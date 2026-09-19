import type { Requirement } from "./types";

export const REQUIREMENTS: Requirement[] = [
  {
    id: "req-password-reset",
    title: "Password Reset via Email",
    statement: "User should be able to reset their password using a registered email address.",
    difficulty: "Beginner",
    coverageChecklist: {
      Positive: [
        ["valid registered email", "reset link sent"],
        ["successfully reset password", "login with new password"],
      ],
      Negative: [
        ["unregistered email", "email not found"],
        ["expired reset link", "reset link expired"],
      ],
      Boundary: [
        ["minimum password length", "8 characters"],
        ["maximum password length"],
      ],
      Security: [
        ["reset link single use", "token reused"],
        ["reset link expires", "time limited token"],
      ],
      Usability: [["clear error message", "helpful instructions"]],
    },
  },
  {
    id: "req-profile-name",
    title: "Profile Name Update",
    statement:
      "User should be able to update their display name from the profile page, with validation preventing an empty name.",
    difficulty: "Beginner",
    coverageChecklist: {
      Positive: [["valid name update", "name saved successfully"]],
      Negative: [
        ["empty name", "blank name rejected"],
        ["whitespace only name", "spaces only"],
      ],
      Boundary: [
        ["single character name", "minimum name length"],
        ["very long name", "maximum name length"],
      ],
      Security: [["script injection in name", "xss in name field"]],
      Usability: [["save confirmation", "success message shown"]],
    },
  },
  {
    id: "req-cart-quantity",
    title: "Add to Cart Quantity Limits",
    statement:
      "User should be able to add a product to the cart with a valid quantity, and the system should prevent invalid quantities.",
    difficulty: "Intermediate",
    coverageChecklist: {
      Positive: [["add valid quantity", "quantity within stock"]],
      Negative: [
        ["negative quantity", "quantity below zero"],
        ["non numeric quantity", "letters in quantity field"],
      ],
      Boundary: [
        ["quantity of zero removes item", "zero quantity"],
        ["quantity equal to available stock", "max stock"],
        ["quantity exceeding stock", "exceeds available stock"],
      ],
      Security: [["price tampering", "modify price client side"]],
      Usability: [["clear stock message", "out of stock indicator"]],
    },
  },
  {
    id: "req-coupon-apply",
    title: "Apply Coupon Code at Checkout",
    statement:
      "User should be able to apply a valid coupon code to receive a discount, and invalid or expired codes should be rejected.",
    difficulty: "Intermediate",
    coverageChecklist: {
      Positive: [["valid coupon applies discount", "correct percentage off"]],
      Negative: [
        ["invalid coupon code", "code does not exist"],
        ["expired coupon", "coupon past expiry date"],
      ],
      Boundary: [["minimum subtotal requirement", "coupon requires minimum order"]],
      Security: [
        ["applying coupon twice", "discount stacking"],
        ["coupon reuse prevention", "single use coupon"],
      ],
      Usability: [["clear success message", "shows discount amount"]],
    },
  },
  {
    id: "req-product-search",
    title: "Product Search",
    statement:
      "User should be able to search for products by name and receive accurate, case-insensitive results.",
    difficulty: "Intermediate",
    coverageChecklist: {
      Positive: [
        ["exact name match", "search returns product"],
        ["partial name match", "substring search"],
      ],
      Negative: [["no matching products", "no results found message"]],
      Boundary: [
        ["single character search", "very short query"],
        ["very long search query", "long input string"],
      ],
      Security: [["script injection in search", "xss in search box"]],
      Usability: [["case insensitive search", "extra whitespace tolerated"]],
    },
  },
  {
    id: "req-checkout-address",
    title: "Checkout Address Validation",
    statement:
      "User should not be able to complete checkout without providing a complete, valid shipping address.",
    difficulty: "Advanced",
    coverageChecklist: {
      Positive: [["complete valid address", "order placed successfully"]],
      Negative: [
        ["empty address fields", "missing required field"],
        ["invalid postal code format", "letters in postal code"],
      ],
      Boundary: [
        ["very short address", "minimum address length"],
        ["very long address", "maximum field length"],
      ],
      Security: [["injection in address fields", "script tags in input"]],
      Usability: [["inline field errors", "highlights invalid field"]],
    },
  },
  {
    id: "req-order-cancellation",
    title: "Order Cancellation Window",
    statement:
      "User should be able to cancel a placed order within 24 hours, and cancellation should be blocked after that window.",
    difficulty: "Advanced",
    coverageChecklist: {
      Positive: [["cancel within window", "order cancelled successfully"]],
      Negative: [
        ["cancel after window", "cancellation blocked after 24 hours"],
        ["cancel already cancelled order", "duplicate cancellation"],
      ],
      Boundary: [["cancel exactly at 24 hours", "boundary of cancellation window"]],
      Security: [["cancel another user's order", "unauthorized cancellation"]],
      Usability: [["confirmation dialog", "clear cancellation status"]],
    },
  },
];

export function getRequirementById(id: string): Requirement | undefined {
  return REQUIREMENTS.find((r) => r.id === id);
}
