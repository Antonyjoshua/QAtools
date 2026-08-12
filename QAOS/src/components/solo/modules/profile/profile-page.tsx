"use client";

import { ProfileHeaderCard } from "./components/profile-header-card";
import { ProfileStatsGrid } from "./components/profile-stats-grid";

export function ProfilePage() {
  return (
    <div className="space-y-4">
      <ProfileHeaderCard />
      <ProfileStatsGrid />
    </div>
  );
}
