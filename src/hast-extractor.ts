// extractor.ts
import { Processor, unified } from 'unified'
import rehypeParse, { Options as RehypeParseOptions} from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
// import { select, selectAll } from 'unist-util-select'
import { select, selectAll } from 'hast-util-select'
import { type Node, type Element } from 'hast';
import { toCamelCase } from '@isdk/util';
import type { ArraySchema, BooleanSchema, ExtractionResult, NumberSchema, ObjectSchema, Schema, SchemaType, StringSchema } from './extractor-types';

export class HastHTMLExtractor {
  private processor: Processor<any>

  constructor(options?: {rehypeParseOption: RehypeParseOptions}) {
    this.processor = unified().use(rehypeParse, { fragment: true, ...options?.rehypeParseOption })
  }

  extract(html: string, schema: Schema): ExtractionResult {
    const tree = this.processor.parse(html)
    return this.processSchema(tree, schema)
  }

  private processSchema(node: Node, schema: Schema): any {
    if (!schema || typeof schema !== 'object') {
      return null
    }

    const type = schema.type || this.inferSchemaType(schema)

    try {
      switch (type) {
        case 'string':
          return this.extractString(node, schema as any)
        case 'number':
          return this.extractNumber(node, schema as any)
        case 'boolean':
          return this.extractBoolean(node, schema as any)
        case 'array':
          return this.extractArray(node, schema as any)
        case 'object':
          return this.extractObject(node, schema as any)
        default:
          return this.extractAuto(node, schema)
      }
    } catch (error) {
      console.warn(`Extraction error:`, error)
      if (schema.required) {
        throw new Error(`Required field extraction failed: ${error}`)
      }
      return schema.default !== undefined ? schema.default : null
    }
  }

  private extractString(node: Node, schema: StringSchema): string {
    const element = this.selectElement(node, schema) as Element
    if (!element) {
      return this.handleMissingValue(schema)
    }

    let value: string
    if (schema.attribute) {
      const attr = toCamelCase(schema.attribute)
      const attrValue = element.properties?.[attr]
      value = this.parseAttributeValue(attrValue)
    } else {
      value = this.extractText(element)
    }

    value = value.trim()

    if (schema.transform) {
      value = schema.transform(value, element)
    }

    return value
  }

  private parseAttributeValue(attrValue: any): string {
    if (attrValue === null || attrValue === undefined) {
      return ''
    }
    if (Array.isArray(attrValue)) {
      return attrValue.join(' ')
    }
    if (typeof attrValue === 'boolean') {
      return attrValue ? 'true' : 'false'
    }
    return attrValue.toString()
  }

  private extractNumber(node: Node, schema: NumberSchema): number {
    const stringValue = this.extractString(node, { ...schema, type: 'string' })

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    const numberValue = parseFloat(stringValue)
    if (isNaN(numberValue)) {
      return this.handleMissingValue(schema)
    }

    if (schema.transform) {
      return schema.transform(numberValue) as number
    }

    return numberValue
  }

  private extractBoolean(node: Node, schema: BooleanSchema): boolean {
    const stringValue = this.extractString(node, { ...schema, type: 'string' })

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    const truthyValues = ['true', '1', 'yes', 'on', 'enabled', 'active']
    const boolValue = truthyValues.includes(stringValue.toLowerCase())

    if (schema.transform) {
      return schema.transform(boolValue) as boolean
    }

    return boolValue
  }

  private extractArray(node: Node, schema: ArraySchema): any[] {
    const elements = this.selectElements(node, schema)

    if (!elements.length) {
      return this.handleMissingValue(schema)
    }

    let result: any[]
    if (schema.items) {
      result = elements.map(element => this.processSchema(element, schema.items!))
    } else {
      result = elements.map(element => this.extractText(element).trim())
    }

    if (schema.transform) {
      result = schema.transform(result)
    }

    return result
  }

  private extractObject(node: Node, schema: ObjectSchema): Record<string, any> {
    const element = this.selectElement(node, schema)

    if (!element) {
      return this.handleMissingValue(schema)
    }

    let result: Record<string, any>
    if (schema.properties) {
      result = {}
      for (const [key, propertySchema] of Object.entries(schema.properties)) {
        result[key] = this.processSchema(element, propertySchema)
      }
    } else {
      result = {
        text: this.extractText(element).trim(),
        html: this.elementToHTML(element),
        attributes: element.properties
      }
    }

    if (schema.transform) {
      result = schema.transform(result, element) as Record<string, any>
    }

    return result
  }

  private extractAuto(node: Node, schema: Schema): any {
    if (schema.multiple) {
      return this.extractArray(node, { ...schema, type: 'array' } as ArraySchema)
    } else if ((schema as ObjectSchema).properties) {
      return this.extractObject(node, { ...schema, type: 'object' } as ObjectSchema)
    } else {
      return this.extractString(node, { ...schema, type: 'string' } as StringSchema)
    }
  }

  private inferSchemaType(schema: Schema): SchemaType {
    if (schema.multiple) return 'array'
    if ((schema as any).properties) return 'object'
    return 'string'
  }

  private handleMissingValue(schema: Schema): any {
    if (schema.default !== undefined) {
      return schema.default
    }
    if (schema.required) {
      throw new Error(`Required field is missing: ${schema.selector}`)
    }
    return null
  }

  private selectElement(node: Node, schema: Schema): Element | null | undefined {
    if (!schema.selector) return node as Element

    try {
      return select(schema.selector, node as Element)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return null
    }
  }

  private selectElements(node: Node, schema: Schema): Node[] {
    if (!schema.selector) return [node]

    try {
      return selectAll(schema.selector, node as Element)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return []
    }
  }

  private extractText(node: Node): string {
    const unistNode = node as any

    if (unistNode.type === 'text') {
      return unistNode.value || ''
    }

    if (unistNode.children && Array.isArray(unistNode.children)) {
      return unistNode.children
        .map((child: Node) => this.extractText(child))
        .filter(Boolean)
        .join('')
    }

    return ''
  }

  private elementToHTML(element: Node): string {
    try {
      const processor = unified().use(rehypeStringify)
      return processor.stringify(element as any)
    } catch (error) {
      console.warn('HTML serialization error:', error)
      return ''
    }
  }
}
