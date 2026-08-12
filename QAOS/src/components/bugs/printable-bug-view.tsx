"use client";

import * as React from "react";
import { generateHTML, type JSONContent } from "@tiptap/core";
import { baseExtensions } from "@/lib/bugs/editor-extensions";
import type { BugReport } from "@/lib/bugs/types";
import "./editor/editor.css";

const SECTIONS: { key: keyof BugReport; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "preconditions", label: "Preconditions" },
  { key: "stepsToReproduce", label: "Steps to Reproduce" },
  { key: "expectedResult", label: "Expected Result" },
  { key: "actualResult", label: "Actual Result" },
  { key: "observedBehaviour", label: "Observed Behaviour" },
  { key: "additionalNotes", label: "Additional Notes" },
];

export function PrintableBugView({
  bug,
  projectName,
  moduleName,
  featureName,
}: {
  bug: BugReport;
  projectName: string;
  moduleName: string;
  featureName: string;
}) {
  const metaRows: [string, string][] = [
    ["Bug ID", bug.displayId],
    ["Project", projectName || "—"],
    ["Module", moduleName || "—"],
    ["Feature", featureName || "—"],
    ["Build Version", bug.buildVersion || "—"],
    ["Environment", bug.environment || "—"],
    ["Platform", bug.platform || "—"],
    ["Browser", `${bug.browser || "—"} ${bug.browserVersion}`.trim()],
    ["Device", bug.device || "—"],
    ["OS", bug.os || "—"],
    ["Reporter", bug.reporter || "—"],
    ["Severity", bug.severity ?? "—"],
    ["Priority", bug.priority ?? "—"],
    ["Category", bug.category ?? "—"],
    ["Status", bug.status],
    ["Labels", bug.labels.join(", ") || "—"],
  ];

  return (
    <div className="print-only bf-prose mx-auto max-w-3xl p-8 text-black">
      <h1 className="text-2xl font-bold">
        {bug.displayId} — {bug.title || "Untitled"}
      </h1>
      <table className="mt-4 w-full border-collapse text-sm">
        <tbody>
          {metaRows.map(([k, v]) => (
            <tr key={k}>
              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left">{k}</th>
              <td className="border border-gray-300 px-2 py-1">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {SECTIONS.map((s) => (
        <div key={String(s.key)}>
          <h2 className="mt-6 border-b-2 border-gray-200 pb-1 text-lg font-semibold">{s.label}</h2>
          <div dangerouslySetInnerHTML={{ __html: generateHTML(bug[s.key] as JSONContent, baseExtensions()) }} />
        </div>
      ))}
    </div>
  );
}
