import type { DomainDef, DomainId } from "./types";

const ACCENTS = [
  "oklch(0.585 0.19 269)",
  "oklch(0.65 0.2 25)",
  "oklch(0.65 0.16 152)",
  "oklch(0.75 0.16 75)",
  "oklch(0.6 0.14 320)",
];

function accentFor(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}

export const DOMAINS: DomainDef[] = [
  { id: "banking-finance", name: "Banking & Finance", description: "Accounts, cards, loans, transactions, KYC, and payment data.", icon: "Banknote", accent: accentFor(0) },
  { id: "healthcare", name: "Healthcare", description: "Patients, appointments, prescriptions, diagnoses, and insurance claims.", icon: "HeartPulse", accent: accentFor(1) },
  { id: "ecommerce", name: "E-commerce", description: "Products, carts, orders, coupons, reviews, shipments, and returns.", icon: "ShoppingCart", accent: accentFor(2) },
  { id: "travel-hospitality", name: "Travel & Hospitality", description: "Flights, bookings, itineraries, passengers, and travel insurance.", icon: "Plane", accent: accentFor(3) },
  { id: "education", name: "Education", description: "Students, courses, enrollments, grades, and fee records.", icon: "GraduationCap", accent: accentFor(4) },
  { id: "insurance", name: "Insurance", description: "Policies, premiums, claims, beneficiaries, and underwriting data.", icon: "Umbrella", accent: accentFor(0) },
  { id: "telecom", name: "Telecom", description: "SIM/MSISDN records, call detail records, plans, and billing usage.", icon: "Wifi", accent: accentFor(1) },
  { id: "retail", name: "Retail", description: "Store inventory, POS transactions, pricing, and loyalty data.", icon: "Store", accent: accentFor(2) },
  { id: "logistics-transportation", name: "Logistics & Transportation", description: "Shipments, fleet, drivers, routes, and delivery tracking.", icon: "Truck", accent: accentFor(3) },
  { id: "real-estate", name: "Real Estate", description: "Listings, properties, tenants, leases, and agent records.", icon: "Home", accent: accentFor(4) },
  { id: "human-resources", name: "Human Resources", description: "Employees, departments, leave, performance, and onboarding data.", icon: "Briefcase", accent: accentFor(0) },
  { id: "payroll", name: "Payroll", description: "Salary structures, payslips, deductions, and tax records.", icon: "Wallet", accent: accentFor(1) },
  { id: "manufacturing", name: "Manufacturing", description: "Work orders, production lines, materials, and quality inspections.", icon: "Factory", accent: accentFor(2) },
  { id: "government", name: "Government", description: "Citizen records, permits, licenses, and public-service applications.", icon: "Landmark", accent: accentFor(3) },
  { id: "social-media", name: "Social Media", description: "Profiles, posts, comments, followers, and engagement data.", icon: "Share2", accent: accentFor(4) },
  { id: "food-delivery", name: "Food Delivery", description: "Restaurants, menu items, delivery orders, and rider assignments.", icon: "UtensilsCrossed", accent: accentFor(0) },
  { id: "hotel-management", name: "Hotel Management", description: "Rooms, reservations, guests, check-ins, and housekeeping records.", icon: "BedDouble", accent: accentFor(1) },
  { id: "hospital-management", name: "Hospital Management", description: "Wards, admissions, doctors, staff shifts, and medical records.", icon: "Stethoscope", accent: accentFor(2) },
  { id: "inventory-management", name: "Inventory Management", description: "Stock items, warehouses, purchase orders, and stock movements.", icon: "Boxes", accent: accentFor(3) },
  { id: "crm", name: "CRM", description: "Leads, contacts, opportunities, and sales-pipeline activity.", icon: "UserCheck", accent: accentFor(4) },
  { id: "erp", name: "ERP", description: "Vendors, purchase orders, GL entries, and cross-department records.", icon: "Layers", accent: accentFor(0) },
  { id: "project-management", name: "Project Management", description: "Projects, tasks, sprints, milestones, and time-tracking entries.", icon: "ListChecks", accent: accentFor(1) },
  { id: "auth-security", name: "Authentication & Security", description: "User credentials, sessions, tokens, roles, and audit logs.", icon: "ShieldCheck", accent: accentFor(2) },
  { id: "payment-billing", name: "Payment & Billing", description: "Invoices, billing cycles, payment methods, and gateway transactions.", icon: "CreditCard", accent: accentFor(3) },
  { id: "subscription", name: "Subscription", description: "Plans, subscribers, renewals, upgrades, and cancellation records.", icon: "RefreshCw", accent: accentFor(4) },
  { id: "booking-reservation", name: "Booking & Reservation", description: "Reservations, time slots, resources, and cancellation/no-show data.", icon: "CalendarCheck", accent: accentFor(0) },
];

const byId = new Map<DomainId, DomainDef>(DOMAINS.map((d) => [d.id, d]));

export function getDomain(id: string): DomainDef | undefined {
  return byId.get(id as DomainId);
}

export function searchDomains(query: string): DomainDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return DOMAINS;
  return DOMAINS.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
}
