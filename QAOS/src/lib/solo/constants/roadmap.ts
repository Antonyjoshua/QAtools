import type { RoadmapMilestone } from "@/lib/solo/types";

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  { id: "rm-manual-testing", order: 1, title: "Manual Testing", description: "Master exploratory and scripted testing fundamentals." },
  { id: "rm-sql", order: 2, title: "SQL", description: "Query, join, and validate data with confidence." },
  { id: "rm-api-testing", order: 3, title: "API Testing", description: "Validate REST/GraphQL contracts and responses." },
  { id: "rm-automation", order: 4, title: "Automation", description: "Build reliable automated test suites." },
  { id: "rm-cicd", order: 5, title: "CI/CD", description: "Wire automation into continuous delivery pipelines." },
  { id: "rm-performance", order: 6, title: "Performance Testing", description: "Load, stress, and scalability testing." },
  { id: "rm-cloud", order: 7, title: "Cloud Testing", description: "Test across cloud-native and distributed environments." },
  { id: "rm-leadership", order: 8, title: "Leadership", description: "Lead QA strategy, mentor, and drive quality culture." },
];
