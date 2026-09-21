[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1622](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1622)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1623](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1623)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1624](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1624)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1625](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1625)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1629](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1629)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1630](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1630)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1631](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1631)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1632](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1632)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1633](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1633)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1634](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1634)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1638](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1638)

#### Parameters

##### o

`any`

##### cb

(`n`, `o`) => `void`

##### opt?

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

`void`

## Methods

### $emit()

> **$emit**(`name`, ...`arg`): `void`

Defined in: [lib/core.ts:1626](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1626)

#### Parameters

##### name

`string`

##### arg

...`any`

#### Returns

`void`

***

### $forceUpdate()

> **$forceUpdate**(): `void`

Defined in: [lib/core.ts:1627](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1627)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1628](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1628)

#### Returns

`Promise`\<`void`\>
