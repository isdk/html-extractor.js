[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / toReadableMarkdown

# Function: toReadableMarkdown()

> **toReadableMarkdown**(`html`, `options`): `Promise`\<[`TextContentResult`](../interfaces/TextContentResult.md)\>

Defined in: [to-readable-markdown.ts:45](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L45)

Converts HTML content to readable markdown format.

This function takes raw HTML input and processes it through readability algorithms from @mozilla/readability
to extract the main content, then converts that content to markdown format.
It handles error cases gracefully and returns structured result data.

## Parameters

### html

`string`

The HTML string to convert to readable markdown

### options

[`ReadableHtmlOptions`](../interfaces/ReadableHtmlOptions.md) = `{}`

Configuration options for HTML readability processing (optional)

## Returns

`Promise`\<[`TextContentResult`](../interfaces/TextContentResult.md)\>

A promise that resolves to a TextContentResult containing the processed content
         and metadata, with success flag indicating operation outcome
