[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / ObjectExtractionRule

# Interface: ObjectExtractionRule

Defined in: [extractor-types.ts:37](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L37)

## Extends

- [`BaseExtractionRule`](BaseExtractionRule.md)

## Properties

### attribute?

> `optional` **attribute**: `string`

Defined in: [extractor-types.ts:13](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L13)

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`attribute`](BaseExtractionRule.md#attribute)

***

### default?

> `optional` **default**: `any`

Defined in: [extractor-types.ts:16](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L16)

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`default`](BaseExtractionRule.md#default)

***

### multiple?

> `optional` **multiple**: `boolean`

Defined in: [extractor-types.ts:14](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L14)

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`multiple`](BaseExtractionRule.md#multiple)

***

### properties?

> `optional` **properties**: `Record`\<`string`, [`ExtractionRule`](../type-aliases/ExtractionRule.md)\>

Defined in: [extractor-types.ts:39](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L39)

***

### required?

> `optional` **required**: `boolean`

Defined in: [extractor-types.ts:15](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L15)

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`required`](BaseExtractionRule.md#required)

***

### selector?

> `optional` **selector**: `string`

Defined in: [extractor-types.ts:11](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L11)

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`selector`](BaseExtractionRule.md#selector)

***

### transform()?

> `optional` **transform**: (`value`, `element?`) => `any`

Defined in: [extractor-types.ts:17](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L17)

#### Parameters

##### value

`any`

##### element?

`any`

#### Returns

`any`

#### Inherited from

[`BaseExtractionRule`](BaseExtractionRule.md).[`transform`](BaseExtractionRule.md#transform)

***

### type

> **type**: `"object"`

Defined in: [extractor-types.ts:38](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L38)

#### Overrides

[`BaseExtractionRule`](BaseExtractionRule.md).[`type`](BaseExtractionRule.md#type)
