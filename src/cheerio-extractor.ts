import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { BaseHTMLExtractor } from './base-extractor';
import type { ExtractionRule } from './extractor-types';

type TNode = any
type TElement = any

// Here, both the "root node" and "element" are represented by TElement
export class CheerioHTMLExtractor extends BaseHTMLExtractor<TNode, TElement> {
  private $!: CheerioAPI;

  parse(html: string, options?: any): TNode {
    const isDocument = !options?.fragment;
    this.$ = cheerio.load(html, options, isDocument);
    return this.$.root();
  }

  selectElement(context: TNode | TElement, schema: ExtractionRule): TElement | null {
    if (!schema.selector) return context;
    try {
      const el = context.find(schema.selector).first();
      return el.length > 0 ? el : null;
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return null;
    }
  }

  selectElements(context: TNode | TElement, schema: ExtractionRule): TElement[] {
    if (!schema.selector) return [context];
    try {
      // .toArray() returns raw elements, so we need to wrap them back into Cheerio objects
      return context.find(schema.selector).toArray().map((el: any) => this.$(el));
    } catch (error) {
      console.warn(`Selector error for "${schema.selector}":`, error);
      return [];
    }
  }

  extractText(element: TElement): string {
    return element.text();
  }

  extractAttribute(element: TElement, attributeName: string): string | undefined {
    return element.attr(attributeName);
  }

  elementToHtml(element: TElement): string {
    // .html() on a selection gives inner html. We might need outer.
    // cheerio.html(element) gives outer html.
    return this.$.html(element) || '';
  }

  getAttributes(element: TElement): Record<string, any> {
    return element[0].attribs;
  }
}
