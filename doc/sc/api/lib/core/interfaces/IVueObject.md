[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [lib/core.ts:1868](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1868)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [lib/core.ts:1869](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1869)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [lib/core.ts:1877](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1877)

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

Defined in: [lib/core.ts:1871](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1871)

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

Defined in: [lib/core.ts:1870](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1870)

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

Defined in: [lib/core.ts:1872](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1872)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
