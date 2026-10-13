[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1894](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1894)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1906](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1906)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1897](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1897)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1904](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1904)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1895](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1895)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1896](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1896)

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

Defined in: [lib/core.ts:1898](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1898)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1899](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1899)

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

Defined in: [lib/core.ts:1900](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1900)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1901](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1901)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1902](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1902)

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

Defined in: [lib/core.ts:1903](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1903)

#### Returns

`void`
