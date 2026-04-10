[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1327](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1327)

Vue 实例

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1328](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1328)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1329](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1329)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1330](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1330)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1334](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1334)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1335](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1335)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1336)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1337)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1338](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1338)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1339](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1339)

#### Index Signature

\[`key`: `string`\]: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

#### default

> **default**: ((`o?`) => [`IVNode`](IVNode.md)[]) \| `undefined`

***

### $watch

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1343)

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

Defined in: [lib/core.ts:1331](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1331)

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

Defined in: [lib/core.ts:1332](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1332)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1333](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1333)

#### Returns

`Promise`\<`void`\>
