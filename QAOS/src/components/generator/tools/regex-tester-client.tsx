"use client";

import * as React from "react";
import { toast } from "sonner";
import { Copy, GraduationCap, TestTube2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RegexBreakdownPanel } from "@/components/generator/tools/regex-breakdown-panel";
import { RegexMatchPanel } from "@/components/generator/tools/regex-match-panel";
import { RegexTestCasePanel } from "@/components/generator/tools/regex-test-case-panel";
import { RegexCheatSheetPanel } from "@/components/generator/tools/regex-cheat-sheet-panel";
import { RegexCommonPatternsPanel } from "@/components/generator/tools/regex-common-patterns-panel";
import { RegexBuilderPanel } from "@/components/generator/tools/regex-builder-panel";
import {
  ENGINE_INFO,
  analyzeFailure,
  classifyDifficulty,
  explainPlainEnglish,
  tokenizeRegex,
} from "@/lib/generator/tools/regex-engine";
import type { CommonPattern } from "@/lib/generator/tools/regex-reference-data";

interface Flags {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
}

const VALID_FLAG_CHARS = new Set(["g", "i", "m", "s", "u", "y"]);
const MAX_RENDERED_MATCHES = 500;

const PRESETS: { label: string; pattern: string }[] = [
  { label: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s]+" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { label: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" },
  { label: "ISO Date", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { label: "Phone (loose)", pattern: "\\+?\\d[\\d\\s-]{7,}\\d" },
];

const DEFAULT_PATTERN = "[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}";
const DEFAULT_TEST_TEXT =
  "Contact us at support@quangrade.dev or sales@quangrade.dev for help.\nInvalid: user@@bad, missing-domain@, plainaddress";

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-status-good/15 text-status-good ring-1 ring-status-good/30",
  Intermediate: "bg-status-warning/15 text-status-warning ring-1 ring-status-warning/30",
  Advanced: "bg-chart-2/15 text-chart-2 ring-1 ring-chart-2/30",
  Expert: "bg-status-critical/15 text-status-critical ring-1 ring-status-critical/30",
};

function flagsToString(flags: Flags): string {
  return (flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "") + (flags.s ? "s" : "");
}

export function RegexTesterClient() {
  const [pattern, setPattern] = React.useState(DEFAULT_PATTERN);
  const [flags, setFlags] = React.useState<Flags>({ g: true, i: true, m: false, s: false });
  const [testText, setTestText] = React.useState(DEFAULT_TEST_TEXT);
  const [replacement, setReplacement] = React.useState("[EMAIL]");
  const [mode, setMode] = React.useState<"tester" | "learning">("tester");

  const flagsStr = flagsToString(flags);

  const { regex, error } = React.useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      return { regex: new RegExp(pattern, flagsStr), error: null };
    } catch (e) {
      return { regex: null, error: e instanceof Error ? e.message : "Invalid pattern" };
    }
  }, [pattern, flagsStr]);

  const tokens = React.useMemo(() => tokenizeRegex(pattern), [pattern]);
  const plainEnglish = React.useMemo(() => explainPlainEnglish(tokens, pattern), [tokens, pattern]);
  const difficulty = React.useMemo(() => classifyDifficulty(tokens), [tokens]);

  const matches = React.useMemo(() => {
    if (!regex || !testText) return [];
    if (regex.global) return Array.from(testText.matchAll(regex));
    const m = testText.match(regex);
    return m ? [m] : [];
  }, [regex, testText]);

  const truncated = matches.length > MAX_RENDERED_MATCHES;
  const displayMatches = truncated ? matches.slice(0, MAX_RENDERED_MATCHES) : matches;

  const failure = React.useMemo(() => {
    if (!pattern || !testText || matches.length > 0 || error) return null;
    return analyzeFailure(pattern, flagsStr, testText, tokens);
  }, [pattern, testText, matches.length, error, flagsStr, tokens]);

  const segments = React.useMemo(() => {
    if (!testText) return [];
    if (displayMatches.length === 0) return [{ text: testText, isMatch: false, index: -1 }];
    const segs: { text: string; isMatch: boolean; index: number }[] = [];
    let cursor = 0;
    displayMatches.forEach((m, i) => {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (start < cursor) return;
      if (start > cursor) segs.push({ text: testText.slice(cursor, start), isMatch: false, index: -1 });
      segs.push({ text: m[0], isMatch: true, index: i });
      cursor = end;
    });
    if (cursor < testText.length) segs.push({ text: testText.slice(cursor), isMatch: false, index: -1 });
    return segs;
  }, [testText, displayMatches]);

  const replacePreview = React.useMemo(() => {
    if (!regex || !testText) return null;
    try {
      return testText.replace(regex, replacement);
    } catch {
      return null;
    }
  }, [regex, testText, replacement]);

  function toggleFlag(key: keyof Flags) {
    setFlags((f) => ({ ...f, [key]: !f[key] }));
  }

  function handlePatternPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text");
    const m = /^\/(.+)\/([a-z]*)$/.exec(pasted.trim());
    if (!m) return;
    const [, body, flagChars] = m;
    const chars = flagChars.split("");
    if (!chars.every((c) => VALID_FLAG_CHARS.has(c)) || new Set(chars).size !== chars.length) return;
    e.preventDefault();
    setPattern(body);
    setFlags({ g: flagChars.includes("g"), i: flagChars.includes("i"), m: flagChars.includes("m"), s: flagChars.includes("s") });
    toast.success("Detected /pattern/flags — split into pattern and flags");
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`);
  }

  function loadCommonPattern(p: CommonPattern) {
    setPattern(p.pattern);
    setFlags({ g: p.flags.includes("g"), i: p.flags.includes("i"), m: p.flags.includes("m"), s: p.flags.includes("s") });
    toast.success(`Loaded "${p.name}"`);
  }

  const isPatternDirty = pattern.trim() !== "" && pattern !== DEFAULT_PATTERN;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-2">
        <p className="px-2 text-xs text-muted-foreground">Choose how this page focuses its explanations.</p>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <Button
            size="sm"
            variant={mode === "tester" ? "default" : "ghost"}
            className="gap-1.5"
            onClick={() => setMode("tester")}
          >
            <TestTube2 className="size-3.5" /> Tester Mode
          </Button>
          <Button
            size="sm"
            variant={mode === "learning" ? "default" : "ghost"}
            className="gap-1.5"
            onClick={() => setMode("learning")}
          >
            <GraduationCap className="size-3.5" /> Learning Mode
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="regex-pattern" className="text-xs text-muted-foreground">
              Pattern
            </Label>
            <Popover>
              <PopoverTrigger>
                <Badge variant="secondary" className={cn("cursor-pointer text-[10px]", DIFFICULTY_STYLES[difficulty.level])}>
                  {difficulty.level}
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-72" side="top" align="end">
                <p className="text-xs">{difficulty.reason}</p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted-foreground select-none">/</span>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              onPaste={handlePatternPaste}
              placeholder="Enter a regular expression…"
              className={cn("font-mono", error && "border-destructive text-destructive")}
              aria-invalid={Boolean(error)}
            />
            <span className="font-mono text-muted-foreground select-none">/{flagsStr}</span>
            <Button variant="ghost" size="icon-sm" onClick={() => copy(pattern, "regex")} title="Copy regex">
              <Copy className="size-3.5" />
            </Button>
          </div>
          {error && (
            <p className="text-xs text-destructive">
              Invalid Regular Expression{error ? ` — ${error}` : ""}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {([
            ["g", "Global — find all matches"],
            ["i", "Ignore case"],
            ["m", "Multiline — ^ $ match line breaks"],
            ["s", "Dot all — . matches newlines"],
          ] as [keyof Flags, string][]).map(([key, desc]) => (
            <label key={key} className="flex items-center gap-1.5 text-sm">
              <Checkbox checked={flags[key]} onCheckedChange={() => toggleFlag(key)} />
              <span className="font-mono font-medium">{key}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <span className="mr-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Wand2 className="size-3.5" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <Button key={p.label} variant="outline" size="sm" onClick={() => setPattern(p.pattern)}>
              {p.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          JS regex flavor (mostly PCRE-compatible) — paste a full <code className="font-mono">/pattern/flags</code> literal and it&rsquo;ll split automatically.
        </p>
        <p className="text-xs text-muted-foreground">Regex engine: {ENGINE_INFO}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <RegexBreakdownPanel tokens={tokens} plainEnglish={plainEnglish} error={error} learningMode={mode === "learning"} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Test string</Label>
          <Textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="Paste sample text, an API response, a log line…"
          />
          {testText.length > 20000 && <p className="text-xs text-status-warning">Large input ({testText.length.toLocaleString()} chars) — highlighting may be slower.</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Matches</Label>
            <Badge variant={matches.length > 0 ? "default" : "secondary"}>
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </Badge>
          </div>
          <div className="min-h-[13.5rem] whitespace-pre-wrap break-words rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm dark:bg-input/30">
            {testText ? (
              segments.map((seg, i) =>
                seg.isMatch ? (
                  <mark
                    key={i}
                    title={`Match ${seg.index + 1}`}
                    className="rounded-sm bg-primary/25 text-foreground ring-1 ring-primary/40"
                  >
                    {seg.text || "​"}
                  </mark>
                ) : (
                  <React.Fragment key={i}>{seg.text}</React.Fragment>
                )
              )
            ) : (
              <span className="text-muted-foreground">Nothing to match yet — add some test text.</span>
            )}
          </div>
          {truncated && <p className="text-xs text-status-warning">Showing the first {MAX_RENDERED_MATCHES} of {matches.length} matches.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <RegexMatchPanel matches={displayMatches} testText={testText} hasPattern={Boolean(pattern)} failure={failure} />
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
        <Label htmlFor="regex-replacement" className="text-xs text-muted-foreground">
          Replace with (supports $1, $2, $&lt;name&gt;)
        </Label>
        <Input
          id="regex-replacement"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          className="font-mono"
          placeholder="Replacement text…"
        />
        {replacePreview !== null && (
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Result</span>
              <Button variant="ghost" size="icon-sm" onClick={() => copy(replacePreview, "result")} title="Copy result">
                <Copy className="size-3.5" />
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-input bg-muted/20 px-2.5 py-2 font-mono text-sm">
              {replacePreview}
            </pre>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <RegexTestCasePanel pattern={pattern} flags={flagsStr} tokens={tokens} />
      </div>

      <RegexCheatSheetPanel defaultOpen={mode === "learning"} />

      <div className="rounded-xl border border-border bg-card p-4">
        <RegexCommonPatternsPanel currentPattern={pattern} isDirty={isPatternDirty} onLoad={loadCommonPattern} />
      </div>

      <RegexBuilderPanel onUse={(p) => setPattern(p)} />
    </div>
  );
}
