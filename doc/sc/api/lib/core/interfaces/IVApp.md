[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [dist/lib/core.ts:1341](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1341)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [dist/lib/core.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1353)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [dist/lib/core.ts:1344](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1344)

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1351)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [dist/lib/core.ts:1342](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1342)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1343)

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

Defined in: [dist/lib/core.ts:1345](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1345)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1346](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1346)

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

Defined in: [dist/lib/core.ts:1347](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1347)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [dist/lib/core.ts:1348](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1348)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [dist/lib/core.ts:1349](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1349)

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

Defined in: [dist/lib/core.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1350)

#### Returns

`void`
