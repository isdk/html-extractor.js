import { Processor, unified } from 'unified';
import rehypeParse, { Options as RehypeParseOptions } from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { select, selectAll } from 'hast-util-select';
import { toCamelCase } from '@isdk/util';
import type { Node, Element, Text } from 'hast';
import { BaseHTMLExtractor } from './base-extractor';
import type { ExtractionRule } from './extractor-types';

export class HastHTMLExtractor extends BaseHTMLExtractor<Node, Element> {
  private processor: Processor<any>;
  private stringifier: Processor<any, any, any, any, any>;

  constructor(options?: { rehypeParseOption: RehypeParseOptions }) {
    super();
    this.processor = unified().use(rehypeParse, { fragment: true, ...options?.rehypeParseOption });
    this.stringifier = unified().use(rehypeStringify);
  }

  parse(html: string): Node {
    return this.processor.parse(html);
  }

  selectElement(context: Node, schema: ExtractionRule) {
    if (!schema.selector) return context as Element;
    try {
      return select(schema.selector, context as Element);
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return;
    }
  }

  selectElements(context: Node, schema: ExtractionRule): Element[] {
    if (!schema.selector) return [context as Element];
    try {
      return selectAll(schema.selector, context as Element) as Element[];
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return [];
    }
  }

  extractText(element: Element): string {
    const extract = (node: Node): string => {
        if (node.type === 'text') {
            return (node as Text).value || '';
        }
        const el = node as Element;
        if (el.children && Array.isArray(el.children)) {
            return el.children.map(child => extract(child)).filter(Boolean).join('');
        }
        return '';
    }
    return extract(element);
  }

  extractAttribute(element: Element, attributeName: string): string | undefined {
    const attr = toCamelCase(attributeName);
    const attrValue = element.properties?.[attr];
    return this.parseAttributeValue(attrValue);
  }

  private parseAttributeValue(attrValue: any): string | undefined {
    if (attrValue === null || attrValue === undefined) {
      return undefined;
    }
    if (Array.isArray(attrValue)) {
      return attrValue.join(' ');
    }
    return String(attrValue);
  }

  elementToHtml(element: Element): string {
    try {
      return this.stringifier.stringify(element as any);
    } catch (error) {
      console.warn('HTML serialization error:', error);
      return '';
    }
  }

  getAttributes(element: Element): Record<string, any> {
    return element.properties;
  }
}
