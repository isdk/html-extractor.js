[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ensureBaseUrl

# Function: ensureBaseUrl()

Ensures a <base> tag exists in an HTML document (provided as a string or a HAST tree).

This function checks for the presence of a <base> tag, and if not found,
inserts one at the beginning of the <head> element. It can handle both
raw HTML strings and HAST trees as input, returning the same type.

## Param

**input**

The raw HTML string or HAST tree.

## Param

**baseUrl**

The URL to set as the href for the <base> tag.

## Call Signature

> **ensureBaseUrl**(`html`, `baseUrl`, `options?`): `string` \| `undefined`

Defined in: [html-extractor/src/ensure-base-url.ts:13](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/ensure-base-url.ts#L13)

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

`string` \| `undefined`

A new HTML string with the <base> tag, or undefined if no changes were made.

## Call Signature

> **ensureBaseUrl**(`tree`, `baseUrl`, `options?`): `Root` \| `undefined`

Defined in: [html-extractor/src/ensure-base-url.ts:20](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/ensure-base-url.ts#L20)

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

`Root` \| `undefined`

The modified HAST tree, or undefined if no changes were made.
