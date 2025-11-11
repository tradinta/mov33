'use server';
/**
 * @fileOverview This file implements the AI-powered event recommendation flow.
 *
 * - recommendEvents - A function that takes user preferences and past activity as input and returns a list of recommended events.
 * - AIEventRecommendationsInput - The input type for the recommendEvents function.
 * - AIEventRecommendationsOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIEventRecommendationsInputSchema = z.object({
  userPreferences: z.string().describe('A description of the user preferences.'),
  pastActivity: z.string().describe('A description of the user past activity.'),
});
export type AIEventRecommendationsInput = z.infer<typeof AIEventRecommendationsInputSchema>;

const AIEventRecommendationsOutputSchema = z.object({
  recommendedEvents: z.string().describe('A list of recommended events based on user preferences and past activity.'),
});
export type AIEventRecommendationsOutput = z.infer<typeof AIEventRecommendationsOutputSchema>;

export async function recommendEvents(input: AIEventRecommendationsInput): Promise<AIEventRecommendationsOutput> {
  return recommendEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEventRecommendationsPrompt',
  input: {schema: AIEventRecommendationsInputSchema},
  output: {schema: AIEventRecommendationsOutputSchema},
  prompt: `You are an AI event recommendation system. Based on the user's preferences and past activity, you will recommend a list of events that the user is likely to enjoy.

User Preferences: {{{userPreferences}}}
Past Activity: {{{pastActivity}}}

Recommended Events:`,
});

const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: AIEventRecommendationsInputSchema,
    outputSchema: AIEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
