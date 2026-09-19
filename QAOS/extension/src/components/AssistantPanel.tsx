import * as React from "react";
import { resolveHelpAnswer } from "../lib/help/resolve-answer";
import { getStarterQuestions } from "../lib/help/search";
import type { ChatTurn, HelpAnswer } from "../lib/help/providers/types";
import type { HelpEntry } from "../lib/help/types";

interface DisplayTurn {
  role: "user" | "assistant";
  text?: string;
  answer?: HelpAnswer;
}

function EntryAnswer({ entry, alternatives }: { entry: HelpEntry; alternatives: HelpEntry[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {entry.module}
        </span>
        <span className="text-sm font-semibold">{entry.question}</span>
      </div>
      <ol className="ml-4 list-decimal space-y-1 text-xs text-slate-700 dark:text-slate-300">
        {entry.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      {entry.tip && (
        <p className="rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-800 dark:bg-amber-950 dark:text-amber-200">Tip: {entry.tip}</p>
      )}
      {alternatives.length > 0 && (
        <div className="text-[11px] text-slate-400">Related: {alternatives.map((a) => a.question).join(" · ")}</div>
      )}
    </div>
  );
}

export function AssistantPanel() {
  const [turns, setTurns] = React.useState<DisplayTurn[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const starters = React.useMemo(getStarterQuestions, []);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  async function ask(query: string) {
    const q = query.trim();
    if (!q || busy) return;
    const history: ChatTurn[] = turns
      .filter((t): t is DisplayTurn & { text: string } => typeof t.text === "string")
      .map((t) => ({ role: t.role, text: t.text as string }));
    setTurns((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const answer = await resolveHelpAnswer(q, history);
      setTurns((prev) => [...prev, { role: "assistant", answer }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div ref={scrollRef} data-testid="assistant-thread" className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-0.5">
        {turns.length === 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask how to do something in QuanGrade, e.g.:</p>
            {starters.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => void ask(s.question)}
                className="rounded-md border border-slate-200 px-2 py-1.5 text-left text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {s.question}
              </button>
            ))}
          </div>
        )}

        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="ml-6 self-end rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white">
              {t.text}
            </div>
          ) : (
            <div key={i} className="mr-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-800">
              {t.answer?.kind === "kb" && <EntryAnswer entry={t.answer.entry} alternatives={t.answer.alternatives} />}
              {t.answer?.kind === "text" && <p className="text-xs">{t.answer.text}</p>}
              {t.answer?.kind === "fallback" && <p className="text-xs text-slate-500 dark:text-slate-400">{t.answer.text}</p>}
            </div>
          )
        )}
        {busy && <div className="text-xs text-slate-400">Thinking…</div>}
      </div>

      <form
        className="mt-auto flex gap-1.5 border-t border-slate-200 pt-2 dark:border-slate-700"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
      >
        <input
          data-testid="assistant-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How do I add a note?"
          className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="submit"
          data-testid="assistant-send"
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
