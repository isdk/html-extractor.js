[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadableHtmlOptions

# Interface: ReadableHtmlOptions

Defined in: [to-readable-html.ts:126](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L126)

Interface representing options for the toReadableHtml function.
Controls the behavior of HTML parsing and processing.

## Properties

### emptyLinkBrackets?

> `optional` **emptyLinkBrackets?**: `false` \| \[`string`, `string`\]

Defined in: [to-readable-html.ts:138](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L138)

Delimiters to wrap around the text of empty links in the markdown output
(see `ToMarkdownOptions.emptyLinkBrackets`). Default: `['[', ']']`.
Only used when converting to markdown; ignored by `toReadableHtml` itself.

***

### emptyLinks?

> `optional` **emptyLinks?**: [`EmptyLinksAction`](../type-aliases/EmptyLinksAction.md)

Defined in: [to-readable-html.ts:148](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L148)

What to do with empty links (`<a>` without `href`, or with `href=""`/`"#"`).
Defaults to `'keep'` so they reach the markdown conversion, where their
text is wrapped in `emptyLinkBrackets` (default `[文字]`).
Set to `'unwrap'` to keep the link text as plain text, or `'remove'` to
drop empty links entirely.
Note: links to in-page anchors with a real target (e.g. `href="#section1"`)
are NOT considered empty and are always kept.

***

### readabilityOptions?

> `optional` **readabilityOptions?**: [`ReadabilityOptions`](ReadabilityOptions.md)

Defined in: [to-readable-html.ts:130](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L130)

Readability-specific parsing options

***

### removeComments?

> `optional` **removeComments?**: `boolean`

Defined in: [to-readable-html.ts:132](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L132)

Whether to remove HTML comments from the content (default: true)

***

### url?

> `optional` **url?**: `string`

Defined in: [to-readable-html.ts:128](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L128)

The URL of the document being parsed
