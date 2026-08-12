"use client";

import * as React from "react";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GenericListEditor } from "./generic-list-editor";
import { ExperienceForm, EducationForm, ProjectsForm } from "./timeline-forms";
import { addAttachment } from "@/lib/resume/repo/attachments-repo";
import { uid } from "@/lib/resume/id";
import type { ResumeSectionInstance, SectionData } from "@/lib/resume/types";

export function SectionEditor({
  resumeId,
  section,
  onChange,
}: {
  resumeId: string;
  section: ResumeSectionInstance;
  onChange: (data: SectionData) => void;
}) {
  const data = section.data;

  switch (data.type) {
    case "name":
      return (
        <Field label="Full name">
          <Input value={data.fullName} onChange={(e) => onChange({ ...data, fullName: e.target.value })} placeholder="Jordan Rivera" />
        </Field>
      );
    case "title":
      return (
        <Field label="Professional title">
          <Input value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} placeholder="Senior QA Engineer" />
        </Field>
      );
    case "summary":
      return (
        <Field label="Summary">
          <Textarea rows={4} value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} placeholder="2-3 sentences on your experience and strengths…" />
        </Field>
      );
    case "custom":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Section heading">
            <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
          </Field>
          <Field label="Content">
            <Textarea rows={4} value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} />
          </Field>
        </div>
      );
    case "contact":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Email">
            <Input value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={data.location} onChange={(e) => onChange({ ...data, location: e.target.value })} />
          </Field>
          <Field label="Website">
            <Input value={data.website} onChange={(e) => onChange({ ...data, website: e.target.value })} />
          </Field>
        </div>
      );
    case "photo":
      return (
        <PhotoField
          resumeId={resumeId}
          attachmentId={data.attachmentId}
          shape={data.shape}
          onChange={(attachmentId) => onChange({ ...data, attachmentId })}
          onShapeChange={(shape) => onChange({ ...data, shape })}
        />
      );
    case "social":
      return (
        <GenericListEditor
          items={data.links}
          fields={[
            { key: "label", label: "Label", placeholder: "LinkedIn" },
            { key: "url", label: "URL", placeholder: "linkedin.com/in/you" },
          ]}
          onChange={(links) => onChange({ ...data, links })}
          addLabel="Add link"
          makeBlank={() => ({ id: uid(), label: "", url: "" })}
        />
      );
    case "skills":
    case "technicalSkills":
    case "softSkills":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "name", label: "Skill", placeholder: "Test Automation" },
            { key: "level", label: "Level (0-100)", placeholder: "80" },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add skill"
          makeBlank={() => ({ id: uid(), name: "", level: 70 })}
        />
      );
    case "experience":
      return <ExperienceForm items={data.items} onChange={(items) => onChange({ ...data, items })} />;
    case "education":
      return <EducationForm items={data.items} onChange={(items) => onChange({ ...data, items })} />;
    case "projects":
      return <ProjectsForm items={data.items} onChange={(items) => onChange({ ...data, items })} />;
    case "certifications":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "name", label: "Name", span: 2 },
            { key: "issuer", label: "Issuer" },
            { key: "date", label: "Date", type: "month" },
            { key: "link", label: "Link", span: 2 },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add certification"
          makeBlank={() => ({ id: uid(), name: "", issuer: "", date: "", link: "" })}
        />
      );
    case "awards":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "title", label: "Title", span: 2 },
            { key: "issuer", label: "Issuer" },
            { key: "date", label: "Date", type: "month" },
            { key: "description", label: "Description", span: 2 },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add award"
          makeBlank={() => ({ id: uid(), title: "", issuer: "", date: "", description: "" })}
        />
      );
    case "publications":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "title", label: "Title", span: 2 },
            { key: "publisher", label: "Publisher" },
            { key: "date", label: "Date", type: "month" },
            { key: "link", label: "Link", span: 2 },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add publication"
          makeBlank={() => ({ id: uid(), title: "", publisher: "", date: "", link: "" })}
        />
      );
    case "languages":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "name", label: "Language" },
            { key: "level", label: "Level", placeholder: "Fluent" },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add language"
          makeBlank={() => ({ id: uid(), name: "", level: "" })}
        />
      );
    case "references":
      return (
        <GenericListEditor
          items={data.items}
          fields={[
            { key: "name", label: "Name" },
            { key: "relation", label: "Relation" },
            { key: "contact", label: "Contact", span: 2 },
          ]}
          onChange={(items) => onChange({ ...data, items })}
          addLabel="Add reference"
          makeBlank={() => ({ id: uid(), name: "", relation: "", contact: "" })}
        />
      );
    case "interests":
      return <InterestsField items={data.items} onChange={(items) => onChange({ ...data, items })} />;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function InterestsField({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = React.useState("");
  function commit() {
    const value = draft.trim();
    if (value && !items.includes(value)) onChange([...items, value]);
    setDraft("");
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs">
            {item}
            <button type="button" onClick={() => onChange(items.filter((i) => i !== item))} aria-label={`Remove ${item}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder="Type and press Enter…"
        className="h-8 text-sm"
      />
    </div>
  );
}

function PhotoField({
  resumeId,
  attachmentId,
  shape,
  onChange,
  onShapeChange,
}: {
  resumeId: string;
  attachmentId: string | null;
  shape: "circle" | "square";
  onChange: (id: string | null) => void;
  onShapeChange: (shape: "circle" | "square") => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  async function handleFile(file: File | undefined) {
    if (!file) return;
    const attachment = await addAttachment(resumeId, file);
    onChange(attachment.id);
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => inputRef.current?.click()}>
          <Upload className="size-3.5" />
          {attachmentId ? "Replace photo" : "Upload photo"}
        </Button>
        {attachmentId && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      <Field label="Shape">
        <div className="flex gap-1.5">
          {(["circle", "square"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onShapeChange(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                shape === s ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
