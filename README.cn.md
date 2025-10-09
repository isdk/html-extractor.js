# @isdk/html-extractor

> 简体中文 | [English](./README.md)

[![NPM version](https://img.shields.io/npm/v/@isdk/html-extractor.svg)](https://www.npmjs.com/package/@isdk/html-extractor)

`@isdk/html-extractor` 是一个功能强大的 HTML 内容提取工具，专为从复杂的 HTML 文档中精确提取所需信息而设计。它不仅能将网页正文转换为干净的 Markdown 格式，还能根据自定义规则提取结构化数据（JSON），并全面解析页面的元数据。

## 核心功能

- **可读内容提取**: 核心功能基于 Mozilla 的 [`Readability.js`](https://github.com/mozilla/readability)，能够智能识别并提取网页的主要内容，去除广告、导航栏、页脚等无关元素。
- **Markdown 转换**: 将提取出的干净 HTML 转换为格式良好的 Markdown，非常适合内容归档、索引或语言模型（LLM）处理。
- **结构化数据提取**: 通过定义基于 CSS 选择器的提取规则（Schema），可以从 HTML 中精确抓取任何数据，并将其构造成嵌套的 JSON 对象或数组。
- **元数据解析**: 自动提取丰富的页面元数据，包括但不限于：
  - 标题 (`title`)
  - 作者 (`byline`)
  - 摘要 (`excerpt`)
  - 站点名称 (`siteName`)
  - 发布日期 (`publishedTime`)
  - 语言和文字方向 (`lang`, `dir`)
  - 支持从标准 Meta 标签、Open Graph、JSON-LD 等多种来源解析。
- **URL 自动处理**: 在提取过程中，自动将相对 URL（如 `/about`, `../img.png`）根据提供的基准 URL 转换为绝对 URL。
- **双提取引擎**:
  - **HAST Extractor (默认)**: 基于 `unified/hast` 生态，速度快，纯 JavaScript 实现，无需浏览器环境。
  - **JSDOM Extractor**: 基于 `jsdom`，提供一个模拟的浏览器环境，支持更复杂的选择器和 DOM 操作，但性能开销更大。

## 安装

```bash
npm install @isdk/html-extractor
```

## 快速上手

该库提供了一个统一的入口函数 `extractHtmlContent`，可以根据传入的选项自动选择提取模式。

### 1. 提取可读的 Markdown

当不提供 `extractionRules` 时，默认提取文章正文并转换为 Markdown, 返回结果是包含内容和metadata对象，包含以下字段：

```ts
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
```

```typescript
import { extractHtmlContent } from '@isdk/html-extractor';

const html = `
  <!DOCTYPE html>
  <html>
    <head><title>我的文章</title></head>
    <body>
      <nav>...</nav>
      <article>
        <h1>文章标题</h1>
        <p>这是第一段内容。</p>
        <div class="ad">这是广告，应该被忽略。</div>
        <p>这是第二段内容。</p>
      </article>
      <footer>...</footer>
    </body>
  </html>
`;

async function main() {
  const result = await extractHtmlContent(html, { url: 'https://example.com' });
  if (typeof result?.content === 'string') {
    console.log(result.content);
  }
}

main();
```

**输出:**

```markdown
# 文章标题

这是第一段内容。

这是第二段内容。
```

### 2. 提取结构化数据 (JSON)

当提供 `extractionRules` 时，会根据规则提取结构化数据。

```typescript
import { extractHtmlContent, ExtractionRule } from '@isdk/html-extractor';

const html = `
  <div class="profile">
    <h1 class="name">John Doe</h1>
    <div class="details">
      <span class="age">30</span>
      <a href="/profile/johndoe">个人主页</a>
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
  // 注意：当提供 extractionRules 时，函数是同步的
  const result = extractHtmlContent(html, { extractionRules: rules });
  console.log(JSON.stringify(result, null, 2));
}

main();
```

**输出:**

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

## API 参考

### `toReadableMarkdown(html, options)`

将 HTML 转换为包含元数据的可读 Markdown。

- `html` (string): 输入的 HTML 字符串。
- `options` (ReadableHtmlOptions):
  - `url` (string): 页面的基准 URL，用于解析相对链接。
  - `readabilityOptions` (object): 传递给 `Readability.js` 的自定义选项。

**返回** `Promise<TextContentResult>`:

```typescript
interface TextContentResult {
  title?: string | null;
  content: string; // Markdown 内容
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

根据规则将 HTML 提取为结构化数据。

- `html` (string): 输入的 HTML 字符串。
- `options` (StructuredOptions):
  - `extractionRules` (ExtractionRule): 定义提取逻辑的规则对象。
  - `extractorOptions` (any): 传递给提取器引擎的选项。

**返回** `any`: 根据规则定义的结构化数据。

### `extractHtmlMetadata(html, options)`

从 HTML 中提取元数据。

- `html` (string | Root): HTML 字符串或 HAST 树。
- `options` (ExtractOptions):
  - `useH1AsTitleFallback` (boolean): 是否使用第一个 `<h1>` 作为标题的备选项。默认为 `false`。

**返回** `HtmlMetadata`:

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

确保 HTML 中存在 `<base>` 标签。如果不存在，则会添加一个；如果已存在，则不作任何修改。

- `html` (string | Root): HTML 字符串或 HAST 树。
- `baseUrl` (string): 要设置的基准 URL。

**返回** `string | Root | undefined`: 如果进行了修改，则返回新的 HTML 字符串或 HAST 树；否则返回 `undefined`。

## 结构化提取规则 (`ExtractionRule`)

提取规则是一个描述如何从 HTML 中查找和转换数据的对象。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | `string` | **(可选)** 用于查找元素的 CSS 选择器。如果省略，则在当前上下文（或整个文档）中操作。 |
| `type` | `string` | **(可选)** 提取的数据类型。可以是 `'string'`, `'number'`, `'boolean'`, `'array'`, `'object'`。默认为 `'string'`。 |
| `attribute` | `string` | **(可选)** 指定要提取的 HTML 元素属性，例如 `href`, `src`, `data-id`。如果省略，则提取元素的文本内容。 |
| `multiple` | `boolean` | **(可选)** 如果为 `true`，则使用 `querySelectorAll` 查找所有匹配的元素，并将结果作为数组返回。等同于 `type: 'array'`。 |
| `required` | `boolean` | **(可选)** 如果为 `true` 且未找到任何内容，则会抛出错误。 |
| `default` | `any` | **(可选)** 如果未找到任何内容，则返回此默认值。 |
| `transform` | `(value: any, element?: any) => any` | **(可选)** 一个函数，用于在返回值之前对提取的数据进行自定义转换。 |
| `properties` | `Record<string, ExtractionRule>` | **(仅用于 `type: 'object'`)** 一个对象，其键是输出对象的属性名，值是用于提取该属性的嵌套规则。 |
| `items` | `ExtractionRule` | **(仅用于 `type: 'array'`)** 一个规则对象，用于处理由 `selector` 选中的每个元素。 |

## 许可证

[MIT](./LICENSE-MIT)
