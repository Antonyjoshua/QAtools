"use client";

import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { getCareerCoachAdvice } from "@/lib/solo/services/ai";

export function AiCoachTeaser() {
  async function handleAsk() {
    const result = await getCareerCoachAdvice();
    toast(result.message, { icon: "✨" });
  }

  return (
    <Card className="border-[var(--accent)]/20 bg-gradient-to-br from-[var(--accent)]/[0.06] to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          AI Career Coach
        </CardTitle>
        <CardDescription>
          Personalized guidance, skill-gap analysis, and quest suggestions — the AI layer is wired up
          and ready to connect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" onClick={handleAsk}>
          Ask my Coach
        </Button>
      </CardContent>
    </Card>
  );
}
