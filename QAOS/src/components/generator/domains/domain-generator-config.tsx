"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/lib/generator/data";
import type { DomainCategoryDef, DomainGenConfig, FieldSchema, FieldType, ScenarioMode } from "@/lib/generator/domains/types";

const COUNT_PRESETS = [10, 25, 50, 100, 1000, 10000];
const MAX_COUNT = 100000;

const SCENARIO_OPTIONS: { label: string; value: ScenarioMode }[] = [
  { label: "Valid data", value: "valid" },
  { label: "Invalid data", value: "invalid" },
  { label: "Boundary values", value: "boundary" },
  { label: "Mixed (positive & negative)", value: "mixed" },
];

const CUSTOM_FIELD_TYPES: { label: string; value: FieldType }[] = [
  { label: "Text (short)", value: "text" },
  { label: "Sentence / Notes", value: "sentence" },
  { label: "Full Name", value: "fullName" },
  { label: "First Name", value: "firstName" },
  { label: "Last Name", value: "lastName" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Date", value: "date" },
  { label: "Date & Time", value: "dateTime" },
  { label: "Age", value: "age" },
  { label: "Gender", value: "gender" },
  { label: "Address", value: "address" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Country", value: "country" },
  { label: "Postal Code", value: "postalCode" },
  { label: "Company", value: "company" },
  { label: "Job Title", value: "jobTitle" },
  { label: "Yes / No", value: "boolean" },
  { label: "URL", value: "url" },
  { label: "Currency Code", value: "currencyCode" },
  { label: "Amount", value: "amount" },
  { label: "Percentage", value: "percentage" },
  { label: "Rating (1-5)", value: "rating" },
  { label: "ID / Code", value: "id" },
  { label: "UUID", value: "uuid" },
  { label: "Custom list (choose one of…)", value: "enum" },
];

function makeFieldKey(label: string, existingKeys: string[]): string {
  const base = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "field";
  let key = `custom_${base}`;
  let i = 2;
  while (existingKeys.includes(key)) {
    key = `custom_${base}_${i}`;
    i++;
  }
  return key;
}

interface DomainGeneratorConfigProps {
  category: DomainCategoryDef;
  customFields: FieldSchema[];
  config: DomainGenConfig;
  onChange: (patch: Partial<DomainGenConfig>) => void;
  onAddCustomField: (field: FieldSchema) => void;
  onRemoveCustomField: (key: string) => void;
}

export function DomainGeneratorConfig({ category, customFields, config, onChange, onAddCustomField, onRemoveCustomField }: DomainGeneratorConfigProps) {
  const [newFieldLabel, setNewFieldLabel] = React.useState("");
  const [newFieldType, setNewFieldType] = React.useState<FieldType>("text");
  const [newFieldEnumValues, setNewFieldEnumValues] = React.useState("");

  const allFields = React.useMemo(() => [...category.fields, ...customFields], [category.fields, customFields]);
  const customKeys = React.useMemo(() => new Set(customFields.map((f) => f.key)), [customFields]);

  function toggleField(key: string, checked: boolean) {
    const next = checked ? [...config.selectedFieldKeys, key] : config.selectedFieldKeys.filter((k) => k !== key);
    onChange({ selectedFieldKeys: next });
  }

  function selectAll() {
    onChange({ selectedFieldKeys: allFields.map((f) => f.key) });
  }

  function clearAll() {
    onChange({ selectedFieldKeys: [] });
  }

  function handleAddField() {
    const label = newFieldLabel.trim();
    if (!label) return;
    const enumValues =
      newFieldType === "enum"
        ? newFieldEnumValues
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : undefined;
    if (newFieldType === "enum" && (!enumValues || enumValues.length === 0)) return;

    const key = makeFieldKey(label, allFields.map((f) => f.key));
    onAddCustomField({ key, label, type: newFieldType, required: false, enumValues });
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldEnumValues("");
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Fields to include — pick exactly the details this test data should have ({config.selectedFieldKeys.length} of {allFields.length} selected)
          </p>
          <div className="flex gap-1">
            <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={selectAll}>
              Select all
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {allFields.map((f) => {
            const isCustom = customKeys.has(f.key);
            return (
              <div key={f.key} className="flex items-center gap-1">
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <Checkbox checked={config.selectedFieldKeys.includes(f.key)} onCheckedChange={(checked) => toggleField(f.key, Boolean(checked))} />
                  {f.label}
                  {f.required && !isCustom && <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">typically required</span>}
                  {isCustom && <span className="text-[10px] uppercase tracking-wide text-primary/70">custom</span>}
                </label>
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => onRemoveCustomField(f.key)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${f.label}`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {config.selectedFieldKeys.length === 0 && <p className="mt-2 text-xs text-destructive">Select at least one field to generate data.</p>}
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Add a custom field</p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Field name</Label>
            <Input value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} placeholder="e.g. Middle Name" className="w-44" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select value={newFieldType} onValueChange={(v) => v !== null && setNewFieldType(v as FieldType)}>
              <SelectTrigger className="w-44">
                <SelectValue>{(v: string) => CUSTOM_FIELD_TYPES.find((o) => o.value === v)?.label ?? v}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CUSTOM_FIELD_TYPES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {newFieldType === "enum" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Values (comma-separated)</Label>
              <Input value={newFieldEnumValues} onChange={(e) => setNewFieldEnumValues(e.target.value)} placeholder="Bronze, Silver, Gold" className="w-56" />
            </div>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleAddField}
            disabled={!newFieldLabel.trim() || (newFieldType === "enum" && !newFieldEnumValues.trim())}
          >
            <Plus className="size-3.5" />
            Add field
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Scenario</Label>
          <Select value={config.scenario} onValueChange={(v) => v !== null && onChange({ scenario: v as ScenarioMode })}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => SCENARIO_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SCENARIO_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Locale / Country</Label>
          <Select value={config.locale} onValueChange={(v) => v !== null && onChange({ locale: v })}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => COUNTRIES.find((c) => c.code === v)?.name ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Row count</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="w-28"
              min={1}
              max={MAX_COUNT}
              value={config.count}
              onChange={(e) => onChange({ count: Number(e.target.value) || 1 })}
            />
            <div className="flex flex-wrap gap-1">
              {COUNT_PRESETS.map((p) => (
                <Button key={p} type="button" size="sm" variant={config.count === p ? "secondary" : "ghost"} className="h-7 px-2 text-xs" onClick={() => onChange({ count: p })}>
                  {p.toLocaleString("en-US")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-border pt-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeDuplicates} onCheckedChange={(v) => onChange({ includeDuplicates: v })} />
          Include duplicate rows
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeNulls} onCheckedChange={(v) => onChange({ includeNulls: v })} />
          Include empty / null values
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeSpecialChars} onCheckedChange={(v) => onChange({ includeSpecialChars: v })} />
          Include special characters
        </label>
      </div>
    </div>
  );
}
