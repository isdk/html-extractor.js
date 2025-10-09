[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / BaseExtractionRule

# Interface: BaseExtractionRule

Defined in: [extractor-types.ts:10](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L10)

## Extended by

- [`StringExtractionRule`](StringExtractionRule.md)
- [`NumberExtractionRule`](NumberExtractionRule.md)
- [`BooleanExtractionRule`](BooleanExtractionRule.md)
- [`ArrayExtractionRule`](ArrayExtractionRule.md)
- [`ObjectExtractionRule`](ObjectExtractionRule.md)

## Properties

### attribute?

> `optional` **attribute**: `string`

Defined in: [extractor-types.ts:13](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L13)

***

### default?

> `optional` **default**: `any`

Defined in: [extractor-types.ts:16](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L16)

***

### multiple?

> `optional` **multiple**: `boolean`

Defined in: [extractor-types.ts:14](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L14)

***

### required?

> `optional` **required**: `boolean`

Defined in: [extractor-types.ts:15](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L15)

***

### selector?

> `optional` **selector**: `string`

Defined in: [extractor-types.ts:11](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L11)

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

***

### type?

> `optional` **type**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"`

Defined in: [extractor-types.ts:12](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/extractor-types.ts#L12)
