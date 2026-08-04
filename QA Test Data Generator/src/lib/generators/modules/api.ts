import type { GeneratorModule } from "../types";
import { buildPerson } from "./personal";
import { pick, randInt, randFloat, uuidv4, digits } from "../random";
import { CURRENCIES, DEPARTMENTS, JOB_TITLES, UNIVERSITIES, DEGREES } from "../data";
import { productName, sku } from "./ecommerce-helpers";

export const apiGenerators: GeneratorModule[] = [
  {
    slug: "api-login",
    name: "Login Payload",
    category: "api",
    description: "POST /login request body with credentials and device metadata.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        email: p.email,
        password: p.password,
        rememberMe: pick([true, false]),
        device: {
          deviceId: uuidv4(),
          platform: pick(["web", "ios", "android"]),
          appVersion: `${randInt(1, 5)}.${randInt(0, 9)}.${randInt(0, 9)}`,
        },
      };
    },
  },
  {
    slug: "api-registration",
    name: "Registration Payload",
    category: "api",
    description: "POST /register request body with profile and address.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        password: p.password,
        confirmPassword: p.password,
        phone: p.mobileNumber,
        dateOfBirth: p.dateOfBirth,
        address: {
          line1: p.address,
          city: p.city,
          state: p.state,
          country: p.country,
          postalCode: p.pinCode,
        },
        acceptedTerms: true,
      };
    },
  },
  {
    slug: "api-employee",
    name: "Employee Payload",
    category: "api",
    description: "Employee record with department, manager, and salary.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      const manager = buildPerson("US");
      return {
        employeeId: `EMP-${digits(6)}`,
        fullName: p.fullName,
        email: p.email,
        department: pick(DEPARTMENTS),
        jobTitle: pick(JOB_TITLES),
        manager: manager.fullName,
        salary: randInt(45000, 220000),
        currency: "USD",
        hireDate: p.dateOfBirth,
        isActive: pick([true, true, true, false]),
      };
    },
  },
  {
    slug: "api-product",
    name: "Product Payload",
    category: "api",
    description: "Product entity with pricing, inventory, and category tags.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => ({
      productId: uuidv4(),
      name: productName(),
      sku: sku(),
      price: randFloat(4.99, 999.99, 2),
      currency: pick(CURRENCIES),
      inStock: pick([true, false]),
      quantity: randInt(0, 500),
      tags: [pick(["new", "sale", "featured"]), pick(["electronics", "fashion", "home"])],
      dimensions: { widthCm: randFloat(2, 60, 1), heightCm: randFloat(2, 60, 1), weightKg: randFloat(0.1, 20, 2) },
    }),
  },
  {
    slug: "api-course",
    name: "Course Payload",
    category: "api",
    description: "Online course entity with modules and instructor.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const instructor = buildPerson("US");
      return {
        courseId: uuidv4(),
        title: `${pick(["Introduction to", "Advanced", "Mastering", "Fundamentals of"])} ${pick(["Test Automation", "React", "SQL", "API Testing", "Cloud Computing", "Data Structures"])}`,
        instructor: instructor.fullName,
        durationHours: randInt(2, 40),
        price: randFloat(0, 199.99, 2),
        rating: randFloat(3.5, 5, 1),
        modules: Array.from({ length: randInt(3, 6) }, (_, i) => ({
          moduleId: i + 1,
          title: `Module ${i + 1}: ${pick(["Getting Started", "Core Concepts", "Hands-on Lab", "Best Practices", "Case Study"])}`,
          durationMinutes: randInt(15, 90),
        })),
      };
    },
  },
  {
    slug: "api-student",
    name: "Student Payload",
    category: "api",
    description: "Student enrollment record with academic details.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        studentId: `STU-${digits(7)}`,
        fullName: p.fullName,
        email: p.email,
        university: pick(UNIVERSITIES),
        degree: pick(DEGREES),
        year: randInt(1, 4),
        gpa: randFloat(2.0, 4.0, 2),
        enrolledCourses: Array.from({ length: randInt(1, 4) }, () => pick(["CS101", "MATH204", "ENG150", "PHY220", "STAT301"])),
      };
    },
  },
  {
    slug: "api-payment",
    name: "Payment Payload",
    category: "api",
    description: "Payment intent request with method and billing details.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        paymentId: uuidv4(),
        amount: randFloat(1, 5000, 2),
        currency: pick(CURRENCIES),
        method: pick(["card", "upi", "netbanking", "wallet", "paypal"]),
        status: pick(["succeeded", "pending", "failed"]),
        billing: { name: p.fullName, email: p.email, address: p.address, country: p.country },
        card: { brand: pick(["visa", "mastercard", "amex"]), last4: digits(4), expMonth: randInt(1, 12), expYear: randInt(2026, 2031) },
      };
    },
  },
  {
    slug: "api-invoice",
    name: "Invoice Payload",
    category: "api",
    description: "Invoice with itemized line items and totals.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      const items = Array.from({ length: randInt(1, 4) }, () => {
        const qty = randInt(1, 5);
        const price = randFloat(10, 500, 2);
        return { description: productName(), quantity: qty, unitPrice: price, amount: Number((qty * price).toFixed(2)) };
      });
      const subtotal = Number(items.reduce((s, i) => s + i.amount, 0).toFixed(2));
      return {
        invoiceNumber: `INV-${new Date().getFullYear()}-${digits(6)}`,
        billTo: { name: p.fullName, company: p.companyName, address: p.address, email: p.email },
        issueDate: p.dateOfBirth,
        dueDate: p.dateOfBirth,
        items,
        subtotal,
        tax: Number((subtotal * 0.1).toFixed(2)),
        total: Number((subtotal * 1.1).toFixed(2)),
        currency: "USD",
        status: pick(["draft", "sent", "paid", "overdue"]),
      };
    },
  },
  {
    slug: "api-order",
    name: "Order Payload",
    category: "api",
    description: "E-commerce order with shipping, items, and payment status.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        orderId: uuidv4(),
        orderNumber: `ORD-${digits(8)}`,
        customer: { name: p.fullName, email: p.email, phone: p.mobileNumber },
        shippingAddress: { line1: p.address, city: p.city, state: p.state, country: p.country, postalCode: p.pinCode },
        items: Array.from({ length: randInt(1, 4) }, () => ({ productName: productName(), sku: sku(), quantity: randInt(1, 3), price: randFloat(9.99, 299.99, 2) })),
        paymentStatus: pick(["paid", "pending", "refunded"]),
        fulfillmentStatus: pick(["unfulfilled", "shipped", "delivered", "cancelled"]),
        createdAt: new Date().toISOString(),
      };
    },
  },
  {
    slug: "api-customer",
    name: "Customer Payload",
    category: "api",
    description: "CRM-style customer entity with contact and lifecycle data.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: () => {
      const p = buildPerson("US");
      return {
        customerId: uuidv4(),
        fullName: p.fullName,
        email: p.email,
        phone: p.mobileNumber,
        company: p.companyName,
        address: { line1: p.address, city: p.city, state: p.state, country: p.country, postalCode: p.pinCode },
        lifetimeValue: randFloat(0, 50000, 2),
        tags: [pick(["vip", "new", "returning"]), pick(["newsletter", "no-newsletter"])],
        createdAt: new Date().toISOString(),
      };
    },
  },
];
