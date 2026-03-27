[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1389](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1389)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1401](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1401)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1392](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1392)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1399](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1399)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1390](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1390)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1391](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1391)

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

Defined in: [lib/core.ts:1393](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1393)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1394](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1394)

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

Defined in: [lib/core.ts:1395](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1395)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1396](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1396)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1397](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1397)

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

Defined in: [lib/core.ts:1398](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1398)

#### Returns

`void`
