[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / TextContentResult

# Interface: TextContentResult

Defined in: [html-extractor/src/to-readable-markdown.ts:14](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L14)

Interface defining the structure of text content extraction results.
Contains various metadata fields along with the main content and success status.

## Properties

### byline?

> `optional` **byline?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:22](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L22)

Optional byline/author information

***

### content

> **content**: `string`

Defined in: [html-extractor/src/to-readable-markdown.ts:18](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L18)

Main content text in markdown format

***

### dir?

> `optional` **dir?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:26](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L26)

The text direction (e.g., 'ltr' or 'rtl')

***

### error?

> `optional` **error?**: `string`

Defined in: [html-extractor/src/to-readable-markdown.ts:36](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L36)

Optional error message if extraction failed

***

### excerpt?

> `optional` **excerpt?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:20](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L20)

Optional excerpt/summary of the content

***

### lang?

> `optional` **lang?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:30](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L30)

Optional language code of the content

***

### length?

> `optional` **length?**: `number` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:24](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L24)

Optional length of the content in characters

***

### publishedTime?

> `optional` **publishedTime?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:32](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L32)

The published time of the article in ISO format for metadata "article:published_time" or "parsely-pub-date"

***

### siteName?

> `optional` **siteName?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:28](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L28)

Optional name of the website/source

***

### success

> **success**: `boolean`

Defined in: [html-extractor/src/to-readable-markdown.ts:34](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L34)

Indicates whether the extraction was successful

***

### title?

> `optional` **title?**: `string` \| `null`

Defined in: [html-extractor/src/to-readable-markdown.ts:16](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L16)

Optional title of the extracted content
