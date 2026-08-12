import {
  Percent,
  IndianRupee,
  Tag,
  TrendingUp,
  Wallet,
  Receipt,
  HandCoins,
  Landmark,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome, SummaryItem } from "../types";
import { formatCurrency, formatPercent, round2 } from "../format";

function money(v: number) {
  return formatCurrency(round2(v));
}
function pct(v: number) {
  return formatPercent(round2(v));
}

/* ---------------------------------- GST ---------------------------------- */

function buildGstCalculator(mode: "inclusive" | "exclusive"): CalculatorDef {
  const isInclusive = mode === "inclusive";
  return {
    id: `gst-${mode}`,
    slug: `gst-${mode}-calculator`,
    name: `GST ${isInclusive ? "Inclusive" : "Exclusive"} Calculator`,
    shortName: `GST ${isInclusive ? "Inclusive" : "Exclusive"}`,
    category: "financial",
    description: isInclusive
      ? "Extract taxable value & GST from a price that already includes tax."
      : "Add GST on top of a tax-free price to get the final customer price.",
    icon: Receipt,
    keywords: ["gst", "tax", "vat", "cgst", "sgst", "igst"],
    formulaExplanation: isInclusive
      ? "Taxable Value = Price after Discount ÷ (1 + GST% / 100). GST Amount = Price after Discount − Taxable Value. Customer Pays = Price after Discount (tax already included)."
      : "Taxable Value = Price after Discount (tax not yet applied). GST Amount = Taxable Value × GST% / 100. Customer Pays = Taxable Value + GST Amount.",
    fields: [
      {
        id: "unitPrice",
        label: "Unit Price",
        kind: "number",
        prefix: "₹",
        allowDecimal: true,
        allowZero: false,
        placeholder: "600",
        helpText: "Price per unit / course fee / item price",
      },
      {
        id: "quantity",
        label: "Quantity",
        kind: "number",
        allowDecimal: false,
        allowZero: false,
        defaultValue: "1",
        placeholder: "1",
      },
      {
        id: "discountPercent",
        label: "Discount %",
        kind: "number",
        suffix: "%",
        allowDecimal: true,
        allowZero: true,
        optional: true,
        max: 100,
        defaultValue: "0",
        placeholder: "5",
      },
      {
        id: "gstPercent",
        label: "GST %",
        kind: "number",
        suffix: "%",
        allowDecimal: true,
        allowZero: true,
        max: 100,
        defaultValue: "18",
        placeholder: "18",
      },
      {
        id: "costPrice",
        label: "Actual / Cost Price (optional)",
        kind: "number",
        prefix: "₹",
        allowDecimal: true,
        allowZero: true,
        optional: true,
        defaultValue: "0",
        placeholder: "For profit calculation",
        helpText: "What this item cost you — leave 0 to skip profit metrics",
      },
    ],
    compute: (v): CalculatorOutcome => {
      const subtotal = v.unitPrice * v.quantity;
      const discountAmount = subtotal * (v.discountPercent / 100);
      const priceAfterDiscount = subtotal - discountAmount;

      let taxableValue: number;
      let gstAmount: number;
      let customerPays: number;

      if (isInclusive) {
        taxableValue = priceAfterDiscount / (1 + v.gstPercent / 100);
        gstAmount = priceAfterDiscount - taxableValue;
        customerPays = priceAfterDiscount;
      } else {
        taxableValue = priceAfterDiscount;
        gstAmount = priceAfterDiscount * (v.gstPercent / 100);
        customerPays = priceAfterDiscount + gstAmount;
      }

      const costTotal = v.costPrice * v.quantity;
      const profit = customerPays - costTotal;
      const profitExcludingGst = taxableValue - costTotal;
      const profitPercent = costTotal > 0 ? (profitExcludingGst / costTotal) * 100 : 0;

      const steps = [
        { label: "Subtotal", formula: "Unit Price × Quantity", value: money(subtotal) },
        {
          label: "Discount Amount",
          formula: "Subtotal × Discount% / 100",
          value: money(discountAmount),
        },
        {
          label: "Price after Discount",
          formula: "Subtotal − Discount Amount",
          value: money(priceAfterDiscount),
        },
        {
          label: "Taxable Value",
          formula: isInclusive
            ? "Price after Discount ÷ (1 + GST% / 100)"
            : "Price after Discount",
          value: money(taxableValue),
        },
        {
          label: "GST Amount",
          formula: isInclusive
            ? "Price after Discount − Taxable Value"
            : "Taxable Value × GST% / 100",
          value: money(gstAmount),
        },
        {
          label: "Customer Pays",
          formula: isInclusive ? "Price after Discount" : "Taxable Value + GST Amount",
          value: money(customerPays),
        },
      ];

      const summary: SummaryItem[] = [
        { label: "Subtotal", value: money(subtotal) },
        { label: "Discount Amount", value: money(discountAmount) },
        { label: "Taxable Value", value: money(taxableValue) },
        { label: "GST Amount", value: money(gstAmount) },
        { label: "Customer Pays", value: money(customerPays), highlight: true },
      ];

      if (v.costPrice > 0) {
        summary.push(
          { label: "Profit", value: money(profit), tone: profit >= 0 ? "positive" : "negative" },
          {
            label: "Profit excluding GST",
            value: money(profitExcludingGst),
            tone: profitExcludingGst >= 0 ? "positive" : "negative",
          },
          { label: "Profit %", value: pct(profitPercent), tone: profitPercent >= 0 ? "positive" : "negative" }
        );
      }

      return { steps, summary };
    },
  };
}

/* -------------------------------- Discount -------------------------------- */

const discountCalculator: CalculatorDef = {
  id: "discount-calculator",
  slug: "discount-calculator",
  name: "Discount Calculator",
  category: "financial",
  description: "Combine percentage and flat discounts to find the final payable amount.",
  icon: Tag,
  keywords: ["discount", "coupon", "sale", "offer"],
  formulaExplanation:
    "Total Discount = (Price × Qty × Discount%) + Flat Discount. Total = (Price × Qty) − Total Discount.",
  fields: [
    { id: "price", label: "Price", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    {
      id: "quantity",
      label: "Quantity",
      kind: "number",
      allowDecimal: false,
      allowZero: false,
      defaultValue: "1",
    },
    {
      id: "discountPercent",
      label: "Discount %",
      kind: "number",
      suffix: "%",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      max: 100,
      defaultValue: "0",
    },
    {
      id: "flatDiscount",
      label: "Flat Discount",
      kind: "number",
      prefix: "₹",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      defaultValue: "0",
    },
  ],
  compute: (v): CalculatorOutcome => {
    const subtotal = v.price * v.quantity;
    const discountFromPercent = subtotal * (v.discountPercent / 100);
    const totalDiscount = Math.min(discountFromPercent + v.flatDiscount, subtotal);
    const total = subtotal - totalDiscount;
    const percentageSaved = subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0;

    return {
      steps: [
        { label: "Subtotal", formula: "Price × Quantity", value: money(subtotal) },
        {
          label: "Discount from %",
          formula: "Subtotal × Discount% / 100",
          value: money(discountFromPercent),
        },
        { label: "Flat Discount", formula: "Flat Discount", value: money(v.flatDiscount) },
        {
          label: "Total Discount",
          formula: "Discount from % + Flat Discount",
          value: money(totalDiscount),
        },
        { label: "Total", formula: "Subtotal − Total Discount", value: money(total) },
      ],
      summary: [
        { label: "Discount", value: money(totalDiscount) },
        { label: "Total", value: money(total), highlight: true },
        { label: "Savings", value: money(totalDiscount), tone: "positive" },
        { label: "Percentage Saved", value: pct(percentageSaved) },
      ],
    };
  },
};

/* --------------------------------- Profit ---------------------------------- */

const profitCalculator: CalculatorDef = {
  id: "profit-calculator",
  slug: "profit-calculator",
  name: "Profit Calculator",
  category: "financial",
  description: "Work out net profit, gross profit and taxable profit on a sale.",
  icon: TrendingUp,
  keywords: ["profit", "margin", "loss"],
  formulaExplanation:
    "Gross Profit = Price after Discount − Actual Price. Taxable Profit (Net Profit) = Taxable Value − Actual Price.",
  fields: [
    { id: "actualPrice", label: "Actual Price (Cost)", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    { id: "sellingPrice", label: "Selling Price", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    {
      id: "discountPercent",
      label: "Discount %",
      kind: "number",
      suffix: "%",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      max: 100,
      defaultValue: "0",
    },
    {
      id: "gstPercent",
      label: "GST %",
      kind: "number",
      suffix: "%",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      max: 100,
      defaultValue: "0",
      helpText: "Assumes Selling Price is GST-inclusive",
    },
  ],
  compute: (v): CalculatorOutcome => {
    const discountAmount = v.sellingPrice * (v.discountPercent / 100);
    const priceAfterDiscount = v.sellingPrice - discountAmount;
    const taxableValue = priceAfterDiscount / (1 + v.gstPercent / 100);
    const gstAmount = priceAfterDiscount - taxableValue;
    const grossProfit = priceAfterDiscount - v.actualPrice;
    const taxableProfit = taxableValue - v.actualPrice;
    const netProfit = taxableProfit;
    const profitPercent = v.actualPrice > 0 ? (netProfit / v.actualPrice) * 100 : 0;

    return {
      steps: [
        { label: "Discount Amount", formula: "Selling Price × Discount% / 100", value: money(discountAmount) },
        { label: "Price after Discount", formula: "Selling Price − Discount Amount", value: money(priceAfterDiscount) },
        { label: "Taxable Value", formula: "Price after Discount ÷ (1 + GST% / 100)", value: money(taxableValue) },
        { label: "GST Amount", formula: "Price after Discount − Taxable Value", value: money(gstAmount) },
        { label: "Gross Profit", formula: "Price after Discount − Actual Price", value: money(grossProfit) },
        { label: "Taxable Profit", formula: "Taxable Value − Actual Price", value: money(taxableProfit) },
      ],
      summary: [
        { label: "Net Profit", value: money(netProfit), highlight: true, tone: netProfit >= 0 ? "positive" : "negative" },
        { label: "Profit %", value: pct(profitPercent), tone: profitPercent >= 0 ? "positive" : "negative" },
        { label: "Taxable Profit", value: money(taxableProfit) },
        { label: "Gross Profit", value: money(grossProfit) },
      ],
    };
  },
};

/* ----------------------------- Selling Price ------------------------------ */

const sellingPriceCalculator: CalculatorDef = {
  id: "selling-price-calculator",
  slug: "selling-price-calculator",
  name: "Selling Price Calculator",
  category: "financial",
  description: "Find the price to charge for a target profit margin, with optional GST.",
  icon: IndianRupee,
  keywords: ["selling price", "markup", "pricing"],
  formulaExplanation:
    "Selling Price (excl. GST) = Cost Price + (Cost Price × Profit% / 100). Final Price = Selling Price + GST Amount.",
  fields: [
    { id: "costPrice", label: "Cost Price", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    { id: "profitPercent", label: "Desired Profit %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true },
    {
      id: "gstPercent",
      label: "GST % (optional)",
      kind: "number",
      suffix: "%",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      defaultValue: "0",
      max: 100,
    },
  ],
  compute: (v): CalculatorOutcome => {
    const profitAmount = v.costPrice * (v.profitPercent / 100);
    const sellingPriceExclGst = v.costPrice + profitAmount;
    const gstAmount = sellingPriceExclGst * (v.gstPercent / 100);
    const finalPrice = sellingPriceExclGst + gstAmount;

    return {
      steps: [
        { label: "Profit Amount", formula: "Cost Price × Profit% / 100", value: money(profitAmount) },
        { label: "Selling Price (excl. GST)", formula: "Cost Price + Profit Amount", value: money(sellingPriceExclGst) },
        { label: "GST Amount", formula: "Selling Price × GST% / 100", value: money(gstAmount) },
        { label: "Final Selling Price", formula: "Selling Price + GST Amount", value: money(finalPrice) },
      ],
      summary: [
        { label: "Profit Amount", value: money(profitAmount) },
        { label: "Selling Price (excl. GST)", value: money(sellingPriceExclGst) },
        { label: "GST Amount", value: money(gstAmount) },
        { label: "Final Selling Price", value: money(finalPrice), highlight: true },
      ],
    };
  },
};

/* ------------------------------- Cost Price -------------------------------- */

const costPriceCalculator: CalculatorDef = {
  id: "cost-price-calculator",
  slug: "cost-price-calculator",
  name: "Cost Price Calculator",
  category: "financial",
  description: "Reverse-calculate the cost price from a selling price and profit/loss %.",
  icon: Wallet,
  keywords: ["cost price", "reverse margin", "loss"],
  formulaExplanation:
    "Cost Price = Selling Price ÷ (1 + Profit% / 100). A negative Profit% is treated as a loss.",
  fields: [
    { id: "sellingPrice", label: "Selling Price", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    {
      id: "profitPercent",
      label: "Profit % (negative for loss)",
      kind: "number",
      suffix: "%",
      allowDecimal: true,
      allowZero: true,
      allowNegative: true,
      min: -99,
    },
  ],
  compute: (v): CalculatorOutcome => {
    const costPrice = v.sellingPrice / (1 + v.profitPercent / 100);
    const profitAmount = v.sellingPrice - costPrice;

    return {
      steps: [
        { label: "Cost Price", formula: "Selling Price ÷ (1 + Profit% / 100)", value: money(costPrice) },
        { label: "Profit / Loss Amount", formula: "Selling Price − Cost Price", value: money(profitAmount) },
      ],
      summary: [
        { label: "Cost Price", value: money(costPrice), highlight: true },
        {
          label: v.profitPercent >= 0 ? "Profit Amount" : "Loss Amount",
          value: money(Math.abs(profitAmount)),
          tone: v.profitPercent >= 0 ? "positive" : "negative",
        },
      ],
    };
  },
};

/* ------------------------------- Commission -------------------------------- */

const commissionCalculator: CalculatorDef = {
  id: "commission-calculator",
  slug: "commission-calculator",
  name: "Commission Calculator",
  category: "financial",
  description: "Calculate commission earned on a sale and the resulting net payout.",
  icon: HandCoins,
  keywords: ["commission", "brokerage", "sales"],
  formulaExplanation: "Commission = Sale Amount × Commission% / 100. Net Amount = Sale Amount − Commission.",
  fields: [
    { id: "saleAmount", label: "Sale Amount", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    { id: "commissionPercent", label: "Commission %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true, max: 100 },
  ],
  compute: (v): CalculatorOutcome => {
    const commissionAmount = v.saleAmount * (v.commissionPercent / 100);
    const netAmount = v.saleAmount - commissionAmount;

    return {
      steps: [
        { label: "Commission Amount", formula: "Sale Amount × Commission% / 100", value: money(commissionAmount) },
        { label: "Net Amount", formula: "Sale Amount − Commission Amount", value: money(netAmount) },
      ],
      summary: [
        { label: "Commission Amount", value: money(commissionAmount) },
        { label: "Net Amount", value: money(netAmount), highlight: true },
      ],
    };
  },
};

/* ----------------------------- Taxable Value ------------------------------- */

const taxableValueCalculator: CalculatorDef = {
  id: "taxable-value-calculator",
  slug: "taxable-value-calculator",
  name: "Taxable Value Calculator",
  category: "financial",
  description: "Back out the taxable value and GST amount from a GST-inclusive total.",
  icon: Landmark,
  keywords: ["taxable value", "gst", "reverse tax"],
  formulaExplanation: "Taxable Value = Total Amount ÷ (1 + GST% / 100). GST Amount = Total Amount − Taxable Value.",
  fields: [
    { id: "totalAmount", label: "Total Amount (incl. GST)", kind: "number", prefix: "₹", allowDecimal: true, allowZero: false },
    { id: "gstPercent", label: "GST %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true, defaultValue: "18", max: 100 },
  ],
  compute: (v): CalculatorOutcome => {
    const taxableValue = v.totalAmount / (1 + v.gstPercent / 100);
    const gstAmount = v.totalAmount - taxableValue;

    return {
      steps: [
        { label: "Taxable Value", formula: "Total Amount ÷ (1 + GST% / 100)", value: money(taxableValue) },
        { label: "GST Amount", formula: "Total Amount − Taxable Value", value: money(gstAmount) },
      ],
      summary: [
        { label: "Taxable Value", value: money(taxableValue), highlight: true },
        { label: "GST Amount", value: money(gstAmount) },
      ],
    };
  },
};

/* ------------------------------ Percentage --------------------------------- */

const percentageCalculator: CalculatorDef = {
  id: "percentage-calculator",
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "financial",
  description: "Find what percentage A is of B, plus the increase/decrease between them.",
  icon: Percent,
  keywords: ["percentage", "percent change", "increase", "decrease"],
  formulaExplanation:
    "Percentage = (A ÷ B) × 100. Difference = B − A. % Change = (Difference ÷ |A|) × 100.",
  fields: [
    { id: "valueA", label: "A", kind: "number", allowDecimal: true, allowZero: true, allowNegative: true },
    { id: "valueB", label: "B", kind: "number", allowDecimal: true, allowZero: true, allowNegative: true },
  ],
  compute: (v): CalculatorOutcome => {
    const percentage = v.valueB !== 0 ? (v.valueA / v.valueB) * 100 : 0;
    const difference = v.valueB - v.valueA;
    const change = v.valueA !== 0 ? (difference / Math.abs(v.valueA)) * 100 : 0;
    const isIncrease = difference >= 0;

    return {
      steps: [
        { label: "Percentage", formula: "(A ÷ B) × 100", value: pct(percentage) },
        { label: "Difference", formula: "B − A", value: money(difference) },
        {
          label: isIncrease ? "% Increase" : "% Decrease",
          formula: "(Difference ÷ |A|) × 100",
          value: pct(Math.abs(change)),
        },
      ],
      summary: [
        { label: "A as % of B", value: pct(percentage), highlight: true },
        { label: "Difference", value: money(difference) },
        {
          label: isIncrease ? "Increase" : "Decrease",
          value: pct(Math.abs(change)),
          tone: isIncrease ? "positive" : "negative",
        },
      ],
    };
  },
};

export const financialCalculators: CalculatorDef[] = [
  buildGstCalculator("inclusive"),
  buildGstCalculator("exclusive"),
  discountCalculator,
  profitCalculator,
  sellingPriceCalculator,
  costPriceCalculator,
  commissionCalculator,
  taxableValueCalculator,
  percentageCalculator,
];
