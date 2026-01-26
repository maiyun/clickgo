[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [dist/lib/core.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1351)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1353)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [dist/lib/core.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1355)

***

### performance

> **performance**: `boolean`

Defined in: [dist/lib/core.ts:1356](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1356)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [dist/lib/core.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1352)

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

Defined in: [dist/lib/core.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1354)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [dist/lib/core.ts:1357](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1357)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`
