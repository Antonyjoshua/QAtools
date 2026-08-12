"use client";

import * as React from "react";
import { useQuickCalculatorStore } from "./store";
import { formatResult, formatExpressionForDisplay } from "./formatter";
import { playKeySound, triggerHaptic } from "./sound";
import {
  INITIAL_ENGINE_STATE,
  type EngineState,
  pressDigit,
  pressDecimalPoint,
  pressOperator,
  pressConstant,
  pressOpenParen,
  pressCloseParen,
  pressUnaryFunction,
  pressPower,
  pressFactorial,
  pressNthRoot,
  pressNamedOperator,
  pressExp,
  pressToggleSign,
  pressPercent,
  pressBackspace,
  pressClearAll,
  pressEquals,
  pressMemoryClear,
  pressMemoryRecall,
  pressMemoryAdd,
  pressMemorySubtract,
} from "./calculator-engine";

export function useCalculator() {
  const settings = useQuickCalculatorStore((s) => s.settings);
  const mode = useQuickCalculatorStore((s) => s.mode);
  const setMode = useQuickCalculatorStore((s) => s.setMode);
  const history = useQuickCalculatorStore((s) => s.history);
  const addHistoryEntry = useQuickCalculatorStore((s) => s.addHistoryEntry);
  const removeHistoryEntry = useQuickCalculatorStore((s) => s.removeHistoryEntry);
  const clearHistory = useQuickCalculatorStore((s) => s.clearHistory);
  const updateSettings = useQuickCalculatorStore((s) => s.updateSettings);

  const [state, setState] = React.useState<EngineState>(INITIAL_ENGINE_STATE);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const feedback = React.useCallback(
    (kind: "tap" | "equals" = "tap") => {
      if (settings.soundEnabled) playKeySound(kind);
      if (settings.hapticEnabled) triggerHaptic();
    },
    [settings.soundEnabled, settings.hapticEnabled]
  );

  const dispatch = React.useCallback(
    (updater: (s: EngineState) => EngineState, sound: "tap" | "equals" = "tap") => {
      setHistoryIndex(-1);
      feedback(sound);
      setState((prev) => updater(prev));
    },
    [feedback]
  );

  const actions = React.useMemo(
    () => ({
      digit: (d: string) => dispatch((s) => pressDigit(s, d, settings.angleUnit)),
      decimal: () => dispatch((s) => pressDecimalPoint(s, settings.angleUnit)),
      operator: (op: "+" | "-" | "×" | "÷" | "^") => dispatch((s) => pressOperator(s, op, settings.angleUnit)),
      constant: (token: "π" | "e") => dispatch((s) => pressConstant(s, token, settings.angleUnit)),
      openParen: () => dispatch((s) => pressOpenParen(s, settings.angleUnit)),
      closeParen: () => dispatch((s) => pressCloseParen(s, settings.angleUnit)),
      unaryFunc: (prefix: string) => dispatch((s) => pressUnaryFunction(s, prefix, settings.angleUnit)),
      power: (power: 2 | 3) => dispatch((s) => pressPower(s, power, settings.angleUnit)),
      factorial: () => dispatch((s) => pressFactorial(s, settings.angleUnit)),
      nthRoot: () => dispatch((s) => pressNthRoot(s, settings.angleUnit)),
      namedOp: (op: "mod" | "nPr" | "nCr") => dispatch((s) => pressNamedOperator(s, op, settings.angleUnit)),
      exp: () => dispatch((s) => pressExp(s, settings.angleUnit)),
      toggleSign: () => dispatch((s) => pressToggleSign(s, settings.angleUnit)),
      percent: () => dispatch((s) => pressPercent(s, settings.angleUnit)),
      backspace: () => dispatch((s) => pressBackspace(s, settings.angleUnit)),
      clearAll: () => dispatch(pressClearAll),
      memoryClear: () => dispatch(pressMemoryClear),
      memoryRecall: () => dispatch((s) => pressMemoryRecall(s, settings.angleUnit)),
      memoryAdd: () => dispatch((s) => pressMemoryAdd(s, settings.angleUnit)),
      memorySubtract: () => dispatch((s) => pressMemorySubtract(s, settings.angleUnit)),
      equals: () => {
        if (!state.expression.trim()) return;
        const next = pressEquals(state, settings.angleUnit);
        setHistoryIndex(-1);
        feedback("equals");
        setState(next);
        // Runs after setState, not inside its updater — addHistoryEntry touches a
        // different store and must not update another component while this one renders.
        if (next.committedResult !== null) {
          addHistoryEntry(state.expression, formatResult(next.committedResult, settings));
        }
      },
    }),
    [state, dispatch, feedback, settings, addHistoryEntry]
  );

  const recallHistory = React.useCallback(
    (direction: "up" | "down") => {
      if (history.length === 0) return;
      const nextIdx = direction === "up" ? Math.min(historyIndex + 1, history.length - 1) : Math.max(historyIndex - 1, -1);
      const entry = history[nextIdx];
      setHistoryIndex(nextIdx);
      setState(entry ? { ...INITIAL_ENGINE_STATE, expression: entry.expression } : { ...INITIAL_ENGINE_STATE });
    },
    [history, historyIndex]
  );

  const loadHistoryEntry = React.useCallback((expression: string) => {
    setState({ ...INITIAL_ENGINE_STATE, expression });
    setHistoryIndex(-1);
  }, []);

  const displayExpression = formatExpressionForDisplay(state.expression, settings);
  const displayResult = state.error
    ? "Error"
    : state.committedResult !== null
      ? formatResult(state.committedResult, settings)
      : state.preview !== null
        ? formatResult(state.preview, settings)
        : state.expression
          ? ""
          : "0";

  return {
    state,
    mode,
    setMode,
    settings,
    updateSettings,
    history,
    removeHistoryEntry,
    clearHistory,
    loadHistoryEntry,
    recallHistory,
    displayExpression,
    displayResult,
    hasError: Boolean(state.error),
    actions,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator>;
