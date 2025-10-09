import { toReadableMarkdown } from "./to-readable-markdown";
import { toStructured, type StructuredOptions } from "./to-structured";
import { type ReadableHtmlOptions } from "./to-readable-html";

/**
 * Extracts content from HTML string and converts it to either structured data or readable markdown format.
 *
 * This function serves as the main entry point for HTML content extraction. It analyzes the provided HTML
 * and processes it according to the specified options. If extraction rules are provided, it returns
 * structured data; otherwise, it converts the HTML to readable markdown format.
 *
 * @param html - The HTML string to extract content from
 * @param options - Optional configuration object that can include both structured extraction rules
 *                 and readable HTML processing options
 * @returns A promise that resolves to either structured data (when extractionRules are provided)
 *          or readable markdown text (when no extraction rules are specified)
 */
export async function extractHtmlContent(html: string, options?: StructuredOptions & ReadableHtmlOptions) {
  if (options?.extractionRules) {
    return toStructured(html, options)
  } else {
    return toReadableMarkdown(html, options)
  }
}
