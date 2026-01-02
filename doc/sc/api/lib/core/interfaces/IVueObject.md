[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [dist/lib/core.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1316)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [dist/lib/core.ts:1317](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1317)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [dist/lib/core.ts:1325](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1325)

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

Defined in: [dist/lib/core.ts:1319](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1319)

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

Defined in: [dist/lib/core.ts:1318](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1318)

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

Defined in: [dist/lib/core.ts:1320](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1320)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
