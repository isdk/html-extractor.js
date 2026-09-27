[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ReadabilityOptions

# Interface: ReadabilityOptions

Defined in: [html-extractor/src/to-readable-html.ts:84](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L84)

Interface representing configuration options for the Readability parser.
These options control how the content is parsed and extracted.

## Properties

### allowedVideoRegex?

> `optional` **allowedVideoRegex?**: `RegExp`

Defined in: [html-extractor/src/to-readable-html.ts:102](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L102)

Regular expression to match allowed video sources

***

### charThreshold?

> `optional` **charThreshold?**: `number`

Defined in: [html-extractor/src/to-readable-html.ts:92](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L92)

Minimum character threshold for content

***

### classesToPreserve?

> `optional` **classesToPreserve?**: `string`[]

Defined in: [html-extractor/src/to-readable-html.ts:94](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L94)

Array of CSS class names to preserve during parsing

***

### debug?

> `optional` **debug?**: `boolean`

Defined in: [html-extractor/src/to-readable-html.ts:86](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L86)

Enable or disable debug logging

***

### disableJSONLD?

> `optional` **disableJSONLD?**: `boolean`

Defined in: [html-extractor/src/to-readable-html.ts:100](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L100)

Disable JSON-LD metadata extraction

***

### keepClasses?

> `optional` **keepClasses?**: `boolean`

Defined in: [html-extractor/src/to-readable-html.ts:96](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L96)

Whether to keep CSS classes in the output

***

### maxElemsToParse?

> `optional` **maxElemsToParse?**: `number`

Defined in: [html-extractor/src/to-readable-html.ts:88](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L88)

Maximum number of elements to parse before giving up

***

### nbTopCandidates?

> `optional` **nbTopCandidates?**: `number`

Defined in: [html-extractor/src/to-readable-html.ts:90](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L90)

Number of top candidate elements to consider

***

### serializer?

> `optional` **serializer?**: (`node`) => `string`

Defined in: [html-extractor/src/to-readable-html.ts:98](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-html.ts#L98)

Custom serializer function for nodes

#### Parameters

##### node

`Node`

#### Returns

`string`
