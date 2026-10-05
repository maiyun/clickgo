[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1772](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1772)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1773](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1773)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1774](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1774)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1775](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1775)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1779](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1779)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1780](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1780)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1781](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1781)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1782](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1782)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1783](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1783)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1784](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1784)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1788](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1788)

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

Defined in: [lib/core.ts:1776](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1776)

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

Defined in: [lib/core.ts:1777](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1777)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1778](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1778)

#### Returns

`Promise`\<`void`\>
