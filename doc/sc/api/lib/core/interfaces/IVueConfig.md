[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1364](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1364)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1366](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1366)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1368](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1368)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1369](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1369)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1365](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1365)

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

Defined in: [lib/core.ts:1367](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1367)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1370](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1370)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`
