'use server';

import { recommendEvents } from '@/ai/flows/ai-event-recommendations';
import { z } from 'zod';

const recommendationSchema = z.object({
  userPreferences: z.string().min(10, { message: "Please describe your preferences in at least 10 characters." }),
  pastActivity: z.string().min(10, { message: "Please describe your past activities in at least 10 characters." }),
});

export type FormState = {
  message: string;
  recommendations?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getAIRecommendations(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    userPreferences: formData.get('userPreferences'),
    pastActivity: formData.get('pastActivity'),
  }
  const parsed = recommendationSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: "Failed to get recommendations. Please check your input.",
      issues,
      fields: {
        userPreferences: parsed.error.flatten().fieldErrors.userPreferences?.join(', ') || '',
        pastActivity: parsed.error.flatten().fieldErrors.pastActivity?.join(', ') || ''
      }
    };
  }

  try {
    const result = await recommendEvents(parsed.data);
    return {
      message: "Success! Here are your AI-powered recommendations.",
      recommendations: result.recommendedEvents,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred while getting recommendations. Please try again later.",
    };
  }
}
