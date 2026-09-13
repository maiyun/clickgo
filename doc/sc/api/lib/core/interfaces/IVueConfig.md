[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1679](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1679)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1681](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1681)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1683](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1683)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1684](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1684)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1680](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1680)

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

Defined in: [lib/core.ts:1682](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1682)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1685](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1685)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) \| `null`

##### trace

`string`

#### Returns

`void`
