[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1671](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1671)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1673](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1673)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1675](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1675)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1676](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1676)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1672](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1672)

#### Parameters

##### err

`unknown`

##### instance

[`IVue`](IVue.md) \| `null`

##### info

`string`

#### Returns

`void`

***

### isCustomElement()

> **isCustomElement**(`tag`): `boolean`

Defined in: [lib/core.ts:1674](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1674)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1677](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1677)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) \| `null`

##### trace

`string`

#### Returns

`void`
