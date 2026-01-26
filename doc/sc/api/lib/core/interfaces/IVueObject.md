[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [dist/lib/core.ts:1335](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1335)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [dist/lib/core.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1336)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [dist/lib/core.ts:1344](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1344)

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

Defined in: [dist/lib/core.ts:1338](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1338)

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

Defined in: [dist/lib/core.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1337)

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

Defined in: [dist/lib/core.ts:1339](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1339)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
