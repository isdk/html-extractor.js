[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / toReadableHtml

# Function: toReadableHtml()

> **toReadableHtml**(`html`, `options?`): [`ReadableHtmlResult`](../interfaces/ReadableHtmlResult.md) \| `null`

Defined in: [html-extractor/src/to-readable-html.ts:159](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L159)

Converts HTML content into a readable format by parsing and extracting the main content.
Uses Mozilla's Readability library to extract article content and metadata.

## Parameters

### html

`string`

The raw HTML string to parse

### options?

[`ReadableHtmlOptions`](../interfaces/ReadableHtmlOptions.md) = `{}`

Configuration options for parsing and processing

## Returns

[`ReadableHtmlResult`](../interfaces/ReadableHtmlResult.md) \| `null`

Parsed readable content with metadata, or null if parsing fails
