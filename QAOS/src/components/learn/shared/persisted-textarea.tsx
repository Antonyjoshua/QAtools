"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

/**
 * A textarea seeded once from async-loaded external state (e.g. a Dexie live query) but locally
 * authoritative after that. Only mount this once the source data has actually resolved (never
 * while it's `undefined`/loading) — its initial value is read once via useState's lazy
 * initializer and never fed back from the query again, which is what avoids the data-loss race
 * of a fully-controlled-by-async-state input: fast typing outrunning the write→read round-trip
 * and getting clobbered by a stale re-render mid-keystroke. Pass a `key` that changes when the
 * underlying record changes (e.g. `key={article.id}`) so it re-seeds correctly on record switch.
 */
export function PersistedTextarea({
  initialValue,
  onSave,
  ...props
}: { initialValue: string; onSave: (value: string) => void } & Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange" | "defaultValue">) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <Textarea
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onSave(e.target.value);
      }}
      {...props}
    />
  );
}
