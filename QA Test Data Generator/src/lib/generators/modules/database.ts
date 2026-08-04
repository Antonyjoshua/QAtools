import type { GeneratorModule } from "../types";
import { buildPerson } from "./personal";
import { productName, sku } from "./ecommerce-helpers";
import { pick, randInt, randFloat, formatDate, randomDate } from "../random";
import { DEPARTMENTS, JOB_TITLES } from "../data";
import { quoteIdent, sqlLiteral, type SqlDialect as Dialect } from "../sql-utils";

interface ColumnValue {
  name: string;
  value: unknown;
}

interface RowSchema {
  table: string;
  columns: (id: number) => ColumnValue[];
}

const SCHEMAS: Record<string, RowSchema> = {
  users: {
    table: "users",
    columns: (id) => {
      const p = buildPerson("US");
      return [
        { name: "id", value: id },
        { name: "full_name", value: p.fullName },
        { name: "email", value: p.email },
        { name: "mobile", value: p.mobileNumber },
        { name: "city", value: p.city },
        { name: "is_active", value: pick([true, false]) },
        { name: "created_at", value: `${p.dateOfBirth} 00:00:00` },
      ];
    },
  },
  employees: {
    table: "employees",
    columns: (id) => {
      const p = buildPerson("US");
      return [
        { name: "id", value: id },
        { name: "full_name", value: p.fullName },
        { name: "department", value: pick(DEPARTMENTS) },
        { name: "job_title", value: pick(JOB_TITLES) },
        { name: "salary", value: randInt(45000, 220000) },
        { name: "hire_date", value: formatDate(randomDate(2015, 2026)) },
      ];
    },
  },
  products: {
    table: "products",
    columns: (id) => [
      { name: "id", value: id },
      { name: "name", value: productName() },
      { name: "sku", value: sku() },
      { name: "price", value: randFloat(4.99, 999.99, 2) },
      { name: "stock", value: randInt(0, 500) },
      { name: "category", value: pick(["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books"]) },
    ],
  },
  orders: {
    table: "orders",
    columns: (id) => {
      const p = buildPerson("US");
      return [
        { name: "id", value: id },
        { name: "order_number", value: `ORD-${1000 + id}` },
        { name: "customer_name", value: p.fullName },
        { name: "total", value: randFloat(9.99, 999.99, 2) },
        { name: "status", value: pick(["pending", "paid", "shipped", "delivered", "cancelled"]) },
        { name: "created_at", value: `${formatDate(randomDate(2023, 2026))} 12:00:00` },
      ];
    },
  },
};

const tableOptions = Object.keys(SCHEMAS).map((k) => ({ label: k, value: k }));
const dialectOptions = [
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgres" },
  { label: "SQL Server", value: "mssql" },
];

function buildInsert(dialect: Dialect, table: string, cols: ColumnValue[]): string {
  const names = cols.map((c) => quoteIdent(dialect, c.name)).join(", ");
  const values = cols.map((c) => sqlLiteral(c.value)).join(", ");
  return `INSERT INTO ${quoteIdent(dialect, table)} (${names}) VALUES (${values});`;
}

function buildUpdate(dialect: Dialect, table: string, cols: ColumnValue[]): string {
  const idCol = cols[0];
  const rest = cols.slice(1);
  const setClauses = rest
    .slice(0, Math.max(1, Math.ceil(rest.length / 2)))
    .map((c) => `${quoteIdent(dialect, c.name)} = ${sqlLiteral(c.value)}`)
    .join(", ");
  return `UPDATE ${quoteIdent(dialect, table)} SET ${setClauses} WHERE ${quoteIdent(dialect, idCol.name)} = ${sqlLiteral(idCol.value)};`;
}

function buildDelete(dialect: Dialect, table: string, cols: ColumnValue[]): string {
  const idCol = cols[0];
  return `DELETE FROM ${quoteIdent(dialect, table)} WHERE ${quoteIdent(dialect, idCol.name)} = ${sqlLiteral(idCol.value)};`;
}

function buildSelect(dialect: Dialect, table: string, cols: ColumnValue[]): string {
  const idCol = cols[0];
  const limitClause = dialect === "mssql" ? "" : " LIMIT 10";
  const topClause = dialect === "mssql" ? "TOP 10 " : "";
  return `SELECT ${topClause}* FROM ${quoteIdent(dialect, table)} WHERE ${quoteIdent(dialect, idCol.name)} >= ${sqlLiteral(idCol.value)}${limitClause};`;
}

const commonOptions = [
  { key: "table", label: "Table", type: "select" as const, options: tableOptions, default: "users" },
  { key: "dialect", label: "SQL Dialect", type: "select" as const, options: dialectOptions, default: "mysql" },
];

export const databaseGenerators: GeneratorModule[] = [
  {
    slug: "sql-insert",
    name: "SQL INSERT Statements",
    category: "database",
    description: "Generate INSERT statements for seeding a table with realistic rows.",
    outputKind: "sql",
    language: "sql",
    supportsBulk: true,
    defaultCount: 20,
    options: commonOptions,
    generate: (ctx) => {
      const table = String(ctx.options.table ?? "users");
      const dialect = String(ctx.options.dialect ?? "mysql") as Dialect;
      const schema = SCHEMAS[table] ?? SCHEMAS.users;
      const cols = schema.columns(ctx.index + 1);
      return buildInsert(dialect, schema.table, cols);
    },
  },
  {
    slug: "sql-update",
    name: "SQL UPDATE Statements",
    category: "database",
    description: "Generate UPDATE statements against synthetic primary keys.",
    outputKind: "sql",
    language: "sql",
    supportsBulk: true,
    defaultCount: 20,
    options: commonOptions,
    generate: (ctx) => {
      const table = String(ctx.options.table ?? "users");
      const dialect = String(ctx.options.dialect ?? "mysql") as Dialect;
      const schema = SCHEMAS[table] ?? SCHEMAS.users;
      const cols = schema.columns(ctx.index + 1);
      return buildUpdate(dialect, schema.table, cols);
    },
  },
  {
    slug: "sql-delete",
    name: "SQL DELETE Statements",
    category: "database",
    description: "Generate DELETE statements against synthetic primary keys.",
    outputKind: "sql",
    language: "sql",
    supportsBulk: true,
    defaultCount: 20,
    options: commonOptions,
    generate: (ctx) => {
      const table = String(ctx.options.table ?? "users");
      const dialect = String(ctx.options.dialect ?? "mysql") as Dialect;
      const schema = SCHEMAS[table] ?? SCHEMAS.users;
      const cols = schema.columns(ctx.index + 1);
      return buildDelete(dialect, schema.table, cols);
    },
  },
  {
    slug: "sql-select",
    name: "SQL SELECT Test Datasets",
    category: "database",
    description: "Generate SELECT queries with realistic WHERE predicates for test datasets.",
    outputKind: "sql",
    language: "sql",
    supportsBulk: true,
    defaultCount: 20,
    options: commonOptions,
    generate: (ctx) => {
      const table = String(ctx.options.table ?? "users");
      const dialect = String(ctx.options.dialect ?? "mysql") as Dialect;
      const schema = SCHEMAS[table] ?? SCHEMAS.users;
      const cols = schema.columns(ctx.index + 1);
      return buildSelect(dialect, schema.table, cols);
    },
  },
  {
    slug: "sql-table-rows",
    name: "Table Row Dataset (for CSV/Excel export)",
    category: "database",
    description: "Generate flat row data for a chosen schema — export as CSV, Excel, JSON, XML.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 50,
    options: [{ key: "table", label: "Table", type: "select", options: tableOptions, default: "users" }],
    generate: (ctx) => {
      const table = String(ctx.options.table ?? "users");
      const schema = SCHEMAS[table] ?? SCHEMAS.users;
      const cols = schema.columns(ctx.index + 1);
      return Object.fromEntries(cols.map((c) => [c.name, c.value]));
    },
  },
];
