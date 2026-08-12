"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  calculateExamDuration,
  calculateQuestionDuration,
  calculateQuestionsPossible,
  calculateTestExecutionTime,
  calculateTimePerQuestion,
} from "@/lib/duration/calculations";
import { durationToMs } from "@/lib/duration/conversions";
import type { DurationUnit } from "@/lib/duration/units";
import { ResultCard, ValueUnitInput } from "./shared";

const Q_TIME_UNITS: DurationUnit[] = ["s", "min"];
const ALL_UNITS: DurationUnit[] = ["ms", "s", "min", "hr", "day", "week"];

type CalcMode = "q-to-time" | "time-to-q" | "q-possible" | "test-execution" | "exam-duration";

const CALC_MODES: { value: CalcMode; label: string }[] = [
  { value: "q-to-time", label: "Questions → Total Time" },
  { value: "time-to-q", label: "Time → Per Question" },
  { value: "q-possible", label: "Time → Questions Possible" },
  { value: "test-execution", label: "Test Execution Timer" },
  { value: "exam-duration", label: "Exam / Test Duration" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

/** Called only when the user copies the prominent result — records "the answer" into recent history, not every keystroke. */
type ResultHandler = ((expression: string, result: string) => void) | undefined;

export function CalculatePanel({ onResult }: { onResult?: (expression: string, result: string) => void }) {
  const [mode, setMode] = React.useState<CalcMode>("q-to-time");

  return (
    <div className="flex flex-col gap-3">
      <Select value={mode} onValueChange={(v) => v !== null && setMode(v as CalcMode)}>
        <SelectTrigger className="w-full">
          <SelectValue>{(v: CalcMode) => CALC_MODES.find((m) => m.value === v)?.label ?? v}</SelectValue>
        </SelectTrigger>
        <SelectContent positionerClassName="z-[110]">
          {CALC_MODES.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {mode === "q-to-time" && <QuestionsToTime onResult={onResult} />}
      {mode === "time-to-q" && <TimeToPerQuestion onResult={onResult} />}
      {mode === "q-possible" && <QuestionsPossible onResult={onResult} />}
      {mode === "test-execution" && <TestExecutionTimer onResult={onResult} />}
      {mode === "exam-duration" && <ExamDuration onResult={onResult} />}
    </div>
  );
}

function QuestionsToTime({ onResult }: { onResult: ResultHandler }) {
  const [numQuestions, setNumQuestions] = React.useState("50");
  const [timePerQuestion, setTimePerQuestion] = React.useState("54");
  const [unit, setUnit] = React.useState<DurationUnit>("s");

  const n = Number(numQuestions) || 0;
  const t = Number(timePerQuestion) || 0;
  const result = React.useMemo(() => calculateQuestionDuration(n, t, unit), [n, t, unit]);
  const expression = `${n} questions × ${t} ${unit === "s" ? "seconds" : "minutes"}/question`;

  return (
    <div className="flex flex-col gap-2">
      <Field label="Number of questions">
        <Input value={numQuestions} onChange={(e) => setNumQuestions(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
      </Field>
      <Field label="Time per question">
        <ValueUnitInput value={timePerQuestion} onValueChange={setTimePerQuestion} unit={unit} onUnitChange={setUnit} units={Q_TIME_UNITS} />
      </Field>
      <ResultCard
        title="Total time"
        value={result.formatted}
        detail={`${result.totalSeconds.toLocaleString()} seconds · ${result.timeFormat}`}
        copyText={`${expression} = ${result.formatted}`}
        onCopied={() => onResult?.(expression, result.formatted)}
      />
    </div>
  );
}

function TimeToPerQuestion({ onResult }: { onResult: ResultHandler }) {
  const [totalValue, setTotalValue] = React.useState("45");
  const [totalUnit, setTotalUnit] = React.useState<DurationUnit>("min");
  const [numQuestions, setNumQuestions] = React.useState("50");

  const totalMs = durationToMs(Number(totalValue) || 0, totalUnit);
  const n = Number(numQuestions) || 0;
  const result = React.useMemo(() => calculateTimePerQuestion(totalMs, n), [totalMs, n]);
  const expression = `${totalValue} ${totalUnit} ÷ ${n} questions`;

  return (
    <div className="flex flex-col gap-2">
      <Field label="Total duration">
        <ValueUnitInput value={totalValue} onValueChange={setTotalValue} unit={totalUnit} onUnitChange={setTotalUnit} units={ALL_UNITS} />
      </Field>
      <Field label="Number of questions">
        <Input value={numQuestions} onChange={(e) => setNumQuestions(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
      </Field>
      <ResultCard
        title="Time per question"
        value={`${result.perQuestionSeconds.toLocaleString()} seconds/question`}
        detail={`${result.formatted}/question`}
        copyText={`${expression} = ${result.perQuestionSeconds} seconds/question`}
        onCopied={() => onResult?.(expression, `${result.perQuestionSeconds} seconds/question`)}
      />
    </div>
  );
}

function QuestionsPossible({ onResult }: { onResult: ResultHandler }) {
  const [totalValue, setTotalValue] = React.useState("1");
  const [totalUnit, setTotalUnit] = React.useState<DurationUnit>("hr");
  const [perQValue, setPerQValue] = React.useState("45");
  const [perQUnit, setPerQUnit] = React.useState<DurationUnit>("s");

  const totalMs = durationToMs(Number(totalValue) || 0, totalUnit);
  const perQMs = durationToMs(Number(perQValue) || 0, perQUnit);
  const result = React.useMemo(() => calculateQuestionsPossible(totalMs, perQMs), [totalMs, perQMs]);
  const expression = `${totalValue} ${totalUnit} ÷ ${perQValue} ${perQUnit}/question`;

  return (
    <div className="flex flex-col gap-2">
      <Field label="Total time available">
        <ValueUnitInput value={totalValue} onValueChange={setTotalValue} unit={totalUnit} onUnitChange={setTotalUnit} units={ALL_UNITS} />
      </Field>
      <Field label="Time per question">
        <ValueUnitInput value={perQValue} onValueChange={setPerQValue} unit={perQUnit} onUnitChange={setPerQUnit} units={ALL_UNITS} />
      </Field>
      <ResultCard
        title="Questions possible"
        value={`${result} questions`}
        copyText={`${expression} = ${result} questions`}
        onCopied={() => onResult?.(expression, `${result} questions`)}
      />
    </div>
  );
}

function TestExecutionTimer({ onResult }: { onResult: ResultHandler }) {
  const [numTestCases, setNumTestCases] = React.useState("100");
  const [avgTime, setAvgTime] = React.useState("5");
  const [avgUnit, setAvgUnit] = React.useState<DurationUnit>("min");
  const [numTesters, setNumTesters] = React.useState("2");
  const [buffer, setBuffer] = React.useState("0");

  const n = Number(numTestCases) || 0;
  const avgMs = durationToMs(Number(avgTime) || 0, avgUnit);
  const testers = Number(numTesters) || 1;
  const bufferPct = Number(buffer) || 0;
  const result = React.useMemo(() => calculateTestExecutionTime(n, avgMs, testers, bufferPct), [n, avgMs, testers, bufferPct]);
  const expression = `${n} test cases × ${avgTime} ${avgUnit}, ${testers} tester${testers === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-2">
      <Field label="Number of test cases">
        <Input value={numTestCases} onChange={(e) => setNumTestCases(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
      </Field>
      <Field label="Average time per test case">
        <ValueUnitInput value={avgTime} onValueChange={setAvgTime} unit={avgUnit} onUnitChange={setAvgUnit} units={Q_TIME_UNITS} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Number of testers">
          <Input value={numTesters} onChange={(e) => setNumTesters(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
        </Field>
        <Field label="Buffer % (optional)">
          <Input value={buffer} onChange={(e) => setBuffer(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="0" />
        </Field>
      </div>
      <ResultCard
        title="Total effort"
        value={result.totalEffortFormatted}
        copyText={`${expression} = ${result.totalEffortFormatted} total effort`}
        onCopied={() => onResult?.(expression, result.totalEffortFormatted)}
      />
      <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
        With {testers} tester{testers === 1 ? "" : "s"}: <span className="font-medium text-foreground">{result.perTesterFormatted}</span> calendar time
      </div>
    </div>
  );
}

function ExamDuration({ onResult }: { onResult: ResultHandler }) {
  const [numQuestions, setNumQuestions] = React.useState("50");
  const [timePerQuestion, setTimePerQuestion] = React.useState("54");
  const [unit, setUnit] = React.useState<DurationUnit>("s");
  const [additional, setAdditional] = React.useState("5");
  const [additionalUnit, setAdditionalUnit] = React.useState<DurationUnit>("min");

  const n = Number(numQuestions) || 0;
  const perQMs = durationToMs(Number(timePerQuestion) || 0, unit);
  const additionalMs = durationToMs(Number(additional) || 0, additionalUnit);
  const result = React.useMemo(() => calculateExamDuration(n, perQMs, additionalMs), [n, perQMs, additionalMs]);
  const expression = `${n} questions × ${timePerQuestion} ${unit} + ${additional} ${additionalUnit} extra`;

  return (
    <div className="flex flex-col gap-2">
      <Field label="Number of questions">
        <Input value={numQuestions} onChange={(e) => setNumQuestions(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
      </Field>
      <Field label="Time per question">
        <ValueUnitInput value={timePerQuestion} onValueChange={setTimePerQuestion} unit={unit} onUnitChange={setUnit} units={Q_TIME_UNITS} />
      </Field>
      <Field label="Additional time (optional)">
        <ValueUnitInput value={additional} onValueChange={setAdditional} unit={additionalUnit} onUnitChange={setAdditionalUnit} units={ALL_UNITS} />
      </Field>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
          <p className="text-muted-foreground">Base</p>
          <p className="font-medium">{result.baseFormatted}</p>
        </div>
        <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
          <p className="text-muted-foreground">Additional</p>
          <p className="font-medium">{result.additionalFormatted}</p>
        </div>
      </div>
      <ResultCard
        title="Total duration"
        value={result.totalFormatted}
        copyText={`${expression} = ${result.totalFormatted}`}
        onCopied={() => onResult?.(expression, result.totalFormatted)}
      />
    </div>
  );
}
