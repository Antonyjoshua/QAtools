"use client";

import { CalculatorButton } from "./calculator-button";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

export function CalculatorKeypad({ calc }: { calc: UseCalculatorReturn }) {
  const { actions } = calc;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-1.5">
        <CalculatorButton variant="memory" onClick={actions.memoryClear} ariaLabel="Memory clear">
          MC
        </CalculatorButton>
        <CalculatorButton variant="memory" onClick={actions.memoryRecall} ariaLabel="Memory recall">
          MR
        </CalculatorButton>
        <CalculatorButton variant="memory" onClick={actions.memoryAdd} ariaLabel="Memory add">
          M+
        </CalculatorButton>
        <CalculatorButton variant="memory" onClick={actions.memorySubtract} ariaLabel="Memory subtract">
          M−
        </CalculatorButton>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        <CalculatorButton variant="function" onClick={actions.clearAll} ariaLabel="All clear">
          AC
        </CalculatorButton>
        <CalculatorButton variant="function" onClick={actions.toggleSign} ariaLabel="Toggle sign">
          ±
        </CalculatorButton>
        <CalculatorButton variant="function" onClick={actions.percent} ariaLabel="Percent">
          %
        </CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => actions.operator("÷")} ariaLabel="Divide">
          ÷
        </CalculatorButton>

        <CalculatorButton onClick={() => actions.digit("7")}>7</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("8")}>8</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("9")}>9</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => actions.operator("×")} ariaLabel="Multiply">
          ×
        </CalculatorButton>

        <CalculatorButton onClick={() => actions.digit("4")}>4</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("5")}>5</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("6")}>6</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => actions.operator("-")} ariaLabel="Subtract">
          −
        </CalculatorButton>

        <CalculatorButton onClick={() => actions.digit("1")}>1</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("2")}>2</CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("3")}>3</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => actions.operator("+")} ariaLabel="Add">
          +
        </CalculatorButton>

        <CalculatorButton variant="function" onClick={() => actions.unaryFunc("sqrt")} ariaLabel="Square root">
          √
        </CalculatorButton>
        <CalculatorButton onClick={() => actions.digit("0")}>0</CalculatorButton>
        <CalculatorButton onClick={actions.decimal} ariaLabel="Decimal point">
          .
        </CalculatorButton>
        <CalculatorButton variant="equals" onClick={actions.equals} ariaLabel="Equals">
          =
        </CalculatorButton>
      </div>
    </div>
  );
}
