export type SqlDialect = "mysql" | "postgres" | "mssql";

export function quoteIdent(dialect: SqlDialect, name: string): string {
  if (dialect === "mysql") return `\`${name}\``;
  if (dialect === "mssql") return `[${name}]`;
  return `"${name}"`;
}

export function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function rowsToInsertStatements(rows: Record<string, unknown>[], table: string, dialect: SqlDialect = "mysql"): string {
  return rows
    .map((row) => {
      const keys = Object.keys(row);
      const names = keys.map((k) => quoteIdent(dialect, k)).join(", ");
      const values = keys.map((k) => sqlLiteral(row[k])).join(", ");
      return `INSERT INTO ${quoteIdent(dialect, table)} (${names}) VALUES (${values});`;
    })
    .join("\n");
}
