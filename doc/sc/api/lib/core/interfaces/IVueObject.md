[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [lib/core.ts:1663](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1663)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [lib/core.ts:1664](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1664)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [lib/core.ts:1672](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1672)

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

Defined in: [lib/core.ts:1666](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1666)

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

Defined in: [lib/core.ts:1665](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1665)

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

Defined in: [lib/core.ts:1667](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1667)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
