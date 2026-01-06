[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [dist/lib/core.ts:1347](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1347)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [dist/lib/core.ts:1359](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1359)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [dist/lib/core.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1350)

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1357](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1357)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [dist/lib/core.ts:1348](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1348)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1349](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1349)

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

Defined in: [dist/lib/core.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1351)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1352)

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

Defined in: [dist/lib/core.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1353)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [dist/lib/core.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1354)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [dist/lib/core.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1355)

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

Defined in: [dist/lib/core.ts:1356](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1356)

#### Returns

`void`
