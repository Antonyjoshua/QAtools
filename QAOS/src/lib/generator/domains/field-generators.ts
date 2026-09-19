/** One generator per FieldType, reused by every domain/category's field schema.
 * Built entirely on the existing generator helpers — no duplicate randomization logic. */
import { pick, randInt, randFloat, digits, digitsNoLeadingZero, alphaNum, letters, uuidv4, randomDate, formatDate, pad } from "../random";
import { getLocaleFaker } from "../locale";
import { INDIAN_BANKS, CURRENCIES, PRODUCT_CATEGORIES, UNICODE_SAMPLES, EMOJI_SAMPLES, SPECIAL_CHAR_SAMPLES } from "../data";
import type { FieldGenerator, FieldGenContext, FieldType } from "./types";

function boundaryFor(min: number, max: number): (ctx: FieldGenContext) => { label: string; value: unknown; expected: string }[] {
  return () => [
    { label: "min - 1", value: min - 1, expected: "Invalid" },
    { label: "min", value: min, expected: "Valid" },
    { label: "min + 1", value: min + 1, expected: "Valid" },
    { label: "max - 1", value: max - 1, expected: "Valid" },
    { label: "max", value: max, expected: "Valid" },
    { label: "max + 1", value: max + 1, expected: "Invalid" },
  ];
}

const INVALID_EMAILS: [string, string][] = [
  ["plainaddress", "Missing @ symbol"],
  ["missing@domain", "Missing TLD"],
  ["two@@at.com", "Double @ symbol"],
  ["", "Empty string"],
];
const INVALID_PHONES: [string, string][] = [
  ["123", "Too short"],
  ["+91-98-XY-12345", "Contains letters"],
  ["0000000000", "All zeros"],
  ["", "Empty string"],
];
const INVALID_PAN: [string, string][] = [
  ["ABCD12345E", "Only 4 leading letters instead of 5"],
  ["aaaaa1234a", "Lowercase letters (PAN must be uppercase)"],
  ["1AAAA2345B", "Starts with digit"],
];
const INVALID_IFSC: [string, string][] = [
  ["SBI0001234", "Only 3 letters instead of 4"],
  ["sbin0001234", "Lowercase (IFSC must be uppercase)"],
  ["SBIN1001234", "5th character must be 0"],
];
const INVALID_CARD: [string, string][] = [
  ["1234 5678", "Too short (8 digits instead of 16)"],
  ["4111-1111-1111-111A", "Contains a letter"],
  ["0000 0000 0000 0000", "All-zero sequence"],
];
const INVALID_UPI: [string, string][] = [
  ["9876543210", "Missing @handle suffix"],
  ["@okhdfcbank", "Missing VPA prefix"],
  ["987654 3210@ybl", "Contains a space"],
];
const INVALID_POSTAL: [string, string][] = [
  ["123", "Too short"],
  ["ABCDEF", "Non-numeric"],
  ["", "Empty string"],
];

function ifscCode(): string {
  const bank = pick(INDIAN_BANKS);
  return `${bank.ifsc}0${alphaNum(6)}`;
}

function cardNumber(): string {
  return `${digits(4)} ${digits(4)} ${digits(4)} ${digits(4)}`;
}

function upiId(): string {
  return `${digits(10)}@${pick(["okhdfcbank", "ybl", "okicici", "oksbi", "paytm"])}`;
}

function transactionId(): string {
  return `TXN${Date.now().toString().slice(-8)}${digits(4)}`;
}

function panNumber(): string {
  return `${letters(5)}${digits(4)}${letters(1)}`;
}

function idFor(prefix: string, len = 8): () => string {
  return () => `${prefix}-${alphaNum(len)}`;
}

const ACCOUNT_TYPES = ["Savings", "Current", "Salary", "Fixed Deposit", "NRI"];
const CARD_TYPES = ["Visa", "Mastercard", "RuPay", "Amex", "Discover"];
const LOAN_TYPES = ["Personal Loan", "Home Loan", "Auto Loan", "Education Loan", "Business Loan", "Gold Loan"];
const TRANSACTION_TYPES = ["Credit", "Debit", "Transfer", "Refund", "Withdrawal", "Deposit"];
const PAYMENT_STATUSES = ["SUCCESS", "PENDING", "FAILED", "REVERSED", "PROCESSING"];
const KYC_STATUSES = ["Verified", "Pending", "Rejected", "Not Submitted"];
const ORDER_STATUSES = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];
const SHIPMENT_STATUSES = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Failed Delivery", "Returned to Sender"];
const RETURN_REASONS = ["Damaged item", "Wrong item received", "Item not as described", "No longer needed", "Better price found elsewhere", "Size/fit issue", "Quality issue"];
const PAYMENT_METHODS = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet", "Cash on Delivery", "EMI"];

function enumField(values: string[]): FieldGenerator {
  return {
    valid: () => pick(values),
    invalid: () => ["INVALID_VALUE", "Value outside the allowed enum set"],
  };
}

export const FIELD_GENERATORS: Record<FieldType, FieldGenerator> = {
  id: { valid: () => alphaNum(10) },
  uuid: { valid: () => uuidv4() },

  fullName: { valid: (ctx) => ctx.person.fullName, invalid: () => ["", "Empty name"] },
  firstName: { valid: (ctx) => ctx.person.firstName },
  lastName: { valid: (ctx) => ctx.person.lastName },
  email: {
    valid: (ctx) => ctx.person.email,
    invalid: (ctx) => INVALID_EMAILS[ctx.index % INVALID_EMAILS.length],
  },
  phone: {
    valid: (ctx) => ctx.person.mobileNumber,
    invalid: (ctx) => INVALID_PHONES[ctx.index % INVALID_PHONES.length],
  },
  dateOfBirth: { valid: (ctx) => ctx.person.dateOfBirth },
  age: {
    valid: (ctx) => ctx.person.age,
    invalid: () => [randInt(-10, 0), "Non-positive age"],
    boundary: boundaryFor(18, 65),
  },
  gender: { valid: (ctx) => ctx.person.gender },
  address: { valid: (ctx) => ctx.person.address },
  city: { valid: (ctx) => ctx.person.city },
  state: { valid: (ctx) => ctx.person.state },
  country: { valid: (ctx) => ctx.person.country },
  postalCode: {
    valid: (ctx) => ctx.person.pinCode,
    invalid: (ctx) => INVALID_POSTAL[ctx.index % INVALID_POSTAL.length],
  },
  company: { valid: (ctx) => ctx.person.companyName },
  jobTitle: { valid: (ctx) => ctx.person.jobTitle },

  date: { valid: () => formatDate(randomDate(2020, 2026)) },
  dateTime: { valid: () => randomDate(2020, 2026).toISOString() },
  boolean: { valid: () => pick([true, false]) },
  url: { valid: (ctx) => `https://www.${ctx.person.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com` },
  text: { valid: (ctx) => getLocaleFaker(ctx.locale).lorem.sentence() },
  sentence: { valid: (ctx) => getLocaleFaker(ctx.locale).lorem.sentences(2) },
  notes: { valid: (ctx) => getLocaleFaker(ctx.locale).lorem.sentences(1) },

  currencyCode: { valid: () => pick(CURRENCIES) },
  amount: { valid: () => randFloat(50, 500000, 2), invalid: () => [-randFloat(1, 5000, 2), "Negative amount"] },
  percentage: { valid: () => randInt(0, 100), invalid: () => [randInt(101, 200), "Above 100%"], boundary: boundaryFor(0, 100) },
  rating: { valid: () => randInt(1, 5), invalid: () => [randInt(6, 20), "Above the 1-5 rating scale"], boundary: boundaryFor(1, 5) },

  accountNumber: {
    valid: () => digitsNoLeadingZero(pick([11, 12, 14, 16])),
    invalid: () => ["123", "Too short for a real account number"],
  },
  ifsc: {
    valid: () => ifscCode(),
    invalid: (ctx) => INVALID_IFSC[ctx.index % INVALID_IFSC.length],
  },
  bankName: { valid: () => pick(INDIAN_BANKS).name },
  branchName: { valid: () => `${pick(["MG Road", "Andheri East", "Connaught Place", "Koramangala", "Sector 18"])} Branch` },
  accountType: enumField(ACCOUNT_TYPES),
  cardNumber: {
    valid: () => cardNumber(),
    invalid: (ctx) => INVALID_CARD[ctx.index % INVALID_CARD.length],
  },
  cardType: enumField(CARD_TYPES),
  cvv: {
    valid: () => digits(3),
    invalid: () => [digits(1), "Too short (must be 3-4 digits)"],
    boundary: boundaryFor(100, 999),
  },
  cardExpiry: { valid: () => `${pad(randInt(1, 12), 2)}/${pick(["26", "27", "28", "29", "30"])}` },
  loanType: enumField(LOAN_TYPES),
  loanAmount: { valid: () => randFloat(50000, 5000000, 2), invalid: () => [0, "Zero loan amount"] },
  emiAmount: { valid: () => randFloat(500, 100000, 2) },
  interestRate: { valid: () => randFloat(4, 22, 2), invalid: () => [randFloat(-5, -1, 2), "Negative interest rate"], boundary: boundaryFor(4, 22) },
  tenureMonths: { valid: () => pick([6, 12, 24, 36, 48, 60, 84, 120, 240]), boundary: boundaryFor(6, 360) },
  beneficiaryName: { valid: (ctx) => ctx.person.fullName },
  upiId: {
    valid: () => upiId(),
    invalid: (ctx) => INVALID_UPI[ctx.index % INVALID_UPI.length],
  },
  transactionId: { valid: () => transactionId() },
  transactionType: enumField(TRANSACTION_TYPES),
  paymentStatus: enumField(PAYMENT_STATUSES),
  panNumber: {
    valid: () => panNumber(),
    invalid: (ctx) => INVALID_PAN[ctx.index % INVALID_PAN.length],
  },
  kycStatus: enumField(KYC_STATUSES),
  taxAmount: { valid: () => randFloat(0, 50000, 2) },

  productName: { valid: () => `${pick(["Premium", "Wireless", "Portable", "Smart", "Ultra", "Compact", "Eco", "Pro"])} ${pick(["Headphones", "Backpack", "Water Bottle", "Desk Lamp", "Keyboard", "Sneakers", "Watch", "Speaker"])}` },
  sku: { valid: idFor("SKU") },
  productCategory: enumField(PRODUCT_CATEGORIES),
  price: { valid: () => randFloat(5, 50000, 2), invalid: () => [-randFloat(1, 500, 2), "Negative price"] },
  quantity: { valid: () => randInt(1, 999), invalid: () => [0, "Zero quantity"], boundary: boundaryFor(1, 999) },
  orderId: { valid: () => `ORD-${alphaNum(2)}${digits(7)}` },
  orderStatus: enumField(ORDER_STATUSES),
  cartId: { valid: idFor("CART") },
  couponCode: { valid: () => `${pick(["SAVE", "OFF", "DEAL", "PROMO"])}${randInt(10, 75)}` },
  discountPercent: { valid: () => randInt(5, 70), invalid: () => [randInt(101, 200), "Above 100% discount"], boundary: boundaryFor(0, 100) },
  reviewRating: { valid: () => randInt(1, 5), boundary: boundaryFor(1, 5) },
  reviewText: { valid: (ctx) => getLocaleFaker(ctx.locale).lorem.sentences(2) },
  trackingId: { valid: () => `TRK${digits(10)}` },
  shipmentStatus: enumField(SHIPMENT_STATUSES),
  returnReason: enumField(RETURN_REASONS),
  invoiceNumber: { valid: () => `INV-${new Date().getFullYear()}-${digitsNoLeadingZero(6)}` },
  paymentMethod: enumField(PAYMENT_METHODS),

  enum: {
    valid: (ctx) => pick(ctx.field.enumValues ?? ["N/A"]),
    invalid: () => ["INVALID_VALUE", "Value outside the allowed enum set"],
  },
};

/** Overrides a field's value with a special-character/unicode/emoji sample, for text-like fields only. */
const SPECIAL_CHAR_ELIGIBLE: FieldType[] = [
  "fullName", "firstName", "lastName", "text", "sentence", "notes", "reviewText",
  "address", "company", "jobTitle", "productName", "branchName", "beneficiaryName", "city",
];

export function isSpecialCharEligible(type: FieldType): boolean {
  return SPECIAL_CHAR_ELIGIBLE.includes(type);
}

export function specialCharSample(): string {
  return pick([...SPECIAL_CHAR_SAMPLES, ...UNICODE_SAMPLES, ...EMOJI_SAMPLES]);
}
