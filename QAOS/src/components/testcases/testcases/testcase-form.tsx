"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { testCaseFormSchema, type TestCaseFormValues } from "@/lib/testcases/schema";
import {
  PRIORITIES,
  SEVERITIES,
  TEST_TYPES,
  TEST_CASE_STATUSES,
  AUTOMATION_STATUSES,
  BROWSERS,
  OS_LIST,
  DEVICE_TYPES,
} from "@/lib/testcases/types";
import { cn } from "@/lib/utils";

function Field({ label, htmlFor, className, children }: { label: string; htmlFor?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function EnumSelect<T extends string>({ options, value, onChange, placeholder }: { options: readonly T[]; value: T | undefined; onChange: (v: T) => void; placeholder?: string }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function TestCaseForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  formId,
}: {
  defaultValues: TestCaseFormValues;
  onSubmit: (values: TestCaseFormValues) => void | Promise<void>;
  submitLabel?: string;
  formId: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseFormSchema),
    defaultValues,
  });

  const [tagDraft, setTagDraft] = React.useState("");
  const tags = watch("tags");

  function addTag() {
    const value = tagDraft.trim();
    if (!value || tags.includes(value)) {
      setTagDraft("");
      return;
    }
    setValue("tags", [...tags, value]);
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setValue("tags", tags.filter((t) => t !== tag));
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title="Overview">
        <Field label="Title" htmlFor="title" className="sm:col-span-2">
          <Input id="title" {...register("title")} placeholder="What is being tested?" autoFocus />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </Field>
        <Field label="Description" htmlFor="description" className="sm:col-span-2">
          <Textarea id="description" rows={3} {...register("description")} />
        </Field>
        <Field label="Objective" htmlFor="objective" className="sm:col-span-2">
          <Textarea id="objective" rows={2} {...register("objective")} placeholder="What does this test case verify?" />
        </Field>
        <Field label="Module" htmlFor="module">
          <Input id="module" {...register("module")} placeholder="e.g. Authentication" />
        </Field>
        <Field label="Feature" htmlFor="feature">
          <Input id="feature" {...register("feature")} placeholder="e.g. Login" />
        </Field>
      </Section>

      <Section title="Classification">
        <Field label="Priority">
          <Controller control={control} name="priority" render={({ field }) => <EnumSelect options={PRIORITIES} value={field.value} onChange={field.onChange} />} />
        </Field>
        <Field label="Severity">
          <Controller control={control} name="severity" render={({ field }) => <EnumSelect options={SEVERITIES} value={field.value} onChange={field.onChange} />} />
        </Field>
        <Field label="Type">
          <Controller control={control} name="type" render={({ field }) => <EnumSelect options={TEST_TYPES} value={field.value} onChange={field.onChange} />} />
        </Field>
        <Field label="Status">
          <Controller control={control} name="status" render={({ field }) => <EnumSelect options={TEST_CASE_STATUSES} value={field.value} onChange={field.onChange} />} />
        </Field>
      </Section>

      <Section title="Planning">
        <Field label="Requirement ID" htmlFor="requirementId">
          <Input id="requirementId" {...register("requirementId")} placeholder="e.g. REQ-101" />
        </Field>
        <Field label="Sprint" htmlFor="sprint">
          <Input id="sprint" {...register("sprint")} placeholder="e.g. Sprint 14" />
        </Field>
        <Field label="Release Version" htmlFor="releaseVersion">
          <Input id="releaseVersion" {...register("releaseVersion")} placeholder="e.g. 1.0.5" />
        </Field>
        <Field label="Estimated Time (minutes)" htmlFor="estimatedTimeMinutes">
          <Input
            id="estimatedTimeMinutes"
            type="number"
            min={0}
            {...register("estimatedTimeMinutes", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
          />
        </Field>
        <Field label="Reviewer" htmlFor="reviewer">
          <Input id="reviewer" {...register("reviewer")} placeholder="Who reviews this case?" />
        </Field>
        <Field label="Tags" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input px-2 py-1.5">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
              onBlur={addTag}
              placeholder="Add a tag…"
              className="min-w-24 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </Field>
      </Section>

      <Section title="Environment">
        <Field label="Environment" htmlFor="environment">
          <Input id="environment" {...register("environment")} placeholder="e.g. Staging" />
        </Field>
        <Field label="Browser">
          <Controller control={control} name="browser" render={({ field }) => <EnumSelect options={BROWSERS} value={field.value as (typeof BROWSERS)[number]} onChange={field.onChange} placeholder="Any" />} />
        </Field>
        <Field label="Device">
          <Controller control={control} name="device" render={({ field }) => <EnumSelect options={DEVICE_TYPES} value={field.value as (typeof DEVICE_TYPES)[number]} onChange={field.onChange} placeholder="Any" />} />
        </Field>
        <Field label="Operating System">
          <Controller control={control} name="os" render={({ field }) => <EnumSelect options={OS_LIST} value={field.value as (typeof OS_LIST)[number]} onChange={field.onChange} placeholder="Any" />} />
        </Field>
      </Section>

      <Section title="Automation">
        <Field label="Automation Status">
          <Controller control={control} name="automationStatus" render={({ field }) => <EnumSelect options={AUTOMATION_STATUSES} value={field.value} onChange={field.onChange} />} />
        </Field>
        <Field label="Automation Script Link" htmlFor="automationScriptLink">
          <Input id="automationScriptLink" {...register("automationScriptLink")} placeholder="https://…" />
        </Field>
      </Section>

      <Section title="Details">
        <Field label="Preconditions" htmlFor="preconditions" className="sm:col-span-2">
          <Textarea id="preconditions" rows={2} {...register("preconditions")} />
        </Field>
        <Field label="Test Data" htmlFor="testData" className="sm:col-span-2">
          <Textarea id="testData" rows={2} {...register("testData")} />
        </Field>
        <Field label="Expected Result" htmlFor="expectedResult" className="sm:col-span-2">
          <Textarea id="expectedResult" rows={2} {...register("expectedResult")} />
        </Field>
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" rows={2} {...register("notes")} />
        </Field>
      </Section>

      <Button type="submit" className="sr-only" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
