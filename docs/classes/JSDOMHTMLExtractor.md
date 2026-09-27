[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / JSDOMHTMLExtractor

# Class: JSDOMHTMLExtractor

Defined in: [html-extractor/src/jsdom-extractor.ts:7](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L7)

## Extends

- `BaseHTMLExtractor`\<`Document`, `Element`\>

## Constructors

### Constructor

> **new JSDOMHTMLExtractor**(): `JSDOMHTMLExtractor`

#### Returns

`JSDOMHTMLExtractor`

#### Inherited from

`BaseHTMLExtractor<Document, Element>.constructor`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [html-extractor/src/jsdom-extractor.ts:57](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L57)

#### Returns

`void`

***

### elementToHtml()

> **elementToHtml**(`element`): `string`

Defined in: [html-extractor/src/jsdom-extractor.ts:44](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L44)

#### Parameters

##### element

`Element`

#### Returns

`string`

#### Overrides

`BaseHTMLExtractor.elementToHtml`

***

### extract()

> **extract**(`html`, `schema`, `options?`): [`ExtractionResult`](../interfaces/ExtractionResult.md)

Defined in: [html-extractor/src/base-extractor.ts:23](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L23)

#### Parameters

##### html

`string`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

##### options?

`any`

#### Returns

[`ExtractionResult`](../interfaces/ExtractionResult.md)

#### Inherited from

`BaseHTMLExtractor.extract`

***

### extractArray()

> `protected` **extractArray**(`context`, `schema`): `any`[] \| `null`

Defined in: [html-extractor/src/base-extractor.ts:136](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L136)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`ArrayExtractionRule`](../interfaces/ArrayExtractionRule.md)

#### Returns

`any`[] \| `null`

#### Inherited from

`BaseHTMLExtractor.extractArray`

***

### extractAttribute()

> **extractAttribute**(`element`, `attributeName`): `string` \| `undefined`

Defined in: [html-extractor/src/jsdom-extractor.ts:39](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L39)

#### Parameters

##### element

`Element`

##### attributeName

`string`

#### Returns

`string` \| `undefined`

#### Overrides

`BaseHTMLExtractor.extractAttribute`

***

### extractAuto()

> `protected` **extractAuto**(`context`, `schema`): `any`

Defined in: [html-extractor/src/base-extractor.ts:185](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L185)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`any`

#### Inherited from

`BaseHTMLExtractor.extractAuto`

***

### extractBoolean()

> `protected` **extractBoolean**(`context`, `schema`): `boolean` \| `null`

Defined in: [html-extractor/src/base-extractor.ts:109](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L109)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`BooleanExtractionRule`](../interfaces/BooleanExtractionRule.md)

#### Returns

`boolean` \| `null`

#### Inherited from

`BaseHTMLExtractor.extractBoolean`

***

### extractMultiple()

> **extractMultiple**(`htmlDocuments`, `schema`): `Record`\<`string`, [`ExtractionResult`](../interfaces/ExtractionResult.md)\>

Defined in: [html-extractor/src/jsdom-extractor.ts:64](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L64)

#### Parameters

##### htmlDocuments

`object`[]

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`Record`\<`string`, [`ExtractionResult`](../interfaces/ExtractionResult.md)\>

***

### extractNumber()

> `protected` **extractNumber**(`context`, `schema`): `number` \| `null`

Defined in: [html-extractor/src/base-extractor.ts:83](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L83)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`NumberExtractionRule`](../interfaces/NumberExtractionRule.md)

#### Returns

`number` \| `null`

#### Inherited from

`BaseHTMLExtractor.extractNumber`

***

### extractObject()

> `protected` **extractObject**(`context`, `schema`): `Record`\<`string`, `any`\> \| `null`

Defined in: [html-extractor/src/base-extractor.ts:157](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L157)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`ObjectExtractionRule`](../interfaces/ObjectExtractionRule.md)

#### Returns

`Record`\<`string`, `any`\> \| `null`

#### Inherited from

`BaseHTMLExtractor.extractObject`

***

### extractString()

> `protected` **extractString**(`context`, `schema`): `string` \| `null` \| `undefined`

Defined in: [html-extractor/src/base-extractor.ts:60](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L60)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`StringExtractionRule`](../interfaces/StringExtractionRule.md)

#### Returns

`string` \| `null` \| `undefined`

#### Inherited from

`BaseHTMLExtractor.extractString`

***

### extractText()

> **extractText**(`element`): `string`

Defined in: [html-extractor/src/jsdom-extractor.ts:35](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L35)

#### Parameters

##### element

`Element`

#### Returns

`string`

#### Overrides

`BaseHTMLExtractor.extractText`

***

### getAttributes()

> **getAttributes**(`element`): `Record`\<`string`, `any`\>

Defined in: [html-extractor/src/jsdom-extractor.ts:48](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L48)

#### Parameters

##### element

`Element`

#### Returns

`Record`\<`string`, `any`\>

#### Overrides

`BaseHTMLExtractor.getAttributes`

***

### handleMissingValue()

> `protected` **handleMissingValue**(`schema`): `any`

Defined in: [html-extractor/src/base-extractor.ts:201](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L201)

#### Parameters

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`any`

#### Inherited from

`BaseHTMLExtractor.handleMissingValue`

***

### inferSchemaType()

> `protected` **inferSchemaType**(`schema`): `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"`

Defined in: [html-extractor/src/base-extractor.ts:195](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L195)

#### Parameters

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"`

#### Inherited from

`BaseHTMLExtractor.inferSchemaType`

***

### parse()

> **parse**(`html`): `Document`

Defined in: [html-extractor/src/jsdom-extractor.ts:10](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L10)

#### Parameters

##### html

`string`

#### Returns

`Document`

#### Overrides

`BaseHTMLExtractor.parse`

***

### parseBooleanValue()

> `protected` **parseBooleanValue**(`value`): `boolean`

Defined in: [html-extractor/src/base-extractor.ts:131](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L131)

#### Parameters

##### value

`string`

#### Returns

`boolean`

#### Inherited from

`BaseHTMLExtractor.parseBooleanValue`

***

### processSchema()

> `protected` **processSchema**(`context`, `schema`): `any`

Defined in: [html-extractor/src/base-extractor.ts:29](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/base-extractor.ts#L29)

#### Parameters

##### context

`Document` \| `Element`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`any`

#### Inherited from

`BaseHTMLExtractor.processSchema`

***

### selectElement()

> **selectElement**(`context`, `schema`): `Element` \| `null`

Defined in: [html-extractor/src/jsdom-extractor.ts:15](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L15)

#### Parameters

##### context

`JSDOMNode`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`Element` \| `null`

#### Overrides

`BaseHTMLExtractor.selectElement`

***

### selectElements()

> **selectElements**(`context`, `schema`): `Element`[]

Defined in: [html-extractor/src/jsdom-extractor.ts:25](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/jsdom-extractor.ts#L25)

#### Parameters

##### context

`JSDOMNode`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`Element`[]

#### Overrides

`BaseHTMLExtractor.selectElements`
