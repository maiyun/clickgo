[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1602](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1602)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1603](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1603)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1604](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1604)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1605](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1605)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1609](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1609)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1610](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1610)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1611](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1611)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1612](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1612)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1613](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1613)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1614](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1614)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1618](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1618)

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

Defined in: [lib/core.ts:1606](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1606)

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

Defined in: [lib/core.ts:1607](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1607)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1608](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1608)

#### Returns

`Promise`\<`void`\>
