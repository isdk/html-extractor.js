[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadableHtmlResult

# Interface: ReadableHtmlResult

Defined in: [to-readable-html.ts:56](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L56)

Interface representing the result of the readable HTML parsing operation.
Contains various metadata and content extracted from the parsed document.

## Properties

### byline?

> `optional` **byline**: `null` \| `string`

Defined in: [to-readable-html.ts:68](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L68)

The author byline information

***

### content?

> `optional` **content**: `null` \| `Element`

Defined in: [to-readable-html.ts:60](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L60)

The main content element of the parsed document

***

### dir?

> `optional` **dir**: `null` \| `string`

Defined in: [to-readable-html.ts:70](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L70)

The text direction (e.g., 'ltr' or 'rtl')

***

### excerpt?

> `optional` **excerpt**: `null` \| `string`

Defined in: [to-readable-html.ts:66](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L66)

A short excerpt or summary of the content

***

### lang?

> `optional` **lang**: `null` \| `string`

Defined in: [to-readable-html.ts:74](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L74)

The language of the document

***

### length?

> `optional` **length**: `null` \| `number`

Defined in: [to-readable-html.ts:64](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L64)

The length of the text content

***

### publishedTime?

> `optional` **publishedTime**: `null` \| `string`

Defined in: [to-readable-html.ts:76](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L76)

The published time of the article in ISO format for "article:published_time" or "parsely-pub-date"

***

### siteName?

> `optional` **siteName**: `null` \| `string`

Defined in: [to-readable-html.ts:72](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L72)

The name of the website or publication

***

### textContent?

> `optional` **textContent**: `null` \| `string`

Defined in: [to-readable-html.ts:62](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L62)

The text content of the parsed document

***

### title?

> `optional` **title**: `null` \| `string`

Defined in: [to-readable-html.ts:58](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/to-readable-html.ts#L58)

The title of the article or document
