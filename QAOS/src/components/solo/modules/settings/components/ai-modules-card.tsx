"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Badge } from "@/components/solo/ui/badge";
import { AI_MODULES } from "@/lib/solo/services/ai";

export function AiModulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Modules</CardTitle>
        <CardDescription>
          Slots ready for a future AI provider — no re-architecture needed once one is connected.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {AI_MODULES.map((mod) => (
          <div key={mod.id} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
            <span>{mod.name}</span>
            <Badge variant="locked">Coming Soon</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
