[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [dist/lib/core.ts:1361](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1361)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [dist/lib/core.ts:1373](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1373)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [dist/lib/core.ts:1364](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1364)

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1371](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1371)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [dist/lib/core.ts:1362](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1362)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1363](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1363)

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

Defined in: [dist/lib/core.ts:1365](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1365)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1366](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1366)

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

Defined in: [dist/lib/core.ts:1367](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1367)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [dist/lib/core.ts:1368](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1368)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [dist/lib/core.ts:1369](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1369)

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

Defined in: [dist/lib/core.ts:1370](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1370)

#### Returns

`void`
