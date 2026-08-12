"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Save,
  Share2,
  RotateCcw,
  Download,
  Sigma,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { notFound } from "next/navigation";
import type { CalculatorDef, SummaryItem } from "@/lib/calculator/types";
import { validateFields } from "@/lib/calculator/validation";
import { validateOtherFields } from "@/lib/calculator/field-validation";
import { FieldInput } from "@/components/calculator/calculators/field-input";
import { CalculatorPieChart, CalculatorBarChart } from "@/components/calculator/calculators/calculator-chart";
import { useHistoryStore } from "@/lib/calculator/store/history-store";
import { getCalculator } from "@/lib/calculator/registry";
import { cn } from "@/lib/utils";

function initialRaw(calculator: CalculatorDef, preset?: Record<string, string> | null) {
  const raw: Record<string, string> = {};
  for (const field of calculator.fields) {
    raw[field.id] = preset?.[field.id] ?? field.defaultValue ?? "";
  }
  return raw;
}

function decodeState(param: string | null): Record<string, string> | null {
  if (!param) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(param)));
  } catch {
    return null;
  }
}

function summaryToText(summary: SummaryItem[]) {
  return summary.map((s) => `${s.label}: ${s.value}`).join("\n");
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function CalculatorShell({ slug }: { slug: string }) {
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  // key forces a full remount (and fresh state) whenever the calculator changes
  return <CalculatorShellInner key={calculator.slug} calculator={calculator} />;
}

function CalculatorShellInner({ calculator }: { calculator: CalculatorDef }) {
  const searchParams = useSearchParams();
  const preset = React.useMemo(() => decodeState(searchParams.get("state")), [searchParams]);

  const [raw, setRaw] = React.useState<Record<string, string>>(() => initialRaw(calculator, preset));
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [tick, setTick] = React.useState(0);
  const [busyFileField, setBusyFileField] = React.useState<string | null>(null);
  const addEntry = useHistoryStore((s) => s.addEntry);

  React.useEffect(() => {
    if (!calculator.live) return;
    const id = setInterval(() => setTick((t) => t + 1), calculator.liveIntervalMs ?? 1000);
    return () => clearInterval(id);
  }, [calculator]);

  const { values, errors: numberErrors } = React.useMemo(
    () => validateFields(calculator.fields, raw),
    [calculator, raw]
  );
  const otherErrors = React.useMemo(
    () => validateOtherFields(calculator.fields, raw),
    [calculator, raw]
  );
  const errors = { ...numberErrors, ...otherErrors };
  const isValid = Object.keys(errors).length === 0;
  const touchedAny = Object.keys(touched).length > 0;

  const outcome = React.useMemo(() => {
    if (!isValid) return null;
    try {
      return calculator.compute(values, raw);
    } catch {
      return null;
    }
    // `tick` is intentionally unused here — its only purpose is to force this memo
    // to recompute on each interval tick for live (e.g. countdown) calculators
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, values, raw, calculator, tick]);

  function setField(id: string, value: string) {
    setRaw((r) => ({ ...r, [id]: value }));
  }
  function blurField(id: string) {
    setTouched((t) => ({ ...t, [id]: true }));
  }
  async function handleFile(field: (typeof calculator.fields)[number], file: File) {
    if (!field.onFileLoad) return;
    setBusyFileField(field.id);
    try {
      const extra = await field.onFileLoad(file);
      setRaw((r) => ({ ...r, ...extra, [field.id]: file.name }));
      setTouched((t) => ({ ...t, [field.id]: true }));
    } catch {
      toast.error("Couldn't read that file");
    } finally {
      setBusyFileField(null);
    }
  }
  function handleReset() {
    setRaw(initialRaw(calculator));
    setTouched({});
    toast.info("Inputs reset");
  }
  function handleSave() {
    if (!outcome) return;
    addEntry({
      calculatorId: calculator.id,
      calculatorSlug: calculator.slug,
      calculatorName: calculator.name,
      category: calculator.category,
      inputs: raw,
      summary: outcome.summary,
    });
    toast.success("Saved to history");
  }
  function handleCopy() {
    if (!outcome) return;
    navigator.clipboard.writeText(summaryToText(outcome.summary));
    toast.success("Result copied to clipboard");
  }
  function handleShare() {
    const encoded = btoa(encodeURIComponent(JSON.stringify(raw)));
    const url = `${window.location.origin}/calculators/${calculator.slug}?state=${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success("Shareable link copied");
  }
  function handleExportCsv() {
    if (!outcome) return;
    const rows = [
      ["Field", "Value"],
      ...calculator.fields.map((f) => [f.label, raw[f.id] ?? ""]),
      [],
      ["Result", "Value"],
      ...outcome.summary.map((s) => [s.label, s.value]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile(`${calculator.slug}.csv`, csv, "text/csv");
    toast.success("CSV exported");
  }
  function handleExportJson() {
    if (!outcome) return;
    const json = JSON.stringify(
      { calculator: calculator.name, inputs: raw, result: outcome.summary },
      null,
      2
    );
    downloadFile(`${calculator.slug}.json`, json, "application/json");
    toast.success("JSON exported");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 flex items-start gap-4"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <calculator.icon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{calculator.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{calculator.description}</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculator.fields.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={raw[field.id] ?? ""}
                  error={errors[field.id]}
                  touched={touchedAny ? true : touched[field.id]}
                  onChange={(v) => setField(field.id, v)}
                  onBlur={() => blurField(field.id)}
                  onFile={(file) => handleFile(field, file)}
                  fileBusy={busyFileField === field.id}
                />
              ))}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" onClick={handleSave} disabled={!outcome}>
                  <Save className="mr-1.5 size-4" /> Save to History
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCopy} disabled={!outcome}>
                  <Copy className="mr-1.5 size-4" /> Copy
                </Button>
                <Button size="sm" variant="secondary" onClick={handleShare}>
                  <Share2 className="mr-1.5 size-4" /> Share
                </Button>
                <Button size="sm" variant="ghost" onClick={handleReset}>
                  <RotateCcw className="mr-1.5 size-4" /> Reset
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleExportCsv} disabled={!outcome}>
                  <Download className="mr-1.5 size-4" /> Export CSV
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportJson} disabled={!outcome}>
                  <Download className="mr-1.5 size-4" /> Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sigma className="size-4" /> Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{calculator.formulaExplanation}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <AnimatePresence mode="wait">
                {!isValid ? (
                  <motion.div
                    key="errors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertTriangle className="size-4" />
                      <AlertDescription>
                        {touchedAny
                          ? "Fix the highlighted fields to see the result."
                          : "Fill in the inputs to see the result."}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                ) : outcome ? (
                  <motion.div
                    key="outcome"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {outcome.notes && outcome.notes.length > 0 && (
                      <Alert>
                        <Info className="size-4" />
                        <AlertDescription>
                          {outcome.notes.map((n, i) => (
                            <div key={i}>{n}</div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {outcome.summary.map((item, i) => {
                        const isLong = item.value.length > 60 || item.value.includes("\n");
                        return (
                          <div
                            key={`${item.label}-${i}`}
                            className={`rounded-xl border p-3 ${
                              item.highlight || isLong
                                ? "col-span-full border-primary/40 bg-primary/5"
                                : "border-border/60 bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              {isLong && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.value);
                                    toast.success(`${item.label} copied`);
                                  }}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Copy
                                </button>
                              )}
                            </div>
                            <p
                              className={`mt-1 ${
                                isLong
                                  ? "max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed"
                                  : "font-mono text-lg font-semibold tabular-nums"
                              } ${
                                item.tone === "positive"
                                  ? "text-[var(--status-good)]"
                                  : item.tone === "negative"
                                  ? "text-[var(--status-critical)]"
                                  : "text-foreground"
                              }`}
                            >
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {outcome.progress && outcome.progress.length > 0 && (
                      <div className="space-y-3">
                        {outcome.progress.map((p) => (
                          <div key={p.label}>
                            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                              <span>{p.label}</span>
                              <span>{p.value.toFixed(1)}%</span>
                            </div>
                            <Progress value={Math.min(p.value, 100)} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}

                    {outcome.chart && outcome.chart.type === "bar" && <CalculatorBarChart chart={outcome.chart} />}
                    {outcome.chart && outcome.chart.type === "pie" && <CalculatorPieChart chart={outcome.chart} />}

                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Step by step
                      </p>
                      <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
                        {outcome.steps.map((step, i) => {
                          const isLong = step.value.length > 40 || step.value.includes("\n");
                          return (
                            <div
                              key={i}
                              className={cn(
                                "gap-2 text-sm",
                                isLong ? "flex flex-col" : "flex flex-wrap items-baseline justify-between"
                              )}
                            >
                              <span className="text-muted-foreground">
                                {step.label}
                                <span className="ml-1.5 text-xs opacity-70">({step.formula})</span>
                              </span>
                              <span
                                className={cn(
                                  "font-mono font-medium tabular-nums",
                                  isLong && "max-h-48 overflow-y-auto whitespace-pre-wrap break-words text-xs"
                                )}
                              >
                                {step.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
