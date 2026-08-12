import type { GeneratorModule } from "../types";
import { INDIAN_BANKS, CURRENCIES } from "../data";
import { pick, digits, digitsNoLeadingZero, alphaNum, letters, randFloat, uuidv4 } from "../random";
import { buildPerson } from "./personal";

const WORLD_BANKS = ["Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "HSBC", "Barclays", "Deutsche Bank", "BNP Paribas", "Standard Chartered", "DBS Bank"];
const SWIFT_COUNTRY = { US: "US33", GB: "GB2L", DE: "DEFF", FR: "FRPP", SG: "SGSG", IN: "INBB" };

function swiftCode(): string {
  const bankCode = letters(4);
  const country = pick(Object.keys(SWIFT_COUNTRY));
  return `${bankCode}${country.slice(0, 2)}${pick(["1", "2", "S", "L", "X"])}${pick(["", digits(3)])}`;
}

function transactionId(): string {
  return `TXN${Date.now().toString().slice(-8)}${digits(4)}`;
}

function referenceNumber(): string {
  return `REF-${alphaNum(3)}-${digits(8)}`;
}

function invoiceNumber(): string {
  return `INV-${new Date().getFullYear()}-${digitsNoLeadingZero(6)}`;
}

function orderNumber(): string {
  return `ORD-${alphaNum(2)}${digits(7)}`;
}

export const bankingGenerators: GeneratorModule[] = [
  {
    slug: "bank-account-profile",
    name: "Bank Account Profile",
    category: "banking",
    description: "Full synthetic bank account: holder, bank, branch, account number, IFSC, SWIFT.",
    note: "Synthetic test data only — not linked to any real bank account.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    options: [
      { key: "region", label: "Region", type: "select", options: [{ label: "India", value: "IN" }, { label: "International", value: "INTL" }], default: "IN" },
    ],
    columns: ["accountHolder", "bankName", "branch", "accountNumber", "ifsc", "swift"],
    generate: (ctx) => {
      const region = String(ctx.options.region ?? "IN");
      const holder = buildPerson(region === "IN" ? "IN" : "US").fullName;
      if (region === "IN") {
        const bank = pick(INDIAN_BANKS);
        return {
          accountHolder: holder,
          bankName: bank.name,
          branch: `${pick(["MG Road", "Andheri East", "Connaught Place", "Koramangala", "Sector 18"])} Branch`,
          accountNumber: digitsNoLeadingZero(pick([11, 12, 14, 16])),
          ifsc: `${bank.ifsc}0${alphaNum(6)}`,
          swift: swiftCode(),
        };
      }
      return {
        accountHolder: holder,
        bankName: pick(WORLD_BANKS),
        branch: `${pick(["Downtown", "Uptown", "Central", "Westside"])} Branch`,
        accountNumber: digitsNoLeadingZero(pick([10, 12])),
        ifsc: "-",
        swift: swiftCode(),
      };
    },
  },
  {
    slug: "swift-code",
    name: "SWIFT/BIC Code Generator",
    category: "banking",
    description: "8-11 character SWIFT/BIC style codes.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["swiftCode"],
    generate: () => ({ swiftCode: swiftCode() }),
  },
  {
    slug: "transaction-id",
    name: "Transaction ID Generator",
    category: "banking",
    description: "Unique transaction identifiers with amount and currency.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["transactionId", "amount", "currency", "status"],
    generate: () => ({
      transactionId: transactionId(),
      amount: randFloat(50, 500000, 2),
      currency: pick(CURRENCIES),
      status: pick(["SUCCESS", "PENDING", "FAILED", "REVERSED"]),
    }),
  },
  {
    slug: "reference-number",
    name: "Reference Number Generator",
    category: "banking",
    description: "Bank/payment reference numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["referenceNumber"],
    generate: () => ({ referenceNumber: referenceNumber() }),
  },
  {
    slug: "invoice-number",
    name: "Invoice Number Generator",
    category: "banking",
    description: "Sequential-looking invoice numbers with year prefix.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["invoiceNumber", "amount", "currency"],
    generate: () => ({ invoiceNumber: invoiceNumber(), amount: randFloat(100, 50000, 2), currency: pick(CURRENCIES) }),
  },
  {
    slug: "order-number-banking",
    name: "Order Number Generator",
    category: "banking",
    description: "Payment/order numbers used in checkout and settlement flows.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["orderNumber"],
    generate: () => ({ orderNumber: orderNumber() }),
  },
  {
    slug: "upi-transaction",
    name: "UPI Transaction Record",
    category: "banking",
    description: "Synthetic UPI transaction with reference ID, VPA, and status.",
    note: "Synthetic test data only.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["upiRefId", "vpa", "amount", "status"],
    generate: () => ({
      upiRefId: digits(12),
      vpa: `${digits(10)}@${pick(["okhdfcbank", "ybl", "okicici", "oksbi"])}`,
      amount: randFloat(10, 25000, 2),
      status: pick(["SUCCESS", "PENDING", "FAILED"]),
    }),
  },
  {
    slug: "card-uuid",
    name: "Payment Session / Card Token",
    category: "banking",
    description: "Non-financial tokenized identifiers for payment-gateway test flows (not real card numbers).",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["sessionId", "cardBrand", "last4", "expiry"],
    generate: () => ({
      sessionId: uuidv4(),
      cardBrand: pick(["Visa", "Mastercard", "RuPay", "Amex"]),
      last4: digits(4),
      expiry: `${digitsNoLeadingZero(1).padStart(2, "0")}/${pick(["26", "27", "28", "29"])}`,
    }),
  },
];
