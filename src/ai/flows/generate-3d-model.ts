'use server';

/**
 * @fileOverview A flow that generates a 3D model preview from a text description.
 *
 * - generate3DModel - A function that handles the 3D model generation process.
 * - Generate3DModelInput - The input type for the generate3DModel function.
 * - Generate3DModelOutput - The return type for the generate3DModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate3DModelInputSchema = z.object({
  description: z
    .string()
    .describe('The text description of the 3D model to generate.'),
});
export type Generate3DModelInput = z.infer<typeof Generate3DModelInputSchema>;

const Generate3DModelOutputSchema = z.object({
  modelDataUri: z
    .string()
    .describe(
      'The data URI of the generated 3D model preview as a base64 encoded string.'
    ),
});
export type Generate3DModelOutput = z.infer<typeof Generate3DModelOutputSchema>;

export async function generate3DModel(input: Generate3DModelInput): Promise<Generate3DModelOutput> {
  return generate3DModelFlow(input);
}

const generate3DModelPrompt = ai.definePrompt({
  name: 'generate3DModelPrompt',
  input: {schema: Generate3DModelInputSchema},
  output: {schema: Generate3DModelOutputSchema},
  prompt: `You are a 3D model generator.  The user will provide a description of a 3D model, and you will generate a 3D model preview.

Description: {{{description}}}`,
  config: {
    // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
  },
});

const generate3DModelFlow = ai.defineFlow(
  {
    name: 'generate3DModelFlow',
    inputSchema: Generate3DModelInputSchema,
    outputSchema: Generate3DModelOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.description,
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('No model data URI was returned.');
    }

    return {modelDataUri: media.url};
  }
);
