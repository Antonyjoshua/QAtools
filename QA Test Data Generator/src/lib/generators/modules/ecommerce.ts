import type { GeneratorModule } from "../types";
import { PRODUCT_CATEGORIES, CURRENCIES } from "../data";
import { pick, digits, alphaNum, randInt, randFloat, uuidv4 } from "../random";
import { buildPerson } from "./personal";
import { productName, sku, ean13 } from "./ecommerce-helpers";

function couponCode(prefix = "SAVE"): string {
  return `${prefix}${randInt(10, 60)}-${alphaNum(5)}`;
}

function trackingNumber(): string {
  const carrier = pick(["FDX", "UPS", "DHL", "BLQ", "IND"]);
  return `${carrier}${digits(9)}${letters2()}`;
}
function letters2(): string {
  return alphaNum(2, true);
}

function orderNumber(): string {
  return `ORD-${new Date().getFullYear()}-${digits(6)}`;
}

export const ecommerceGenerators: GeneratorModule[] = [
  {
    slug: "product-catalog",
    name: "Product Catalog Entry",
    category: "ecommerce",
    description: "Product name, SKU, category, price, and stock in one record.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["productName", "sku", "category", "price", "currency", "stock", "rating"],
    generate: () => {
      const category = pick(PRODUCT_CATEGORIES);
      return {
        productName: productName(),
        sku: sku(category),
        category,
        price: randFloat(4.99, 999.99, 2),
        currency: pick(CURRENCIES),
        stock: randInt(0, 500),
        rating: randFloat(2.5, 5, 1),
      };
    },
  },
  {
    slug: "sku-generator",
    name: "SKU Generator",
    category: "ecommerce",
    description: "Category-prefixed stock keeping unit codes.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 30,
    columns: ["sku"],
    generate: () => ({ sku: sku() }),
  },
  {
    slug: "barcode-ean13",
    name: "Barcode Generator (EAN-13)",
    category: "ecommerce",
    description: "Valid-checksum EAN-13 barcode numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 30,
    columns: ["barcode"],
    generate: () => ({ barcode: ean13() }),
  },
  {
    slug: "qr-code-data",
    name: "QR Code Data Generator",
    category: "ecommerce",
    description: "Encodable QR payload strings (product URLs / codes). Render a scannable image in Content & Media → QR/Barcode Studio.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["qrData"],
    generate: () => ({ qrData: `https://testdatahub.dev/p/${alphaNum(8, false)}` }),
  },
  {
    slug: "coupon-code",
    name: "Coupon Code Generator",
    category: "ecommerce",
    description: "Promotional coupon codes with a percentage-off prefix.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["couponCode", "discountPercent", "expiresOn"],
    generate: () => ({
      couponCode: couponCode(),
      discountPercent: pick([10, 15, 20, 25, 30, 40, 50]),
      expiresOn: `${2026}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    }),
  },
  {
    slug: "discount-code",
    name: "Discount Code Generator",
    category: "ecommerce",
    description: "Flat and percentage discount codes for checkout testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["discountCode", "type", "value"],
    generate: () => {
      const type = pick(["PERCENT", "FLAT"]);
      return {
        discountCode: couponCode(pick(["DEAL", "OFF", "FLASH", "PROMO"])),
        type,
        value: type === "PERCENT" ? randInt(5, 70) : randInt(50, 2000),
      };
    },
  },
  {
    slug: "tracking-number",
    name: "Tracking Number Generator",
    category: "ecommerce",
    description: "Courier-style shipment tracking numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["trackingNumber", "carrier", "status"],
    generate: () => ({
      trackingNumber: trackingNumber(),
      carrier: pick(["FedEx", "UPS", "DHL", "Blue Dart", "India Post", "Delhivery"]),
      status: pick(["Order Placed", "Shipped", "In Transit", "Out for Delivery", "Delivered", "Delayed"]),
    }),
  },
  {
    slug: "order-number-ecom",
    name: "Order Number Generator",
    category: "ecommerce",
    description: "Year-prefixed e-commerce order numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["orderNumber"],
    generate: () => ({ orderNumber: orderNumber() }),
  },
  {
    slug: "cart-data",
    name: "Cart Data (JSON)",
    category: "ecommerce",
    description: "Shopping cart payload with line items, quantities, and totals.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const items = Array.from({ length: randInt(1, 5) }, () => {
        const price = randFloat(4.99, 299.99, 2);
        const qty = randInt(1, 4);
        return {
          productName: productName(),
          sku: sku(),
          unitPrice: price,
          quantity: qty,
          lineTotal: Number((price * qty).toFixed(2)),
        };
      });
      const subtotal = Number(items.reduce((s, i) => s + i.lineTotal, 0).toFixed(2));
      return {
        cartId: uuidv4(),
        userId: uuidv4(),
        items,
        subtotal,
        tax: Number((subtotal * 0.08).toFixed(2)),
        total: Number((subtotal * 1.08).toFixed(2)),
        currency: pick(CURRENCIES),
      };
    },
  },
  {
    slug: "wishlist-data",
    name: "Wishlist Data (JSON)",
    category: "ecommerce",
    description: "Wishlist payload with saved products for a user.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => ({
      wishlistId: uuidv4(),
      userId: uuidv4(),
      items: Array.from({ length: randInt(2, 6) }, () => ({
        productName: productName(),
        sku: sku(),
        addedOn: `2026-0${randInt(1, 8)}-${String(randInt(1, 28)).padStart(2, "0")}`,
        priceAtAdd: randFloat(4.99, 499.99, 2),
      })),
    }),
  },
  {
    slug: "review-data",
    name: "Review Data Generator",
    category: "ecommerce",
    description: "Product reviews with rating, title, and reviewer.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["reviewer", "rating", "title", "comment", "verifiedPurchase"],
    generate: () => {
      const reviewer = buildPerson("US").fullName;
      const rating = randInt(1, 5);
      const positive = ["Exceeded my expectations!", "Great value for money.", "Works exactly as described.", "Fast shipping, well packaged."];
      const negative = ["Not as described.", "Stopped working after a week.", "Packaging was damaged on arrival.", "Overpriced for the quality."];
      return {
        reviewer,
        rating,
        title: rating >= 4 ? pick(["Excellent!", "Highly recommend", "Love it"]) : pick(["Disappointed", "Could be better", "Not great"]),
        comment: rating >= 4 ? pick(positive) : pick(negative),
        verifiedPurchase: pick([true, false]),
      };
    },
  },
];
