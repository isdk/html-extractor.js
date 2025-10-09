[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / TextContentResult

# Interface: TextContentResult

Defined in: [to-readable-markdown.ts:8](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L8)

Interface defining the structure of text content extraction results.
Contains various metadata fields along with the main content and success status.

## Properties

### byline?

> `optional` **byline**: `null` \| `string`

Defined in: [to-readable-markdown.ts:16](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L16)

Optional byline/author information

***

### content

> **content**: `string`

Defined in: [to-readable-markdown.ts:12](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L12)

Main content text in markdown format

***

### dir?

> `optional` **dir**: `null` \| `string`

Defined in: [to-readable-markdown.ts:20](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L20)

The text direction (e.g., 'ltr' or 'rtl')

***

### error?

> `optional` **error**: `string`

Defined in: [to-readable-markdown.ts:30](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L30)

Optional error message if extraction failed

***

### excerpt?

> `optional` **excerpt**: `null` \| `string`

Defined in: [to-readable-markdown.ts:14](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L14)

Optional excerpt/summary of the content

***

### lang?

> `optional` **lang**: `null` \| `string`

Defined in: [to-readable-markdown.ts:24](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L24)

Optional language code of the content

***

### length?

> `optional` **length**: `null` \| `number`

Defined in: [to-readable-markdown.ts:18](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L18)

Optional length of the content in characters

***

### publishedTime?

> `optional` **publishedTime**: `null` \| `string`

Defined in: [to-readable-markdown.ts:26](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L26)

The published time of the article in ISO format for metadata "article:published_time" or "parsely-pub-date"

***

### siteName?

> `optional` **siteName**: `null` \| `string`

Defined in: [to-readable-markdown.ts:22](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L22)

Optional name of the website/source

***

### success

> **success**: `boolean`

Defined in: [to-readable-markdown.ts:28](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L28)

Indicates whether the extraction was successful

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [to-readable-markdown.ts:10](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-markdown.ts#L10)

Optional title of the extracted content
