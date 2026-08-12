import type { CalculatorSettings } from "./store";

/** Formats a numeric result according to the calculator's display settings. */
export function formatResult(value: number, settings: CalculatorSettings): string {
  if (!Number.isFinite(value)) return "Error";

  const abs = Math.abs(value);
  const useScientific = settings.scientificNotation && abs !== 0 && (abs >= 1e15 || abs < 1e-6);

  if (useScientific) {
    return value.toExponential(Math.min(settings.decimalPrecision, 10)).replace(/e\+?(-?)(\d+)/, "e$1$2");
  }

  const rounded = roundToPrecision(value, settings.decimalPrecision);
  return new Intl.NumberFormat("en-US", {
    useGrouping: settings.thousandsSeparator,
    maximumFractionDigits: settings.decimalPrecision,
  }).format(rounded);
}

function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Inserts thousands separators into the numeric runs of an in-progress expression string, for display only. */
export function formatExpressionForDisplay(expr: string, settings: CalculatorSettings): string {
  if (!settings.thousandsSeparator) return expr;
  return expr.replace(/\d+(\.\d+)?/g, (match) => {
    const [intPart, fracPart] = match.split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fracPart !== undefined ? `${grouped}.${fracPart}` : grouped;
  });
}

export function formatTimestamp(ts: number): { date: string; time: string } {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}
