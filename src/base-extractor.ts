import type {
  ArrayExtractionRule,
  BooleanExtractionRule,
  ExtractionResult,
  NumberExtractionRule,
  ObjectExtractionRule,
  ExtractionRule,
  ExtractionRuleType,
  StringExtractionRule,
} from './extractor-types';

export abstract class BaseHTMLExtractor<TNode, TElement> {
  // Abstract methods to be implemented by subclasses
  abstract parse(html: string, options?: any): TNode;
  abstract selectElement(context: TNode | TElement, schema: ExtractionRule): TElement | null | undefined;
  abstract selectElements(context: TNode | TElement, schema: ExtractionRule): TElement[];
  abstract extractText(element: TElement): string;
  abstract extractAttribute(element: TElement, attributeName: string): string | undefined;
  abstract elementToHtml(element: TElement): string;
  abstract getAttributes(element: TElement): Record<string, any>;

  // Main extraction method
  public extract(html: string, schema: ExtractionRule, options?: any): ExtractionResult {
    const root = this.parse(html, options);
    return this.processSchema(root, schema);
  }

  // The core processing logic, now generic
  protected processSchema(context: TNode | TElement, schema: ExtractionRule): any {
    if (!schema || typeof schema !== 'object') {
      return null;
    }

    const type = schema.type || this.inferSchemaType(schema);

    try {
      switch (type) {
        case 'string':
          return this.extractString(context, schema as StringExtractionRule);
        case 'number':
          return this.extractNumber(context, schema as NumberExtractionRule);
        case 'boolean':
          return this.extractBoolean(context, schema as BooleanExtractionRule);
        case 'array':
          return this.extractArray(context, schema as ArrayExtractionRule);
        case 'object':
          return this.extractObject(context, schema as ObjectExtractionRule);
        default:
          return this.extractAuto(context, schema);
      }
    } catch (error) {
      if (schema.required) {
        throw new Error(`Required field extraction failed: ${error}`);
      }
      console.warn(`Extraction error for selector "${schema.selector}":`, error);
      return schema.default !== undefined ? schema.default : null;
    }
  }

  protected extractString(context: TNode | TElement, schema: StringExtractionRule): string | null | undefined {
    const element = this.selectElement(context, schema);
    if (!element) {
      return this.handleMissingValue(schema);
    }

    let value: string;
    if (schema.attribute) {
      value = this.extractAttribute(element, schema.attribute) || '';
    } else {
      value = this.extractText(element);
    }

    value = value.trim();

    if (schema.transform) {
      const transformed = schema.transform(value, element);
      value = transformed !== null && transformed !== undefined ? String(transformed) : '';
    }

    return value;
  }

  protected extractNumber(context: TNode | TElement, schema: NumberExtractionRule): number | null {
    const stringValue = this.extractString(context, { ...schema, type: 'string', transform: undefined });

    if (stringValue == null || stringValue === '') {
      return this.handleMissingValue(schema);
    }

    let numberValue: number;
    if (schema.transform) {
      const transformed = schema.transform(stringValue);
      if (typeof transformed === 'number') {
        numberValue = transformed;
      } else {
        numberValue = parseFloat(String(transformed));
      }
    } else {
      numberValue = parseFloat(stringValue);
    }

    if (isNaN(numberValue)) {
      return this.handleMissingValue(schema);
    }

    return numberValue;
  }

  protected extractBoolean(context: TNode | TElement, schema: BooleanExtractionRule): boolean | null {
    const stringValue = this.extractString(context, { ...schema, type: 'string', transform: undefined });

    if (stringValue == null || stringValue === '') {
      return this.handleMissingValue(schema);
    }

    let boolValue: boolean;
    if (schema.transform) {
      const transformed = schema.transform(stringValue);
      if (typeof transformed === 'boolean') {
        boolValue = transformed;
      } else {
        boolValue = this.parseBooleanValue(String(transformed));
      }
    } else {
      boolValue = this.parseBooleanValue(stringValue);
    }

    return boolValue;
  }

  protected parseBooleanValue(value: string): boolean {
    const truthyValues = ['true', '1', 'yes', 'on', 'enabled', 'active'];
    return truthyValues.includes(value.toLowerCase());
  }

  protected extractArray(context: TNode | TElement, schema: ArrayExtractionRule): any[] | null {
    const elements = this.selectElements(context, schema);

    if (!elements || elements.length === 0) {
      return this.handleMissingValue(schema);
    }

    let result: any[];
    if (schema.items) {
      result = elements.map(element => this.processSchema(element, schema.items!));
    } else {
      result = elements.map(element => this.extractText(element).trim());
    }

    if (schema.transform) {
      result = schema.transform(result);
    }

    return result;
  }

  protected extractObject(context: TNode | TElement, schema: ObjectExtractionRule): Record<string, any> | null {
    const element = this.selectElement(context, schema);

    if (!element) {
      return this.handleMissingValue(schema);
    }

    let result: Record<string, any>;
    if (schema.properties) {
      result = {};
      for (const [key, propertySchema] of Object.entries(schema.properties)) {
        result[key] = this.processSchema(element, propertySchema);
      }
    } else {
      result = {
        text: this.extractText(element).trim(),
        html: this.elementToHtml(element),
        attributes: this.getAttributes(element),
      };
    }

    if (schema.transform) {
      result = schema.transform(result, element) as Record<string, any>;
    }

    return result;
  }

  protected extractAuto(context: TNode | TElement, schema: ExtractionRule): any {
    if (schema.multiple) {
      return this.extractArray(context, { ...schema, type: 'array' });
    } else if ((schema as ObjectExtractionRule).properties) {
      return this.extractObject(context, { ...schema, type: 'object' });
    } else {
      return this.extractString(context, { ...schema, type: 'string' });
    }
  }

  protected inferSchemaType(schema: ExtractionRule): ExtractionRuleType {
    if (schema.multiple) return 'array';
    if ((schema as any).properties) return 'object';
    return 'string';
  }

  protected handleMissingValue(schema: ExtractionRule): any {
    if (schema.default !== undefined) {
      return schema.default;
    }
    if (schema.required) {
      throw new Error(`Required field is missing: ${schema.selector}`);
    }
    return null;
  }
}
