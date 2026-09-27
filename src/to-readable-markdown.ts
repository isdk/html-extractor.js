import { ReadableHtmlOptions, toReadableHtml } from './to-readable-html';
import { htmlExtractorRehypePlugins } from './domain-plugins';
import { mdast, htmlReadabilityPlugins, removeEmptyLinksPlugin, type ReadabilityOptions } from '@isdk/mdast-plus';
import { pick } from 'lodash-es';

export interface ReadableMarkdownOptions extends ReadableHtmlOptions, ReadabilityOptions {
  attachMetadata?: boolean;
}

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
 * The article is extracted exactly once: `toReadableHtml` runs Readability
 * and applies DOM-level cleanups (comments, empty links), then hands the
 * result to `@isdk/mdast-plus` via the readability plugin's `article`
 * injection hook. The mdast-plus pipeline performs the hast conversion,
 * empty-link cleanup and markdown serialization — this package only
 * contributes its domain enhancements (see `htmlExtractorRehypePlugins`)
 * on top.
 *
 * @remarks
 * The cleaned DOM subtree is serialized to an HTML string before injection:
 * it lives in the extraction JSDOM, while the conversion pipeline parses its
 * input in a separate JSDOM. Passing the live `Element` instead would make
 * the conversion consume the *uncleaned* input, silently dropping the
 * `emptyLinks`/`removeComments` cleanups.
 *
 * @param html - The HTML string to convert to readable markdown
 * @param options - Configuration options for HTML readability processing (optional)
 * @returns A promise that resolves to a TextContentResult containing the processed content
 *          and metadata, with success flag indicating operation outcome
 */
export async function toReadableMarkdown(
    html: string,
    options: ReadableMarkdownOptions = {}
): Promise<TextContentResult> {
  try {
    // Extraction pass: Readability + DOM cleanup (this package's domain).
    const article = toReadableHtml(html, options)

    if (!article || !article.content) {
      throw new Error('Readability failed to extract content from HTML');
    }

    // Conversion pass: serialize the cleaned DOM subtree to HTML, then inject
    // it as the article into the mdast-plus readability plugin — no second
    // Readability parse happens. (Serializing first is required: the cleaned
    // DOM lives in the extraction JSDOM, and the conversion pipeline parses
    // the input string in its own JSDOM, so passing the live Element would
    // silently convert the *uncleaned* input instead.)
    const cleanedHtml = article.content.innerHTML
    const content = await mdast(cleanedHtml)
      .from('html')
      .use(htmlExtractorRehypePlugins)
      // htmlReadabilityPlugins = htmlReadabilityPlugin (parse) +
      // restoreReadabilityMetaPlugin (runs after rehype-remark). The latter is
      // what actually injects the frontmatter/sourceLink — passing the array
      // keeps both in sync instead of mounting only the parser half.
      .useAt(htmlReadabilityPlugins, {
        ...pick(options, ['url', 'frontmatter', 'sourceLink', 'smartExcerpt', 'fields', 'extraMetadata']),
        article: { ...article, content: cleanedHtml },
      } as any)
      .use(removeEmptyLinksPlugin, options.emptyLinkBrackets === false
        ? { brackets: false }
        : { brackets: options.emptyLinkBrackets ?? ['[', ']'] })
      .toMarkdown({ attachMetadata: options.attachMetadata });

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
