// extractor.ts
import { Processor, unified } from 'unified'
import rehypeParse, { Options as RehypeParseOptions} from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
// import { select, selectAll } from 'unist-util-select'
import { select, selectAll } from 'hast-util-select'
import { toCamelCase } from '@isdk/util';
import type { Node, Element, Text } from 'hast';
import type { ArrayExtractionRule, BooleanExtractionRule, ExtractionResult, NumberExtractionRule, ObjectExtractionRule, ExtractionRule, ExtractionRuleType, StringExtractionRule } from './extractor-types';

export class HastHTMLExtractor {
  private processor: Processor<any>

  constructor(options?: {rehypeParseOption: RehypeParseOptions}) {
    this.processor = unified().use(rehypeParse, { fragment: true, ...options?.rehypeParseOption })
  }

  extract(html: string, schema: ExtractionRule): ExtractionResult {
    const tree = this.processor.parse(html)
    return this.processSchema(tree, schema)
  }

  private processSchema(node: Node, schema: ExtractionRule): any {
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

  private extractString(node: Node, schema: StringExtractionRule): string {
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

    // 在返回前应用转换函数
    if (schema.transform) {
      const transformed = schema.transform(value, element)
      value = transformed !== null && transformed !== undefined ? String(transformed) : ''
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

  private extractNumber(node: Node, schema: NumberExtractionRule): number {
    // 首先提取字符串但不应用转换
    const stringSchema: StringExtractionRule = {
      ...schema,
      type: 'string',
      transform: undefined // 移除转换，因为我们会在数字阶段应用
    }

    let stringValue = this.extractString(node, stringSchema)

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    let numberValue: number

    // 应用数字特定的转换函数
    if (schema.transform) {
      const transformed = schema.transform(stringValue)
      if (typeof transformed === 'number') {
        numberValue = transformed
      } else {
        // 如果转换函数返回非数字，尝试转换
        numberValue = parseFloat(String(transformed))
      }
    } else {
      // 没有转换函数，直接解析
      numberValue = parseFloat(stringValue)
    }

    if (isNaN(numberValue)) {
      return this.handleMissingValue(schema)
    }

    return numberValue
  }

  private extractBoolean(node: Node, schema: BooleanExtractionRule): boolean {
    // 首先提取字符串但不应用转换
    const stringSchema: StringExtractionRule = {
      ...schema,
      type: 'string',
      transform: undefined // 移除转换，因为我们会在布尔阶段应用
    }

    let stringValue = this.extractString(node, stringSchema)

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    let boolValue: boolean

    // 应用布尔特定的转换函数
    if (schema.transform) {
      const transformed = schema.transform(stringValue)
      if (typeof transformed === 'boolean') {
        boolValue = transformed
      } else {
        // 如果转换函数返回非布尔值，使用默认逻辑
        boolValue = this.parseBooleanValue(stringValue)
      }
    } else {
      // 没有转换函数，使用默认逻辑
      boolValue = this.parseBooleanValue(stringValue)
    }

    return boolValue
  }

  /**
   * 解析布尔值
   */
  private parseBooleanValue(value: string): boolean {
    const truthyValues = ['true', '1', 'yes', 'on', 'enabled', 'active']
    return truthyValues.includes(value.toLowerCase())
  }

  private extractArray(node: Node, schema: ArrayExtractionRule): any[] {
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

  private extractObject(node: Node, schema: ObjectExtractionRule): Record<string, any> {
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

  private extractAuto(node: Node, schema: ExtractionRule): any {
    if (schema.multiple) {
      return this.extractArray(node, { ...schema, type: 'array' } as ArrayExtractionRule)
    } else if ((schema as ObjectExtractionRule).properties) {
      return this.extractObject(node, { ...schema, type: 'object' } as ObjectExtractionRule)
    } else {
      return this.extractString(node, { ...schema, type: 'string' } as StringExtractionRule)
    }
  }

  private inferSchemaType(schema: ExtractionRule): ExtractionRuleType {
    if (schema.multiple) return 'array'
    if ((schema as any).properties) return 'object'
    return 'string'
  }

  private handleMissingValue(schema: ExtractionRule): any {
    if (schema.default !== undefined) {
      return schema.default
    }
    if (schema.required) {
      throw new Error(`Required field is missing: ${schema.selector}`)
    }
    return null
  }

  private selectElement(node: Node, schema: ExtractionRule): Element | null | undefined {
    if (!schema.selector) return node as Element

    try {
      return select(schema.selector, node as Element)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return null
    }
  }

  private selectElements(node: Node, schema: ExtractionRule): Node[] {
    if (!schema.selector) return [node]

    try {
      return selectAll(schema.selector, node as Element)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return []
    }
  }

  private extractText(node: Node): string {
    if (node.type === 'text') {
      return (node as Text).value || ''
    }
    const children = (node as Element).children
    if (children && Array.isArray(children)) {
      return children
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
