import type { GeneratorModule } from "../types";
import { buildPerson } from "./personal";
import { pick, randInt, randFloat, uuidv4, formatDate, randomDate } from "../random";
import { JOB_TITLES, DEPARTMENTS, UNIVERSITIES, DEGREES, SKILLS_POOL, COMPANY_ROOTS, COMPANY_SUFFIXES } from "../data";

function pickSkills(n: number): string[] {
  const pool = [...SKILLS_POOL];
  const out: string[] = [];
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(randInt(0, pool.length - 1), 1)[0]);
  return out;
}

export const fakerProfileGenerators: GeneratorModule[] = [
  {
    slug: "fake-resume",
    name: "Fake Resume",
    category: "faker",
    description: "Full resume: contact info, work history, education, and skills.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      const years = randInt(1, 15);
      return {
        fullName: p.fullName,
        email: p.email,
        phone: p.mobileNumber,
        location: `${p.city}, ${p.country}`,
        headline: pick(JOB_TITLES),
        summary: p.biography,
        yearsExperience: years,
        workHistory: Array.from({ length: randInt(1, 4) }, (_, i) => ({
          company: `${pick(COMPANY_ROOTS)} ${pick(COMPANY_SUFFIXES)}`,
          title: pick(JOB_TITLES),
          startDate: formatDate(randomDate(2010 + i, 2020 + i)),
          endDate: i === 0 ? "Present" : formatDate(randomDate(2020 + i, 2025 + i)),
        })),
        education: [{ institution: pick(UNIVERSITIES), degree: pick(DEGREES), graduationYear: randInt(2005, 2024) }],
        skills: pickSkills(randInt(5, 10)),
      };
    },
  },
  {
    slug: "fake-employee",
    name: "Fake Employee",
    category: "faker",
    description: "Employee HR profile with compensation and reporting line.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      const manager = buildPerson("US");
      return {
        employeeId: `EMP-${randInt(10000, 99999)}`,
        fullName: p.fullName,
        email: p.email,
        department: pick(DEPARTMENTS),
        jobTitle: pick(JOB_TITLES),
        reportsTo: manager.fullName,
        employmentType: pick(["Full-time", "Part-time", "Contract", "Intern"]),
        salaryAnnual: randInt(45000, 220000),
        joinDate: p.dateOfBirth,
        performanceRating: randFloat(2.5, 5, 1),
      };
    },
  },
  {
    slug: "fake-customer",
    name: "Fake Customer",
    category: "faker",
    description: "CRM customer profile with purchase history and support tier.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        customerId: uuidv4(),
        fullName: p.fullName,
        email: p.email,
        phone: p.mobileNumber,
        tier: pick(["Free", "Bronze", "Silver", "Gold", "Platinum"]),
        totalOrders: randInt(0, 120),
        lifetimeSpend: randFloat(0, 45000, 2),
        lastPurchaseDate: p.dateOfBirth,
        supportTickets: randInt(0, 15),
      };
    },
  },
  {
    slug: "fake-student",
    name: "Fake Student",
    category: "faker",
    description: "Student academic profile with enrollment and grades.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        studentId: `STU-${randInt(100000, 999999)}`,
        fullName: p.fullName,
        email: p.email,
        university: pick(UNIVERSITIES),
        degree: pick(DEGREES),
        yearOfStudy: randInt(1, 4),
        gpa: randFloat(2.0, 4.0, 2),
        courses: Array.from({ length: randInt(3, 6) }, () => ({
          code: `${pick(["CS", "MATH", "ENG", "PHY", "STAT"])}${randInt(100, 499)}`,
          grade: pick(["A", "A-", "B+", "B", "B-", "C+", "C"]),
        })),
      };
    },
  },
  {
    slug: "fake-company",
    name: "Fake Company",
    category: "faker",
    description: "Company profile with industry, size, and leadership.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const ceo = buildPerson("US");
      const name = `${pick(COMPANY_ROOTS)} ${pick(COMPANY_SUFFIXES)}`;
      return {
        companyName: name,
        industry: pick(["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Logistics"]),
        founded: randInt(1985, 2023),
        employeeCount: randInt(5, 50000),
        headquarters: ceo.city,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
        ceo: ceo.fullName,
        annualRevenueUSD: randInt(100000, 500000000),
      };
    },
  },
  {
    slug: "fake-teacher",
    name: "Fake Teacher",
    category: "faker",
    description: "Teacher/faculty profile with subject and qualifications.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        teacherId: `TCH-${randInt(10000, 99999)}`,
        fullName: p.fullName,
        email: p.email,
        subject: pick(["Mathematics", "Physics", "Chemistry", "English Literature", "Computer Science", "History", "Biology"]),
        qualification: pick(["B.Ed", "M.Ed", "M.Sc", "Ph.D"]),
        yearsOfExperience: randInt(1, 30),
        school: pick(UNIVERSITIES),
        rating: randFloat(3.0, 5.0, 1),
      };
    },
  },
  {
    slug: "fake-doctor",
    name: "Fake Doctor",
    category: "faker",
    description: "Doctor profile with specialization and license (synthetic).",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    note: "Synthetic license number — not a real medical registration.",
    generate: () => {
      const p = buildPerson("US");
      return {
        doctorId: `DOC-${randInt(10000, 99999)}`,
        fullName: `Dr. ${p.fullName}`,
        email: p.email,
        specialization: pick(["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "General Medicine", "Radiology"]),
        licenseNumber: `MED-${randInt(100000, 999999)}`,
        yearsOfExperience: randInt(1, 35),
        hospital: `${p.city} General Hospital`,
        consultationFee: randFloat(20, 300, 2),
      };
    },
  },
];
