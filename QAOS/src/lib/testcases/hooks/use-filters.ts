"use client";

import * as React from "react";
import type { TestCase, TestCaseFilters } from "../types";
import { EMPTY_FILTERS } from "../types";

export function useTestCaseFilters() {
  const [filters, setFilters] = React.useState<TestCaseFilters>(EMPTY_FILTERS);

  const activeCount = React.useMemo(() => {
    let count = filters.search.trim() ? 1 : 0;
    count += filters.status.length + filters.priority.length + filters.severity.length + filters.type.length;
    count += filters.module.length + filters.feature.length + filters.sprint.length;
    count += filters.author.length + filters.reviewer.length + filters.automationStatus.length;
    count += filters.browser.length + filters.os.length + filters.tags.length;
    return count;
  }, [filters]);

  function toggle<K extends keyof TestCaseFilters>(key: K, value: string) {
    setFilters((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  function setSearch(search: string) {
    setFilters((prev) => ({ ...prev, search }));
  }

  function clear() {
    setFilters(EMPTY_FILTERS);
  }

  return { filters, setFilters, toggle, setSearch, clear, activeCount };
}

export function applyTestCaseFilters(testCases: TestCase[], filters: TestCaseFilters): TestCase[] {
  const q = filters.search.trim().toLowerCase();
  return testCases.filter((tc) => {
    if (q) {
      const haystack = `${tc.displayId} ${tc.title} ${tc.requirementId} ${tc.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.status.length && !filters.status.includes(tc.status)) return false;
    if (filters.priority.length && !filters.priority.includes(tc.priority)) return false;
    if (filters.severity.length && !filters.severity.includes(tc.severity)) return false;
    if (filters.type.length && !filters.type.includes(tc.type)) return false;
    if (filters.module.length && !filters.module.includes(tc.module)) return false;
    if (filters.feature.length && !filters.feature.includes(tc.feature)) return false;
    if (filters.sprint.length && !filters.sprint.includes(tc.sprint)) return false;
    if (filters.author.length && !filters.author.includes(tc.author)) return false;
    if (filters.reviewer.length && !filters.reviewer.includes(tc.reviewer)) return false;
    if (filters.automationStatus.length && !filters.automationStatus.includes(tc.automationStatus)) return false;
    if (filters.browser.length && !filters.browser.includes(tc.browser)) return false;
    if (filters.os.length && !filters.os.includes(tc.os)) return false;
    if (filters.tags.length && !filters.tags.some((t) => tc.tags.includes(t))) return false;
    return true;
  });
}

export interface FacetOptions {
  status: string[];
  priority: string[];
  severity: string[];
  type: string[];
  module: string[];
  feature: string[];
  sprint: string[];
  author: string[];
  reviewer: string[];
  automationStatus: string[];
  browser: string[];
  os: string[];
  tags: string[];
}

export function deriveFacets(testCases: TestCase[]): FacetOptions {
  const uniq = (values: (string | undefined)[]) => Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort();
  return {
    status: uniq(testCases.map((t) => t.status)),
    priority: uniq(testCases.map((t) => t.priority)),
    severity: uniq(testCases.map((t) => t.severity)),
    type: uniq(testCases.map((t) => t.type)),
    module: uniq(testCases.map((t) => t.module)),
    feature: uniq(testCases.map((t) => t.feature)),
    sprint: uniq(testCases.map((t) => t.sprint)),
    author: uniq(testCases.map((t) => t.author)),
    reviewer: uniq(testCases.map((t) => t.reviewer)),
    automationStatus: uniq(testCases.map((t) => t.automationStatus)),
    browser: uniq(testCases.map((t) => t.browser)),
    os: uniq(testCases.map((t) => t.os)),
    tags: uniq(testCases.flatMap((t) => t.tags)),
  };
}
