import { AccentThemeProvider } from "@/components/solo/providers/accent-theme-provider";
import { SessionInit } from "@/components/solo/providers/session-init";
import { AchievementToastWatcher } from "@/components/solo/providers/achievement-toast-watcher";
import { HydrationGate } from "@/components/solo/providers/hydration-gate";
import { TooltipProvider } from "@/components/solo/ui/tooltip";

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="solo-scope min-h-full">
      <AccentThemeProvider>
        <TooltipProvider delayDuration={200}>
          <HydrationGate>
            <SessionInit />
            <AchievementToastWatcher />
            <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
          </HydrationGate>
        </TooltipProvider>
      </AccentThemeProvider>
    </div>
  );
}
