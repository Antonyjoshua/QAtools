"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Hammer, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { explainPlainEnglish, tokenizeRegex } from "@/lib/generator/tools/regex-engine";

type BlockType = "char" | "digit" | "letter" | "whitespace" | "any" | "start" | "end";
type QuantifierChoice = "none" | "zeroOrMore" | "oneOrMore" | "optional" | "exact" | "atLeast" | "between";
type GroupMode = "none" | "capture" | "non-capture";

interface BuilderBlock {
  uid: number;
  type: BlockType;
  charValue: string;
  quantifier: QuantifierChoice;
  exactN: string;
  minN: string;
  maxN: string;
}

const BLOCK_TYPE_OPTIONS: { value: BlockType; label: string }[] = [
  { value: "char", label: "Character (custom)" },
  { value: "digit", label: "Digit" },
  { value: "letter", label: "Letter" },
  { value: "whitespace", label: "Whitespace" },
  { value: "any", label: "Any Character" },
  { value: "start", label: "Start (^)" },
  { value: "end", label: "End ($)" },
];

const QUANTIFIER_OPTIONS: { value: QuantifierChoice; label: string }[] = [
  { value: "none", label: "None (exactly once)" },
  { value: "exact", label: "Exactly N" },
  { value: "atLeast", label: "At Least N" },
  { value: "between", label: "Between N and M" },
  { value: "zeroOrMore", label: "Zero or More" },
  { value: "oneOrMore", label: "One or More" },
  { value: "optional", label: "Optional" },
];

function escapeLiteral(char: string): string {
  return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function quantifierSuffix(b: BuilderBlock): string {
  switch (b.quantifier) {
    case "none":
      return "";
    case "zeroOrMore":
      return "*";
    case "oneOrMore":
      return "+";
    case "optional":
      return "?";
    case "exact":
      return `{${b.exactN || "1"}}`;
    case "atLeast":
      return `{${b.minN || "1"},}`;
    case "between":
      return `{${b.minN || "1"},${b.maxN || "2"}}`;
  }
}

function blockFragment(b: BuilderBlock): string {
  if (b.type === "start") return "^";
  if (b.type === "end") return "$";
  const base = b.type === "digit" ? "\\d" : b.type === "letter" ? "[a-zA-Z]" : b.type === "whitespace" ? "\\s" : b.type === "any" ? "." : escapeLiteral(b.charValue || "x");
  return base + quantifierSuffix(b);
}

let uidCounter = 0;
function newBlock(): BuilderBlock {
  uidCounter += 1;
  return { uid: uidCounter, type: "digit", charValue: "", quantifier: "none", exactN: "1", minN: "1", maxN: "2" };
}

export function RegexBuilderPanel({ onUse }: { onUse: (pattern: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [groupMode, setGroupMode] = React.useState<GroupMode>("none");
  const [blocks, setBlocks] = React.useState<BuilderBlock[]>(() => [
    { ...newBlock(), type: "start" },
    { ...newBlock(), type: "digit", quantifier: "exact", exactN: "10" },
    { ...newBlock(), type: "end" },
  ]);

  const joined = blocks.map(blockFragment).join("");
  const generated = groupMode === "capture" ? `(${joined})` : groupMode === "non-capture" ? `(?:${joined})` : joined;
  const explanation = generated ? explainPlainEnglish(tokenizeRegex(generated), generated) : "Add a block below to start building a pattern.";

  function updateBlock(uid: number, patch: Partial<BuilderBlock>) {
    setBlocks((prev) => prev.map((b) => (b.uid === uid ? { ...b, ...patch } : b)));
  }
  function removeBlock(uid: number) {
    setBlocks((prev) => prev.filter((b) => b.uid !== uid));
  }
  function addBlock() {
    setBlocks((prev) => [...prev, newBlock()]);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left">
        <Label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
          <Hammer className="size-3.5" /> Regex Builder
        </Label>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 pt-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Wrap whole sequence in</Label>
            <Select value={groupMode} onValueChange={(v) => v !== null && setGroupMode(v as GroupMode)}>
              <SelectTrigger className="w-56">
                <SelectValue>
                  {(v: GroupMode) =>
                    ({ none: "No group", capture: "Capture group ( )", "non-capture": "Non-capture group (?: )" })[v] ?? v
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No group</SelectItem>
                <SelectItem value="capture">Capture group ( )</SelectItem>
                <SelectItem value="non-capture">Non-capture group (?: )</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            {blocks.map((b) => (
              <div key={b.uid} className="flex flex-wrap items-center gap-1.5 rounded-md border border-border p-2">
                <Select value={b.type} onValueChange={(v) => v !== null && updateBlock(b.uid, { type: v as BlockType })}>
                  <SelectTrigger className="w-44">
                    <SelectValue>{(v: BlockType) => BLOCK_TYPE_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {b.type === "char" && (
                  <Input
                    value={b.charValue}
                    onChange={(e) => updateBlock(b.uid, { charValue: e.target.value.slice(0, 1) })}
                    placeholder="e.g. -"
                    className="h-8 w-16 font-mono"
                    maxLength={1}
                  />
                )}

                {b.type !== "start" && b.type !== "end" && (
                  <>
                    <Select value={b.quantifier} onValueChange={(v) => v !== null && updateBlock(b.uid, { quantifier: v as QuantifierChoice })}>
                      <SelectTrigger className="w-40">
                        <SelectValue>{(v: QuantifierChoice) => QUANTIFIER_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {QUANTIFIER_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {b.quantifier === "exact" && (
                      <Input
                        value={b.exactN}
                        onChange={(e) => updateBlock(b.uid, { exactN: e.target.value.replace(/\D/g, "") })}
                        className="h-8 w-16"
                        placeholder="N"
                      />
                    )}
                    {b.quantifier === "atLeast" && (
                      <Input
                        value={b.minN}
                        onChange={(e) => updateBlock(b.uid, { minN: e.target.value.replace(/\D/g, "") })}
                        className="h-8 w-16"
                        placeholder="N"
                      />
                    )}
                    {b.quantifier === "between" && (
                      <>
                        <Input
                          value={b.minN}
                          onChange={(e) => updateBlock(b.uid, { minN: e.target.value.replace(/\D/g, "") })}
                          className="h-8 w-14"
                          placeholder="Min"
                        />
                        <Input
                          value={b.maxN}
                          onChange={(e) => updateBlock(b.uid, { maxN: e.target.value.replace(/\D/g, "") })}
                          className="h-8 w-14"
                          placeholder="Max"
                        />
                      </>
                    )}
                  </>
                )}

                <code className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{blockFragment(b)}</code>
                <Button variant="ghost" size="icon-xs" onClick={() => removeBlock(b.uid)} title="Remove block">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={addBlock}>
            <Plus className="size-3.5" /> Add Block
          </Button>

          <div className="flex flex-col gap-1.5 rounded-md border border-border bg-background p-3">
            <Label className="text-xs text-muted-foreground">Generated pattern</Label>
            <code className="break-all font-mono text-sm">{generated || "(empty)"}</code>
            <p className="text-xs text-muted-foreground">{explanation}</p>
            <Button size="sm" className="w-fit" disabled={!generated} onClick={() => onUse(generated)}>
              Use This Pattern
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
