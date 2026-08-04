import type { GeneratorModule } from "../types";
import { getLocaleFaker, formatPhone } from "../locale";
import { generatePassword } from "../password";
import {
  COUNTRIES,
  CITIES_BY_COUNTRY,
  INDIAN_STATES,
  INDIAN_FIRST_NAMES_M,
  INDIAN_FIRST_NAMES_F,
  INDIAN_LAST_NAMES,
  COMPANY_ROOTS,
  COMPANY_SUFFIXES,
  JOB_TITLES,
} from "../data";
import { pick, digits, randInt, randomDate, formatDate } from "../random";

const countryOptions = COUNTRIES.map((c) => ({ label: `${c.name} (${c.code})`, value: c.code }));

function companyName(): string {
  return `${pick(COMPANY_ROOTS)} ${pick(COMPANY_SUFFIXES)}`;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export interface Person {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  mobileNumber: string;
  email: string;
  username: string;
  password: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  companyName: string;
  jobTitle: string;
  website: string;
  biography: string;
}

export function buildPerson(countryCode: string): Person {
  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
  const lf = getLocaleFaker(countryCode);
  const gender = pick(["Male", "Female"]);

  let firstName: string;
  let lastName: string;
  if (countryCode === "IN") {
    firstName = gender === "Male" ? pick(INDIAN_FIRST_NAMES_M) : pick(INDIAN_FIRST_NAMES_F);
    lastName = pick(INDIAN_LAST_NAMES);
  } else {
    firstName = lf.person.firstName(gender === "Male" ? "male" : "female");
    lastName = lf.person.lastName();
  }
  const fullName = `${firstName} ${lastName}`;

  const dob = randomDate(1965, 2006);
  const age = new Date().getFullYear() - dob.getFullYear();

  const emailDomain = pick(["gmail.com", "yahoo.com", "outlook.com", "proton.me", "hotmail.com"]);
  const email = `${firstName}.${lastName}${randInt(1, 999)}@${emailDomain}`.toLowerCase();
  const username = `${firstName}${lastName}${randInt(1, 999)}`.toLowerCase();
  const password = generatePassword({ length: 14 });

  const city = pick(CITIES_BY_COUNTRY[countryCode] ?? CITIES_BY_COUNTRY.US);
  const state = countryCode === "IN" ? pick(INDIAN_STATES).state : lf.location.state();
  const pinCode = countryCode === "IN" ? digits(6) : lf.location.zipCode();
  const mobileNumber = formatPhone(countryCode);
  const company = companyName();
  const jobTitle = pick(JOB_TITLES);
  const website = `https://www.${slugify(company)}.com`;
  const biography = lf.lorem.sentences(2);
  const address = lf.location.streetAddress();

  return {
    firstName,
    lastName,
    fullName,
    gender,
    dateOfBirth: formatDate(dob),
    age,
    mobileNumber,
    email,
    username,
    password,
    address,
    city,
    state,
    country: country.name,
    pinCode,
    companyName: company,
    jobTitle,
    website,
    biography,
  };
}

const countrySelect = {
  key: "country",
  label: "Country",
  type: "select" as const,
  options: countryOptions,
  default: "IN",
};

export const personalGenerators: GeneratorModule[] = [
  {
    slug: "personal-profile",
    name: "Personal Profile (Full Record)",
    category: "personal",
    description: "Complete synthetic identity: name, contact, address, employer, and bio in one record.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 10,
    options: [countrySelect],
    columns: ["fullName", "gender", "dateOfBirth", "age", "email", "mobileNumber", "username", "jobTitle", "companyName", "city", "state", "country", "pinCode"],
    generate: (ctx) => buildPerson(String(ctx.options.country ?? "IN")) as unknown as Record<string, unknown>,
  },
  {
    slug: "full-name",
    name: "Full Name Generator",
    category: "personal",
    description: "First name, last name, full name, and gender.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    options: [countrySelect],
    columns: ["firstName", "lastName", "fullName", "gender"],
    generate: (ctx) => {
      const p = buildPerson(String(ctx.options.country ?? "IN"));
      return { firstName: p.firstName, lastName: p.lastName, fullName: p.fullName, gender: p.gender };
    },
  },
  {
    slug: "email-address",
    name: "Email Address Generator",
    category: "personal",
    description: "Realistic email addresses, optionally on a custom domain.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    options: [
      countrySelect,
      { key: "domain", label: "Custom domain (optional)", type: "text", placeholder: "e.g. testcorp.com" },
    ],
    columns: ["fullName", "email"],
    generate: (ctx) => {
      const p = buildPerson(String(ctx.options.country ?? "IN"));
      const domain = String(ctx.options.domain ?? "").trim();
      const email = domain ? `${p.username}@${domain}` : p.email;
      return { fullName: p.fullName, email };
    },
  },
  {
    slug: "username",
    name: "Username Generator",
    category: "personal",
    description: "Unique usernames derived from realistic names.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["username"],
    generate: () => ({ username: buildPerson("US").username }),
  },
  {
    slug: "password",
    name: "Password Generator",
    category: "personal",
    description: "Configurable random passwords for signup / reset-flow test data.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    options: [
      { key: "length", label: "Length", type: "number", default: 14, min: 4, max: 128 },
      { key: "uppercase", label: "Include uppercase", type: "boolean", default: true },
      { key: "lowercase", label: "Include lowercase", type: "boolean", default: true },
      { key: "numbers", label: "Include numbers", type: "boolean", default: true },
      { key: "symbols", label: "Include symbols", type: "boolean", default: true },
    ],
    columns: ["password"],
    generate: (ctx) => ({
      password: generatePassword({
        length: Number(ctx.options.length ?? 14),
        uppercase: Boolean(ctx.options.uppercase ?? true),
        lowercase: Boolean(ctx.options.lowercase ?? true),
        numbers: Boolean(ctx.options.numbers ?? true),
        symbols: Boolean(ctx.options.symbols ?? true),
      }),
    }),
  },
  {
    slug: "mobile-number",
    name: "Mobile Number Generator",
    category: "personal",
    description: "Country-formatted mobile numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    options: [countrySelect],
    columns: ["mobileNumber", "country"],
    generate: (ctx) => {
      const code = String(ctx.options.country ?? "IN");
      const country = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
      return { mobileNumber: formatPhone(code), country: country.name };
    },
  },
  {
    slug: "address",
    name: "Address Generator",
    category: "personal",
    description: "Street address, city, state, country, and PIN/ZIP code.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    options: [countrySelect],
    columns: ["address", "city", "state", "country", "pinCode"],
    generate: (ctx) => {
      const p = buildPerson(String(ctx.options.country ?? "IN"));
      return { address: p.address, city: p.city, state: p.state, country: p.country, pinCode: p.pinCode };
    },
  },
  {
    slug: "company-profile",
    name: "Company & Job Generator",
    category: "personal",
    description: "Company name, job title, and website.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["companyName", "jobTitle", "website"],
    generate: () => {
      const p = buildPerson("US");
      return { companyName: p.companyName, jobTitle: p.jobTitle, website: p.website };
    },
  },
  {
    slug: "biography",
    name: "Biography Generator",
    category: "personal",
    description: "Short bio / about-me text for profile fields.",
    outputKind: "text",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => getLocaleFaker("US").lorem.sentences(randInt(2, 4)),
  },
];
