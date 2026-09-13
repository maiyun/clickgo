[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1676](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1676)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1688](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1688)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1679](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1679)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1686](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1686)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1677](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1677)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1678](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1678)

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

Defined in: [lib/core.ts:1680](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1680)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1681](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1681)

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

Defined in: [lib/core.ts:1682](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1682)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1683](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1683)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1684](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1684)

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

Defined in: [lib/core.ts:1685](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1685)

#### Returns

`void`
