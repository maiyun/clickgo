[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1379](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1379)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1381](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1381)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1383](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1383)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1384](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1384)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1380](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1380)

#### Parameters

##### err

`unknown`

##### instance

[`IVue`](IVue.md) | `null`

##### info

`string`

#### Returns

`void`

***

### isCustomElement()

> **isCustomElement**(`tag`): `boolean`

Defined in: [lib/core.ts:1382](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1382)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1385](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1385)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`
