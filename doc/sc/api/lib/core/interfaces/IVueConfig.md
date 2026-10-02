[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1790](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1790)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1792](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1792)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1794](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1794)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1795](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1795)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1791](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1791)

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

Defined in: [lib/core.ts:1793](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1793)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1796](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1796)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) \| `null`

##### trace

`string`

#### Returns

`void`
