"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { updateResume } from "@/lib/resume/repo/resumes-repo";
import { FONT_STACKS } from "@/lib/resume/templates/theme-presets";
import { cn } from "@/lib/utils";
import type { ColumnCount, PageSize, Resume, ResumeLayout, ResumeTheme } from "@/lib/resume/types";

const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: FONT_STACKS.arial, label: "Arial" },
  { value: FONT_STACKS.georgia, label: "Georgia" },
  { value: FONT_STACKS.times, label: "Times New Roman" },
  { value: FONT_STACKS.segoe, label: "Segoe UI" },
  { value: FONT_STACKS.calibri, label: "Calibri" },
  { value: FONT_STACKS.trebuchet, label: "Trebuchet MS" },
  { value: FONT_STACKS.verdana, label: "Verdana" },
  { value: FONT_STACKS.plexMono, label: "Plex Mono (QA/Dev)" },
];

function toNumber(v: number | readonly number[]): number {
  return Array.isArray(v) ? v[0] : (v as number);
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 last:border-0">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function PillGroup<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === o.value ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-6 cursor-pointer rounded border border-input bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-20 rounded border border-input bg-transparent px-1.5 font-mono text-[11px] outline-none focus-visible:border-ring"
        />
      </div>
    </div>
  );
}

export function CustomizationPanel({ resume }: { resume: Resume }) {
  function patchTheme(patch: Partial<ResumeTheme>) {
    void updateResume(resume.id, { theme: { ...resume.theme, ...patch } });
  }
  function patchLayout(patch: Partial<ResumeLayout>) {
    void updateResume(resume.id, { layout: { ...resume.layout, ...patch } });
  }
  function setAllIcons(showIcon: boolean) {
    void updateResume(resume.id, { sections: resume.sections.map((s) => ({ ...s, showIcon })) });
  }

  const theme = resume.theme;
  const layout = resume.layout;
  const anyIconsOn = resume.sections.some((s) => s.showIcon);

  return (
    <div className="flex flex-col gap-5">
      <Group title="Page">
        <Row label="Page size">
          <PillGroup
            value={layout.pageSize}
            onChange={(v: PageSize) => patchLayout({ pageSize: v })}
            options={[
              { value: "a4", label: "A4" },
              { value: "letter", label: "Letter" },
            ]}
          />
        </Row>
        <Row label="Columns">
          <PillGroup
            value={String(layout.columns) as "1" | "2"}
            onChange={(v) => patchLayout({ columns: Number(v) as ColumnCount })}
            options={[
              { value: "1", label: "Single column" },
              { value: "2", label: "Two columns" },
            ]}
          />
        </Row>
        {layout.columns === 2 && (
          <Row label={`Main column width — ${Math.round(layout.columnRatio * 100)}%`}>
            <Slider value={[layout.columnRatio]} min={0.5} max={0.8} step={0.01} onValueChange={(v) => patchLayout({ columnRatio: toNumber(v) })} />
          </Row>
        )}
        <Row label="Header layout">
          <PillGroup
            value={layout.headerLayout}
            onChange={(v: ResumeLayout["headerLayout"]) => patchLayout({ headerLayout: v })}
            options={[
              { value: "stacked", label: "Stacked" },
              { value: "split", label: "Split" },
              { value: "banner", label: "Banner" },
            ]}
          />
        </Row>
      </Group>

      <Group title="Typography">
        <Row label="Heading font">
          <Select value={theme.headingFont} onValueChange={(v) => v && patchTheme({ headingFont: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue>{(v: string) => FONT_OPTIONS.find((f) => f.value === v)?.label ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
        <Row label="Body font">
          <Select value={theme.bodyFont} onValueChange={(v) => v && patchTheme({ bodyFont: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue>{(v: string) => FONT_OPTIONS.find((f) => f.value === v)?.label ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
        <Row label={`Font size — ${theme.fontSize}px`}>
          <Slider value={[theme.fontSize]} min={10} max={18} step={1} onValueChange={(v) => patchTheme({ fontSize: toNumber(v) })} />
        </Row>
        <Row label="Font weight">
          <PillGroup
            value={String(theme.fontWeight) as "400" | "500" | "600"}
            onChange={(v) => patchTheme({ fontWeight: Number(v) as ResumeTheme["fontWeight"] })}
            options={[
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
            ]}
          />
        </Row>
        <Row label="Alignment">
          <PillGroup
            value={theme.alignment}
            onChange={(v: ResumeTheme["alignment"]) => patchTheme({ alignment: v })}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
            ]}
          />
        </Row>
      </Group>

      <Group title="Colors">
        <ColorField label="Primary (headings)" value={theme.primaryColor} onChange={(v) => patchTheme({ primaryColor: v })} />
        <ColorField label="Accent (dividers/tags)" value={theme.accentColor} onChange={(v) => patchTheme({ accentColor: v })} />
        <ColorField label="Body text" value={theme.textColor} onChange={(v) => patchTheme({ textColor: v })} />
        <ColorField label="Muted text" value={theme.mutedColor} onChange={(v) => patchTheme({ mutedColor: v })} />
        <ColorField label="Background" value={theme.backgroundColor} onChange={(v) => patchTheme({ backgroundColor: v })} />
      </Group>

      <Group title="Spacing">
        <Row label={`Section spacing — ${theme.sectionSpacing}px`}>
          <Slider value={[theme.sectionSpacing]} min={8} max={40} step={1} onValueChange={(v) => patchTheme({ sectionSpacing: toNumber(v) })} />
        </Row>
        <Row label={`Page margin — ${theme.pageMargin}px`}>
          <Slider value={[theme.pageMargin]} min={16} max={64} step={1} onValueChange={(v) => patchTheme({ pageMargin: toNumber(v) })} />
        </Row>
      </Group>

      <Group title="Style">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Section dividers</span>
          <Switch checked={theme.dividers} onCheckedChange={(v) => patchTheme({ dividers: Boolean(v) })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Sidebar border</span>
          <Switch checked={theme.borders} onCheckedChange={(v) => patchTheme({ borders: Boolean(v) })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Section icons</span>
          <Switch checked={anyIconsOn} onCheckedChange={(v) => setAllIcons(Boolean(v))} />
        </div>
      </Group>
    </div>
  );
}
