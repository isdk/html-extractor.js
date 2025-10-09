import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
// import { toDom } from 'hast-util-to-dom';
// import { fromDom } from 'hast-util-from-dom';
// import { fromHtml } from 'hast-util-from-html';
// import { ensureBaseUrl } from './ensure-base-url';

const ReadabilityProto = Readability.prototype as any ;

const negativeNames = [
  'unlikelyCandidates',
  // 'negative', 'extraneous',
]

const newRegexParts = ['|advertisement', '|(^|_)ad[-_]']
negativeNames.forEach(name => {
  const oldReg = ReadabilityProto.REGEXPS[name];
  let src = oldReg.source;
  newRegexParts.forEach(part => {
    if (!src.includes(part)) {
      src += part;
    }
  });
  ReadabilityProto.REGEXPS[name] = new RegExp(src, oldReg.flags);
});

export const DefaultBaseUrl = 'https://unknown-url.unk';

//*
function toJsDOM(html: string, options: {url?: string} = {}) {
  const dom = new JSDOM(html, {
    url: options.url || DefaultBaseUrl,
    pretendToBeVisual: true
  });
  return dom.window.document;
}
//*/

/*
function toJsDOM(html: string, options: {url?: string, fragment?: boolean, document?: Document, namespace?: string} = {}) {
  const jsdom = new JSDOM(undefined,  {
    url: options.url || DefaultBaseUrl,
    pretendToBeVisual: true
  })
  const tree = fromHtml(html, options);
  ensureBaseUrl(tree, options.url || DefaultBaseUrl, options);
  const dom = toDom(tree, {document: jsdom.window.document, ...options});
  // console.log('🚀 ~ file: to-readable-html.ts:28 ~ dom:', JSON.stringify(fromDom(dom), undefined, 2))
  return dom as Document
}
// */
/**
 * Interface representing the result of the readable HTML parsing operation.
 * Contains various metadata and content extracted from the parsed document.
 */
export interface ReadableHtmlResult {
  /** The title of the article or document */
  title?: string | null;
  /** The main content element of the parsed document */
  content?: Element | null;
  /** The text content of the parsed document */
  textContent?: string | null;
  /** The length of the text content */
  length?: number | null;
  /** A short excerpt or summary of the content */
  excerpt?: string | null;
  /** The author byline information */
  byline?: string | null;
  /** The text direction (e.g., 'ltr' or 'rtl') */
  dir?: string | null;
  /** The name of the website or publication */
  siteName?: string | null;
  /** The language of the document */
  lang?: string | null;
  /** The published time of the article in ISO format */
  publishedTime?: string | null;
}


/**
 * Interface representing configuration options for the Readability parser.
 * These options control how the content is parsed and extracted.
 */
export interface ReadabilityOptions {
  /** Enable or disable debug logging */
  debug?: boolean;
  /** Maximum number of elements to parse before giving up */
  maxElemsToParse?: number;
  /** Number of top candidate elements to consider */
  nbTopCandidates?: number;
  /** Minimum character threshold for content */
  charThreshold?: number;
  /** Array of CSS class names to preserve during parsing */
  classesToPreserve?: string[];
  /** Whether to keep CSS classes in the output */
  keepClasses?: boolean;
  /** Custom serializer function for nodes */
  serializer?: ((node: Node) => string);
  /** Disable JSON-LD metadata extraction */
  disableJSONLD?: boolean;
  /** Regular expression to match allowed video sources */
  allowedVideoRegex?: RegExp;
}

/**
 * Interface representing options for the toReadableHtml function.
 * Controls the behavior of HTML parsing and processing.
 */
export interface ReadableHtmlOptions {
  /** The URL of the document being parsed */
  url?: string;
  /** Readability-specific parsing options */
  readabilityOptions?: ReadabilityOptions;
  /** Whether to remove HTML comments from the content (default: true) */
  removeComments?: boolean;
}

/**
 * Converts HTML content into a readable format by parsing and extracting the main content.
 * Uses Mozilla's Readability library to extract article content and metadata.
 *
 * @param html - The raw HTML string to parse
 * @param options - Configuration options for parsing and processing
 * @returns Parsed readable content with metadata, or null if parsing fails
 */
export function toReadableHtml(html: string, options: ReadableHtmlOptions = {}) {
  const dom = toJsDOM(html, options);

  const readabilityOptions = {
    // debug: true,
    maxElemsToParse: 100000,
    nbTopCandidates: 5,
    charThreshold: 500,
    keepClasses: true,
    ...options.readabilityOptions,
    serializer: (el: any) => el,
  };

  const reader = new Readability(dom, readabilityOptions);
  const article = reader.parse() as ReadableHtmlResult|null;
  const content = article?.content
  if (content && options.removeComments !== false) {
    removeCommentNodes(content)
  }
  return article;
}

/**
 * Removes all comment nodes from the given element and its descendants.
 *
 * @param element - The root element from which to remove comment nodes
 */
function removeCommentNodes(element: Node): void {
  // 在 JSDOM 环境中创建 TreeWalker
  const walker = (element.ownerDocument || element as Document).createTreeWalker(
    element,
    128 // NodeFilter.SHOW_COMMENT
  );

  const commentNodes: Comment[] = [];
  let node: Node | null;

  // 收集所有注释节点
  while (node = walker.nextNode()) {
    commentNodes.push(node as Comment);
  }

  // 移除所有注释节点
  commentNodes.forEach(comment => {
    comment.remove();
  });
}
