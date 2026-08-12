import type { ArticleOutline } from "./types";

// Topics registered so the library's structure is complete and navigable, but not yet written
// as full articles — each renders a "coming soon" state pointing back to the module overview.
export const ARTICLE_OUTLINES: ArticleOutline[] = [
  // Manual Testing — remaining topics beyond the fully-authored set in modules/manual-testing.ts
  ...[
    "Test Planning",
    "Test Strategy",
    "Test Cases",
    "Test Scenario",
    "Requirement Traceability Matrix (RTM)",
    "Bug Report",
    "Integration Testing",
    "System Testing",
    "User Acceptance Testing (UAT)",
    "Functional Testing",
    "Non-Functional Testing",
    "Exploratory Testing",
    "Ad Hoc Testing",
    "Compatibility Testing",
    "Accessibility Testing",
    "Localization Testing",
    "Internationalization Testing",
  ].map((title) => ({ moduleId: "manual-testing" as const, title })),

  ...[
    "Selenium — Installation & Architecture",
    "Selenium — Locators & Waits",
    "Playwright — Installation & Architecture",
    "Playwright — Locators & Assertions",
    "Playwright — Fixtures & Parallel Execution",
    "Cypress — Installation & Architecture",
    "Cypress — Commands & Assertions",
    "Appium — Mobile Automation Architecture",
    "Robot Framework — Keywords & Libraries",
    "Frames, Windows & Popups",
    "Data-Driven Testing",
    "Automation Reports (Allure, HTML)",
    "CI/CD Integration for Automation Suites",
  ].map((title) => ({ moduleId: "automation-testing" as const, title })),

  ...[
    "Java — Syntax & Fundamentals",
    "Java — OOP Concepts",
    "Java — Collections Framework",
    "Java — Exception Handling",
    "JavaScript — Syntax & Fundamentals",
    "JavaScript — Async/Await & Promises",
    "TypeScript — Types & Interfaces",
    "Python — Syntax & Fundamentals",
    "Python — File Handling",
    "C# — Syntax & OOP",
    "Making API Calls from Code",
  ].map((title) => ({ moduleId: "programming" as const, title })),

  ...[
    "REST API Fundamentals",
    "SOAP vs REST vs GraphQL",
    "HTTP Methods",
    "HTTP Status Codes",
    "API Authentication (API Keys, Basic Auth)",
    "JWT — JSON Web Tokens",
    "OAuth 2.0",
    "Headers & Cookies",
    "Postman — Collections & Environments",
    "Swagger / OpenAPI",
    "Newman — CLI Test Runner",
    "RestAssured for API Testing",
  ].map((title) => ({ moduleId: "api-testing" as const, title })),

  ...[
    "SQL Fundamentals — CRUD",
    "Constraints (Primary Key, Foreign Key, Unique)",
    "Joins (Inner, Left, Right, Full)",
    "Views",
    "Stored Procedures",
    "Transactions & ACID",
    "PostgreSQL Essentials",
    "MySQL Essentials",
    "SQL Server Essentials",
    "MongoDB for Testers",
    "Data Validation Techniques",
  ].map((title) => ({ moduleId: "database-testing" as const, title })),

  ...[
    "Load Testing",
    "Stress Testing",
    "Spike Testing",
    "Endurance (Soak) Testing",
    "Volume Testing",
    "JMeter — Getting Started",
    "k6 — Getting Started",
    "Gatling — Getting Started",
    "Reading Performance Test Reports",
  ].map((title) => ({ moduleId: "performance-testing" as const, title })),

  ...[
    "OWASP Top 10 Overview",
    "SQL Injection",
    "Cross-Site Scripting (XSS)",
    "Cross-Site Request Forgery (CSRF)",
    "Authentication & Authorization Testing",
    "JWT Security Pitfalls",
    "Burp Suite Basics",
    "OWASP ZAP Basics",
  ].map((title) => ({ moduleId: "security-testing" as const, title })),

  ...[
    "Android Testing Fundamentals",
    "iOS Testing Fundamentals",
    "Appium for Mobile Automation",
    "Real Device vs Emulator/Simulator Testing",
    "Push Notification Testing",
    "Deep Linking Testing",
  ].map((title) => ({ moduleId: "mobile-testing" as const, title })),

  ...[
    "Git Fundamentals",
    "GitHub Workflows",
    "Docker Fundamentals",
    "Jenkins Pipelines",
    "GitHub Actions",
    "Azure DevOps Pipelines",
    "Kubernetes Basics for Testers",
    "Designing a CI/CD Pipeline for QA",
  ].map((title) => ({ moduleId: "devops" as const, title })),

  ...[
    "What Is LLM Testing?",
    "Prompt Testing Strategies",
    "Hallucination Testing",
    "AI Regression Testing",
    "AI Model Evaluation Metrics",
    "Prompt Engineering for Testers",
    "AI Security Considerations",
    "AI-Assisted Test Automation",
  ].map((title) => ({ moduleId: "ai-testing" as const, title })),
];

export function getOutlinesForModule(moduleId: string): ArticleOutline[] {
  return ARTICLE_OUTLINES.filter((o) => o.moduleId === moduleId);
}
