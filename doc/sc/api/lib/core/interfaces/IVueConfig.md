[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [dist/lib/core.ts:1331](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1331)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1333](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1333)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [dist/lib/core.ts:1335](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1335)

***

### performance

> **performance**: `boolean`

Defined in: [dist/lib/core.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1336)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [dist/lib/core.ts:1332](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1332)

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

Defined in: [dist/lib/core.ts:1334](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1334)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [dist/lib/core.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1337)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`
