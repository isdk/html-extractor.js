import { newFunction } from 'util-ex'
import { Root } from 'hast';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { defaultsDeep } from 'lodash-es';

interface HtmlMetadata {
  /** The title of the document */
  title?: string;
  /** The author or byline of the document */
  byline?: string;
  /** A brief description or excerpt of the document */
  description?: string;
  /** The primary language of the document */
  lang?: string;
  /** The text direction (e.g., ltr or rtl) */
  dir?: string;
  /** The base URL for relative URLs in the document */
  baseUrl?: string;
  /** The time the article was published (ISO 8601 format) */
  publishedTime?: string;
  /** Alias for publishedTime */
  datePublished?: string;
  /** The name of the site where the article was published */
  siteName?: string;
  /** An excerpt or summary of the content */
  excerpt?: string;
  /** Additional metadata properties */
  [key: string]: any;
}

interface ExtractOptions {
  /**
   * Whether to use the first h1 tag as a fallback for the title.
   * Defaults to false to match Readability.js behavior.
   */
  useH1AsTitleFallback?: boolean;
}

/**
 * Extracts metadata from HTML content, following the logic of Readability.js.
 * @param htmlContent - The HTML string or parsed AST to extract metadata from
 * @param options - Extraction options
 * @returns The extracted metadata object
 */
export function extractHtmlMetadata(htmlContent: string|Root, options: ExtractOptions = {}): HtmlMetadata {
  const { useH1AsTitleFallback } = options;
  if (typeof htmlContent === 'string') {
    // Parse HTML using unified and rehype-parse
    const processor = unified().use(rehypeParse, { fragment: false });
    htmlContent = processor.parse(htmlContent);
  }

  const metadata: HtmlMetadata = {};

  // Extract JSON-LD structured data
  const jsonLdData = extractJsonLd(htmlContent);

  // Add other potentially useful metadata
  const metaValues: Record<string, string> = {...jsonLdData};


  // Extract meta tag data
  extractMetaTags(htmlContent, metaValues);

  // Extract base URL
  metadata.baseUrl = extractBaseUrl(htmlContent);

  // Extract language and direction
  extractLangAndDir(htmlContent, metadata);

  // Extract title
  metadata.title = extractTitle(htmlContent, jsonLdData, metaValues, useH1AsTitleFallback);

  // Extract author/byline
  metadata.byline = extractByline(jsonLdData, metaValues);

  // Extract description/excerpt
  metadata.excerpt = extractExcerpt(jsonLdData, metaValues);

  // Extract site name
  metadata.siteName = jsonLdData.siteName || metaValues['og:site_name'];

  // Extract publication time
  metadata.publishedTime =
    jsonLdData.datePublished ||
    metaValues['article:published_time'] ||
    metaValues['parsely-pub-date']
  ;

  metadata.datePublished = metadata.publishedTime;

  return metadata;
}

/**
 * Extracts JSON-LD structured data from the HTML tree.
 * @param tree - The parsed HTML tree
 * @returns Extracted JSON-LD data or empty object
 */
function extractJsonLd(tree: Root): any {
  const jsonLdElements: any[] = [];
  const result: Record<string, any> = {};

  function traverse(node: any) {
    if (node.type === 'element' && node.tagName === 'script') {
      const attributes = node.properties || {};
      if (attributes.type === 'application/ld+json' && node.children?.length > 0) {
        // Strip CDATA markers if present
        const jsonContent = node.children[0].value?.replace(/(^|\s*\/\/[^\n\r]+|\/\*.*[\n\r]\s*\*\/)\s*<!\[CDATA\[|\]\]>\s*/g, "");
        if (jsonContent) try {
          const jsonData = parseJsJson(jsonContent);
          jsonLdElements.push(jsonData);
        } catch (e) {
          console.error('JSONLD parse Error:', e, jsonContent)
          // JSON 解析失败，跳过
        }
      }
    }

    if (node.children) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  traverse(tree);

  // Look for Article-type JSON-LD data
  for (const item of jsonLdElements) {
    defaultsDeep(result, item)

    if (item && item['@type'] && isArticleType(item['@type'])) {
      defaultsDeep(result, {
        title: item.headline || item.name,
        byline: extractAuthorFromJsonLd(item.author),
        excerpt: item.description,
        siteName: item.publisher?.name,
        datePublished: item.datePublished
      });
    }

    // Check data in @graph
    if (item && Array.isArray(item['@graph'])) {
      for (const graphItem of item['@graph']) {
        defaultsDeep(result, graphItem)
        if (graphItem && graphItem['@type'] && isArticleType(graphItem['@type'])) {
          defaultsDeep(result, {
            title: graphItem.headline || graphItem.name,
            byline: extractAuthorFromJsonLd(graphItem.author),
            excerpt: graphItem.description,
            siteName: graphItem.publisher?.name,
            datePublished: graphItem.datePublished
          })
        }
      }
    }
  }

  return result;
}

/**
 * Checks if the given type is an article type.
 * @param type - The type to check
 * @returns True if the type is an article type
 */
function isArticleType(type: string): boolean {
  const articleTypes = [
    'Article', 'AdvertiserContentArticle', 'NewsArticle', 'AnalysisNewsArticle',
    'AskPublicNewsArticle', 'BackgroundNewsArticle', 'OpinionNewsArticle',
    'ReportageNewsArticle', 'ReviewNewsArticle', 'Report', 'SatiricalArticle',
    'ScholarlyArticle', 'MedicalScholarlyArticle', 'SocialMediaPosting',
    'BlogPosting', 'LiveBlogPosting', 'DiscussionForumPosting',
    'TechArticle', 'APIReference'
  ];

  return articleTypes.some(articleType => type.includes(articleType));
}

/**
 * Extracts author information from JSON-LD data.
 * @param author - The author data from JSON-LD
 * @returns The extracted author name or undefined
 */
function extractAuthorFromJsonLd(author: any): string | undefined {
  if (!author) return undefined;

  if (typeof author === 'string') {
    return author;
  }

  if (typeof author.name === 'string') {
    return author.name;
  }

  if (Array.isArray(author)) {
    const names = author
      .filter(a => a && typeof a.name === 'string')
      .map(a => a.name);
    return names.length > 0 ? names.join(', ') : undefined;
  }

  return undefined;
}

/**
 * Extracts meta tag data from the HTML tree.
 * @param tree - The parsed HTML tree
 * @param metaValues - Object to store extracted meta values
 */
function extractMetaTags(tree: Root, metaValues: Record<string, string>): void {
  const propertyPattern =
    /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi;

  const namePattern =
    /^\s*(?:(dc|dcterm|og|twitter|parsely|weibo:(article|webpage))\s*[-\.:]\s*)?(author|creator|pub-date|description|title|site_name)\s*$/i;

  function traverse(node: any) {
    if (node.type === 'element' && node.tagName === 'meta') {
      const attributes = node.properties || {};
      const content = attributes.content;

      if (!content) return;

      const elementName = attributes.name;
      const elementProperty = attributes.property;
      let name = null;

      // Handle property attribute
      if (elementProperty) {
        const matches = elementProperty.match(propertyPattern);
        if (matches) {
          name = matches[0].toLowerCase().replace(/\s/g, "");
          metaValues[name] = content.trim();
        }
      }

      // Handle name attribute
      if (!name && elementName && namePattern.test(elementName)) {
        name = elementName
          .toLowerCase()
          .replace(/\s/g, "")
          .replace(/\./g, ":");
        metaValues[name] = content.trim();
      }
    }

    if (node.children) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  traverse(tree);
}

/**
 * Extracts the base URL from the HTML tree.
 * @param tree - The parsed HTML tree
 * @returns The base URL or undefined
 */
function extractBaseUrl(tree: Root): string | undefined {
  let baseUrl: string | undefined;

  function traverse(node: any) {
    if (node.type === 'element' && node.tagName === 'base') {
      const attributes = node.properties || {};
      if (attributes.href) {
        baseUrl = attributes.href;
      }
    }

    if (node.children && !baseUrl) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  traverse(tree);
  return baseUrl;
}

/**
 * Gets HTML attributes from a node if it's an html element.
 * @param node - The node to check
 * @returns The HTML attributes or undefined
 */
function tryGetHtmlAttrs(node: any) {
  if (node.type === 'element' && node.tagName === 'html') {
    const attributes = node.properties || {};
    return attributes;
  }

}

/**
 * Extracts language and direction from the HTML tree.
 * @param tree - The parsed HTML tree
 * @param metadata - The metadata object to populate
 */
function extractLangAndDir(tree: Root, metadata: HtmlMetadata): void {
  function traverse(node: any) {
    let attrs = tryGetHtmlAttrs(node);
    if (attrs) {
      metadata.lang = attrs.lang;
      metadata.dir = attrs.dir;
      return true;
    } else if (node.children?.length) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        // 不需要递归，html只可能在顶层
        attrs = tryGetHtmlAttrs(child);
        if (attrs) {
          metadata.lang = attrs.lang;
          metadata.dir = attrs.dir;
          return true;
        }
      }
    }
  }

  traverse(tree);
}

/**
 * Extracts the title from the HTML tree.
 * @param tree - The parsed HTML tree
 * @param jsonLdData - Extracted JSON-LD data
 * @param metaValues - Extracted meta tag values
 * @param useH1AsTitleFallback - Whether to use h1 as fallback
 * @returns The extracted title
 */
function extractTitle(tree: Root, jsonLdData: any, metaValues: Record<string, string>, useH1AsTitleFallback?: boolean): string {
  // 按优先级获取标题
  const title =
    jsonLdData.title ||
    metaValues["dc:title"] ||
    metaValues["dcterm:title"] ||
    metaValues["og:title"] ||
    metaValues["weibo:article:title"] ||
    metaValues["weibo:webpage:title"] ||
    metaValues["title"] ||
    metaValues["twitter:title"] ||
    metaValues["parsely-title"] ||
    (useH1AsTitleFallback ? extractTitleFromH1(tree) : '') ||
    extractTitleFromTitleTag(tree);

  return title ? unescapeHtmlEntities(title) : '';
}

/**
 * Extracts title from the <title> tag.
 * @param tree - The parsed HTML tree
 * @returns The extracted title
 */
function extractTitleFromTitleTag(tree: Root): string {
  let title = '';

  function traverse(node: any) {
    if (node.type === 'element' && node.tagName === 'title' && node.children?.length > 0) {
      title = node.children[0].value || '';
    }

    if (node.children && !title) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  traverse(tree);
  return title.trim();
}


/**
 * Extracts title from the first <h1> tag.
 * @param tree - The parsed HTML tree
 * @returns The extracted title
 */
function extractTitleFromH1(tree: Root): string {
  let title = '';

  function traverse(node: any) {
    if (node.type === 'element' && node.tagName === 'h1' && node.children?.length > 0) {
      title = node.children[0].value || '';
    }

    if (node.children && !title) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  traverse(tree);
  return title.trim();
}

/**
 * Extracts author/byline information.
 * @param jsonLdData - Extracted JSON-LD data
 * @param metaValues - Extracted meta tag values
 * @returns The extracted author/byline or undefined
 */
function extractByline(jsonLdData: any, metaValues: Record<string, string>): string | undefined {
  const articleAuthor =
    typeof metaValues["article:author"] === "string" &&
    !isUrl(metaValues["article:author"])
      ? metaValues["article:author"]
      : undefined;

  const byline =
    jsonLdData.byline ||
    metaValues["dc:creator"] ||
    metaValues["dcterm:creator"] ||
    metaValues["author"] ||
    metaValues["parsely-author"] ||
    articleAuthor;

  return byline ? unescapeHtmlEntities(byline) : undefined;
}

/**
 * Extracts description/excerpt information.
 * @param jsonLdData - Extracted JSON-LD data
 * @param metaValues - Extracted meta tag values
 * @returns The extracted description/excerpt or undefined
 */
function extractExcerpt(jsonLdData: any, metaValues: Record<string, string>): string | undefined {
  const excerpt =
    jsonLdData.excerpt ||
    metaValues["dc:description"] ||
    metaValues["dcterm:description"] ||
    metaValues["og:description"] ||
    metaValues["weibo:article:description"] ||
    metaValues["weibo:webpage:description"] ||
    metaValues["description"] ||
    metaValues["twitter:description"];

  return excerpt ? unescapeHtmlEntities(excerpt) : undefined;
}

/**
 * Checks if a string is a valid URL.
 * @param str - The string to check
 * @returns True if the string is a valid URL
 */
function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Unescapes HTML entities in a string.
 * @param str - The string to unescape
 * @returns The unescaped string
 */
function unescapeHtmlEntities(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    quot: '"',
    amp: '&',
    apos: "'",
    lt: '<',
    gt: '>'
  };

  return str
    .replace(/&(quot|amp|apos|lt|gt);/g, (_, tag) => htmlEscapeMap[tag])
    .replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, (_, hex, numStr) => {
      const num = parseInt(hex || numStr, hex ? 16 : 10);
      if (num == 0 || num > 0x10ffff || (num >= 0xd800 && num <= 0xdfff)) {
        return String.fromCodePoint(0xfffd);
      }
      return String.fromCodePoint(num);
    });
}

/**
 * Parses JavaScript-style JSON (allowing unquoted keys).
 * @param json - The JSON string to parse
 * @returns The parsed JSON object
 */
function parseJsJson(json: string): any {
  const fn = newFunction(`function rtJson() {return ${json.trimStart()}}`)
  return fn();
}
