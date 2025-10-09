import { htmlToMarkdown } from './html-to-markdown'
import { ReadableHtmlOptions, toReadableHtml } from './to-readable-html';

/**
 * Interface defining the structure of text content extraction results.
 * Contains various metadata fields along with the main content and success status.
 */
export interface TextContentResult {
 /** Optional title of the extracted content */
  title?: string|null;
  /** Main content text in markdown format */
  content: string;
  /** Optional excerpt/summary of the content */
  excerpt?: string|null;
  /** Optional byline/author information */
  byline?: string|null;
  /** Optional length of the content in characters */
  length?: number|null;
  /** The text direction (e.g., 'ltr' or 'rtl') */
  dir?: string | null;
  /** Optional name of the website/source */
  siteName?: string|null;
  /** Optional language code of the content */
  lang?: string|null;
  /** The published time of the article in ISO format for metadata "article:published_time" or "parsely-pub-date" */
  publishedTime?: string | null;
  /** Indicates whether the extraction was successful */
  success: boolean;
  /** Optional error message if extraction failed */
  error?: string;
}

/**
 * Converts HTML content to readable markdown format.
 *
 * This function takes raw HTML input and processes it through readability algorithms from @mozilla/readability
 * to extract the main content, then converts that content to markdown format.
 * It handles error cases gracefully and returns structured result data.
 *
 * @param html - The HTML string to convert to readable markdown
 * @param options - Configuration options for HTML readability processing (optional)
 * @returns A promise that resolves to a TextContentResult containing the processed content
 *          and metadata, with success flag indicating operation outcome
 */
export async function toReadableMarkdown(
    html: string,
    options: ReadableHtmlOptions = {}
): Promise<TextContentResult> {
  try {
    const article = toReadableHtml(html, options)

    if (!article || !article.content) {
      throw new Error('Readability failed to extract content from HTML');
    }

    const content = await htmlToMarkdown(article.content.innerHTML);
    delete article.content;

    return {
      ...article as any,
      content,
      success: true
    };
  } catch (error) {
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
