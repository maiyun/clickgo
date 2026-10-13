[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [lib/core.ts:1582](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1582)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [lib/core.ts:1594](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1594)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [lib/core.ts:1585](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1585)

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1592](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1592)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [lib/core.ts:1583](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1583)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [lib/core.ts:1584](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1584)

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

Defined in: [lib/core.ts:1586](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1586)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [lib/core.ts:1587](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1587)

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

Defined in: [lib/core.ts:1588](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1588)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [lib/core.ts:1589](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1589)

#### Parameters

##### rootContainer

`string` \| `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [lib/core.ts:1590](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1590)

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

Defined in: [lib/core.ts:1591](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1591)

#### Returns

`void`
