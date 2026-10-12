[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1827](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1827)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1828](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1828)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1829](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1829)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1830](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1830)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1834](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1834)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1835](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1835)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1836](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1836)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1837](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1837)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1838](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1838)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1839](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1839)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1843](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1843)

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

Defined in: [lib/core.ts:1831](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1831)

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

Defined in: [lib/core.ts:1832](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1832)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1833](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1833)

#### Returns

`Promise`\<`void`\>
