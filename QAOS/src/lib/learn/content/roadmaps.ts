import type { Roadmap } from "./types";

export const ROADMAPS: Roadmap[] = [
  {
    id: "roadmap-manual-tester",
    title: "Manual Tester",
    description: "The foundational path into QA — testing theory, test design, and defect management.",
    milestones: [
      { id: "m1", title: "Learn the SDLC & STLC", description: "Understand how testing fits into the broader development process.", relatedArticleIds: ["mt-sdlc", "mt-stlc"] },
      { id: "m2", title: "Master the 7 testing principles", description: "Internalize the theory that explains why testing is scoped and prioritized the way it is.", relatedArticleIds: ["mt-testing-principles"] },
      { id: "m3", title: "Learn verification vs validation, QA vs QC", description: "Get the core vocabulary right — it's asked in almost every interview.", relatedArticleIds: ["mt-verification-validation", "mt-qa-vs-qc"] },
      { id: "m4", title: "Practice writing test cases and test scenarios", description: "Turn requirements into clear, traceable test cases.", relatedArticleIds: [] },
      { id: "m5", title: "Learn the defect life cycle & severity/priority", description: "Know how to log, triage, and track a bug from discovery to closure.", relatedArticleIds: ["mt-defect-lifecycle", "mt-severity-priority"] },
      { id: "m6", title: "Learn smoke, sanity, and regression testing", description: "Know when to run each type of test and why.", relatedArticleIds: ["mt-smoke-sanity-regression"] },
      { id: "m7", title: "Get comfortable with SQL basics", description: "Most manual testers eventually need to verify data directly in the database.", relatedArticleIds: [] },
      { id: "m8", title: "Take the Manual Testing quiz and flashcards", description: "Confirm retention before moving to automation or a specialization.", relatedArticleIds: [] },
    ],
  },
  {
    id: "roadmap-automation-tester",
    title: "Automation Tester",
    description: "Building on manual testing fundamentals with a programming language and an automation framework.",
    milestones: [
      { id: "m1", title: "Be solid on manual testing fundamentals first", description: "Automation without solid test design underneath just automates bad tests faster.", relatedArticleIds: ["mt-introduction", "mt-testing-principles"] },
      { id: "m2", title: "Learn a programming language (Java, Python, or JS/TS)", description: "Pick one and go deep rather than spreading thin across all of them.", relatedArticleIds: [] },
      { id: "m3", title: "Learn a modern automation tool (Playwright or Selenium)", description: "Locators, waits, assertions, and page object patterns.", relatedArticleIds: [] },
      { id: "m4", title: "Learn data-driven and parameterized testing", description: "Run the same test logic across many data sets." },
      { id: "m5", title: "Set up reporting and CI/CD integration", description: "Make your suite run automatically and produce readable results on every commit." },
      { id: "m6", title: "Learn to keep suites fast and non-flaky", description: "Parallel execution, proper waits, and test isolation." },
    ],
  },
  {
    id: "roadmap-api-tester",
    title: "API Tester",
    description: "Testing the layer underneath the UI — faster, more stable, and often higher-leverage than UI testing.",
    milestones: [
      { id: "m1", title: "Learn HTTP fundamentals", description: "Methods, status codes, headers, and how a request/response cycle actually works." },
      { id: "m2", title: "Learn REST, and the basics of SOAP and GraphQL", description: "Understand the tradeoffs between the major API styles." },
      { id: "m3", title: "Get fluent in Postman", description: "Collections, environments, and scripted pre-request/test assertions." },
      { id: "m4", title: "Learn authentication: API keys, JWT, OAuth 2.0", description: "Most real-world API bugs live in auth edge cases." },
      { id: "m5", title: "Automate API tests (RestAssured, Playwright API, or Newman)", description: "Move from manual Postman runs to a CI-integrated suite." },
      { id: "m6", title: "Learn to read and validate against a Swagger/OpenAPI contract", description: "Catch contract drift between docs and actual behavior." },
    ],
  },
  {
    id: "roadmap-performance-engineer",
    title: "Performance Engineer",
    description: "Moving from 'does it work' to 'does it work under load.'",
    milestones: [
      { id: "m1", title: "Learn the 5 load types", description: "Load, stress, spike, endurance, and volume testing — know when to use each." },
      { id: "m2", title: "Learn JMeter or k6 deeply", description: "Pick a tool and learn to script realistic, parameterized load scenarios." },
      { id: "m3", title: "Learn to read performance reports", description: "Response time percentiles (p95/p99), throughput, and error rate under load." },
      { id: "m4", title: "Understand basic system architecture", description: "You can't reason about bottlenecks without knowing what's behind the API — app servers, DB, cache, queues." },
      { id: "m5", title: "Practice root-causing a performance regression", description: "Correlate load test results with server-side metrics/logs to find the actual bottleneck." },
    ],
  },
  {
    id: "roadmap-security-tester",
    title: "Security Tester",
    description: "Thinking like an attacker to find the flaws functional testing misses.",
    milestones: [
      { id: "m1", title: "Learn the OWASP Top 10", description: "The most common and highest-impact web application vulnerability classes." },
      { id: "m2", title: "Practice SQL injection and XSS on a legal training target", description: "Use intentionally vulnerable apps (e.g. OWASP Juice Shop) — never test unauthorized systems." },
      { id: "m3", title: "Learn authentication & authorization testing", description: "Broken access control is consistently one of the highest-impact vulnerability classes found in practice." },
      { id: "m4", title: "Get hands-on with Burp Suite or OWASP ZAP", description: "Intercept, modify, and replay requests to probe for flaws." },
      { id: "m5", title: "Learn JWT-specific security pitfalls", description: "Algorithm confusion, weak secrets, and missing expiry checks are common real-world findings." },
    ],
  },
  {
    id: "roadmap-ai-test-engineer",
    title: "AI Test Engineer",
    description: "An emerging specialization: testing systems whose behavior is probabilistic, not deterministic.",
    milestones: [
      { id: "m1", title: "Understand how LLMs/AI features actually work at a high level", description: "You don't need to train models, but you need to understand tokens, context windows, and non-determinism." },
      { id: "m2", title: "Learn prompt testing strategies", description: "Testing prompts systematically instead of ad hoc trial-and-error." },
      { id: "m3", title: "Learn hallucination testing techniques", description: "Detecting confidently-wrong outputs, which is the defining failure mode of generative AI." },
      { id: "m4", title: "Learn AI regression testing", description: "How to detect when a model/prompt update silently degrades quality on cases that used to pass." },
      { id: "m5", title: "Learn AI model evaluation metrics", description: "Precision/recall-style thinking applied to generative and classification outputs." },
    ],
  },
  {
    id: "roadmap-sdet",
    title: "SDET (Software Development Engineer in Test)",
    description: "The hybrid path: strong testing instincts plus real software engineering skill.",
    milestones: [
      { id: "m1", title: "Be strong in both manual testing and automation first", description: "SDET is a superset, not a shortcut past fundamentals.", relatedArticleIds: ["mt-testing-principles"] },
      { id: "m2", title: "Get genuinely proficient in one programming language", description: "Data structures, OOP, and writing clean, testable code — not just automation scripts." },
      { id: "m3", title: "Learn to design test automation frameworks", description: "Layered architecture, page objects, reusable fixtures, and reporting." },
      { id: "m4", title: "Learn CI/CD and containerization", description: "Docker, Jenkins/GitHub Actions — SDETs usually own the pipeline testing runs in." },
      { id: "m5", title: "Learn performance and API testing fundamentals", description: "SDETs are expected to test at every layer, not just the UI." },
      { id: "m6", title: "Practice system design for testability", description: "Understanding how to make a system easier to test (feature flags, seams, observability)." },
    ],
  },
  {
    id: "roadmap-qa-lead",
    title: "QA Lead",
    description: "Shifting from executing tests to shaping how a team tests.",
    milestones: [
      { id: "m1", title: "Master test strategy and test planning", description: "Define scope, approach, and risk-based prioritization for a whole project." },
      { id: "m2", title: "Learn to build and coach a QA team", description: "Interviewing, onboarding, and growing testers at different skill levels." },
      { id: "m3", title: "Own quality metrics and reporting", description: "Defect trends, coverage, and release-readiness reporting to stakeholders." },
      { id: "m4", title: "Learn to balance manual, automated, and exploratory testing at the team level", description: "Allocate effort across a team, not just decide for yourself." },
      { id: "m5", title: "Practice stakeholder communication under release pressure", description: "Say no to a risky release, and explain exactly why, in business terms." },
    ],
  },
  {
    id: "roadmap-test-architect",
    title: "Test Architect",
    description: "Designing the testing strategy and tooling that an entire organization builds on.",
    milestones: [
      { id: "m1", title: "Have deep, broad experience across manual, automation, API, performance, and security testing", description: "You can't architect for layers you've never personally tested." },
      { id: "m2", title: "Design test automation architecture at scale", description: "Shared libraries, reusable frameworks, and standards multiple teams build on." },
      { id: "m3", title: "Own the org-wide CI/CD test strategy", description: "How testing gates deployments across many services, not just one app." },
      { id: "m4", title: "Evaluate and select tooling", description: "Make build-vs-buy calls for test infrastructure with a multi-year view." },
      { id: "m5", title: "Mentor QA Leads and SDETs across teams", description: "Architects scale themselves through other people's decisions, not just their own code." },
    ],
  },
];

export function getRoadmap(id: string): Roadmap | undefined {
  return ROADMAPS.find((r) => r.id === id);
}
