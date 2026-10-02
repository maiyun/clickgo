[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1738](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1738)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1739](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1739)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1740](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1740)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1741](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1741)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1745](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1745)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1746](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1746)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1747](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1747)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1748](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1748)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1749](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1749)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1750](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1750)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1754](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1754)

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

Defined in: [lib/core.ts:1742](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1742)

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

Defined in: [lib/core.ts:1743](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1743)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1744](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1744)

#### Returns

`Promise`\<`void`\>
