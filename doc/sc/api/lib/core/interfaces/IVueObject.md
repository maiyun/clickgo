[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [lib/core.ts:1774](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1774)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [lib/core.ts:1775](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1775)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [lib/core.ts:1783](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1783)

#### Parameters

##### tag

`string`

##### props?

`any`[] \| `Record`\<`string`, `any`\>

##### list?

`any`[]

#### Returns

`any`

***

### reactive()

> **reactive**\<`T`\>(`obj`): `T`

Defined in: [lib/core.ts:1777](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1777)

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

***

### ref()

> **ref**\<`T`\>(`obj`): `object`

Defined in: [lib/core.ts:1776](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1776)

#### Type Parameters

##### T

`T` *extends* `string` \| `number`

#### Parameters

##### obj

`T`

#### Returns

`object`

##### value

> **value**: `T`

***

### watch()

> **watch**(`v`, `cb`, `opt`): `void`

Defined in: [lib/core.ts:1778](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1778)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
