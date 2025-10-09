export const ExtractionRuleTypes = [
  'string',
  'number',
  'boolean',
  'array',
  'object'
] as const
export type ExtractionRuleType = typeof ExtractionRuleTypes[number]

export interface BaseExtractionRule {
  selector?: string
  type?: ExtractionRuleType
  attribute?: string
  multiple?: boolean
  required?: boolean
  default?: any
  transform?: (value: any, element?: any) => any
}

export interface StringExtractionRule extends BaseExtractionRule {
  type?: 'string'
}

export interface NumberExtractionRule extends BaseExtractionRule {
  type?: 'number'
}

export interface BooleanExtractionRule extends BaseExtractionRule {
  type?: 'boolean'
}

export interface ArrayExtractionRule extends BaseExtractionRule {
  type: 'array'
  items?: ExtractionRule
}

export interface ObjectExtractionRule extends BaseExtractionRule {
  type: 'object'
  properties?: Record<string, ExtractionRule>
}

export type ExtractionRule =
  | BaseExtractionRule
  | StringExtractionRule
  | NumberExtractionRule
  | BooleanExtractionRule
  | ArrayExtractionRule
  | ObjectExtractionRule

export interface ExtractionResult {
  [key: string]: any
}
