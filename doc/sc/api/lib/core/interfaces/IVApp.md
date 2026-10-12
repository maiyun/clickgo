[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1889](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1889)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1901](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1901)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1892](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1892)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1899](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1899)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1890](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1890)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1891](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1891)

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

Defined in: [lib/core.ts:1893](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1893)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1894](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1894)

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

Defined in: [lib/core.ts:1895](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1895)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1896](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1896)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1897](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1897)

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

Defined in: [lib/core.ts:1898](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1898)

#### Returns

`void`
