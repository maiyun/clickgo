[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [lib/core.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1350)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [lib/core.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1351)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [lib/core.ts:1359](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1359)

#### Parameters

##### tag

`string`

##### props?

`any`[] | `Record`\<`string`, `any`\>

##### list?

`any`[]

#### Returns

`any`

***

### reactive()

> **reactive**\<`T`\>(`obj`): `T`

Defined in: [lib/core.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1353)

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

Defined in: [lib/core.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1352)

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

Defined in: [lib/core.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1354)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
