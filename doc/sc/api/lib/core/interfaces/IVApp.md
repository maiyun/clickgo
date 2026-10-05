[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1834](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1834)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1846](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1846)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1837](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1837)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1844](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1844)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1835](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1835)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1836](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1836)

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

Defined in: [lib/core.ts:1838](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1838)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1839](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1839)

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

Defined in: [lib/core.ts:1840](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1840)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1841](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1841)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1842](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1842)

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

Defined in: [lib/core.ts:1843](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1843)

#### Returns

`void`
