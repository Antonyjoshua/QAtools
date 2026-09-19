import type { Mission } from "./types";

export const MISSIONS: Mission[] = [
  {
    id: "mission-auth",
    title: "Login & Registration Sweep",
    difficulty: "Beginner",
    scope: ["Auth"],
    timeLimitMinutes: 15,
    environment: "Brightbasket Staging (local)",
    browser: "Chromium 130 (desktop)",
    userStory:
      "As a shopper, I want to register a new account and log in reliably, so that I can start shopping.",
    acceptanceCriteria: [
      "Registration rejects passwords shorter than 8 characters.",
      "Login gives an accurate error depending on whether the email or the password is wrong.",
      "Logging out fully ends the session — no leftover data should be visible to the next visitor.",
    ],
    testData: [
      { label: "Seeded account", value: "amy.tester@brightbasket.test / password123" },
      { label: "Unregistered email", value: "nobody@brightbasket.test" },
    ],
    targetBugIds: ["BUG-001", "BUG-002", "BUG-003"],
  },
  {
    id: "mission-catalog",
    title: "Catalog & Search Shakedown",
    difficulty: "Intermediate",
    scope: ["Catalog", "Product Detail"],
    timeLimitMinutes: 20,
    environment: "Brightbasket Staging (local)",
    browser: "Chromium 130 (desktop + narrow 375px viewport)",
    userStory:
      "As a shopper, I want to search, filter, and sort products accurately, so that I can find what I'm looking for.",
    acceptanceCriteria: [
      "Search matches regardless of case or extra whitespace.",
      "Selecting a category filter doesn't clear an in-progress search.",
      "Sorting stays applied even when a filter is also active.",
      "Out-of-stock products cannot be added to the cart.",
      "The product grid reflows correctly on narrow screens.",
    ],
    testData: [
      { label: "Search term to try", value: "mouse (try different casing/spacing)" },
      { label: "Known out-of-stock SKU", value: "USB-C Hub" },
    ],
    targetBugIds: ["BUG-004", "BUG-005", "BUG-006", "BUG-007", "BUG-008", "BUG-009", "BUG-024"],
  },
  {
    id: "mission-cart",
    title: "Cart, Wishlist & Coupons",
    difficulty: "Advanced",
    scope: ["Cart", "Wishlist", "Coupons"],
    timeLimitMinutes: 25,
    environment: "Brightbasket Staging (local)",
    browser: "Chromium 130 (desktop)",
    userStory:
      "As a shopper, I want the cart, wishlist, and coupon totals to be trustworthy, so that I'm charged exactly what I expect.",
    acceptanceCriteria: [
      "Cart quantity can never go below 1 (or the item is removed).",
      "The price charged at checkout matches the price shown in the catalog.",
      "Wishlist never contains duplicate rows for the same product.",
      "An expired coupon code is rejected.",
      "Applying a coupon twice doesn't double the discount.",
    ],
    testData: [
      { label: "Price-mismatch SKU", value: "Wireless Mouse" },
      { label: "Expired coupon", value: "EXPIRED5" },
      { label: "Valid coupon", value: "WELCOME10" },
    ],
    targetBugIds: [
      "BUG-010",
      "BUG-011",
      "BUG-012",
      "BUG-013",
      "BUG-014",
      "BUG-015",
      "BUG-016",
      "BUG-017",
    ],
  },
  {
    id: "mission-checkout",
    title: "Checkout & Account Full Sweep",
    difficulty: "Expert",
    scope: ["Checkout", "Payment", "Orders", "Profile", "Addresses"],
    timeLimitMinutes: 30,
    environment: "Brightbasket Staging (local)",
    browser: "Chromium 130 (desktop)",
    userStory:
      "As a shopper, I want checkout, order history, and my account details to behave correctly, so that my orders and information are accurate.",
    acceptanceCriteria: [
      "An order cannot be placed without a complete shipping address.",
      "Rapidly clicking Place Order never creates two orders.",
      "Postal codes are validated as digits only.",
      "Order history shows the correct number of items per order.",
      "Profile name cannot be saved blank.",
    ],
    testData: [
      { label: "Seeded account", value: "dev.user@brightbasket.test / password123" },
      { label: "Invalid postal code to try", value: "ABCDE" },
    ],
    targetBugIds: ["BUG-018", "BUG-019", "BUG-020", "BUG-021", "BUG-022", "BUG-023"],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}
