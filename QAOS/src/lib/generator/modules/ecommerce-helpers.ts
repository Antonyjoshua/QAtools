import { PRODUCT_ADJECTIVES, PRODUCT_NOUNS, PRODUCT_CATEGORIES } from "../data";
import { pick, digits, alphaNum, digitsNoLeadingZero } from "../random";

export function productName(): string {
  return `${pick(PRODUCT_ADJECTIVES)} ${pick(PRODUCT_NOUNS)}`;
}

export function sku(category?: string): string {
  const cat = (category ?? pick(PRODUCT_CATEGORIES)).slice(0, 4).toUpperCase().replace(/\s/g, "");
  return `${cat}-${alphaNum(4)}-${digits(4)}`;
}

export function ean13CheckDigit(base12: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = Number(base12[i]);
    sum += i % 2 === 0 ? d : d * 3;
  }
  return (10 - (sum % 10)) % 10;
}

export function ean13(): string {
  const base = digitsNoLeadingZero(12);
  return `${base}${ean13CheckDigit(base)}`;
}
