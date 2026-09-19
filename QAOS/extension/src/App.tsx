import * as React from "react";
import { DurationPanel } from "./components/DurationPanel";
import { TimerPanel } from "./components/TimerPanel";
import { TimezonePanel } from "./components/TimezonePanel";
import { AssistantPanel } from "./components/AssistantPanel";

type TabId = "duration" | "timer" | "timezone" | "assistant";

const TABS: { id: TabId; label: string }[] = [
  { id: "duration", label: "Duration" },
  { id: "timer", label: "Timer" },
  { id: "timezone", label: "Timezone" },
  { id: "assistant", label: "Assistant" },
];

export default function App() {
  const [active, setActive] = React.useState<TabId>("duration");

  return (
    <div className="flex h-full min-h-[500px] w-full flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-base font-semibold tracking-tight">QuanGrade</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Quick Tools</span>
      </header>

      <nav
        role="tablist"
        aria-label="Quick tools"
        className="flex border-b border-slate-200 text-sm dark:border-slate-700"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            data-tab={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 px-2 py-2 font-medium transition-colors ${
              active === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-3">
        {active === "duration" && <DurationPanel />}
        {active === "timer" && <TimerPanel />}
        {active === "timezone" && <TimezonePanel />}
        {active === "assistant" && <AssistantPanel />}
      </main>

      <footer className="border-t border-slate-200 px-3 py-1.5 text-center text-[10px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Local only — no account, no network calls.
      </footer>
    </div>
  );
}
