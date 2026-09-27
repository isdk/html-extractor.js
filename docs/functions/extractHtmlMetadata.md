[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / extractHtmlMetadata

# Function: extractHtmlMetadata()

> **extractHtmlMetadata**(`htmlContent`, `options?`): `HtmlMetadata`

Defined in: [html-extractor/src/extract-html-metadata.ts:46](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/extract-html-metadata.ts#L46)

Extracts metadata from HTML content, following the logic of Readability.js.

## Parameters

### htmlContent

`string` \| `Root`

The HTML string or parsed AST to extract metadata from

### options?

`ExtractOptions` = `{}`

Extraction options

## Returns

`HtmlMetadata`

The extracted metadata object
