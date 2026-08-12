"use client";

import { AppearanceCard } from "./components/appearance-card";
import { NotificationsPreviewCard } from "./components/notifications-preview-card";
import { DataManagementCard } from "./components/data-management-card";
import { AiModulesCard } from "./components/ai-modules-card";

export function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Appearance, reminders, data, and what&apos;s coming next.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppearanceCard />
        <NotificationsPreviewCard />
        <DataManagementCard />
        <AiModulesCard />
      </div>
    </div>
  );
}
