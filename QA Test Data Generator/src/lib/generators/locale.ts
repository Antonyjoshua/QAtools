import {
  faker,
  fakerEN_IN,
  fakerEN_US,
  fakerEN_GB,
  fakerEN_CA,
  fakerEN_AU,
  fakerDE,
  fakerFR,
  fakerJA,
} from "@faker-js/faker";
import { digits, digitsNoLeadingZero, pick } from "./random";

const LOCALE_MAP: Record<string, typeof faker> = {
  IN: fakerEN_IN,
  US: fakerEN_US,
  GB: fakerEN_GB,
  CA: fakerEN_CA,
  AU: fakerEN_AU,
  DE: fakerDE,
  FR: fakerFR,
  JP: fakerJA,
};

export function getLocaleFaker(countryCode: string) {
  return LOCALE_MAP[countryCode] ?? faker;
}

export function formatPhone(countryCode: string): string {
  switch (countryCode) {
    case "IN":
      return `+91 ${pick(["6", "7", "8", "9"])}${digits(9)}`;
    case "US":
    case "CA":
      return `+1 (${digitsNoLeadingZero(3)}) ${digitsNoLeadingZero(3)}-${digits(4)}`;
    case "GB":
      return `+44 7${digits(3)} ${digits(6)}`;
    case "AU":
      return `+61 4${digits(2)} ${digits(3)} ${digits(3)}`;
    case "DE":
      return `+49 1${digitsNoLeadingZero(2)} ${digits(7)}`;
    case "FR":
      return `+33 6${digits(2)} ${digits(2)} ${digits(2)} ${digits(2)}`;
    case "SG":
      return `+65 ${pick(["8", "9"])}${digits(7)}`;
    case "AE":
      return `+971 5${digitsNoLeadingZero(1)} ${digits(3)} ${digits(4)}`;
    case "JP":
      return `+81 90-${digits(4)}-${digits(4)}`;
    default:
      return `+1 ${digitsNoLeadingZero(3)}-${digits(3)}-${digits(4)}`;
  }
}
