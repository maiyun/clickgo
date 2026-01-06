[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [dist/lib/core.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1321)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [dist/lib/core.ts:1322](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1322)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [dist/lib/core.ts:1330](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1330)

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

Defined in: [dist/lib/core.ts:1324](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1324)

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

Defined in: [dist/lib/core.ts:1323](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1323)

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

Defined in: [dist/lib/core.ts:1325](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1325)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`
