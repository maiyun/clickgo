[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [lib/core.ts:1312](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1312)

Vue 实例

## Indexable

\[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1313](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1313)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1314](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1314)

***

### $el

> **$el**: `HTMLElement`

Defined in: [lib/core.ts:1315](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1315)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1319](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1319)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [lib/core.ts:1320](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1320)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [lib/core.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1321)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [lib/core.ts:1322](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1322)

***

### $root

> **$root**: `IVue`

Defined in: [lib/core.ts:1323](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1323)

***

### $slots

> **$slots**: `object`

Defined in: [lib/core.ts:1324](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1324)

#### Index Signature

\[`key`: `string`\]: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

#### default

> **default**: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

***

### $watch()

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [lib/core.ts:1328](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1328)

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

Defined in: [lib/core.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1316)

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

Defined in: [lib/core.ts:1317](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1317)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [lib/core.ts:1318](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1318)

#### Returns

`Promise`\<`void`\>
