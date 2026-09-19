export type BugSeverity = "Critical" | "High" | "Medium" | "Low";
export type BugPriority = "P1" | "P2" | "P3" | "P4";

export type BugCategory =
  | "Functional"
  | "UI"
  | "Validation"
  | "Boundary"
  | "Data"
  | "Usability"
  | "Accessibility"
  | "Security";

export type ShopModule =
  | "Auth"
  | "Catalog"
  | "Product Detail"
  | "Cart"
  | "Wishlist"
  | "Coupons"
  | "Checkout"
  | "Payment"
  | "Orders"
  | "Profile"
  | "Addresses";

export interface CanonicalBug {
  id: string;
  title: string;
  module: ShopModule;
  category: BugCategory;
  severity: BugSeverity;
  priority: BugPriority;
  /** Ground-truth description used only by scoring/admin — never shown to a Bug Hunter mid-hunt. */
  description: string;
  /** Extra terms (beyond the title) that help the matcher recognize a report describing this bug. */
  keywords: string[];
  defaultActive: boolean;
}
