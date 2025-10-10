import { JSDOM } from 'jsdom';
import { BaseHTMLExtractor } from './base-extractor';
import type { ExtractionRule, ExtractionResult } from './extractor-types';

type JSDOMNode = Document | Element;

export class JSDOMHTMLExtractor extends BaseHTMLExtractor<Document, Element> {
  private dom: JSDOM | null = null;

  parse(html: string): Document {
    this.dom = new JSDOM(html);
    return this.dom.window.document;
  }

  selectElement(context: JSDOMNode, schema: ExtractionRule): Element | null {
    if (!schema.selector) return context as Element;
    try {
      return context.querySelector(schema.selector);
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return null;
    }
  }

  selectElements(context: JSDOMNode, schema: ExtractionRule): Element[] {
    if (!schema.selector) return [context as Element];
    try {
      return Array.from(context.querySelectorAll(schema.selector));
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return [];
    }
  }

  extractText(element: Element): string {
    return element.textContent?.trim() || '';
  }

  extractAttribute(element: Element, attributeName: string): string | undefined {
    const value = element.getAttribute(attributeName);
    return value === null ? undefined : value;
  }

  elementToHtml(element: Element): string {
    return element.outerHTML;
  }

  getAttributes(element: Element): Record<string, any> {
    const attributes: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attributes[attr.name] = attr.value;
    }
    return attributes;
  }

  // JSDOM specific methods
  destroy(): void {
    if (this.dom) {
      this.dom.window.close();
      this.dom = null;
    }
  }

  extractMultiple(
    htmlDocuments: Array<{ id: string; html: string }>,
    schema: ExtractionRule
  ): Record<string, ExtractionResult> {
    const results: Record<string, ExtractionResult> = {};
    for (const doc of htmlDocuments) {
      try {
        results[doc.id] = this.extract(doc.html, schema);
      } catch (error) {
        console.warn(`Failed to extract from document ${doc.id}:`, error);
        results[doc.id] = {};
      }
    }
    return results;
  }
}
