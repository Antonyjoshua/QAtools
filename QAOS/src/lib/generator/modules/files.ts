import type { GeneratorModule } from "../types";
import { buildPerson } from "./personal";
import { productName, sku } from "./ecommerce-helpers";
import { pick, randInt, randFloat, formatDate, randomDate } from "../random";
import { DEPARTMENTS, JOB_TITLES } from "../data";

export const fileGenerators: GeneratorModule[] = [
  {
    slug: "file-customer-dataset",
    name: "Customer Dataset",
    category: "files",
    description: "Flat customer records — export directly to CSV, Excel, JSON, XML, SQL, or PDF.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 100,
    maxCount: 100000,
    columns: ["fullName", "email", "mobileNumber", "city", "state", "country", "pinCode"],
    generate: () => {
      const p = buildPerson("US");
      return { fullName: p.fullName, email: p.email, mobileNumber: p.mobileNumber, city: p.city, state: p.state, country: p.country, pinCode: p.pinCode };
    },
  },
  {
    slug: "file-employee-dataset",
    name: "Employee Dataset",
    category: "files",
    description: "Flat employee records — export directly to CSV, Excel, JSON, XML, SQL, or PDF.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 100,
    maxCount: 100000,
    columns: ["fullName", "email", "department", "jobTitle", "salary", "hireDate"],
    generate: () => {
      const p = buildPerson("US");
      return { fullName: p.fullName, email: p.email, department: pick(DEPARTMENTS), jobTitle: pick(JOB_TITLES), salary: randInt(45000, 220000), hireDate: formatDate(randomDate(2015, 2026)) };
    },
  },
  {
    slug: "file-product-dataset",
    name: "Product Dataset",
    category: "files",
    description: "Flat product catalog records — export directly to CSV, Excel, JSON, XML, SQL, or PDF.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 100,
    maxCount: 100000,
    columns: ["productName", "sku", "category", "price", "stock"],
    generate: () => ({
      productName: productName(),
      sku: sku(),
      category: pick(["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books"]),
      price: randFloat(4.99, 999.99, 2),
      stock: randInt(0, 500),
    }),
  },
  {
    slug: "file-order-dataset",
    name: "Order Dataset",
    category: "files",
    description: "Flat order records — export directly to CSV, Excel, JSON, XML, SQL, or PDF.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 100,
    maxCount: 100000,
    columns: ["orderNumber", "customerName", "total", "status", "createdAt"],
    generate: (ctx) => {
      const p = buildPerson("US");
      return {
        orderNumber: `ORD-${1000 + ctx.index}`,
        customerName: p.fullName,
        total: randFloat(9.99, 999.99, 2),
        status: pick(["pending", "paid", "shipped", "delivered", "cancelled"]),
        createdAt: formatDate(randomDate(2023, 2026)),
      };
    },
  },
];
