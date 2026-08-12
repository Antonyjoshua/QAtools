"use client";

import { BookOpen, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { describeTokenInContext, type RegexToken } from "@/lib/generator/tools/regex-engine";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<RegexToken["kind"], string> = {
  anchor: "bg-violet-500/10 text-violet-700 ring-violet-500/30 dark:text-violet-300",
  class: "bg-sky-500/10 text-sky-700 ring-sky-500/30 dark:text-sky-300",
  set: "bg-sky-500/10 text-sky-700 ring-sky-500/30 dark:text-sky-300",
  group: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300",
  quantifier: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  alternation: "bg-rose-500/10 text-rose-700 ring-rose-500/30 dark:text-rose-300",
  literal: "bg-muted text-foreground ring-border",
  escape: "bg-fuchsia-500/10 text-fuchsia-700 ring-fuchsia-500/30 dark:text-fuchsia-300",
};

function TokenChip({ token, index, tokens }: { token: RegexToken; index: number; tokens: RegexToken[] }) {
  const contextNote = describeTokenInContext(token, index, tokens);
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "rounded-md px-1.5 py-1 font-mono text-sm ring-1 transition-transform hover:-translate-y-0.5 hover:shadow-sm",
          KIND_STYLES[token.kind]
        )}
      >
        {token.label}
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{token.label}</span>
            <span className="text-xs text-muted-foreground">{token.kind}</span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
            <dt className="font-medium text-muted-foreground">Meaning</dt>
            <dd>{token.meaning}</dd>
            <dt className="font-medium text-muted-foreground">Matches</dt>
            <dd>{token.matches || "—"}</dd>
            {token.example && (
              <>
                <dt className="font-medium text-muted-foreground">Example</dt>
                <dd className="font-mono">{token.example}</dd>
              </>
            )}
            <dt className="font-medium text-muted-foreground">In this regex</dt>
            <dd>{contextNote}</dd>
          </dl>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function RegexBreakdownPanel({
  tokens,
  plainEnglish,
  error,
  learningMode,
}: {
  tokens: RegexToken[];
  plainEnglish: string;
  error: string | null;
  learningMode: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Regex Breakdown</Label>
        {error ? (
          <p className="text-sm text-muted-foreground">Fix the pattern error above to see a token-by-token breakdown.</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">Enter a pattern to see it broken into tokens.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 overflow-x-auto rounded-lg border border-border bg-card p-3">
            {tokens.map((t, i) => (
              <TokenChip key={`${t.start}-${i}`} token={t} index={i} tokens={tokens} />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Click a token to see what it means, what it matches, and what it does in this pattern.</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Plain English</Label>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Copy explanation"
            onClick={() => {
              navigator.clipboard.writeText(plainEnglish);
              toast.success("Copied explanation");
            }}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-sm leading-relaxed">
          <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p>{plainEnglish}</p>
        </div>
        {learningMode && (
          <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Learning tip</p>
            <p className="mt-1">
              Read a regex left to right, one token at a time — each colored chip above consumes some input (or, for anchors and lookaround, checks a
              position without consuming anything). A common mistake is assuming <code className="font-mono">.</code> matches everything, including
              newlines — it doesn&apos;t, unless the <code className="font-mono">s</code> flag is on.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
