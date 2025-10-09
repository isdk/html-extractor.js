[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadableHtmlOptions

# Interface: ReadableHtmlOptions

Defined in: [to-readable-html.ts:109](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L109)

Interface representing options for the toReadableHtml function.
Controls the behavior of HTML parsing and processing.

## Properties

### readabilityOptions?

> `optional` **readabilityOptions**: [`ReadabilityOptions`](ReadabilityOptions.md)

Defined in: [to-readable-html.ts:113](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L113)

Readability-specific parsing options

***

### removeComments?

> `optional` **removeComments**: `boolean`

Defined in: [to-readable-html.ts:115](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L115)

Whether to remove HTML comments from the content (default: true)

***

### url?

> `optional` **url**: `string`

Defined in: [to-readable-html.ts:111](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L111)

The URL of the document being parsed
