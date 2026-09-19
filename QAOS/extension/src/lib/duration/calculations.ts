import { durationToMs, formatDuration, roundClean } from "./conversions";
import type { DurationUnit } from "./units";

// --- Mode 2: Questions x Time per question -> Total duration -----------------

export interface QuestionDurationResult {
  totalMs: number;
  totalSeconds: number;
  formatted: string;
  timeFormat: string;
}

export function calculateQuestionDuration(numQuestions: number, timePerQuestion: number, unit: DurationUnit): QuestionDurationResult {
  const perQuestionMs = durationToMs(timePerQuestion, unit);
  const totalMs = numQuestions * perQuestionMs;
  return {
    totalMs,
    totalSeconds: Math.round(totalMs / 1000),
    formatted: formatDuration(totalMs),
    timeFormat: msToClock(totalMs),
  };
}

// --- Mode 3: Total duration / Questions -> Time per question -----------------

export interface TimePerQuestionResult {
  perQuestionMs: number;
  perQuestionSeconds: number;
  formatted: string;
}

export function calculateTimePerQuestion(totalDurationMs: number, numQuestions: number): TimePerQuestionResult {
  const perQuestionMs = numQuestions > 0 ? totalDurationMs / numQuestions : 0;
  return {
    perQuestionMs,
    perQuestionSeconds: roundClean(perQuestionMs / 1000, 2),
    formatted: formatDuration(perQuestionMs),
  };
}

// --- Mode 4: Total duration / Time per question -> Number of questions -------

export function calculateQuestionsPossible(totalDurationMs: number, timePerQuestionMs: number): number {
  if (timePerQuestionMs <= 0) return 0;
  return Math.floor(totalDurationMs / timePerQuestionMs);
}

// --- Mode 9: Test execution timer --------------------------------------------

export interface TestExecutionResult {
  totalEffortMs: number;
  totalEffortFormatted: string;
  perTesterMs: number;
  perTesterFormatted: string;
  bufferMs: number;
}

export function calculateTestExecutionTime(numTestCases: number, avgTimePerTestCaseMs: number, numTesters: number, bufferPercent = 0): TestExecutionResult {
  const baseEffortMs = numTestCases * avgTimePerTestCaseMs;
  const bufferMs = baseEffortMs * (bufferPercent / 100);
  const totalEffortMs = baseEffortMs + bufferMs;
  const testers = Math.max(1, numTesters);
  const perTesterMs = totalEffortMs / testers;
  return {
    totalEffortMs,
    totalEffortFormatted: formatDuration(totalEffortMs),
    perTesterMs,
    perTesterFormatted: formatDuration(perTesterMs),
    bufferMs,
  };
}

// --- Mode 10: Exam / test duration -------------------------------------------

export interface ExamDurationResult {
  baseMs: number;
  baseFormatted: string;
  additionalMs: number;
  additionalFormatted: string;
  totalMs: number;
  totalFormatted: string;
}

export function calculateExamDuration(numQuestions: number, timePerQuestionMs: number, additionalTimeMs = 0): ExamDurationResult {
  const baseMs = numQuestions * timePerQuestionMs;
  const totalMs = baseMs + additionalTimeMs;
  return {
    baseMs,
    baseFormatted: formatDuration(baseMs),
    additionalMs: additionalTimeMs,
    additionalFormatted: formatDuration(additionalTimeMs),
    totalMs,
    totalFormatted: formatDuration(totalMs),
  };
}

/** HH:MM:SS clock format, e.g. 2700000ms -> "00:45:00". */
export function msToClock(totalMs: number): string {
  const totalSeconds = Math.round(totalMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
