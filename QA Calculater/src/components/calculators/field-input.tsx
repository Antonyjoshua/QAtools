"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalculatorField } from "@/lib/calculators/types";
import { cn } from "@/lib/utils";

interface FieldInputProps {
  field: CalculatorField;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFile?: (file: File) => void;
  fileBusy?: boolean;
}

export function FieldInput({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  onFile,
  fileBusy,
}: FieldInputProps) {
  const showError = touched && !!error;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.id} className="text-sm text-foreground/90">
        {field.label}
        {field.optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
      </Label>

      {field.kind === "file" ? (
        <div>
          <Input
            id={field.id}
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile?.(file);
            }}
            className="cursor-pointer"
          />
          {fileBusy && <p className="mt-1 text-xs text-muted-foreground">Reading file…</p>}
          {!fileBusy && value && <p className="mt-1 text-xs text-muted-foreground">Loaded: {value}</p>}
        </div>
      ) : field.kind === "select" ? (
        <Select value={value} onValueChange={(v) => v !== null && onChange(v)}>
          <SelectTrigger id={field.id} className="w-full" aria-invalid={showError}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.kind === "text" && field.multiline ? (
        <Textarea
          id={field.id}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={showError}
          rows={4}
          className={cn(showError && "border-destructive focus-visible:ring-destructive/40")}
        />
      ) : (
        <div className="relative">
          {field.prefix && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
              {field.prefix}
            </span>
          )}
          <Input
            id={field.id}
            type={field.kind === "date" ? "date" : field.kind === "time" ? "time" : "text"}
            inputMode={field.kind === "number" ? "decimal" : undefined}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={showError}
            className={cn(
              field.prefix && "pl-7",
              field.suffix && "pr-9",
              showError && "border-destructive focus-visible:ring-destructive/40"
            )}
          />
          {field.suffix && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              {field.suffix}
            </span>
          )}
        </div>
      )}

      {field.helpText && !showError && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
      {showError && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
