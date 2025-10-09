[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / toReadableHtml

# Function: toReadableHtml()

> **toReadableHtml**(`html`, `options`): `null` \| [`ReadableHtmlResult`](../interfaces/ReadableHtmlResult.md)

Defined in: [to-readable-html.ts:126](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L126)

Converts HTML content into a readable format by parsing and extracting the main content.
Uses Mozilla's Readability library to extract article content and metadata.

## Parameters

### html

`string`

The raw HTML string to parse

### options

[`ReadableHtmlOptions`](../interfaces/ReadableHtmlOptions.md) = `{}`

Configuration options for parsing and processing

## Returns

`null` \| [`ReadableHtmlResult`](../interfaces/ReadableHtmlResult.md)

Parsed readable content with metadata, or null if parsing fails
