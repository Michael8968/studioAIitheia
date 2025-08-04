'use server';

/**
 * @fileOverview A user profiling AI agent.
 *
 * - generateUserProfile - A function that handles the user profiling process.
 * - UserProfileInput - The input type for the generateUserProfile function.
 * - UserProfileOutput - The return type for the generateUserProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileInputSchema = z.object({
  description: z.string().describe('The description of the desired product or service.'),
  photoDataUri: z.string().optional().describe("An optional photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;

const UserProfileOutputSchema = z.object({
    summary: z.string().describe('A concise summary of the user profile based on their request.'),
    tags: z.array(z.string()).describe('A list of 3-5 keywords or tags that represent the user\'s needs and preferences.'),
});
export type UserProfile = z.infer<typeof UserProfileOutputSchema>;

export async function generateUserProfile(input: UserProfileInput): Promise<UserProfile> {
  return generateUserProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'userProfilePrompt',
  input: {schema: UserProfileInputSchema},
  output: {schema: UserProfileOutputSchema},
  prompt: `Analyze the following user request and generate a user profile.

The user is looking for a product or service. Based on their description and/or image, create a concise summary of their likely profile and distill their needs into 3-5 relevant keyword tags.

Description: {{{description}}}
{{#if photoDataUri}}
Image: {{media url=photoDataUri}}
{{/if}}

Your output should be a JSON object that follows this schema: ${JSON.stringify(UserProfileOutputSchema.shape)}`,
});

const generateUserProfileFlow = ai.defineFlow(
  {
    name: 'generateUserProfileFlow',
    inputSchema: UserProfileInputSchema,
    outputSchema: UserProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
