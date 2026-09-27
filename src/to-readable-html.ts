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
  /** The published time of the article in ISO format for "article:published_time" or "parsely-pub-date" */
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
 * The action to take on empty links found in the extracted content.
 *
 * An "empty link" is an `<a>` element whose `href` attribute is missing, empty,
 * or `"#"` — i.e. a link that leads nowhere (typically a leftover from
 * script-driven UI, navigation menus or placeholder markup).
 *
 * - `'unwrap'`: keep the link's inner content (text/children), drop the `<a>` wrapper.
 *   This mirrors how Readability itself handles `javascript:` links.
 * - `'remove'`: delete the whole `<a>` element including its content.
 * - `'keep'`: leave empty links untouched (default). They survive into the
 *   markdown conversion, where the `remove-empty-links` plugin from
 *   `@isdk/mdast-plus` wraps their text in configurable delimiters
 *   (default `[文字]`) instead of emitting broken `[文字]()` links.
 */
export type EmptyLinksAction = 'keep' | 'unwrap' | 'remove'

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
  /**
   * Delimiters to wrap around the text of empty links in the markdown output
   * (see `ToMarkdownOptions.emptyLinkBrackets`). Default: `['[', ']']`.
   * Only used when converting to markdown; ignored by `toReadableHtml` itself.
   */
  emptyLinkBrackets?: [string, string] | false;
  /**
   * What to do with empty links (`<a>` without `href`, or with `href=""`/`"#"`).
   * Defaults to `'keep'` so they reach the markdown conversion, where their
   * text is wrapped in `emptyLinkBrackets` (default `[文字]`).
   * Set to `'unwrap'` to keep the link text as plain text, or `'remove'` to
   * drop empty links entirely.
   * Note: links to in-page anchors with a real target (e.g. `href="#section1"`)
   * are NOT considered empty and are always kept.
   */
  emptyLinks?: EmptyLinksAction;
  attachMetadata?: boolean;
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
  if (content) {
    cleanupContent(content, {
      removeComments: options.removeComments !== false,
      emptyLinks: options.emptyLinks ?? 'keep',
    });
  }
  return article;
}

/** Options for the post-parse content cleanup pass. */
interface CleanupOptions {
  removeComments: boolean;
  emptyLinks: EmptyLinksAction;
}

/**
 * Cleans up the extracted content in a single traversal pass.
 *
 * Handles both comment removal and empty-link filtering in one TreeWalker
 * walk over the subtree, so the content tree is not traversed repeatedly.
 *
 * @param element - The root element of the extracted content
 * @param opts - What to clean up
 */
function cleanupContent(element: Element, opts: CleanupOptions): void {
  const doc = element.ownerDocument || (element as unknown as Document);
  const commentFilter = opts.removeComments ? 128 /* NodeFilter.SHOW_COMMENT */ : 0;
  const linkFilter = opts.emptyLinks !== 'keep' ? 1 /* NodeFilter.SHOW_ELEMENT (a) */ : 0;
  // No filters requested: nothing to do.
  if (!commentFilter && !linkFilter) return;

  const walker = doc.createTreeWalker(
    element,
    commentFilter | linkFilter,
  );

  const toProcess: Array<{ node: Node; kind: 'comment' | 'link' }> = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeType === 8 /* COMMENT_NODE */) {
      if (commentFilter) toProcess.push({ node, kind: 'comment' });
    } else if (node.nodeType === 1 /* ELEMENT_NODE */) {
      if (linkFilter && isEmptyLink(node as Element)) {
        toProcess.push({ node, kind: 'link' });
      }
    }
  }

  for (const { node, kind } of toProcess) {
    if (kind === 'comment') {
      (node as ChildNode).remove();
    } else {
      cleanupEmptyLink(node as HTMLAnchorElement, opts.emptyLinks);
    }
  }
}

/**
 * Checks whether an `<a>` element is an "empty" link: no `href` attribute,
 * an empty `href`, or a `href` of `"#"` (a dead placeholder anchor).
 *
 * Links to real in-page anchors (e.g. `"#section1"`) are not empty.
 *
 * @param link - The anchor element to check
 * @returns True if the link leads nowhere and should be filtered
 */
function isEmptyLink(link: Element): boolean {
  if (link.tagName !== 'A') return false;
  const href = link.getAttribute('href');
  return href === null || href === '' || href === '#';
}

/**
 * Processes a single empty link according to the configured action.
 *
 * @param link - The empty anchor element
 * @param action - Whether to unwrap (keep content) or remove (drop all)
 */
function cleanupEmptyLink(link: HTMLAnchorElement, action: EmptyLinksAction): void {
  if (action === 'remove') {
    link.remove();
    return;
  }
  // 'unwrap': keep the inner content, drop the <a> wrapper.
  const parent = link.parentNode;
  if (!parent) return;
  while (link.firstChild) {
    parent.insertBefore(link.firstChild, link);
  }
  link.remove();
}
