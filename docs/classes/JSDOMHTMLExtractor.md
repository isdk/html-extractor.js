[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / JSDOMHTMLExtractor

# Class: JSDOMHTMLExtractor

Defined in: [jsdom-extractor.ts:10](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/jsdom-extractor.ts#L10)

## Constructors

### Constructor

> **new JSDOMHTMLExtractor**(): `JSDOMHTMLExtractor`

#### Returns

`JSDOMHTMLExtractor`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [jsdom-extractor.ts:314](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/jsdom-extractor.ts#L314)

清理资源

#### Returns

`void`

***

### extract()

> **extract**(`html`, `schema`): [`ExtractionResult`](../interfaces/ExtractionResult.md)

Defined in: [jsdom-extractor.ts:16](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/jsdom-extractor.ts#L16)

提取 HTML 内容

#### Parameters

##### html

`string`

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

[`ExtractionResult`](../interfaces/ExtractionResult.md)

***

### extractMultiple()

> **extractMultiple**(`htmlDocuments`, `schema`): `Record`\<`string`, [`ExtractionResult`](../interfaces/ExtractionResult.md)\>

Defined in: [jsdom-extractor.ts:25](https://github.com/isdk/html-extractor.js/blob/03c7744f8cdba6c993e1072972ef3a0f111ee64d/src/jsdom-extractor.ts#L25)

批量提取多个 HTML 文档

#### Parameters

##### htmlDocuments

`object`[]

##### schema

[`ExtractionRule`](../type-aliases/ExtractionRule.md)

#### Returns

`Record`\<`string`, [`ExtractionResult`](../interfaces/ExtractionResult.md)\>
