import type { KnowledgeModuleMeta } from "./types";

export const MODULE_META: KnowledgeModuleMeta[] = [
  { id: "manual-testing", title: "Manual Testing", description: "SDLC, STLC, test design, defect management, and the core vocabulary every tester needs.", icon: "ClipboardCheck" },
  { id: "automation-testing", title: "Automation Testing", description: "Selenium, Playwright, Cypress, Appium, and Robot Framework — architecture to CI/CD.", icon: "Bot" },
  { id: "programming", title: "Programming Languages", description: "Java, JavaScript, TypeScript, Python, and C# for testers who write code.", icon: "Code2" },
  { id: "api-testing", title: "API Testing", description: "REST, SOAP, GraphQL, auth, Postman, Swagger, and API automation tools.", icon: "Webhook" },
  { id: "database-testing", title: "Database Testing", description: "SQL across PostgreSQL, MySQL, SQL Server, Oracle, and MongoDB.", icon: "Database" },
  { id: "performance-testing", title: "Performance Testing", description: "Load, stress, spike, endurance, and volume testing with JMeter, k6, and Gatling.", icon: "Gauge" },
  { id: "security-testing", title: "Security Testing", description: "OWASP Top 10, injection attacks, auth flaws, and tools like Burp Suite and ZAP.", icon: "ShieldAlert" },
  { id: "mobile-testing", title: "Mobile Testing", description: "Android and iOS testing, device/emulator strategy, and Appium.", icon: "Smartphone" },
  { id: "devops", title: "DevOps", description: "Git, Docker, Jenkins, GitHub Actions, Kubernetes, and CI/CD pipelines for QA.", icon: "GitBranch" },
  { id: "ai-testing", title: "AI Testing", description: "Testing LLMs and AI features — prompt testing, hallucination checks, and AI regression.", icon: "Sparkles" },
];

export function getModuleMeta(id: string): KnowledgeModuleMeta | undefined {
  return MODULE_META.find((m) => m.id === id);
}
