[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1613](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1613)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1614](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1614)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1615](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1615)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1616](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1616)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1620](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1620)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1621](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1621)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1622](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1622)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1623](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1623)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1624](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1624)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1625](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1625)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1629](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1629)

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

Defined in: [lib/core.ts:1617](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1617)

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

Defined in: [lib/core.ts:1618](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1618)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1619](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1619)

#### Returns

`Promise`\<`void`\>
