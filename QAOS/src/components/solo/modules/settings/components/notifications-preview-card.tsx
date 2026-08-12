"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { useNotifications } from "@/lib/solo/hooks/useNotifications";

export function NotificationsPreviewCard() {
  const notifications = useNotifications();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
        <CardDescription>
          In-app nudges to keep your streak, quests, and missions on track — no account or push
          permissions required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {notifications.map((n) => (
          <div key={n.id} className="text-sm text-foreground/80 rounded-md bg-white/5 px-3 py-2">
            {n.message}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
