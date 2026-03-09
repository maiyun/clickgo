[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1374](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1374)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1386](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1386)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1377](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1377)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1384](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1384)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1375](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1375)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1376](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1376)

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

Defined in: [lib/core.ts:1378](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1378)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1379](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1379)

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

Defined in: [lib/core.ts:1380](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1380)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1381](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1381)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1382](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1382)

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

Defined in: [lib/core.ts:1383](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1383)

#### Returns

`void`
