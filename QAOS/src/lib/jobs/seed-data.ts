import type { QACategory, SourceType } from "./types";

// -----------------------------------------------------------------------------
// Sample data only. Every company below is fictional — chosen deliberately so
// this preview can never be mistaken for a real, currently-open listing at a
// real employer. When a real source adapter is wired up (see adapters.ts),
// this file stops being imported.
// -----------------------------------------------------------------------------

export interface SeedCompany {
  id: string;
  name: string;
  website: string;
  logoInitials: string;
  logoColor: string;
  headquarters: string;
  description: string;
  isIndia: boolean;
}

export const SEED_COMPANIES: SeedCompany[] = [
  { id: "nimbus-cloud", name: "Nimbus Cloud Systems", website: "https://nimbuscloud.example.com", logoInitials: "NC", logoColor: "oklch(0.6 0.14 269)", headquarters: "Bangalore, India", description: "B2B SaaS platform for cloud cost management.", isIndia: true },
  { id: "vertex-analytics", name: "Vertex Analytics", website: "https://vertexanalytics.example.com", logoInitials: "VA", logoColor: "oklch(0.6 0.16 152)", headquarters: "Pune, India", description: "Data analytics and BI tooling for enterprises.", isIndia: true },
  { id: "pinnacle-fintech", name: "Pinnacle FinTech", website: "https://pinnaclefintech.example.com", logoInitials: "PF", logoColor: "oklch(0.65 0.2 25)", headquarters: "Mumbai, India", description: "Digital lending and payments infrastructure.", isIndia: true },
  { id: "brightpath-health", name: "BrightPath Health", website: "https://brightpathhealth.example.com", logoInitials: "BH", logoColor: "oklch(0.65 0.16 152)", headquarters: "Hyderabad, India", description: "Telehealth and hospital management software.", isIndia: true },
  { id: "quanta-robotics", name: "Quanta Robotics", website: "https://quantarobotics.example.com", logoInitials: "QR", logoColor: "oklch(0.6 0.14 320)", headquarters: "Chennai, India", description: "Warehouse automation and robotics control systems.", isIndia: true },
  { id: "solstice-commerce", name: "Solstice Commerce", website: "https://solsticecommerce.example.com", logoInitials: "SC", logoColor: "oklch(0.75 0.16 75)", headquarters: "Delhi NCR, India", description: "Multi-brand e-commerce platform.", isIndia: true },
  { id: "ember-logistics", name: "Ember Logistics", website: "https://emberlogistics.example.com", logoInitials: "EL", logoColor: "oklch(0.65 0.2 25)", headquarters: "Gurgaon, India", description: "Last-mile delivery and fleet management platform.", isIndia: true },
  { id: "crestline-systems", name: "Crestline Systems", website: "https://crestlinesystems.example.com", logoInitials: "CS", logoColor: "oklch(0.585 0.19 269)", headquarters: "Noida, India", description: "Enterprise HR and payroll software.", isIndia: true },
  { id: "northstar-payments", name: "Northstar Payments", website: "https://northstarpayments.example.com", logoInitials: "NP", logoColor: "oklch(0.6 0.18 280)", headquarters: "Kolkata, India", description: "Merchant payment gateway and reconciliation platform.", isIndia: true },
  { id: "bluewave-mobility", name: "Bluewave Mobility", website: "https://bluewavemobility.example.com", logoInitials: "BM", logoColor: "oklch(0.58 0.135 168)", headquarters: "Coimbatore, India", description: "EV fleet telematics and charging network software.", isIndia: true },
  { id: "skyline-edtech", name: "Skyline Edtech", website: "https://skylineedtech.example.com", logoInitials: "SE", logoColor: "oklch(0.65 0.2 25)", headquarters: "Kochi, India", description: "Online learning platform for competitive exams.", isIndia: true },
  { id: "ridgeline-security", name: "Ridgeline Security", website: "https://ridgelinesecurity.example.com", logoInitials: "RS", logoColor: "oklch(0.577 0.245 27)", headquarters: "Trivandrum, India", description: "Cloud security posture management.", isIndia: true },
  { id: "meridian-healthtech", name: "Meridian Health Tech", website: "https://meridianhealthtech.example.com", logoInitials: "MH", logoColor: "oklch(0.65 0.16 152)", headquarters: "Jaipur, India", description: "Diagnostics lab management software.", isIndia: true },
  { id: "cobalt-data", name: "Cobalt Data Systems", website: "https://cobaltdata.example.com", logoInitials: "CD", logoColor: "oklch(0.6 0.14 269)", headquarters: "Indore, India", description: "Data pipeline and warehousing infrastructure.", isIndia: true },
  { id: "zenith-cloud", name: "Zenith Cloud", website: "https://zenithcloud.example.com", logoInitials: "ZC", logoColor: "oklch(0.75 0.16 75)", headquarters: "Ahmedabad, India", description: "Managed Kubernetes and cloud infrastructure platform.", isIndia: true },
  { id: "coral-retail", name: "Coral Retail Tech", website: "https://coralretail.example.com", logoInitials: "CR", logoColor: "oklch(0.6 0.16 152)", headquarters: "Bangalore, India", description: "Point-of-sale and inventory software for retail chains.", isIndia: true },

  { id: "lumen-software", name: "Lumen Software", website: "https://lumensoftware.example.com", logoInitials: "LS", logoColor: "oklch(0.585 0.19 269)", headquarters: "Austin, USA", description: "Project collaboration software for distributed teams.", isIndia: false },
  { id: "argon-technologies", name: "Argon Technologies", website: "https://argontech.example.com", logoInitials: "AT", logoColor: "oklch(0.6 0.18 280)", headquarters: "London, UK", description: "Developer tooling for API observability.", isIndia: false },
  { id: "pixelworks-studio", name: "Pixelworks Studio", website: "https://pixelworksstudio.example.com", logoInitials: "PS", logoColor: "oklch(0.65 0.2 25)", headquarters: "Berlin, Germany", description: "Creative tools for game studios.", isIndia: false },
  { id: "northlight-analytics", name: "Northlight Analytics", website: "https://northlightanalytics.example.com", logoInitials: "NA", logoColor: "oklch(0.6 0.14 320)", headquarters: "Toronto, Canada", description: "Marketing analytics platform.", isIndia: false },
  { id: "vantage-robotics", name: "Vantage Robotics Inc.", website: "https://vantagerobotics.example.com", logoInitials: "VR", logoColor: "oklch(0.58 0.135 168)", headquarters: "San Francisco, USA", description: "Autonomous drone fleet software.", isIndia: false },
  { id: "fernbridge-systems", name: "Fernbridge Systems", website: "https://fernbridgesystems.example.com", logoInitials: "FS", logoColor: "oklch(0.65 0.16 152)", headquarters: "Sydney, Australia", description: "Supply-chain visibility platform.", isIndia: false },
  { id: "hearthstone-saas", name: "Hearthstone SaaS", website: "https://hearthstonesaas.example.com", logoInitials: "HS", logoColor: "oklch(0.577 0.245 27)", headquarters: "Chicago, USA", description: "Accounting software for small businesses.", isIndia: false },
  { id: "driftwood-labs", name: "Driftwood Labs", website: "https://driftwoodlabs.example.com", logoInitials: "DL", logoColor: "oklch(0.6 0.14 269)", headquarters: "Amsterdam, Netherlands", description: "Privacy-first analytics for mobile apps.", isIndia: false },
];

export interface SeedJobInput {
  title: string;
  companyId: string;
  city: string | null;
  state: string | null;
  country: string;
  /** Raw text as it would appear on the listing — this is what the classifier reads, not a pre-decided status. */
  remoteEvidence: string | null;
  minYears: number;
  maxYears: number | null;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  technologies: string[];
  qaCategoryHints: QACategory[];
  sourceType: SourceType;
  sourceName: string;
  postedHoursAgo: number;
  applicationDeadlineDaysFromNow?: number;
  benefits?: string[];
}

const IN = "India";

export const SEED_JOBS: SeedJobInput[] = [
  // ---- India — onsite / hybrid / domestic remote -------------------------------------------------
  { title: "QA Automation Engineer", companyId: "nimbus-cloud", city: "Bangalore", state: "Karnataka", country: IN, remoteEvidence: "Hybrid — 3 days/week in office", minYears: 3, maxYears: 6, salaryMin: 1200000, salaryMax: 1800000, currency: "INR", technologies: ["Playwright", "TypeScript", "GitHub Actions", "SQL"], qaCategoryHints: ["Automation Testing", "API Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 2, benefits: ["Health insurance", "Annual learning budget", "Flexible hours"] },
  { title: "SDET", companyId: "vertex-analytics", city: "Pune", state: "Maharashtra", country: IN, remoteEvidence: "On-site", minYears: 4, maxYears: 8, salaryMin: 1600000, salaryMax: 2400000, currency: "INR", technologies: ["Java", "Selenium", "Jenkins", "SQL", "Docker"], qaCategoryHints: ["SDET", "Automation Testing"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 5, benefits: ["ESOPs", "Health insurance"] },
  { title: "Manual Tester", companyId: "pinnacle-fintech", city: "Mumbai", state: "Maharashtra", country: IN, remoteEvidence: "On-site", minYears: 1, maxYears: 3, salaryMin: 500000, salaryMax: 800000, currency: "INR", technologies: ["SQL", "Postman"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Pinnacle FinTech Careers", postedHoursAgo: 20, benefits: ["Health insurance"] },
  { title: "Software Tester", companyId: "brightpath-health", city: "Hyderabad", state: "Telangana", country: IN, remoteEvidence: "Hybrid — 2 days/week in office", minYears: 2, maxYears: 4, salaryMin: 700000, salaryMax: 1100000, currency: "INR", technologies: ["Selenium", "Java", "SQL"], qaCategoryHints: ["Manual Testing", "Automation Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 30 },
  { title: "Automation Tester", companyId: "quanta-robotics", city: "Chennai", state: "Tamil Nadu", country: IN, remoteEvidence: "On-site", minYears: 2, maxYears: 5, salaryMin: 900000, salaryMax: 1400000, currency: "INR", technologies: ["Python", "Selenium", "Docker", "AWS"], qaCategoryHints: ["Automation Testing"], sourceType: "CompanyCareers", sourceName: "Quanta Robotics Careers", postedHoursAgo: 3 },
  { title: "QA Engineer", companyId: "solstice-commerce", city: "Delhi NCR", state: "Delhi", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 1, maxYears: 3, salaryMin: 600000, salaryMax: 950000, currency: "INR", technologies: ["Cypress", "JavaScript", "SQL"], qaCategoryHints: ["Automation Testing", "Manual Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 48 },
  { title: "QA Automation Engineer", companyId: "ember-logistics", city: "Gurgaon", state: "Haryana", country: IN, remoteEvidence: "Remote — India", minYears: 3, maxYears: 5, salaryMin: 1300000, salaryMax: 1900000, currency: "INR", technologies: ["Cypress", "TypeScript", "Postman", "Azure DevOps"], qaCategoryHints: ["Automation Testing", "API Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 1 },
  { title: "Test Engineer", companyId: "crestline-systems", city: "Noida", state: "Uttar Pradesh", country: IN, remoteEvidence: "On-site", minYears: 0, maxYears: 1, salaryMin: 400000, salaryMax: 600000, currency: "INR", technologies: ["SQL", "Postman"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Crestline Systems Careers", postedHoursAgo: 60 },
  { title: "API Tester", companyId: "northstar-payments", city: "Kolkata", state: "West Bengal", country: IN, remoteEvidence: "Hybrid — 2 days/week", minYears: 3, maxYears: 6, salaryMin: 1000000, salaryMax: 1500000, currency: "INR", technologies: ["Postman", "REST Assured", "Java", "SQL"], qaCategoryHints: ["API Testing", "Automation Testing"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 12 },
  { title: "Performance Tester", companyId: "bluewave-mobility", city: "Coimbatore", state: "Tamil Nadu", country: IN, remoteEvidence: "On-site", minYears: 4, maxYears: 7, salaryMin: 1400000, salaryMax: 2000000, currency: "INR", technologies: ["JMeter", "k6", "AWS"], qaCategoryHints: ["Performance Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 72 },
  { title: "Mobile Tester", companyId: "skyline-edtech", city: "Kochi", state: "Kerala", country: IN, remoteEvidence: "Remote — India", minYears: 2, maxYears: 4, salaryMin: 800000, salaryMax: 1200000, currency: "INR", technologies: ["Appium", "Java", "Postman"], qaCategoryHints: ["Mobile Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 6 },
  { title: "QA Lead", companyId: "ridgeline-security", city: "Trivandrum", state: "Kerala", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 8, maxYears: 12, salaryMin: 2200000, salaryMax: 3200000, currency: "INR", technologies: ["Selenium", "Java", "Jenkins", "Docker", "AWS"], qaCategoryHints: ["QA Leadership", "Automation Testing", "Security Testing"], sourceType: "CompanyCareers", sourceName: "Ridgeline Security Careers", postedHoursAgo: 15 },
  { title: "Test Lead", companyId: "meridian-healthtech", city: "Jaipur", state: "Rajasthan", country: IN, remoteEvidence: "On-site", minYears: 6, maxYears: 10, salaryMin: 1800000, salaryMax: 2600000, currency: "INR", technologies: ["Selenium", "Python", "SQL", "Jenkins"], qaCategoryHints: ["Test Management", "QA Leadership"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 90 },
  { title: "QA Manager", companyId: "cobalt-data", city: "Indore", state: "Madhya Pradesh", country: IN, remoteEvidence: "Hybrid — 2 days/week", minYears: 10, maxYears: null, salaryMin: 2800000, salaryMax: 4000000, currency: "INR", technologies: ["Java", "Selenium", "Docker", "Azure DevOps"], qaCategoryHints: ["QA Leadership", "Test Management"], sourceType: "CompanyCareers", sourceName: "Cobalt Data Systems Careers", postedHoursAgo: 130 },
  { title: "Quality Engineering Manager", companyId: "zenith-cloud", city: "Ahmedabad", state: "Gujarat", country: IN, remoteEvidence: "Remote — India", minYears: 10, maxYears: null, salaryMin: 3000000, salaryMax: 4200000, currency: "INR", technologies: ["Playwright", "Python", "GCP", "Docker"], qaCategoryHints: ["Quality Engineering", "QA Leadership", "DevOps / QA"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 4 },
  { title: "Automation Architect", companyId: "coral-retail", city: "Bangalore", state: "Karnataka", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 12, maxYears: null, salaryMin: 3500000, salaryMax: 5000000, currency: "INR", technologies: ["Playwright", "Java", "Python", "Jenkins", "AWS", "Docker"], qaCategoryHints: ["Automation Testing", "Quality Engineering"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 22 },
  { title: "Test Architect", companyId: "nimbus-cloud", city: "Bangalore", state: "Karnataka", country: IN, remoteEvidence: "Hybrid — 2 days/week", minYears: 12, maxYears: null, salaryMin: 3600000, salaryMax: 5200000, currency: "INR", technologies: ["Selenium", "REST Assured", "Java", "Jenkins", "Azure"], qaCategoryHints: ["Test Management", "Quality Engineering"], sourceType: "CompanyCareers", sourceName: "Nimbus Cloud Systems Careers", postedHoursAgo: 200 },
  { title: "Quality Analyst", companyId: "solstice-commerce", city: "Delhi NCR", state: "Delhi", country: IN, remoteEvidence: "On-site", minYears: 0, maxYears: 1, salaryMin: 350000, salaryMax: 550000, currency: "INR", technologies: ["SQL"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Solstice Commerce Careers", postedHoursAgo: 40 },
  { title: "Software Quality Engineer", companyId: "vertex-analytics", city: "Pune", state: "Maharashtra", country: IN, remoteEvidence: "Remote — India", minYears: 5, maxYears: 8, salaryMin: 1700000, salaryMax: 2400000, currency: "INR", technologies: ["Python", "Playwright", "Postman", "SQL"], qaCategoryHints: ["Quality Engineering", "API Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 9 },
  { title: "Quality Engineer", companyId: "pinnacle-fintech", city: "Mumbai", state: "Maharashtra", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 3, maxYears: 6, salaryMin: 1200000, salaryMax: 1700000, currency: "INR", technologies: ["Cypress", "TypeScript", "SQL", "Docker"], qaCategoryHints: ["Quality Engineering", "Automation Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 55 },
  { title: "Fresher QA Engineer", companyId: "crestline-systems", city: "Noida", state: "Uttar Pradesh", country: IN, remoteEvidence: "On-site", minYears: 0, maxYears: 0, salaryMin: 300000, salaryMax: 450000, currency: "INR", technologies: ["SQL", "Postman"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Crestline Systems Careers", postedHoursAgo: 18 },
  { title: "QA Intern", companyId: "skyline-edtech", city: "Kochi", state: "Kerala", country: IN, remoteEvidence: "On-site", minYears: 0, maxYears: 0, salaryMin: 180000, salaryMax: 240000, currency: "INR", technologies: ["SQL"], qaCategoryHints: ["Manual Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 100 },
  { title: "Junior Automation Tester", companyId: "bluewave-mobility", city: "Coimbatore", state: "Tamil Nadu", country: IN, remoteEvidence: "On-site", minYears: 1, maxYears: 2, salaryMin: 500000, salaryMax: 750000, currency: "INR", technologies: ["Selenium", "Java"], qaCategoryHints: ["Automation Testing"], sourceType: "CompanyCareers", sourceName: "Bluewave Mobility Careers", postedHoursAgo: 65 },
  { title: "Senior QA Automation Engineer", companyId: "ember-logistics", city: "Gurgaon", state: "Haryana", country: IN, remoteEvidence: "Remote — India", minYears: 5, maxYears: 9, salaryMin: 1900000, salaryMax: 2700000, currency: "INR", technologies: ["Playwright", "TypeScript", "API", "SQL", "GitHub Actions"], qaCategoryHints: ["Automation Testing", "API Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 2, applicationDeadlineDaysFromNow: 21, benefits: ["Health insurance", "Remote stipend", "Annual learning budget"] },
  { title: "Security Tester", companyId: "ridgeline-security", city: "Trivandrum", state: "Kerala", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 4, maxYears: 7, salaryMin: 1500000, salaryMax: 2200000, currency: "INR", technologies: ["Python", "AWS", "Docker"], qaCategoryHints: ["Security Testing"], sourceType: "CompanyCareers", sourceName: "Ridgeline Security Careers", postedHoursAgo: 33 },
  { title: "Accessibility Tester", companyId: "skyline-edtech", city: "Kochi", state: "Kerala", country: IN, remoteEvidence: "Remote — India", minYears: 2, maxYears: 5, salaryMin: 900000, salaryMax: 1300000, currency: "INR", technologies: ["JavaScript", "SQL"], qaCategoryHints: ["Accessibility Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 14 },
  { title: "DevOps QA Engineer", companyId: "zenith-cloud", city: "Ahmedabad", state: "Gujarat", country: IN, remoteEvidence: "Hybrid — 2 days/week", minYears: 4, maxYears: 7, salaryMin: 1600000, salaryMax: 2300000, currency: "INR", technologies: ["Jenkins", "Docker", "GCP", "Python", "GitHub Actions"], qaCategoryHints: ["DevOps / QA", "Automation Testing"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 25 },
  { title: "AI QA Engineer", companyId: "vertex-analytics", city: "Pune", state: "Maharashtra", country: IN, remoteEvidence: "Remote — India", minYears: 3, maxYears: 6, salaryMin: 1500000, salaryMax: 2100000, currency: "INR", technologies: ["Python", "SQL", "AWS"], qaCategoryHints: ["AI Testing", "Automation Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 7 },
  { title: "QA Engineer", companyId: "coral-retail", city: "Bangalore", state: "Karnataka", country: IN, remoteEvidence: "On-site", minYears: 1, maxYears: 3, salaryMin: 650000, salaryMax: 1000000, currency: "INR", technologies: ["Cypress", "JavaScript"], qaCategoryHints: ["Automation Testing", "Manual Testing"], sourceType: "CompanyCareers", sourceName: "Coral Retail Tech Careers", postedHoursAgo: 44 },
  { title: "Software Tester", companyId: "northstar-payments", city: "Kolkata", state: "West Bengal", country: IN, remoteEvidence: "On-site", minYears: 1, maxYears: 3, salaryMin: 550000, salaryMax: 850000, currency: "INR", technologies: ["SQL", "Postman"], qaCategoryHints: ["Manual Testing", "API Testing"], sourceType: "CompanyCareers", sourceName: "Northstar Payments Careers", postedHoursAgo: 80 },
  { title: "Automation Tester", companyId: "meridian-healthtech", city: "Jaipur", state: "Rajasthan", country: IN, remoteEvidence: "Remote — India", minYears: 3, maxYears: 5, salaryMin: 1100000, salaryMax: 1600000, currency: "INR", technologies: ["Selenium", "Python", "SQL"], qaCategoryHints: ["Automation Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 11 },
  { title: "QA Engineer", companyId: "cobalt-data", city: "Indore", state: "Madhya Pradesh", country: IN, remoteEvidence: "Hybrid — 2 days/week", minYears: 2, maxYears: 4, salaryMin: 750000, salaryMax: 1150000, currency: "INR", technologies: ["Playwright", "TypeScript", "SQL"], qaCategoryHints: ["Automation Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 38 },
  { title: "Manual Tester", companyId: "quanta-robotics", city: "Chennai", state: "Tamil Nadu", country: IN, remoteEvidence: "On-site", minYears: 0, maxYears: 1, salaryMin: 380000, salaryMax: 550000, currency: "INR", technologies: ["SQL"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Quanta Robotics Careers", postedHoursAgo: 150 },
  { title: "SDET", companyId: "pinnacle-fintech", city: "Mumbai", state: "Maharashtra", country: IN, remoteEvidence: "Hybrid — 3 days/week", minYears: 5, maxYears: 8, salaryMin: 2000000, salaryMax: 2800000, currency: "INR", technologies: ["Java", "REST Assured", "Docker", "Jenkins", "SQL"], qaCategoryHints: ["SDET", "API Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 3 },

  // ---- International remote — India-eligible (explicit) -------------------------------------------
  { title: "Senior QA Automation Engineer", companyId: "lumen-software", city: null, state: null, country: "United States", remoteEvidence: "Remote — Worldwide, including India", minYears: 4, maxYears: 7, salaryMin: 70000, salaryMax: 95000, currency: "USD", technologies: ["Playwright", "TypeScript", "API", "SQL"], qaCategoryHints: ["Automation Testing", "API Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 4, applicationDeadlineDaysFromNow: 30, benefits: ["Fully remote", "Health stipend", "Home office budget"] },
  { title: "SDET", companyId: "argon-technologies", city: null, state: null, country: "United Kingdom", remoteEvidence: "Remote — India timezone preferred", minYears: 3, maxYears: 6, salaryMin: 55000, salaryMax: 75000, currency: "USD", technologies: ["Python", "Postman", "REST Assured", "Docker"], qaCategoryHints: ["SDET", "API Testing"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 10 },
  { title: "QA Engineer", companyId: "vantage-robotics", city: null, state: null, country: "United States", remoteEvidence: "Remote — Worldwide (India applicants welcome)", minYears: 2, maxYears: 4, salaryMin: 45000, salaryMax: 65000, currency: "USD", technologies: ["Python", "Appium", "SQL"], qaCategoryHints: ["Automation Testing", "Mobile Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 16 },
  { title: "QA Automation Engineer", companyId: "fernbridge-systems", city: null, state: null, country: "Australia", remoteEvidence: "Remote — Asia (India, Singapore, Philippines eligible)", minYears: 3, maxYears: 6, salaryMin: 60000, salaryMax: 80000, currency: "USD", technologies: ["Cypress", "JavaScript", "SQL"], qaCategoryHints: ["Automation Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 28 },
  { title: "Performance Tester", companyId: "lumen-software", city: null, state: null, country: "United States", remoteEvidence: "Remote — Worldwide, including India", minYears: 4, maxYears: 7, salaryMin: 65000, salaryMax: 90000, currency: "USD", technologies: ["JMeter", "k6", "AWS"], qaCategoryHints: ["Performance Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 50 },
  { title: "Test Lead", companyId: "argon-technologies", city: null, state: null, country: "United Kingdom", remoteEvidence: "Remote — India timezone required", minYears: 7, maxYears: 11, salaryMin: 75000, salaryMax: 100000, currency: "USD", technologies: ["Java", "Selenium", "Jenkins", "SQL"], qaCategoryHints: ["Test Management", "QA Leadership"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 70 },
  { title: "Mobile Tester", companyId: "vantage-robotics", city: null, state: null, country: "United States", remoteEvidence: "Remote — Worldwide (India applicants welcome)", minYears: 2, maxYears: 5, salaryMin: 48000, salaryMax: 68000, currency: "USD", technologies: ["Appium", "Java"], qaCategoryHints: ["Mobile Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 95 },
  { title: "API Tester", companyId: "fernbridge-systems", city: null, state: null, country: "Australia", remoteEvidence: "Remote — Asia (India eligible)", minYears: 3, maxYears: 5, salaryMin: 55000, salaryMax: 72000, currency: "USD", technologies: ["Postman", "REST Assured", "Python"], qaCategoryHints: ["API Testing"], sourceType: "Workable", sourceName: "Workable", postedHoursAgo: 20 },
  { title: "QA Automation Engineer", companyId: "driftwood-labs", city: null, state: null, country: "Netherlands", remoteEvidence: "Remote — Worldwide, India included", minYears: 3, maxYears: 6, salaryMin: 58000, salaryMax: 78000, currency: "USD", technologies: ["Cypress", "TypeScript", "Docker"], qaCategoryHints: ["Automation Testing"], sourceType: "RSS", sourceName: "RemoteOK Feed", postedHoursAgo: 8 },
  { title: "SDET", companyId: "driftwood-labs", city: null, state: null, country: "Netherlands", remoteEvidence: "Remote — Worldwide, India included", minYears: 5, maxYears: 8, salaryMin: 68000, salaryMax: 90000, currency: "USD", technologies: ["Python", "Playwright", "AWS", "Docker"], qaCategoryHints: ["SDET", "Automation Testing"], sourceType: "RSS", sourceName: "RemoteOK Feed", postedHoursAgo: 130 },

  // ---- International remote — ambiguous / not India-eligible (contrast examples for the classifier) ---
  { title: "QA Engineer", companyId: "northlight-analytics", city: null, state: null, country: "Canada", remoteEvidence: "Remote — Asia region", minYears: 2, maxYears: 5, salaryMin: 50000, salaryMax: 68000, currency: "USD", technologies: ["Selenium", "Java", "SQL"], qaCategoryHints: ["Automation Testing"], sourceType: "Lever", sourceName: "Lever", postedHoursAgo: 45 },
  { title: "Automation Tester", companyId: "pixelworks-studio", city: null, state: null, country: "Germany", remoteEvidence: "Remote — EU only", minYears: 3, maxYears: 6, salaryMin: 52000, salaryMax: 70000, currency: "EUR", technologies: ["Cypress", "JavaScript"], qaCategoryHints: ["Automation Testing"], sourceType: "Ashby", sourceName: "Ashby", postedHoursAgo: 60 },
  { title: "Software Tester", companyId: "hearthstone-saas", city: null, state: null, country: "United States", remoteEvidence: "Remote — US only", minYears: 2, maxYears: 4, salaryMin: 55000, salaryMax: 72000, currency: "USD", technologies: ["Selenium", "SQL"], qaCategoryHints: ["Manual Testing", "Automation Testing"], sourceType: "Greenhouse", sourceName: "Greenhouse", postedHoursAgo: 40 },
  { title: "QA Analyst", companyId: "pixelworks-studio", city: null, state: null, country: "Germany", remoteEvidence: "On-site — Berlin office", minYears: 1, maxYears: 3, salaryMin: 42000, salaryMax: 56000, currency: "EUR", technologies: ["SQL"], qaCategoryHints: ["Manual Testing"], sourceType: "CompanyCareers", sourceName: "Pixelworks Studio Careers", postedHoursAgo: 300 },
];

// -----------------------------------------------------------------------------
// Lightweight content generation — produces varied, role-appropriate
// description/requirements/responsibilities text from each job's own
// parameters (title, level, categories, tech stack) rather than 50 hand-written
// essays. Deterministic given the same input.
// -----------------------------------------------------------------------------

const CATEGORY_FOCUS: Partial<Record<QACategory, string>> = {
  "Manual Testing": "manual and exploratory test cycles",
  "Automation Testing": "automated test suites integrated into CI/CD",
  SDET: "test infrastructure and tooling alongside feature development",
  "API Testing": "API contract, integration, and regression testing",
  "Performance Testing": "load, stress, and performance benchmarking",
  "Mobile Testing": "mobile app testing across Android and iOS",
  "Security Testing": "security and vulnerability testing",
  "Accessibility Testing": "accessibility audits against WCAG standards",
  "Test Management": "test planning, strategy, and cross-team coordination",
  "QA Leadership": "the quality roadmap and mentoring the QA team",
  "Quality Engineering": "quality practices embedded across the SDLC",
  "DevOps / QA": "test automation wired into CI/CD pipelines",
  "AI Testing": "testing AI/ML-driven features for correctness and reliability",
};

export function generateJobDescription(opts: { title: string; companyName: string; companyDescription: string; city: string | null; categories: QACategory[]; technologies: string[] }): string {
  const focus = opts.categories.map((c) => CATEGORY_FOCUS[c]).filter(Boolean)[0] ?? "test coverage across the product";
  const locClause = opts.city ? ` in ${opts.city}` : "";
  const techClause = opts.technologies.length > 0 ? ` using ${opts.technologies.slice(0, 4).join(", ")}` : "";
  return (
    `${opts.companyName} — ${opts.companyDescription} — is hiring a ${opts.title} to join our testing team${locClause}. ` +
    `You'll own ${focus}${techClause}, partnering closely with engineering and product to catch issues before they reach production. ` +
    `This role suits someone who enjoys taking ownership of quality end-to-end rather than just executing a fixed script.`
  );
}

const REQUIREMENT_POOL: { match: (categories: QACategory[], tech: string[]) => boolean; text: string }[] = [
  { match: (c) => c.includes("Automation Testing") || c.includes("SDET"), text: "Hands-on experience building and maintaining automated test suites" },
  { match: (c) => c.includes("Manual Testing"), text: "Strong grasp of manual test design: equivalence partitioning, boundary value analysis, exploratory testing" },
  { match: (c) => c.includes("API Testing"), text: "Experience testing REST APIs, including contract and integration testing" },
  { match: (c) => c.includes("Performance Testing"), text: "Experience with load/performance testing tools and interpreting results" },
  { match: (c) => c.includes("Mobile Testing"), text: "Experience testing native or hybrid mobile apps on Android and iOS" },
  { match: (c) => c.includes("Security Testing"), text: "Familiarity with common security testing practices (OWASP Top 10 or similar)" },
  { match: (_c, t) => t.includes("SQL"), text: "Comfortable writing SQL queries to verify data correctness" },
  { match: (_c, t) => t.some((x) => ["Java", "Python", "TypeScript", "JavaScript", "C#"].includes(x)), text: "Solid programming fundamentals in at least one of the listed languages" },
  { match: (_c, t) => t.includes("Docker") || t.includes("AWS") || t.includes("Azure") || t.includes("GCP"), text: "Working knowledge of cloud/container environments used to run test infrastructure" },
  { match: () => true, text: "Clear written and verbal communication for reporting defects and test results" },
];

export function generateRequirements(categories: QACategory[], technologies: string[]): string[] {
  const picked = REQUIREMENT_POOL.filter((r) => r.match(categories, technologies)).map((r) => r.text);
  return Array.from(new Set(picked)).slice(0, 6);
}

export function generateResponsibilities(categories: QACategory[]): string[] {
  const base = [
    "Design and execute test cases against product requirements",
    "Log, triage, and track defects through to resolution",
    "Collaborate with engineering and product during planning to shape testability",
  ];
  if (categories.includes("Automation Testing") || categories.includes("SDET")) {
    base.push("Build and maintain automated regression suites, keeping flake low and runtimes fast");
  }
  if (categories.includes("API Testing")) base.push("Write and maintain automated API test coverage for new and existing endpoints");
  if (categories.includes("Performance Testing")) base.push("Design and run load tests, then analyze results against agreed SLAs");
  if (categories.includes("QA Leadership") || categories.includes("Test Management")) base.push("Own the test strategy for your area and report quality metrics to stakeholders");
  return base;
}
