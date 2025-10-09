[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ensureBaseUrl

# Function: ensureBaseUrl()

Ensures a <base> tag exists in an HTML document (provided as a string or a HAST tree).

This function checks for the presence of a <base> tag, and if not found,
inserts one at the beginning of the <head> element. It can handle both
raw HTML strings and HAST trees as input, returning the same type.

## Param

The raw HTML string or HAST tree.

## Param

The URL to set as the href for the <base> tag.

## Call Signature

> **ensureBaseUrl**(`html`, `baseUrl`, `options?`): `undefined` \| `string`

Defined in: [ensure-base-url.ts:13](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/ensure-base-url.ts#L13)

Ensures a <base> tag exists in an HTML string.

### Parameters

#### html

`string`

The raw HTML string to process.

#### baseUrl

`string`

The URL for the <base> tag's href attribute.

#### options?

`Options`

### Returns

`undefined` \| `string`

A new HTML string with the <base> tag, or undefined if no changes were made.

## Call Signature

> **ensureBaseUrl**(`tree`, `baseUrl`, `options?`): `undefined` \| `Root`

Defined in: [ensure-base-url.ts:20](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/ensure-base-url.ts#L20)

Ensures a <base> tag exists in a HAST tree.

### Parameters

#### tree

`Root`

The HAST tree (Root node) to process.

#### baseUrl

`string`

The URL for the <base> tag's href attribute.

#### options?

`Options`

### Returns

`undefined` \| `Root`

The modified HAST tree, or undefined if no changes were made.
