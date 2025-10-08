// types.ts
export interface ReadabilityResult {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
}

export interface ExtractionRuleBase {
  xpath: string;
  description?: string;
  required?: boolean;
}

export interface StringExtractionRule extends ExtractionRuleBase {
  type: 'string';
  transform?: (value: string | null) => string | null;
}

export interface NumberExtractionRule extends ExtractionRuleBase {
  type: 'number';
  transform?: (value: number | null) => number | null;
}

export interface BooleanExtractionRule extends ExtractionRuleBase {
  type: 'boolean';
  transform?: (value: boolean | null) => boolean | null;
}

export interface DateExtractionRule extends ExtractionRuleBase {
  type: 'date';
  format?: string;
  transform?: (value: Date | null) => Date | string | null;
}

export interface ArrayExtractionRule extends ExtractionRuleBase {
  type: 'array';
  elementType: 'string' | 'number' | 'boolean' | 'object';
  properties?: Record<string, ExtractionRule>;
  transform?: (values: any[]) => any[];
}

export interface ObjectExtractionRule extends ExtractionRuleBase {
  type: 'object';
  properties: Record<string, ExtractionRule>;
}

export type ExtractionRule =
  | StringExtractionRule
  | NumberExtractionRule
  | BooleanExtractionRule
  | DateExtractionRule
  | ArrayExtractionRule
  | ObjectExtractionRule;

export interface ExtractionRules {
  [key: string]: ExtractionRule;
}

export interface TextContentResult {
  title?: string|null;
  content: string;
  excerpt?: string|null;
  byline?: string|null;
  length?: number|null;
  siteName?: string|null;
  lang?: string|null;
  success: boolean;
  error?: string;
}

export interface StructuredContentResult {
  [key: string]: any;
  success: boolean;
  errors?: string[];
}

export interface ProcessOptions {
  contentType?: 'text' | 'structured' | 'auto';
  extractionRules?: ExtractionRules;
  readabilityOptions?: any;
  turndownOptions?: any;
  timeout?: number;
  url?: string;
}

export interface ProcessResult {
  text?: TextContentResult;
  structured?: StructuredContentResult;
  processingTime: number;
}

export interface XPathResult {
  booleanValue?: boolean;
  numberValue?: number;
  stringValue?: string;
  singleNodeValue?: Node | null;
  snapshotLength?: number;
  snapshotItem?: (index: number) => Node | null;
}
