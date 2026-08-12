import type { CategoryDef } from "./types";

export const CATEGORIES: CategoryDef[] = [
  {
    id: "personal",
    name: "Personal Data",
    description: "Names, contact info, addresses, and profiles across countries.",
    icon: "User",
    accent: "oklch(0.585 0.19 269)",
  },
  {
    id: "indian",
    name: "Government IDs (India)",
    description: "Synthetic Aadhaar, PAN, GSTIN, UPI, and other India-specific formats.",
    icon: "Landmark",
    accent: "oklch(0.65 0.2 25)",
  },
  {
    id: "banking",
    name: "Banking",
    description: "Accounts, IFSC/SWIFT codes, transactions, and invoice numbers.",
    icon: "Banknote",
    accent: "oklch(0.65 0.16 152)",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Products, SKUs, barcodes, coupons, orders, and reviews.",
    icon: "ShoppingCart",
    accent: "oklch(0.75 0.16 75)",
  },
  {
    id: "api",
    name: "API Testing",
    description: "Realistic nested JSON payloads for common API endpoints.",
    icon: "Braces",
    accent: "oklch(0.6 0.14 320)",
  },
  {
    id: "database",
    name: "Database",
    description: "INSERT / UPDATE / DELETE / SELECT statements for MySQL, Postgres, SQL Server.",
    icon: "Database",
    accent: "oklch(0.585 0.19 269)",
  },
  {
    id: "files",
    name: "Files",
    description: "Download generated datasets as PDF, CSV, Excel, JSON, XML, or TXT.",
    icon: "FileDown",
    accent: "oklch(0.65 0.16 152)",
  },
  {
    id: "automation",
    name: "Automation Testing",
    description: "Fixtures and data providers for Selenium, Playwright, Cypress, Robot, TestNG, JUnit.",
    icon: "Bot",
    accent: "oklch(0.68 0.18 269)",
  },
  {
    id: "mobile",
    name: "Mobile Testing",
    description: "Devices, OS versions, screen sizes, build numbers, synthetic device IDs.",
    icon: "Smartphone",
    accent: "oklch(0.75 0.16 75)",
  },
  {
    id: "security",
    name: "Security",
    description: "Strong passwords, synthetic API keys, UUIDs, JWTs, hashes, OAuth tokens.",
    icon: "ShieldCheck",
    accent: "oklch(0.65 0.2 25)",
  },
  {
    id: "devutils",
    name: "Developer Utilities",
    description: "UUIDs, slugs, timestamps, color codes, cron expressions, and more.",
    icon: "Terminal",
    accent: "oklch(0.6 0.14 320)",
  },
  {
    id: "content",
    name: "Content & Media",
    description: "Lorem ipsum text and placeholder images for UI testing.",
    icon: "Image",
    accent: "oklch(0.65 0.16 152)",
  },
  {
    id: "qa",
    name: "QA Test Design",
    description: "Boundary values, equivalence partitions, negative & invalid inputs, injection payloads, edge cases.",
    icon: "FlaskConical",
    accent: "oklch(0.65 0.2 25)",
  },
  {
    id: "faker",
    name: "Faker Profiles",
    description: "Complete synthetic profiles: resumes, employees, students, companies.",
    icon: "Users",
    accent: "oklch(0.585 0.19 269)",
  },
];

export function getCategory(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
