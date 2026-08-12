import type { JSONContent } from "@tiptap/core";
import { doc, heading, paragraph, bulletList, taskList, table } from "./template-builders";

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "Testing" | "Reporting" | "Checklists";
  build: () => JSONContent;
}

export const TEMPLATES: NoteTemplate[] = [
  {
    id: "test-case",
    name: "Test Case",
    description: "Structured test case with steps, expected results, and status.",
    icon: "ClipboardCheck",
    category: "Testing",
    build: () =>
      doc(
        heading(1, "Test Case: [Title]"),
        table(
          ["Field", "Value"],
          [
            ["Test Case ID", "TC-001"],
            ["Module", ""],
            ["Priority", "High / Medium / Low"],
            ["Preconditions", ""],
          ]
        ),
        heading(2, "Test Steps"),
        table(
          ["Step", "Action", "Expected Result"],
          [
            ["1", "", ""],
            ["2", "", ""],
            ["3", "", ""],
          ]
        ),
        heading(2, "Actual Result"),
        paragraph(""),
        heading(2, "Status"),
        paragraph("Pass / Fail / Blocked"),
      ),
  },
  {
    id: "bug-report",
    name: "Bug Report",
    description: "Bug report with repro steps, severity, and environment.",
    icon: "Bug",
    category: "Testing",
    build: () =>
      doc(
        heading(1, "Bug: [Title]"),
        table(
          ["Field", "Value"],
          [
            ["Bug ID", "BUG-001"],
            ["Severity", "Critical / High / Medium / Low"],
            ["Priority", "P1 / P2 / P3"],
            ["Environment", "Browser / OS / Device"],
            ["Reported By", ""],
            ["Assigned To", ""],
          ]
        ),
        heading(2, "Steps to Reproduce"),
        bulletList(["Step 1", "Step 2", "Step 3"]),
        heading(2, "Expected Behavior"),
        paragraph(""),
        heading(2, "Actual Behavior"),
        paragraph(""),
        heading(2, "Screenshots / Attachments"),
        paragraph(""),
        heading(2, "Status"),
        paragraph("Open / In Progress / Fixed / Retesting / Closed"),
      ),
  },
  {
    id: "test-plan",
    name: "Test Plan",
    description: "High-level test plan covering scope, approach, and schedule.",
    icon: "ClipboardList",
    category: "Testing",
    build: () =>
      doc(
        heading(1, "Test Plan: [Project Name]"),
        heading(2, "Objective"),
        paragraph(""),
        heading(2, "Scope"),
        heading(3, "In Scope"),
        bulletList(["Feature A", "Feature B"]),
        heading(3, "Out of Scope"),
        bulletList(["Feature C"]),
        heading(2, "Test Approach"),
        paragraph(""),
        heading(2, "Test Environment"),
        paragraph(""),
        heading(2, "Entry & Exit Criteria"),
        table(["Type", "Criteria"], [["Entry", ""], ["Exit", ""]]),
        heading(2, "Resources & Schedule"),
        paragraph(""),
        heading(2, "Risks & Mitigation"),
        paragraph(""),
      ),
  },
  {
    id: "test-strategy",
    name: "Test Strategy",
    description: "Overall testing strategy: levels, types, tools, and automation approach.",
    icon: "Target",
    category: "Testing",
    build: () =>
      doc(
        heading(1, "Test Strategy: [Project Name]"),
        heading(2, "Testing Levels"),
        bulletList(["Unit Testing", "Integration Testing", "System Testing", "UAT"]),
        heading(2, "Testing Types"),
        bulletList(["Functional", "Regression", "API", "Performance", "Security", "Mobile"]),
        heading(2, "Tools & Frameworks"),
        paragraph(""),
        heading(2, "Automation Strategy"),
        paragraph(""),
        heading(2, "Defect Management"),
        paragraph(""),
      ),
  },
  {
    id: "rtm",
    name: "Requirement Traceability Matrix",
    description: "Map requirements to test cases for coverage tracking.",
    icon: "ListChecks",
    category: "Reporting",
    build: () =>
      doc(
        heading(1, "Requirement Traceability Matrix"),
        table(
          ["Req ID", "Requirement", "Test Case ID(s)", "Status"],
          [
            ["REQ-01", "", "TC-001, TC-002", "Covered"],
            ["REQ-02", "", "", "Not Covered"],
          ]
        ),
      ),
  },
  {
    id: "test-summary-report",
    name: "Test Summary Report",
    description: "Summary of test execution results at the end of a cycle.",
    icon: "ClipboardList",
    category: "Reporting",
    build: () =>
      doc(
        heading(1, "Test Summary Report"),
        table(
          ["Metric", "Value"],
          [
            ["Total Test Cases", ""],
            ["Passed", ""],
            ["Failed", ""],
            ["Blocked", ""],
            ["Pass %", ""],
          ]
        ),
        heading(2, "Key Findings"),
        bulletList(["Finding 1"]),
        heading(2, "Open Defects"),
        paragraph(""),
        heading(2, "Recommendation"),
        paragraph("Go / No-Go"),
      ),
  },
  {
    id: "daily-status-report",
    name: "Daily Status Report",
    description: "End-of-day QA status update.",
    icon: "ClipboardList",
    category: "Reporting",
    build: () =>
      doc(
        heading(1, "Daily Status Report — [Date]"),
        heading(2, "Work Completed Today"),
        bulletList(["Item 1"]),
        heading(2, "Planned for Tomorrow"),
        bulletList(["Item 1"]),
        heading(2, "Blockers"),
        paragraph("None"),
        heading(2, "Test Execution Summary"),
        table(["Executed", "Passed", "Failed", "Blocked"], [["", "", "", ""]]),
      ),
  },
  {
    id: "sprint-report",
    name: "Sprint Report",
    description: "Sprint-level QA summary for Agile teams.",
    icon: "Users",
    category: "Reporting",
    build: () =>
      doc(
        heading(1, "Sprint Report — Sprint [#]"),
        table(
          ["Field", "Value"],
          [
            ["Sprint Goal", ""],
            ["Duration", ""],
            ["Stories Tested", ""],
            ["Stories Passed QA", ""],
          ]
        ),
        heading(2, "Defects Logged"),
        paragraph(""),
        heading(2, "Automation Progress"),
        paragraph(""),
        heading(2, "Retrospective Notes"),
        bulletList(["What went well", "What could improve", "Action items"]),
      ),
  },
  {
    id: "api-test-checklist",
    name: "API Test Checklist",
    description: "Checklist covering common REST API test scenarios.",
    icon: "Braces",
    category: "Checklists",
    build: () =>
      doc(
        heading(1, "API Test Checklist"),
        heading(2, "Functional"),
        taskList([
          "Verify status codes for success and error scenarios",
          "Validate response schema/structure",
          "Validate response headers",
          "Test all CRUD operations",
          "Validate pagination, filtering, sorting",
        ]),
        heading(2, "Auth & Security"),
        taskList([
          "Test without auth token",
          "Test with expired/invalid token",
          "Verify role-based access control",
          "Check for sensitive data exposure",
        ]),
        heading(2, "Negative & Edge Cases"),
        taskList([
          "Invalid/missing required fields",
          "Boundary value inputs",
          "Large payloads",
          "SQL injection / XSS payloads in inputs",
        ]),
        heading(2, "Performance"),
        taskList(["Response time under load", "Rate limiting behavior"]),
      ),
  },
  {
    id: "mobile-testing-checklist",
    name: "Mobile Testing Checklist",
    description: "Checklist for Android/iOS mobile app testing.",
    icon: "Smartphone",
    category: "Checklists",
    build: () =>
      doc(
        heading(1, "Mobile Testing Checklist"),
        heading(2, "Installation & Launch"),
        taskList(["Fresh install", "Update from previous version", "Uninstall/reinstall"]),
        heading(2, "Device Compatibility"),
        taskList(["Different screen sizes", "Different OS versions", "Low-end device performance"]),
        heading(2, "Network"),
        taskList(["Wi-Fi", "Mobile data", "Offline mode", "Network switch mid-session"]),
        heading(2, "Permissions"),
        taskList(["Camera", "Location", "Notifications", "Storage"]),
        heading(2, "Orientation & UI"),
        taskList(["Portrait/landscape rotation", "Split-screen behavior", "Dark/light mode"]),
        heading(2, "Interruptions"),
        taskList(["Incoming call", "Push notification", "App backgrounding"]),
      ),
  },
];

export function getTemplate(id: string): NoteTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
