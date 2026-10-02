[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1800](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1800)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1812](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1812)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1803](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1803)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1810](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1810)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1801](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1801)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1802](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1802)

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

Defined in: [lib/core.ts:1804](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1804)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1805](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1805)

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

Defined in: [lib/core.ts:1806](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1806)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1807](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1807)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1808](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1808)

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

Defined in: [lib/core.ts:1809](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1809)

#### Returns

`void`
