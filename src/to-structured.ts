import { ExtractionRule } from "./extractor-types";
import { HastHTMLExtractor } from "./hast-extractor";

export function toStructured(html: string, options: {extractorOptions?: any, extractionRules: ExtractionRule}) {
  const extractor = new HastHTMLExtractor(options.extractorOptions)
  return extractor.extract(html, options.extractionRules)
}
