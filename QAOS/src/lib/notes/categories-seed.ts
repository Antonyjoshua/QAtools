export interface CategorySeed {
  name: string;
  icon: string;
  children: string[];
}

export const CATEGORY_SEED: CategorySeed[] = [
  {
    name: "Manual Testing",
    icon: "ClipboardCheck",
    children: [
      "SDLC",
      "STLC",
      "Test Case Design",
      "Boundary Value Analysis",
      "Equivalence Partitioning",
      "Decision Table Testing",
      "State Transition Testing",
      "Smoke Testing",
      "Sanity Testing",
      "Regression Testing",
      "Integration Testing",
      "System Testing",
      "UAT",
    ],
  },
  {
    name: "Automation Testing",
    icon: "Bot",
    children: [
      "Playwright",
      "Selenium",
      "Cypress",
      "Appium",
      "Robot Framework",
      "TestNG",
      "Cucumber",
      "Page Object Model",
      "Framework Design",
    ],
  },
  {
    name: "API Testing",
    icon: "Braces",
    children: [
      "REST API",
      "SOAP",
      "GraphQL",
      "Postman",
      "Swagger",
      "Authentication",
      "JWT",
      "OAuth",
      "HTTP Status Codes",
    ],
  },
  {
    name: "Database Testing",
    icon: "Database",
    children: ["SQL Basics", "CRUD Operations", "Joins", "Stored Procedures", "Data Validation"],
  },
  {
    name: "Mobile Testing",
    icon: "Smartphone",
    children: [
      "Android Testing",
      "iOS Testing",
      "Device Compatibility",
      "Network Testing",
      "Permission Testing",
      "Orientation Testing",
    ],
  },
  {
    name: "Performance Testing",
    icon: "Gauge",
    children: ["JMeter", "Load Testing", "Stress Testing", "Spike Testing", "Endurance Testing"],
  },
  {
    name: "Security Testing",
    icon: "ShieldAlert",
    children: ["SQL Injection", "XSS", "CSRF", "Authentication Testing", "Authorization Testing"],
  },
  {
    name: "Agile",
    icon: "Users",
    children: ["Scrum", "Sprint Planning", "User Stories", "Story Points", "Sprint Review", "Retrospective"],
  },
];
