import { JSDOM } from 'jsdom'
import {
  Schema,
  SchemaType,
  ExtractionResult,
  ArraySchema,
  ObjectSchema
} from './extractor-types'

export class JSDOMHTMLExtractor {
  private dom: JSDOM | null = null

  /**
   * 提取 HTML 内容
   */
  extract(html: string, schema: Schema): ExtractionResult {
    this.dom = new JSDOM(html)
    const document = this.dom.window.document
    return this.processSchema(document, schema)
  }

  /**
   * 批量提取多个 HTML 文档
   */
  extractMultiple(
    htmlDocuments: Array<{ id: string; html: string }>,
    schema: Schema
  ): Record<string, ExtractionResult> {
    const results: Record<string, ExtractionResult> = {}

    for (const doc of htmlDocuments) {
      try {
        results[doc.id] = this.extract(doc.html, schema)
      } catch (error) {
        console.warn(`Failed to extract from document ${doc.id}:`, error)
        results[doc.id] = {}
      }
    }

    return results
  }

  /**
   * 处理 Schema
   */
  private processSchema(context: Element | Document, schema: Schema): any {
    if (!schema || typeof schema !== 'object') {
      return null
    }

    const type = schema.type || this.inferSchemaType(schema)

    try {
      switch (type) {
        case 'string':
          return this.extractString(context, schema)
        case 'number':
          return this.extractNumber(context, schema)
        case 'boolean':
          return this.extractBoolean(context, schema)
        case 'array':
          return this.extractArray(context, schema as any)
        case 'object':
          return this.extractObject(context, schema as any)
        default:
          return this.extractAuto(context, schema)
      }
    } catch (error) {
      console.warn(`Extraction error for selector "${schema.selector}":`, error)
      if (schema.required) {
        throw new Error(`Required field extraction failed: ${error}`)
      }
      return schema.default !== undefined ? schema.default : null
    }
  }

  /**
   * 提取字符串 - 修复版本
   */
  private extractString(context: Element | Document, schema: Schema): string {
    const element = this.selectElement(context, schema)
    if (!element) {
      return this.handleMissingValue(schema)
    }

    let value: string
    if (schema.attribute) {
      value = element.getAttribute(schema.attribute) || ''
    } else {
      value = element.textContent?.trim() || ''
    }

    // 在返回前应用转换函数
    if (schema.transform) {
      // 确保转换函数接收字符串
      const transformed = schema.transform(value, element)
      // 确保转换后仍然是字符串
      value = transformed !== null && transformed !== undefined ? String(transformed) : ''
    }

    return value
  }

  /**
   * 提取数字 - 修复版本
   */
  private extractNumber(context: Element | Document, schema: Schema): number {
    // 首先提取字符串并应用转换
    const stringSchema: Schema = {
      ...schema,
      type: 'string' as SchemaType,
      // 移除数字类型的转换函数，因为会在字符串阶段应用
      transform: undefined
    }

    let stringValue = this.extractString(context, stringSchema)

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    // 应用数字特定的转换（如果有）
    if (schema.transform) {
      // 转换函数应该接收字符串并返回数字
      const transformed = schema.transform(stringValue)
      if (typeof transformed === 'number') {
        return transformed
      }
      // 如果转换函数返回非数字，尝试转换
      stringValue = String(transformed)
    }

    const numberValue = parseFloat(stringValue)
    if (isNaN(numberValue)) {
      return this.handleMissingValue(schema)
    }

    return numberValue
  }

  /**
   * 提取布尔值 - 修复版本
   */
  private extractBoolean(context: Element | Document, schema: Schema): boolean {
    // 首先提取字符串并应用转换
    const stringSchema: Schema = {
      ...schema,
      type: 'string' as SchemaType,
      transform: undefined
    }

    let stringValue = this.extractString(context, stringSchema)

    if (!stringValue) {
      return this.handleMissingValue(schema)
    }

    // 应用布尔特定的转换（如果有）
    if (schema.transform) {
      const transformed = schema.transform(stringValue)
      if (typeof transformed === 'boolean') {
        return transformed
      }
      stringValue = String(transformed)
    }

    const truthyValues = ['true', '1', 'yes', 'on', 'enabled', 'active']
    const boolValue = truthyValues.includes(stringValue.toLowerCase())

    return boolValue
  }

  /**
   * 提取数组
   */
  private extractArray(context: Element | Document, schema: ArraySchema): any[] {
    const elements = this.selectElements(context, schema)

    if (!elements.length) {
      return this.handleMissingValue(schema)
    }

    let result: any[]
    if (schema.items) {
      result = Array.from(elements).map(element => this.processSchema(element, schema.items!))
    } else {
      result = Array.from(elements).map(element => element.textContent?.trim() || '')
    }

    if (schema.transform) {
      result = schema.transform(result)
    }

    return result
  }

  /**
   * 提取对象
   */
  private extractObject(context: Element | Document, schema: ObjectSchema): Record<string, any> {
    const element = this.selectElement(context, schema)

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
      // 构建元素数据对象
      const attributes: Record<string, string> = {}
      for (const attr of Array.from(element.attributes)) {
        attributes[attr.name] = attr.value
      }

      result = {
        text: element.textContent?.trim() || '',
        html: element.outerHTML,
        attributes
      }
    }

    if (schema.transform) {
      result = schema.transform(result, element)
    }

    return result
  }

  /**
   * 自动类型推断提取
   */
  private extractAuto(context: Element | Document, schema: Schema): any {
    if (schema.multiple) {
      return this.extractArray(context, { ...schema, type: 'array' } as any)
    } else if ((schema as any).properties) {
      return this.extractObject(context, { ...schema, type: 'object' } as any)
    } else {
      return this.extractString(context, { ...schema, type: 'string' } as any)
    }
  }

  /**
   * 选择单个元素
   */
  private selectElement(context: Element | Document, schema: Schema): Element | null {
    if (!schema.selector) return context as Element

    try {
      return context.querySelector(schema.selector)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return null
    }
  }

  /**
   * 选择多个元素
   */
  private selectElements(context: Element | Document, schema: Schema): NodeListOf<Element> {
    if (!schema.selector) {
      // 如果没有选择器，返回包含 context 的伪 NodeList
      const fakeNodeList = {
        length: 1,
        item: (index: number) => index === 0 ? context : null,
        [Symbol.iterator]: function* () {
          yield context
        }
      } as any as NodeListOf<Element>
      return fakeNodeList
    }

    try {
      return context.querySelectorAll(schema.selector)
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error)
      return {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () {}
      } as any as NodeListOf<Element>
    }
  }

  /**
   * 推断 Schema 类型
   */
  private inferSchemaType(schema: Schema): SchemaType {
    if (schema.multiple) return 'array'
    if ((schema as any).properties) return 'object'
    return 'string'
  }

  /**
   * 处理缺失值
   */
  private handleMissingValue(schema: Schema): any {
    if (schema.default !== undefined) {
      return schema.default
    }
    if (schema.required) {
      throw new Error(`Required field is missing: ${schema.selector}`)
    }
    return null
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.dom) {
      this.dom.window.close()
      this.dom = null
    }
  }
}
