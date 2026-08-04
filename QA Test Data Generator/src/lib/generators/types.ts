export type OutputKind = "table" | "json" | "text" | "sql" | "code";

export type CategoryId =
  | "personal"
  | "indian"
  | "banking"
  | "ecommerce"
  | "api"
  | "database"
  | "files"
  | "automation"
  | "mobile"
  | "security"
  | "devutils"
  | "content"
  | "qa"
  | "faker";

export interface CategoryDef {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  accent: string;
}

export interface SelectOptionDef {
  label: string;
  value: string;
}

export interface GeneratorOptionDef {
  key: string;
  label: string;
  type: "select" | "text" | "number" | "boolean";
  options?: SelectOptionDef[];
  default?: string | number | boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  helpText?: string;
}

export type OptionValues = Record<string, string | number | boolean>;

export interface GeneratorContext {
  options: OptionValues;
  index: number;
  count: number;
}

export interface GeneratorModule {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  tags?: string[];
  outputKind: OutputKind;
  supportsBulk?: boolean;
  defaultCount?: number;
  maxCount?: number;
  options?: GeneratorOptionDef[];
  columns?: string[];
  language?: string;
  note?: string;
  generate: (ctx: GeneratorContext) => Record<string, unknown> | string;
}
