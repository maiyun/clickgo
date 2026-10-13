[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [lib/core.ts:1572](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1572)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1574](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1574)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [lib/core.ts:1576](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1576)

***

### performance

> **performance**: `boolean`

Defined in: [lib/core.ts:1577](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1577)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [lib/core.ts:1573](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1573)

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

Defined in: [lib/core.ts:1575](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1575)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [lib/core.ts:1578](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1578)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) \| `null`

##### trace

`string`

#### Returns

`void`
