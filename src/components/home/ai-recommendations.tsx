"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAIRecommendations, type FormState } from "@/lib/actions";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-poppins">
      {pending ? "Getting Recommendations..." : <> <Sparkles className="mr-2 h-4 w-4" /> Get Recommendations </>}
    </Button>
  );
}

const initialState: FormState = {
  message: "",
};

export function AIRecommendations() {
  const [state, formAction] = useFormState(getAIRecommendations, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "Success! Here are your AI-powered recommendations.") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Personalized For You</h2>
        <p className="mt-2 text-lg text-muted-foreground">Let our AI find the perfect events based on your tastes.</p>
      </div>
      <Card className="mt-12 max-w-2xl mx-auto shadow-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-accent" /> AI Event Finder</CardTitle>
            <CardDescription>Tell us what you like, and we'll suggest events you'll love.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="userPreferences" className="font-poppins">Your Preferences</Label>
              <Textarea
                id="userPreferences"
                name="userPreferences"
                placeholder="e.g., I love indie rock, outdoor festivals, and trying new food."
                required
              />
              {state.fields?.userPreferences && <p className="text-sm text-destructive">{state.fields.userPreferences}</p>}
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="pastActivity" className="font-poppins">Recent Events You've Enjoyed</Label>
              <Textarea
                id="pastActivity"
                name="pastActivity"
                placeholder="e.g., Attended the Summer Music Fest, went to a local brewery tour."
                required
              />
               {state.fields?.pastActivity && <p className="text-sm text-destructive">{state.fields.pastActivity}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
        {state.recommendations && (
           <CardContent className="border-t pt-6">
             <h3 className="font-headline text-xl font-bold">Your Recommended Events:</h3>
             <p className="whitespace-pre-wrap mt-2 text-muted-foreground">{state.recommendations}</p>
           </CardContent>
         )}
      </Card>
    </section>
  );
}
