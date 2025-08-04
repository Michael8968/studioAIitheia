
'use server';

/**
 * @fileOverview A product recommendation AI agent.
 *
 * - getProductRecommendations - A function that handles the product recommendation process.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  description: z.string().describe('The description of the desired product or service.'),
  photoDataUri: z.string().optional().describe("An optional photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product or service.'),
      description: z.string().describe('A short description of the recommendation.'),
      imageUrl: z.string().optional().describe('An optional URL to an image of the product or service.'),
      link: z.string().optional().describe('An optional URL to the product or service page.'),
    })
  ).describe('An array of product or service recommendations.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are a helpful shopping assistant. A user will provide a description of what they are looking for, and you should provide a list of product or service recommendations.

Description: {{{description}}}
{{#if photoDataUri}}
Image: {{media url=photoDataUri}}
{{/if}}

Please provide a list of recommendations based on the description and optional image. Include a name, description, optional image URL and optional link for each recommendation.

Your output should be a JSON object that follows this schema: ${JSON.stringify(ProductRecommendationsOutputSchema.shape)}`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

