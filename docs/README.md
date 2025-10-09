**@isdk/html-extractor**

***

# @isdk/html-extractor

> English | [简体中文](_media/README.cn.md)

[![NPM version](https://img.shields.io/npm/v/@isdk/html-extractor.svg)](https://www.npmjs.com/package/@isdk/html-extractor)

`@isdk/html-extractor` is a powerful HTML content extraction tool designed to accurately extract desired information from complex HTML documents. It can convert the main body of a webpage into clean Markdown format, extract structured data (JSON) based on custom rules, and comprehensively parse page metadata.

## Core Features

- **Readable Content Extraction**: The core functionality is based on Mozilla's [`Readability.js`](https://github.com/mozilla/readability), which intelligently identifies and extracts the main content of a webpage, removing ads, navigation bars, footers, and other irrelevant elements.
- **Markdown Conversion**: Converts the extracted clean HTML into well-formatted Markdown, ideal for content archiving, indexing, or processing by language models (LLMs).
- **Structured Data Extraction**: By defining extraction rules (Schema) based on CSS selectors, you can precisely scrape any data from HTML and structure it into nested JSON objects or arrays.
- **Metadata Parsing**: Automatically extracts rich page metadata, including but not limited to:
  - Title (`title`)
  - Author (`byline`)
  - Excerpt (`excerpt`)
  - Site Name (`siteName`)
  - Publication Date (`publishedTime`)
  - Language and Text Direction (`lang`, `dir`)
  - Supports parsing from standard Meta tags, Open Graph, JSON-LD, and more.
- **Automatic URL Handling**: During extraction, it automatically converts relative URLs (e.g., `/about`, `../img.png`) to absolute URLs based on a provided base URL.
- **Dual Extraction Engines**:
  - **HAST Extractor (Default)**: Based on the `unified/hast` ecosystem, it's fast, implemented in pure JavaScript, and doesn't require a browser environment.
  - **JSDOM Extractor**: Based on `jsdom`, it provides a simulated browser environment, supporting more complex selectors and DOM operations, but with higher performance overhead.

## Installation

```bash
npm install @isdk/html-extractor
```

## Quick Start

The library provides a unified entry function, `extractHtmlContent`, which automatically selects the extraction mode based on the provided options.

### 1. Extract Readable Markdown

When `extractionRules` are not provided, it defaults to extracting the main article content and converting it to Markdown.

```typescript
import { extractHtmlContent } from '@isdk/html-extractor';

const html = `
  <!DOCTYPE html>
  <html>
    <head><title>My Article</title></head>
    <body>
      <nav>...</nav>
      <article>
        <h1>Article Title</h1>
        <p>This is the first paragraph.</p>
        <div class="ad">This is an ad and should be ignored.</div>
        <p>This is the second paragraph.</p>
      </article>
      <footer>...</footer>
    </body>
  </html>
`;

async function main() {
  const result = await extractHtmlContent(html, { url: 'https://example.com' });
  // When the result is a string, it indicates Markdown was extracted.
  if (typeof result === 'string') {
    console.log(result);
  }
}

main();
```

**Output:**

```markdown
# Article Title

This is the first paragraph.

This is the second paragraph.
```

### 2. Extract Structured Data (JSON)

When `extractionRules` are provided, it extracts structured data according to the rules.

```typescript
import { extractHtmlContent, ExtractionRule } from '@isdk/html-extractor';

const html = `
  <div class="profile">
    <h1 class="name">John Doe</h1>
    <div class="details">
      <span class="age">30</span>
      <a href="/profile/johndoe">Profile Page</a>
    </div>
    <div class="tags">
      <span class="tag">Developer</span>
      <span class="tag">Writer</span>
    </div>
  </div>
`;

const rules: ExtractionRule = {
  type: 'object',
  selector: '.profile',
  properties: {
    name: { type: 'string', selector: '.name' },
    age: { type: 'number', selector: '.age' },
    profileUrl: { selector: 'a', attribute: 'href' },
    tags: {
      type: 'array',
      selector: '.tag',
      items: { type: 'string' }
    }
  }
};

async function main() {
  // Note: When providing extractionRules, the function is synchronous.
  const result = extractHtmlContent(html, { extractionRules: rules });
  console.log(JSON.stringify(result, null, 2));
}

main();
```

**Output:**

```json
{
  "name": "John Doe",
  "age": 30,
  "profileUrl": "/profile/johndoe",
  "tags": [
    "Developer",
    "Writer"
  ]
}
```

## API Reference

### `toReadableMarkdown(html, options)`

Converts HTML into readable Markdown with metadata.

- `html` (string): The input HTML string.
- `options` (ReadableHtmlOptions):
  - `url` (string): The base URL of the page, used to resolve relative links.
  - `readabilityOptions` (object): Custom options passed to `Readability.js`.

**Returns** `Promise<TextContentResult>`:

```typescript
interface TextContentResult {
  title?: string | null;
  content: string; // Markdown content
  excerpt?: string | null;
  byline?: string | null;
  length?: number | null;
  dir?: string | null;
  siteName?: string | null;
  lang?: string | null;
  publishedTime?: string | null;
  success: boolean;
  error?: string;
}
```

### `toStructured(html, options)`

Extracts structured data from HTML based on rules.

- `html` (string): The input HTML string.
- `options` (StructuredOptions):
  - `extractionRules` (ExtractionRule): The rule object defining the extraction logic.
  - `extractorOptions` (any): Options passed to the extractor engine.

**Returns** `any`: The structured data as defined by the rules.

### `extractHtmlMetadata(html, options)`

Extracts metadata from HTML.

- `html` (string | Root): An HTML string or a HAST tree.
- `options` (ExtractOptions):
  - `useH1AsTitleFallback` (boolean): Whether to use the first `<h1>` as a fallback for the title. Defaults to `false`.

**Returns** `HtmlMetadata`:

```typescript
interface HtmlMetadata {
  title?: string;
  byline?: string;
  description?: string;
  lang?: string;
  dir?: string;
  baseUrl?: string;
  publishedTime?: string;
  siteName?: string;
  excerpt?: string;
}
```

### `ensureBaseUrl(html, baseUrl)`

Ensures that a `<base>` tag exists in the HTML. If it doesn't exist, one will be added; if it already exists, no changes are made.

- `html` (string | Root): An HTML string or a HAST tree.
- `baseUrl` (string): The base URL to set.

**Returns** `string | Root | undefined`: A new HTML string or HAST tree if modified; otherwise, `undefined`.

## Structured Extraction Rules (`ExtractionRule`)

An extraction rule is an object that describes how to find and transform data from HTML.

| Property | Type | Description |
| --- | --- | --- |
| `selector` | `string` | **(Optional)** A CSS selector to find the element(s). If omitted, operates on the current context (or the entire document). |
| `type` | `string` | **(Optional)** The data type to extract. Can be `'string'`, `'number'`, `'boolean'`, `'array'`, `'object'`. Defaults to `'string'`. |
| `attribute` | `string` | **(Optional)** Specifies the HTML attribute to extract, e.g., `href`, `src`, `data-id`. If omitted, extracts the element's text content. |
| `multiple` | `boolean` | **(Optional)** If `true`, finds all matching elements with `querySelectorAll` and returns the results as an array. Equivalent to `type: 'array'`. |
| `required` | `boolean` | **(Optional)** If `true` and nothing is found, an error will be thrown. |
| `default` | `any` | **(Optional)** If nothing is found, this default value will be returned. |
| `transform` | `(value: any, element?: any) => any` | **(Optional)** A function to apply custom transformations to the extracted data before returning it. |
| `properties` | `Record<string, ExtractionRule>` | **(For `type: 'object'` only)** An object where keys are the property names of the output object and values are nested rules for extracting those properties. |
| `items` | `ExtractionRule` | **(For `type: 'array'` only)** A rule object to process each element selected by the `selector`. |

## License

[MIT](_media/LICENSE-MIT)
