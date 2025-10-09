export const SchemaTypes = [
  'string',
  'number',
  'boolean',
  'array',
  'object'
] as const
export type SchemaType = typeof SchemaTypes[number]

export interface BaseSchema {
  selector?: string
  type?: SchemaType
  attribute?: string
  multiple?: boolean
  required?: boolean
  default?: any
  transform?: (value: any, element?: any) => any
}

export interface StringSchema extends BaseSchema {
  type?: 'string'
}

export interface NumberSchema extends BaseSchema {
  type?: 'number'
}

export interface BooleanSchema extends BaseSchema {
  type?: 'boolean'
}

export interface ArraySchema extends BaseSchema {
  type: 'array'
  items?: Schema
}

export interface ObjectSchema extends BaseSchema {
  type: 'object'
  properties?: Record<string, Schema>
}

export type Schema =
  | BaseSchema
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ArraySchema
  | ObjectSchema

export interface ExtractionResult {
  [key: string]: any
}

export interface ElementData {
  text: string
  html: string
  attributes: Record<string, any>
}

// Unist 相关的类型
export interface UnistNode {
  type: string
  tagName?: string
  properties?: Record<string, any>
  children?: UnistNode[]
  value?: string
  position?: any
}
