"use client";

import { cn } from "@/lib/utils";
import { CalculatorButton } from "./calculator-button";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

export function ScientificKeypad({ calc }: { calc: UseCalculatorReturn }) {
  const { actions, settings, updateSettings } = calc;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border/60 bg-foreground/[0.03] p-1">
        {(["deg", "rad"] as const).map((unit) => (
          <button
            key={unit}
            type="button"
            onClick={() => updateSettings({ angleUnit: unit })}
            className={cn(
              "h-8 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors",
              settings.angleUnit === unit
                ? "bg-gradient-to-br from-primary to-[#8B5CF6] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {unit === "deg" ? "Degrees" : "Radians"}
          </button>
        ))}
      </div>

      <div className="max-h-[168px] overflow-y-auto scrollbar-thin pr-0.5">
        <div className="grid grid-cols-4 gap-1.5">
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("sin")}>
            sin
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("cos")}>
            cos
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("tan")}>
            tan
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("log")}>
            log
          </CalculatorButton>

          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("asin")}>
            sin⁻¹
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("acos")}>
            cos⁻¹
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("atan")}>
            tan⁻¹
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("ln")}>
            ln
          </CalculatorButton>

          <CalculatorButton variant="function" onClick={() => actions.power(2)}>
            x²
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={() => actions.power(3)}>
            x³
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={() => actions.operator("^")} ariaLabel="x to the y">
            xʸ
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={() => actions.unaryFunc("sqrt")} ariaLabel="Square root">
            √x
          </CalculatorButton>

          <CalculatorButton variant="function" onClick={() => actions.unaryFunc("cbrt")} ariaLabel="Cube root">
            ³√x
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={actions.nthRoot} ariaLabel="Nth root">
            ⁿ√x
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("10^")}>
            10ˣ
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("e^")}>
            eˣ
          </CalculatorButton>

          <CalculatorButton variant="function" onClick={() => actions.unaryFunc("1÷")} ariaLabel="Reciprocal">
            1/x
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={actions.factorial} ariaLabel="Factorial">
            n!
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.namedOp("nPr")}>
            nPr
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.namedOp("nCr")}>
            nCr
          </CalculatorButton>

          <CalculatorButton variant="function" onClick={actions.openParen}>
            (
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={actions.closeParen}>
            )
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={() => actions.constant("π")}>
            π
          </CalculatorButton>
          <CalculatorButton variant="function" onClick={() => actions.constant("e")}>
            e
          </CalculatorButton>

          <CalculatorButton variant="function" className="text-xs" onClick={actions.exp}>
            Exp
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.namedOp("mod")}>
            Mod
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("abs")}>
            Abs
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("round")}>
            Round
          </CalculatorButton>

          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("floor")}>
            Floor
          </CalculatorButton>
          <CalculatorButton variant="function" className="text-xs" onClick={() => actions.unaryFunc("ceil")}>
            Ceil
          </CalculatorButton>
        </div>
      </div>
    </div>
  );
}
