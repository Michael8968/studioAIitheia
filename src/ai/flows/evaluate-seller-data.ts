'use server';

/**
 * @fileOverview A Genkit flow to evaluate the relevancy of seller data to pre-established demand categories.
 *
 * - evaluateSellerData - A function that handles the evaluation process.
 * - EvaluateSellerDataInput - The input type for the evaluateSellerData function.
 * - EvaluateSellerDataOutput - The return type for the evaluateSellerData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateSellerDataInputSchema = z.object({
  sellerData: z.string().describe('The data of the seller, including product descriptions, service offerings, and company information.'),
  demandCategories: z.array(z.string()).describe('An array of pre-established demand categories, such as "electronics", "home goods", or "apparel".'),
});
export type EvaluateSellerDataInput = z.infer<typeof EvaluateSellerDataInputSchema>;

const EvaluateSellerDataOutputSchema = z.array(
  z.object({
    category: z.string().describe('The demand category.'),
    relevanceScore: z.number().describe('A score between 0 and 1 representing the relevance of the seller data to the category. 1 is highly relevant, 0 is not relevant.'),
    reason: z.string().describe('Explanation of why the seller data is assigned a particular score for the demand category.'),
  })
);
export type EvaluateSellerDataOutput = z.infer<typeof EvaluateSellerDataOutputSchema>;

export async function evaluateSellerData(input: EvaluateSellerDataInput): Promise<EvaluateSellerDataOutput> {
  return evaluateSellerDataFlow(input);
}

const evaluateSellerDataPrompt = ai.definePrompt({
  name: 'evaluateSellerDataPrompt',
  input: {schema: EvaluateSellerDataInputSchema},
  output: {schema: EvaluateSellerDataOutputSchema},
  prompt: `You are an AI assistant tasked with evaluating the relevance of seller data to pre-established demand categories.

  Analyze the provided seller data and assess its relevance to each demand category.
  Assign a relevance score between 0 and 1 for each category, where 1 indicates high relevance and 0 indicates no relevance.
  Provide a brief explanation for each score.

  Seller Data:
  {{sellerData}}

  Demand Categories:
  {{#each demandCategories}}
  - {{{this}}}
  {{/each}}

  Output should be a JSON array of category relevance scores and explanations:
  ${JSON.stringify(EvaluateSellerDataOutputSchema.describe)}
  `,
});

const evaluateSellerDataFlow = ai.defineFlow(
  {
    name: 'evaluateSellerDataFlow',
    inputSchema: EvaluateSellerDataInputSchema,
    outputSchema: EvaluateSellerDataOutputSchema,
  },
  async input => {
    const {output} = await evaluateSellerDataPrompt(input);
    return output!;
  }
);
