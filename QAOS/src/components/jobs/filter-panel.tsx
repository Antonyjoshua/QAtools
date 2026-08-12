"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RemoteBadge } from "@/components/jobs/shared/badges";
import { EXPERIENCE_BANDS, JOB_LEVELS, QA_CATEGORIES, type EmploymentType, type ExperienceBandId, type JobFilterState, type JobLevel, type QACategory, type RemoteStatus } from "@/lib/jobs/types";

const REMOTE_OPTIONS: RemoteStatus[] = ["ONSITE", "HYBRID", "REMOTE_INDIA", "REMOTE_WORLDWIDE", "REMOTE_REGION"];
const EMPLOYMENT_OPTIONS: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const POSTED_WITHIN_OPTIONS = [
  { label: "Any time", value: "0" },
  { label: "Last 24 hours", value: "24" },
  { label: "Last 7 days", value: "168" },
  { label: "Last 30 days", value: "720" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 first:pt-0 last:border-0">
      <Label className="text-xs font-medium text-foreground">{title}</Label>
      {children}
    </div>
  );
}

function CheckRow({ checked, onCheckedChange, children }: { checked: boolean; onCheckedChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 py-0.5 text-sm">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      {children}
    </label>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  availableCities,
  availableCompanies,
  availableSources,
  availableTechnologies,
}: {
  filters: JobFilterState;
  onChange: (patch: Partial<JobFilterState>) => void;
  onReset: () => void;
  availableCities: string[];
  availableCompanies: string[];
  availableSources: string[];
  availableTechnologies: string[];
}) {
  const activeCount =
    filters.remoteStatus.length +
    filters.qaCategories.length +
    filters.technologies.length +
    filters.levels.length +
    filters.employmentTypes.length +
    filters.experienceBands.length +
    filters.cities.length +
    filters.companies.length +
    filters.sources.length +
    (filters.postedWithinHours ? 1 : 0);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-3">
        <p className="text-sm font-semibold">Filters</p>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
            Clear ({activeCount})
          </Button>
        )}
      </div>

      <Section title="Remote">
        {REMOTE_OPTIONS.map((r) => (
          <CheckRow key={r} checked={filters.remoteStatus.includes(r)} onCheckedChange={() => onChange({ remoteStatus: toggle(filters.remoteStatus, r) })}>
            <RemoteBadge value={r} className="text-[10px]" />
          </CheckRow>
        ))}
      </Section>

      <Section title="Role category">
        <div className="flex max-h-48 flex-col overflow-y-auto pr-1">
          {QA_CATEGORIES.map((c: QACategory) => (
            <CheckRow key={c} checked={filters.qaCategories.includes(c)} onCheckedChange={() => onChange({ qaCategories: toggle(filters.qaCategories, c) })}>
              {c}
            </CheckRow>
          ))}
        </div>
      </Section>

      <Section title="Experience">
        {EXPERIENCE_BANDS.map((b) => (
          <CheckRow key={b.id} checked={filters.experienceBands.includes(b.id)} onCheckedChange={() => onChange({ experienceBands: toggle(filters.experienceBands, b.id as ExperienceBandId) })}>
            {b.label}
          </CheckRow>
        ))}
      </Section>

      <Section title="Level">
        {JOB_LEVELS.map((l: JobLevel) => (
          <CheckRow key={l} checked={filters.levels.includes(l)} onCheckedChange={() => onChange({ levels: toggle(filters.levels, l) })}>
            {l}
          </CheckRow>
        ))}
      </Section>

      <Section title="Employment type">
        {EMPLOYMENT_OPTIONS.map((e) => (
          <CheckRow key={e} checked={filters.employmentTypes.includes(e)} onCheckedChange={() => onChange({ employmentTypes: toggle(filters.employmentTypes, e) })}>
            {e}
          </CheckRow>
        ))}
      </Section>

      {availableTechnologies.length > 0 && (
        <Section title="Skills / technologies">
          <div className="flex max-h-48 flex-col overflow-y-auto pr-1">
            {availableTechnologies.map((t) => (
              <CheckRow key={t} checked={filters.technologies.includes(t)} onCheckedChange={() => onChange({ technologies: toggle(filters.technologies, t) })}>
                {t}
              </CheckRow>
            ))}
          </div>
        </Section>
      )}

      {availableCities.length > 0 && (
        <Section title="City">
          <div className="flex max-h-48 flex-col overflow-y-auto pr-1">
            {availableCities.map((c) => (
              <CheckRow key={c} checked={filters.cities.includes(c)} onCheckedChange={() => onChange({ cities: toggle(filters.cities, c) })}>
                {c}
              </CheckRow>
            ))}
          </div>
        </Section>
      )}

      {availableCompanies.length > 0 && (
        <Section title="Company">
          <div className="flex max-h-48 flex-col overflow-y-auto pr-1">
            {availableCompanies.map((c) => (
              <CheckRow key={c} checked={filters.companies.includes(c)} onCheckedChange={() => onChange({ companies: toggle(filters.companies, c) })}>
                {c}
              </CheckRow>
            ))}
          </div>
        </Section>
      )}

      {availableSources.length > 0 && (
        <Section title="Source">
          {availableSources.map((s) => (
            <CheckRow key={s} checked={filters.sources.includes(s)} onCheckedChange={() => onChange({ sources: toggle(filters.sources, s) })}>
              {s}
            </CheckRow>
          ))}
        </Section>
      )}

      <Section title="Posted">
        <Select value={String(filters.postedWithinHours ?? 0)} onValueChange={(v) => v !== null && onChange({ postedWithinHours: Number(v) || undefined })}>
          <SelectTrigger className="w-full">
            <SelectValue>{(v: string) => POSTED_WITHIN_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {POSTED_WITHIN_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>
    </div>
  );
}
