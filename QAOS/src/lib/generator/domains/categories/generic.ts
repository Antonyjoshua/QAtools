/** Shared generic record schema for domains that haven't been hand-authored yet.
 * Every category below is fully functional through the same engine as the
 * hand-authored domains — upgrading one to a bespoke field schema later is a
 * pure data change here (or a new file), never an architecture change. */
import type { DomainCategoryDef, DomainId, FieldSchema } from "../types";

const DEFAULT_STATUS = ["Active", "Pending", "Completed", "Cancelled"];

const GENERIC_FIELDS: FieldSchema[] = [
  { key: "id", label: "ID", type: "id", required: true },
  { key: "name", label: "Name / Title", type: "productName", required: true },
  { key: "ownerName", label: "Owner / Contact", type: "fullName", required: false },
  { key: "referenceDate", label: "Date", type: "date", required: false },
  { key: "status", label: "Status", type: "enum", required: false, enumValues: DEFAULT_STATUS },
  { key: "amount", label: "Amount / Value", type: "amount", required: false },
  { key: "notes", label: "Notes", type: "notes", required: false },
];

function fieldsWithStatus(statusValues?: string[]): FieldSchema[] {
  if (!statusValues) return GENERIC_FIELDS;
  return GENERIC_FIELDS.map((f) => (f.key === "status" ? { ...f, enumValues: statusValues } : f));
}

interface GenericCategorySpec {
  id: string;
  name: string;
  description: string;
  icon: string;
  status?: string[];
}

interface GenericDomainSpec {
  domainId: DomainId;
  categories: GenericCategorySpec[];
}

const GENERIC_DOMAINS: GenericDomainSpec[] = [
  {
    domainId: "retail",
    categories: [
      { id: "store-inventory", name: "Store Inventory", description: "In-store stock levels per item.", icon: "Boxes" },
      { id: "pos-transactions", name: "POS Transactions", description: "Point-of-sale transaction records.", icon: "Receipt", status: ["Completed", "Voided", "Refunded"] },
      { id: "pricing-data", name: "Pricing Data", description: "Item pricing and markdown records.", icon: "Tag" },
      { id: "loyalty-data", name: "Loyalty Data", description: "Customer loyalty points and membership tier.", icon: "Star" },
      { id: "store-data", name: "Store Data", description: "Store locations and operating status.", icon: "Store", status: ["Open", "Closed", "Under Renovation"] },
    ],
  },
  {
    domainId: "logistics-transportation",
    categories: [
      { id: "shipment-data", name: "Shipment Data", description: "Freight shipments with reference and status.", icon: "Truck", status: ["Scheduled", "In Transit", "Delivered", "Delayed"] },
      { id: "fleet-data", name: "Fleet Data", description: "Vehicle fleet records and availability.", icon: "Route" },
      { id: "driver-data", name: "Driver Data", description: "Driver assignments and status.", icon: "UserCheck" },
      { id: "route-data", name: "Route Data", description: "Delivery routes and coverage areas.", icon: "MapPin" },
      { id: "delivery-tracking-data", name: "Delivery Tracking Data", description: "Real-time delivery tracking events.", icon: "PackageCheck", status: ["Picked Up", "In Transit", "Delivered", "Failed"] },
    ],
  },
  {
    domainId: "real-estate",
    categories: [
      { id: "property-listings", name: "Property Listings", description: "For-sale and for-rent property listings.", icon: "Home", status: ["Listed", "Under Offer", "Sold", "Rented"] },
      { id: "tenant-data", name: "Tenant Data", description: "Tenant profiles and lease association.", icon: "User" },
      { id: "lease-data", name: "Lease Data", description: "Lease agreements with terms and dates.", icon: "FileSignature" },
      { id: "agent-data", name: "Agent Data", description: "Real-estate agent directory.", icon: "UserCheck" },
      { id: "property-inspection-data", name: "Property Inspection Data", description: "Inspection reports and outcomes.", icon: "ClipboardCheck", status: ["Passed", "Failed", "Pending"] },
    ],
  },
  {
    domainId: "human-resources",
    categories: [
      { id: "employee-data", name: "Employee Data", description: "Employee profiles with role and department.", icon: "Briefcase", status: ["Active", "On Leave", "Terminated", "Probation"] },
      { id: "leave-data", name: "Leave Data", description: "Leave requests and approval status.", icon: "CalendarDays", status: ["Requested", "Approved", "Rejected", "Cancelled"] },
      { id: "performance-data", name: "Performance Data", description: "Performance review records.", icon: "Target" },
      { id: "onboarding-data", name: "Onboarding Data", description: "New-hire onboarding checklist status.", icon: "ClipboardList", status: ["Not Started", "In Progress", "Completed"] },
      { id: "department-data", name: "Department Data", description: "Department directory and headcount.", icon: "Building2" },
    ],
  },
  {
    domainId: "payroll",
    categories: [
      { id: "salary-structure-data", name: "Salary Structure Data", description: "Compensation structure per employee.", icon: "Wallet" },
      { id: "payslip-data", name: "Payslip Data", description: "Monthly payslip records.", icon: "Receipt", status: ["Generated", "Paid", "On Hold"] },
      { id: "deduction-data", name: "Deduction Data", description: "Statutory and voluntary payroll deductions.", icon: "Percent" },
      { id: "tax-record-data", name: "Tax Record Data", description: "Employee tax withholding records.", icon: "FileSignature" },
      { id: "bonus-data", name: "Bonus Data", description: "Performance and festival bonus payouts.", icon: "Gift" },
    ],
  },
  {
    domainId: "manufacturing",
    categories: [
      { id: "work-order-data", name: "Work Order Data", description: "Production work orders and status.", icon: "ClipboardList", status: ["Open", "In Progress", "Completed", "On Hold"] },
      { id: "production-line-data", name: "Production Line Data", description: "Production line throughput records.", icon: "Factory" },
      { id: "material-data", name: "Material Data", description: "Raw material stock and usage.", icon: "Boxes" },
      { id: "quality-inspection-data", name: "Quality Inspection Data", description: "QC inspection outcomes.", icon: "ClipboardCheck", status: ["Passed", "Failed", "Rework"] },
      { id: "equipment-data", name: "Equipment Data", description: "Machinery and equipment status.", icon: "Warehouse", status: ["Operational", "Under Maintenance", "Decommissioned"] },
    ],
  },
  {
    domainId: "government",
    categories: [
      { id: "citizen-records", name: "Citizen Records", description: "Citizen identity and registration records.", icon: "User" },
      { id: "permit-data", name: "Permit Data", description: "Issued permits with validity and status.", icon: "FileCheck2", status: ["Issued", "Expired", "Revoked", "Pending"] },
      { id: "license-data", name: "License Data", description: "Professional and business license records.", icon: "FileSignature" },
      { id: "application-data", name: "Application Data", description: "Public-service applications and status.", icon: "ClipboardList", status: ["Submitted", "Under Review", "Approved", "Rejected"] },
      { id: "public-service-request-data", name: "Public Service Request Data", description: "Citizen service requests and resolution.", icon: "MessageSquare", status: ["Open", "In Progress", "Resolved", "Closed"] },
    ],
  },
  {
    domainId: "social-media",
    categories: [
      { id: "profile-data", name: "Profile Data", description: "User profiles with bio and handle.", icon: "User" },
      { id: "post-data", name: "Post Data", description: "Posted content with visibility status.", icon: "FileText", status: ["Published", "Draft", "Archived", "Removed"] },
      { id: "comment-data", name: "Comment Data", description: "Comments on posts.", icon: "MessageSquare" },
      { id: "follower-data", name: "Follower Data", description: "Follower/following relationships.", icon: "Users" },
      { id: "engagement-data", name: "Engagement Data", description: "Likes, shares, and engagement metrics.", icon: "ThumbsUp" },
    ],
  },
  {
    domainId: "food-delivery",
    categories: [
      { id: "restaurant-data", name: "Restaurant Data", description: "Partner restaurant directory.", icon: "ChefHat", status: ["Open", "Closed", "Temporarily Unavailable"] },
      { id: "menu-item-data", name: "Menu Item Data", description: "Menu items with price and category.", icon: "Utensils" },
      { id: "delivery-order-data", name: "Delivery Order Data", description: "Customer food orders and status.", icon: "ShoppingBag", status: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"] },
      { id: "rider-data", name: "Rider Data", description: "Delivery rider assignments and availability.", icon: "Bike" },
      { id: "delivery-tracking-data", name: "Delivery Tracking Data", description: "Live delivery tracking events.", icon: "PackageCheck" },
    ],
  },
  {
    domainId: "hotel-management",
    categories: [
      { id: "room-data", name: "Room Data", description: "Room inventory with type and status.", icon: "BedDouble", status: ["Available", "Occupied", "Under Cleaning", "Out of Service"] },
      { id: "reservation-data", name: "Reservation Data", description: "Guest reservations and status.", icon: "CalendarCheck", status: ["Confirmed", "Pending", "Cancelled", "Checked-out"] },
      { id: "guest-data", name: "Guest Data", description: "Guest profiles and contact details.", icon: "User" },
      { id: "checkin-checkout-data", name: "Check-in / Check-out Data", description: "Check-in and check-out event log.", icon: "ClipboardCheck" },
      { id: "housekeeping-data", name: "Housekeeping Data", description: "Room cleaning task assignments.", icon: "Building", status: ["Pending", "In Progress", "Completed"] },
    ],
  },
  {
    domainId: "hospital-management",
    categories: [
      { id: "ward-data", name: "Ward Data", description: "Hospital ward capacity and occupancy.", icon: "Building" },
      { id: "admission-data", name: "Admission Data", description: "Patient admission and discharge records.", icon: "ClipboardList", status: ["Admitted", "Discharged", "Transferred"] },
      { id: "staff-shift-data", name: "Staff Shift Data", description: "Staff shift schedules.", icon: "Timer" },
      { id: "medical-record-data", name: "Medical Record Data", description: "Patient medical record entries.", icon: "FileText" },
      { id: "doctor-assignment-data", name: "Doctor Assignment Data", description: "Doctor-to-patient/ward assignments.", icon: "Stethoscope" },
    ],
  },
  {
    domainId: "inventory-management",
    categories: [
      { id: "stock-item-data", name: "Stock Item Data", description: "Inventory items with quantity on hand.", icon: "Boxes" },
      { id: "warehouse-data", name: "Warehouse Data", description: "Warehouse locations and capacity.", icon: "Warehouse" },
      { id: "purchase-order-data", name: "Purchase Order Data", description: "Purchase orders with status.", icon: "FileCheck2", status: ["Draft", "Submitted", "Approved", "Received"] },
      { id: "stock-movement-data", name: "Stock Movement Data", description: "Stock-in/stock-out movement log.", icon: "ArrowLeftRight" },
      { id: "supplier-data", name: "Supplier Data", description: "Supplier directory and status.", icon: "Handshake" },
    ],
  },
  {
    domainId: "crm",
    categories: [
      { id: "lead-data", name: "Lead Data", description: "Sales leads with source and status.", icon: "UserCheck", status: ["New", "Contacted", "Qualified", "Lost"] },
      { id: "contact-data", name: "Contact Data", description: "Customer/prospect contact records.", icon: "Contact2" },
      { id: "opportunity-data", name: "Opportunity Data", description: "Sales pipeline opportunities.", icon: "Target", status: ["Open", "Won", "Lost", "On Hold"] },
      { id: "sales-activity-data", name: "Sales Activity Data", description: "Calls, meetings, and follow-up activity.", icon: "ClipboardList" },
      { id: "account-data", name: "Account Data", description: "Customer account records.", icon: "Building2" },
    ],
  },
  {
    domainId: "erp",
    categories: [
      { id: "vendor-data", name: "Vendor Data", description: "Vendor master records.", icon: "Handshake" },
      { id: "purchase-order-data", name: "Purchase Order Data", description: "Cross-department purchase orders.", icon: "FileCheck2", status: ["Draft", "Submitted", "Approved", "Closed"] },
      { id: "gl-entry-data", name: "GL Entry Data", description: "General-ledger journal entries.", icon: "ScrollText" },
      { id: "department-budget-data", name: "Department Budget Data", description: "Departmental budget allocations.", icon: "PiggyBank" },
      { id: "asset-data", name: "Asset Data", description: "Fixed-asset register.", icon: "Package" },
    ],
  },
  {
    domainId: "project-management",
    categories: [
      { id: "project-data", name: "Project Data", description: "Project records with owner and status.", icon: "ListChecks", status: ["Planning", "In Progress", "On Hold", "Completed"] },
      { id: "task-data", name: "Task Data", description: "Individual tasks and assignees.", icon: "CheckSquare", status: ["To Do", "In Progress", "In Review", "Done"] },
      { id: "sprint-data", name: "Sprint Data", description: "Sprint records with start/end dates.", icon: "Timer" },
      { id: "milestone-data", name: "Milestone Data", description: "Project milestones and target dates.", icon: "Target" },
      { id: "time-tracking-data", name: "Time Tracking Data", description: "Logged time entries per task.", icon: "Clock" },
    ],
  },
  {
    domainId: "auth-security",
    categories: [
      { id: "user-credential-data", name: "User Credential Data", description: "Synthetic usernames and credential metadata.", icon: "Key" },
      { id: "session-data", name: "Session Data", description: "Active/expired session records.", icon: "Server", status: ["Active", "Expired", "Revoked"] },
      { id: "token-data", name: "Token Data", description: "API/auth token records.", icon: "KeyRound" },
      { id: "role-data", name: "Role Data", description: "Role and permission assignments.", icon: "ShieldCheck" },
      { id: "audit-log-data", name: "Audit Log Data", description: "Security audit log entries.", icon: "ScrollText" },
    ],
  },
  {
    domainId: "payment-billing",
    categories: [
      { id: "invoice-data", name: "Invoice Data", description: "Customer invoices with amount and status.", icon: "Receipt", status: ["Draft", "Sent", "Paid", "Overdue"] },
      { id: "billing-cycle-data", name: "Billing Cycle Data", description: "Recurring billing cycle records.", icon: "CalendarDays" },
      { id: "payment-method-data", name: "Payment Method Data", description: "Stored payment method records.", icon: "CreditCard" },
      { id: "gateway-transaction-data", name: "Gateway Transaction Data", description: "Payment gateway transaction log.", icon: "ArrowLeftRight", status: ["SUCCESS", "PENDING", "FAILED", "REVERSED"] },
      { id: "refund-data", name: "Refund Data", description: "Refund requests and status.", icon: "Undo2", status: ["Requested", "Approved", "Processed", "Rejected"] },
    ],
  },
  {
    domainId: "subscription",
    categories: [
      { id: "plan-data", name: "Plan Data", description: "Subscription plan tiers and pricing.", icon: "Tag" },
      { id: "subscriber-data", name: "Subscriber Data", description: "Subscriber profiles and plan association.", icon: "User" },
      { id: "renewal-data", name: "Renewal Data", description: "Upcoming and past renewal events.", icon: "RefreshCw", status: ["Upcoming", "Renewed", "Failed"] },
      { id: "upgrade-data", name: "Upgrade Data", description: "Plan upgrade/downgrade events.", icon: "Repeat" },
      { id: "cancellation-data", name: "Cancellation Data", description: "Subscription cancellation records.", icon: "PackageX", status: ["Requested", "Confirmed", "Reversed"] },
    ],
  },
  {
    domainId: "booking-reservation",
    categories: [
      { id: "reservation-data", name: "Reservation Data", description: "General-purpose reservation records.", icon: "CalendarCheck", status: ["Confirmed", "Pending", "Cancelled", "Completed"] },
      { id: "time-slot-data", name: "Time Slot Data", description: "Bookable time slots and availability.", icon: "Clock" },
      { id: "resource-data", name: "Resource Data", description: "Bookable resources (rooms, equipment, staff).", icon: "Package" },
      { id: "cancellation-data", name: "Cancellation Data", description: "Reservation cancellation records.", icon: "PackageX" },
      { id: "no-show-data", name: "No-show Data", description: "Missed-reservation tracking.", icon: "Ticket" },
    ],
  },
];

export const GENERIC_CATEGORIES: DomainCategoryDef[] = GENERIC_DOMAINS.flatMap((domain) =>
  domain.categories.map((c) => ({
    id: c.id,
    domainId: domain.domainId,
    name: c.name,
    description: c.description,
    icon: c.icon,
    fields: fieldsWithStatus(c.status),
  }))
);
