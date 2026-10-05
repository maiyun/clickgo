[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [lib/core.ts:1808](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1808)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [lib/core.ts:1809](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1809)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [lib/core.ts:1817](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1817)

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

Defined in: [lib/core.ts:1811](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1811)

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

Defined in: [lib/core.ts:1810](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1810)

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

Defined in: [lib/core.ts:1812](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1812)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
