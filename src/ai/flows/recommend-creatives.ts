
'use server';

/**
 * @fileOverview A flow that recommends creatives (designers/suppliers) for a specific demand.
 *
 * - recommendCreatives - A function that handles the creative recommendation process.
 * - RecommendCreativesInput - The input type for the recommendCreatives function.
 * - RecommendCreativesOutput - The return type for the recommendCreatives function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreativeSchema = z.object({
  id: z.string().describe('The unique identifier for the creative or supplier.'),
  name: z.string().describe('The name of the creative or supplier.'),
  type: z.enum(['creator', 'supplier']).describe('The type of the entity.'),
  specialty: z.string().describe('A brief description of their specialty or expertise.'),
});

const RecommendCreativesInputSchema = z.object({
  demand: z.object({
    title: z.string().describe('The title of the demand.'),
    description: z.string().describe('A detailed description of the demand.'),
    category: z.string().describe('The category of the demand.'),
  }),
  creatives: z.array(CreativeSchema).describe('A list of available creatives and suppliers to choose from.'),
});
export type RecommendCreativesInput = z.infer<typeof RecommendCreativesInputSchema>;

const RecommendCreativesOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      id: z.string().describe('The ID of the recommended creative/supplier.'),
      name: z.string().describe('The name of the recommended creative/supplier.'),
      reason: z.string().describe('A concise reason why this creative/supplier is a good match for the demand.'),
    })
  ).describe('A list of 1-3 recommended creatives or suppliers.'),
});
export type RecommendCreativesOutput = z.infer<typeof RecommendCreativesOutputSchema>;


export async function recommendCreatives(input: RecommendCreativesInput): Promise<RecommendCreativesOutput> {
  return recommendCreativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCreativesPrompt',
  input: { schema: RecommendCreativesInputSchema },
  output: { schema: RecommendCreativesOutputSchema },
  prompt: `You are an expert project manager and talent scout for a creative platform. Your task is to analyze a user's demand and recommend the most suitable creatives or suppliers from a provided list.

Analyze the following demand:
- Title: {{{demand.title}}}
- Category: {{{demand.category}}}
- Description: {{{demand.description}}}

Here is the list of available creatives and suppliers:
{{#each creatives}}
- ID: {{id}}, Name: {{name}}, Type: {{type}}, Specialty: {{specialty}}
{{/each}}

Based on the demand's requirements, please select 1 to 3 of the most appropriate candidates from the list. For each recommendation, provide a brief, insightful reason explaining why they are a good fit. Focus on matching their specialty with the demand's needs.

Your output must be a valid JSON object that follows this schema precisely:
${JSON.stringify(RecommendCreativesOutputSchema.shape)}`,
});

const recommendCreativesFlow = ai.defineFlow(
  {
    name: 'recommendCreativesFlow',
    inputSchema: RecommendCreativesInputSchema,
    outputSchema: RecommendCreativesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
