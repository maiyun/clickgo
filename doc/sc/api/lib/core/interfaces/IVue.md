[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1520](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1520)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1521](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1521)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1522](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1522)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1523](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1523)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1527](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1527)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1528](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1528)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1529](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1529)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1530](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1530)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1531](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1531)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1532](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1532)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1536](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1536)

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

Defined in: [lib/core.ts:1524](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1524)

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

Defined in: [lib/core.ts:1525](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1525)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1526](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1526)

#### Returns

`Promise`\<`void`\>
