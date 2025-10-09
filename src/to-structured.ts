import { ExtractionRule } from "./extractor-types";
import { HastHTMLExtractor } from "./hast-extractor";

export interface StructuredOptions {
  extractorOptions?: any
  extractionRules: ExtractionRule
}

export function toStructured(html: string, options: StructuredOptions) {
  const extractor = new HastHTMLExtractor(options.extractorOptions)
  return extractor.extract(html, options.extractionRules)
}
