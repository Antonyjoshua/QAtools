import { Check, Circle } from "lucide-react";
import type { ChecklistState } from "@/lib/bugs/types";
import { cn } from "@/lib/utils";

const LABELS: [keyof ChecklistState, string][] = [
  ["titleEntered", "Title entered"],
  ["stepsProvided", "Steps provided"],
  ["expectedAdded", "Expected result added"],
  ["actualAdded", "Actual result added"],
  ["severitySelected", "Severity selected"],
  ["prioritySelected", "Priority selected"],
  ["screenshotAttached", "Screenshot attached"],
  ["environmentSelected", "Environment selected"],
];

export function QaChecklist({ checklist }: { checklist: ChecklistState }) {
  const done = LABELS.filter(([key]) => checklist[key]).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Submission Checklist</p>
        <p className="text-xs text-muted-foreground">
          {done}/{LABELS.length}
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(done / LABELS.length) * 100}%` }} />
      </div>
      <ul className="mt-1 flex flex-col gap-1.5">
        {LABELS.map(([key, label]) => {
          const isDone = checklist[key];
          return (
            <li key={key} className={cn("flex items-center gap-2 text-xs", isDone ? "text-foreground" : "text-muted-foreground")}>
              {isDone ? <Check className="size-3.5 text-success" /> : <Circle className="size-3.5" />}
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
