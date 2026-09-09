[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadableHtmlResult

# Interface: ReadableHtmlResult

Defined in: [to-readable-html.ts:56](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L56)

Interface representing the result of the readable HTML parsing operation.
Contains various metadata and content extracted from the parsed document.

## Properties

### byline?

> `optional` **byline?**: `string` \| `null`

Defined in: [to-readable-html.ts:68](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L68)

The author byline information

***

### content?

> `optional` **content?**: `Element` \| `null`

Defined in: [to-readable-html.ts:60](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L60)

The main content element of the parsed document

***

### dir?

> `optional` **dir?**: `string` \| `null`

Defined in: [to-readable-html.ts:70](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L70)

The text direction (e.g., 'ltr' or 'rtl')

***

### excerpt?

> `optional` **excerpt?**: `string` \| `null`

Defined in: [to-readable-html.ts:66](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L66)

A short excerpt or summary of the content

***

### lang?

> `optional` **lang?**: `string` \| `null`

Defined in: [to-readable-html.ts:74](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L74)

The language of the document

***

### length?

> `optional` **length?**: `number` \| `null`

Defined in: [to-readable-html.ts:64](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L64)

The length of the text content

***

### publishedTime?

> `optional` **publishedTime?**: `string` \| `null`

Defined in: [to-readable-html.ts:76](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L76)

The published time of the article in ISO format for "article:published_time" or "parsely-pub-date"

***

### siteName?

> `optional` **siteName?**: `string` \| `null`

Defined in: [to-readable-html.ts:72](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L72)

The name of the website or publication

***

### textContent?

> `optional` **textContent?**: `string` \| `null`

Defined in: [to-readable-html.ts:62](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L62)

The text content of the parsed document

***

### title?

> `optional` **title?**: `string` \| `null`

Defined in: [to-readable-html.ts:58](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L58)

The title of the article or document
