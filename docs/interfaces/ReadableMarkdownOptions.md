[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadableMarkdownOptions

# Interface: ReadableMarkdownOptions

Defined in: [html-extractor/src/to-readable-markdown.ts:6](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L6)

Interface representing options for the toReadableHtml function.
Controls the behavior of HTML parsing and processing.

## Extends

- [`ReadableHtmlOptions`](ReadableHtmlOptions.md).`ReadabilityOptions`

## Properties

### article?

> `optional` **article?**: `InjectedArticle` \| `null`

Defined in: mdast-plus/dist/index.d.ts:2472

A pre-computed Readability result to inject, so the plugin skips its
internal Readability pass and the article is parsed exactly once.
Intended for consumers that run Readability themselves (e.g. to apply
DOM-level cleanups before conversion).

All downstream features (metadata, `smartExcerpt`, `fields` projection,
`frontmatter`, `sourceLink`) work unchanged on the injected article.

#### Default Value

`undefined` (run the internal Readability pass)

#### Inherited from

`ReadabilityOptions.article`

***

### attachMetadata?

> `optional` **attachMetadata?**: `boolean`

Defined in: [html-extractor/src/to-readable-markdown.ts:7](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L7)

***

### emptyLinkBrackets?

> `optional` **emptyLinkBrackets?**: `false` \| \[`string`, `string`\]

Defined in: [html-extractor/src/to-readable-html.ts:138](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L138)

Delimiters to wrap around the text of empty links in the markdown output
(see `ToMarkdownOptions.emptyLinkBrackets`). Default: `['[', ']']`.
Only used when converting to markdown; ignored by `toReadableHtml` itself.

#### Inherited from

[`ReadableHtmlOptions`](ReadableHtmlOptions.md).[`emptyLinkBrackets`](ReadableHtmlOptions.md#emptylinkbrackets)

***

### emptyLinks?

> `optional` **emptyLinks?**: [`EmptyLinksAction`](../type-aliases/EmptyLinksAction.md)

Defined in: [html-extractor/src/to-readable-html.ts:148](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L148)

What to do with empty links (`<a>` without `href`, or with `href=""`/`"#"`).
Defaults to `'keep'` so they reach the markdown conversion, where their
text is wrapped in `emptyLinkBrackets` (default `[文字]`).
Set to `'unwrap'` to keep the link text as plain text, or `'remove'` to
drop empty links entirely.
Note: links to in-page anchors with a real target (e.g. `href="#section1"`)
are NOT considered empty and are always kept.

#### Inherited from

[`ReadableHtmlOptions`](ReadableHtmlOptions.md).[`emptyLinks`](ReadableHtmlOptions.md#emptylinks)

***

### extraMetadata?

> `optional` **extraMetadata?**: `Record`\<`string`, `any`\>

Defined in: mdast-plus/dist/index.d.ts:2499

Extra key-value pairs to inject into the frontmatter.
These will be merged with the readability metadata.

#### Inherited from

`ReadabilityOptions.extraMetadata`

***

### fields?

> `optional` **fields?**: `string`[] \| `Record`\<`string`, `string`\>

Defined in: mdast-plus/dist/index.d.ts:2494

Control the fields and names in metadata.
- If an array of strings, it acts as an allowlist (only these fields are kept).
- If an object, it maps original field names to new names. Only the keys present in the map are kept (Projection).

#### Inherited from

`ReadabilityOptions.fields`

***

### frontmatter?

> `optional` **frontmatter?**: `boolean` \| `"yaml"` \| `"toml"`

Defined in: mdast-plus/dist/index.d.ts:2477

Whether to inject metadata as frontmatter.

#### Default

```ts
false
```

#### Inherited from

`ReadabilityOptions.frontmatter`

***

### hast?

> `optional` **hast?**: `Record`\<`string`, `any`\>

Defined in: mdast-plus/dist/index.d.ts:2460

#### Inherited from

`ReadabilityOptions.hast`

***

### jsdom?

> `optional` **jsdom?**: `Record`\<`string`, `any`\>

Defined in: mdast-plus/dist/index.d.ts:2459

#### Inherited from

`ReadabilityOptions.jsdom`

***

### readability?

> `optional` **readability?**: `false` \| `Record`\<`string`, `any`\>

Defined in: mdast-plus/dist/index.d.ts:2458

#### Inherited from

`ReadabilityOptions.readability`

***

### readabilityOptions?

> `optional` **readabilityOptions?**: [`ReadabilityOptions`](ReadabilityOptions.md)

Defined in: [html-extractor/src/to-readable-html.ts:130](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L130)

Readability-specific parsing options

#### Inherited from

[`ReadableHtmlOptions`](ReadableHtmlOptions.md).[`readabilityOptions`](ReadableHtmlOptions.md#readabilityoptions)

***

### rehype-parse?

> `optional` **rehype-parse?**: `Record`\<`string`, `any`\>

Defined in: mdast-plus/dist/index.d.ts:2461

#### Inherited from

`ReadabilityOptions.rehype-parse`

***

### removeComments?

> `optional` **removeComments?**: `boolean`

Defined in: [html-extractor/src/to-readable-html.ts:132](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L132)

Whether to remove HTML comments from the content (default: true)

#### Inherited from

[`ReadableHtmlOptions`](ReadableHtmlOptions.md).[`removeComments`](ReadableHtmlOptions.md#removecomments)

***

### smartExcerpt?

> `optional` **smartExcerpt?**: `boolean` \| `SmartExcerptOptions`

Defined in: mdast-plus/dist/index.d.ts:2488

Whether to remove the excerpt if it is a duplicate or near-duplicate of the main content.
Useful when the content is short or the excerpt is just a subset of the content.

#### Default

```ts
true
```

#### Inherited from

`ReadabilityOptions.smartExcerpt`

***

### sourceLink?

> `optional` **sourceLink?**: `boolean`

Defined in: mdast-plus/dist/index.d.ts:2482

Whether to append source link at the bottom.

#### Default

```ts
false
```

#### Inherited from

`ReadabilityOptions.sourceLink`

***

### url?

> `optional` **url?**: `string`

Defined in: [html-extractor/src/to-readable-html.ts:128](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L128)

The URL of the document being parsed

#### Inherited from

[`ReadableHtmlOptions`](ReadableHtmlOptions.md).[`url`](ReadableHtmlOptions.md#url)
