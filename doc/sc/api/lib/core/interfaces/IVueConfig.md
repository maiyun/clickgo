[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [dist/lib/core.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1337)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1339](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1339)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [dist/lib/core.ts:1341](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1341)

***

### performance

> **performance**: `boolean`

Defined in: [dist/lib/core.ts:1342](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1342)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [dist/lib/core.ts:1338](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1338)

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

Defined in: [dist/lib/core.ts:1340](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1340)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [dist/lib/core.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1343)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`
