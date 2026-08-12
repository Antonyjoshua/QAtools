import type { GeneratorModule } from "../types";
import { INDIAN_STATES, INDIAN_BANKS, INDIAN_FIRST_NAMES_M, INDIAN_FIRST_NAMES_F, INDIAN_LAST_NAMES } from "../data";
import { pick, digits, letters, alphaNum, digitsNoLeadingZero } from "../random";
import { formatPhone } from "../locale";

const SYNTHETIC_NOTE =
  "Synthetic, format-only test value. It follows the real ID's structural pattern but carries no valid checksum and does not correspond to any real person, bank, or government record. Use for UI/validation testing only — never submit as a real identity document.";

function panNumber(): string {
  return `${letters(5)}${digits(4)}${letters(1)}`;
}

function aadhaarNumber(): string {
  return `${digits(4)} ${digits(4)} ${digits(4)}`;
}

function gstinNumber(): string {
  const state = pick(INDIAN_STATES);
  return `${state.code}${panNumber()}${digits(1)}Z${alphaNum(1)}`;
}

function drivingLicense(): string {
  const state = pick(INDIAN_STATES);
  const stateAbbr = state.state.slice(0, 2).toUpperCase();
  const rto = digitsNoLeadingZero(2);
  const year = 1990 + Math.floor(Math.random() * 34);
  return `${stateAbbr}${rto} ${year} ${digits(7)}`;
}

function passportNumber(): string {
  return `${letters(1)}${digits(7)}`;
}

function voterId(): string {
  return `${letters(3)}${digits(7)}`;
}

function ifscCode(): { bank: string; ifsc: string } {
  const bank = pick(INDIAN_BANKS);
  return { bank: bank.name, ifsc: `${bank.ifsc}0${alphaNum(6)}` };
}

function upiId(): string {
  const handles = ["okhdfcbank", "ybl", "okicici", "oksbi", "paytm", "ibl", "axl"];
  const useMobile = Math.random() < 0.4;
  const name = Math.random() < 0.5 ? pick(INDIAN_FIRST_NAMES_M) : pick(INDIAN_FIRST_NAMES_F);
  const prefix = useMobile ? digits(10) : `${name.toLowerCase()}.${pick(INDIAN_LAST_NAMES).toLowerCase()}`;
  return `${prefix}@${pick(handles)}`;
}

function vehicleRegistration(): string {
  const state = pick(INDIAN_STATES);
  const stateAbbr = state.state.slice(0, 2).toUpperCase();
  return `${stateAbbr}${digitsNoLeadingZero(2)} ${letters(2)} ${digits(4)}`;
}

function bankAccountNumber(): string {
  return digitsNoLeadingZero(randLenAccount());
}

function randLenAccount(): number {
  const lengths = [11, 12, 14, 15, 16];
  return pick(lengths);
}

export const indianGenerators: GeneratorModule[] = [
  {
    slug: "aadhaar-format",
    name: "Aadhaar Number (Format Only)",
    category: "indian",
    description: "12-digit synthetic Aadhaar-style number, grouped as real cards display it.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["aadhaarNumber"],
    generate: () => ({ aadhaarNumber: aadhaarNumber() }),
  },
  {
    slug: "pan-format",
    name: "PAN Number (Format Only)",
    category: "indian",
    description: "10-character PAN-style code (5 letters, 4 digits, 1 letter).",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["panNumber"],
    generate: () => ({ panNumber: panNumber() }),
  },
  {
    slug: "gstin-format",
    name: "GSTIN (Format Only)",
    category: "indian",
    description: "15-character GSTIN-style code with state prefix and PAN segment.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["gstin"],
    generate: () => ({ gstin: gstinNumber() }),
  },
  {
    slug: "driving-license-format",
    name: "Driving License (Format Only)",
    category: "indian",
    description: "State-coded synthetic driving license number.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["drivingLicense"],
    generate: () => ({ drivingLicense: drivingLicense() }),
  },
  {
    slug: "passport-format",
    name: "Passport Number (Format Only)",
    category: "indian",
    description: "1 letter + 7-digit synthetic Indian passport-style number.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["passportNumber"],
    generate: () => ({ passportNumber: passportNumber() }),
  },
  {
    slug: "voter-id-format",
    name: "Voter ID / EPIC (Format Only)",
    category: "indian",
    description: "3 letters + 7-digit synthetic Elector's Photo ID Card number.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["voterId"],
    generate: () => ({ voterId: voterId() }),
  },
  {
    slug: "upi-id",
    name: "UPI ID Generator",
    category: "indian",
    description: "Synthetic UPI virtual payment address (name@bank or mobile@bank).",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["upiId"],
    generate: () => ({ upiId: upiId() }),
  },
  {
    slug: "bank-account-ifsc",
    name: "Bank Account + IFSC",
    category: "indian",
    description: "Synthetic Indian bank account number paired with a bank and IFSC code.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["bankName", "accountNumber", "ifsc"],
    generate: () => {
      const { bank, ifsc } = ifscCode();
      return { bankName: bank, accountNumber: bankAccountNumber(), ifsc };
    },
  },
  {
    slug: "vehicle-registration",
    name: "Vehicle Registration Number",
    category: "indian",
    description: "State-coded synthetic vehicle registration plate.",
    note: SYNTHETIC_NOTE,
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["registrationNumber"],
    generate: () => ({ registrationNumber: vehicleRegistration() }),
  },
  {
    slug: "indian-mobile",
    name: "Indian Mobile Number",
    category: "indian",
    description: "10-digit Indian mobile number starting with 6-9, with +91 prefix.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["mobileNumber"],
    generate: () => ({ mobileNumber: formatPhone("IN") }),
  },
  {
    slug: "indian-state-district",
    name: "State & District Generator",
    category: "indian",
    description: "Random Indian state, district, and PIN code.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["state", "district", "pinCode"],
    generate: () => {
      const state = pick(INDIAN_STATES);
      return { state: state.state, district: pick(state.districts), pinCode: digits(6) };
    },
  },
];
