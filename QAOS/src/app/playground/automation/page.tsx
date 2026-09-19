import Link from "next/link";
import { AUTOMATION_MODULES } from "@/lib/playground/automation/modules";

export default function AutomationOverviewPage() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {AUTOMATION_MODULES.map((m) => (
        <Link
          key={m.id}
          href={m.href}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <m.icon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <div className="font-medium">{m.title}</div>
            <p className="mt-0.5 text-sm text-muted-foreground">{m.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
