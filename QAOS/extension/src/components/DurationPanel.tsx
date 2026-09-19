import * as React from "react";
import { parseQuickExpression, type QuickCalcResult } from "../lib/duration/quick-expression";
import { durationEquivalents, durationToMs } from "../lib/duration/conversions";
import { DURATION_UNITS, unitLabel, type DurationUnit } from "../lib/duration/units";

export function DurationPanel() {
  const [expr, setExpr] = React.useState("");
  const [result, setResult] = React.useState<QuickCalcResult | null>(null);

  const [value, setValue] = React.useState("54");
  const [unit, setUnit] = React.useState<DurationUnit>("s");

  React.useEffect(() => {
    if (!expr.trim()) {
      setResult(null);
      return;
    }
    setResult(parseQuickExpression(expr));
  }, [expr]);

  const equivalents = React.useMemo(() => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return durationEquivalents(durationToMs(n, unit));
  }, [value, unit]);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-1.5">
        <label htmlFor="quick-expr" className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Quick calculate
        </label>
        <input
          id="quick-expr"
          data-testid="quick-expr-input"
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder='e.g. "2 hr + 35 min" or "54 sec × 50 questions"'
          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />

        {result && (
          <div
            data-testid="quick-expr-result"
            className={`mt-1 rounded-md border px-2.5 py-2 text-sm ${
              result.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
            }`}
          >
            {result.success ? (
              <>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{result.expressionText}</div>
                <div className="font-mono text-base font-semibold">{result.resultText}</div>
                {result.detailText && <div className="text-[11px] opacity-80">{result.detailText}</div>}
              </>
            ) : (
              <span>{result.error}</span>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Convert a duration</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as DurationUnit)}
            className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          >
            {DURATION_UNITS.map((u) => (
              <option key={u} value={u}>
                {unitLabel(u, 2)}
              </option>
            ))}
          </select>
        </div>

        {equivalents && (
          <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs">
              <tbody>
                {equivalents.map((eq) => (
                  <tr key={eq.label} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-2 py-1 text-slate-500 dark:text-slate-400">{eq.label}</td>
                    <td className="px-2 py-1 text-right font-mono">{eq.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
