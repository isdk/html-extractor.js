[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / extractHtmlMetadata

# Function: extractHtmlMetadata()

> **extractHtmlMetadata**(`htmlContent`, `options?`): `HtmlMetadata`

Defined in: [extract-html-metadata.ts:46](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/extract-html-metadata.ts#L46)

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
