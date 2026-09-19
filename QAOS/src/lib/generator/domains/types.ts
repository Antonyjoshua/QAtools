/** Types for the Domain-wise Test Data Generator — a separate, schema-driven module
 * that sits alongside (and does not modify) the existing generator registry. */

export type DomainId =
  | "banking-finance"
  | "healthcare"
  | "ecommerce"
  | "travel-hospitality"
  | "education"
  | "insurance"
  | "telecom"
  | "retail"
  | "logistics-transportation"
  | "real-estate"
  | "human-resources"
  | "payroll"
  | "manufacturing"
  | "government"
  | "social-media"
  | "food-delivery"
  | "hotel-management"
  | "hospital-management"
  | "inventory-management"
  | "crm"
  | "erp"
  | "project-management"
  | "auth-security"
  | "payment-billing"
  | "subscription"
  | "booking-reservation";

export interface DomainDef {
  id: DomainId;
  name: string;
  description: string;
  icon: string;
  accent: string;
}

export type FieldType =
  | "id"
  | "uuid"
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "dateOfBirth"
  | "age"
  | "gender"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postalCode"
  | "company"
  | "jobTitle"
  | "date"
  | "dateTime"
  | "boolean"
  | "url"
  | "text"
  | "sentence"
  | "currencyCode"
  | "amount"
  | "percentage"
  | "rating"
  | "notes"
  | "accountNumber"
  | "ifsc"
  | "bankName"
  | "branchName"
  | "accountType"
  | "cardNumber"
  | "cardType"
  | "cvv"
  | "cardExpiry"
  | "loanType"
  | "loanAmount"
  | "emiAmount"
  | "interestRate"
  | "tenureMonths"
  | "beneficiaryName"
  | "upiId"
  | "transactionId"
  | "transactionType"
  | "paymentStatus"
  | "panNumber"
  | "kycStatus"
  | "taxAmount"
  | "productName"
  | "sku"
  | "productCategory"
  | "price"
  | "quantity"
  | "orderId"
  | "orderStatus"
  | "cartId"
  | "couponCode"
  | "discountPercent"
  | "reviewRating"
  | "reviewText"
  | "trackingId"
  | "shipmentStatus"
  | "returnReason"
  | "invoiceNumber"
  | "paymentMethod"
  | "enum";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  /** Only used when type === "enum". */
  enumValues?: string[];
}

export interface DomainCategoryDef {
  id: string;
  domainId: DomainId;
  name: string;
  description: string;
  icon: string;
  fields: FieldSchema[];
}

export type ScenarioMode = "valid" | "invalid" | "boundary" | "mixed";

export interface DomainGenConfig {
  count: number;
  /** Required fields are always included; this additionally lists selected optional fields. */
  selectedFieldKeys: string[];
  scenario: ScenarioMode;
  includeDuplicates: boolean;
  includeNulls: boolean;
  includeSpecialChars: boolean;
  /** Country code — reuses the same codes as src/lib/generator/locale.ts and data.ts COUNTRIES. */
  locale: string;
}

/** Structural subset of modules/personal.ts's `Person` — kept identity fields consistent within a row. */
export interface PersonContext {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  companyName: string;
  jobTitle: string;
}

export interface FieldGenContext {
  locale: string;
  index: number;
  field: FieldSchema;
  /** Shared per-row identity, so e.g. fullName/email/city stay consistent within one generated record. */
  person: PersonContext;
}

export interface FieldGenerator {
  valid: (ctx: FieldGenContext) => unknown;
  /** Malformed/negative-test value + a short reason, when applicable to this field type. */
  invalid?: (ctx: FieldGenContext) => [unknown, string];
  /** Classic boundary-value-analysis cases, when applicable to this field type. */
  boundary?: (ctx: FieldGenContext) => { label: string; value: unknown; expected: string }[];
}
