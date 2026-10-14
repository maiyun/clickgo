[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1664](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1664)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1676](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1676)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1667](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1667)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1674](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1674)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1665](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1665)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1666](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1666)

##### Parameters

###### name

`string`

###### config

`any`

##### Returns

`this`

***

### directive()

#### Call Signature

> **directive**(`name`): `any`

Defined in: [lib/core.ts:1668](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1668)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1669](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1669)

##### Parameters

###### name

`string`

###### config

`any`

##### Returns

`this`

***

### mixin()

> **mixin**(`mixin`): `this`

Defined in: [lib/core.ts:1670](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1670)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1671](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1671)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1672](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1672)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`this`

***

### unmount()

> **unmount**(): `void`

Defined in: [lib/core.ts:1673](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1673)

#### Returns

`void`
