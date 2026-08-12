import type { CategoryId } from "./types";

export interface CustomTool {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  href: string;
  icon: string;
}

export const CUSTOM_TOOLS: CustomTool[] = [
  {
    slug: "image-studio",
    name: "Placeholder Image Studio",
    category: "content",
    description: "Generate downloadable placeholder images — profile photos, product images, avatars, banners, thumbnails — at any dimension.",
    href: "/generator/tools/image-studio",
    icon: "Image",
  },
  {
    slug: "qr-barcode-studio",
    name: "QR / Barcode Studio",
    category: "ecommerce",
    description: "Render and download real scannable QR codes and EAN-13 barcodes from any text or product code.",
    href: "/generator/tools/qr-barcode-studio",
    icon: "QrCode",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester / Builder",
    category: "devutils",
    description: "Test a pattern against real text with live match highlighting, capture groups, and a replace preview.",
    href: "/generator/tools/regex-tester",
    icon: "Regex",
  },
];
