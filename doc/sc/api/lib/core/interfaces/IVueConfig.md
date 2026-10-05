[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1824](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1824)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1826](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1826)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1828](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1828)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1829](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1829)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1825](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1825)

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

Defined in: [lib/core.ts:1827](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1827)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1830](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1830)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) \| `null`

##### trace

`string`

#### Returns

`void`
