[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [dist/lib/core.ts:1285](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1285)

Vue 实例

## Indexable

\[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1286](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1286)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1287](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1287)

***

### $el

> **$el**: `HTMLElement`

Defined in: [dist/lib/core.ts:1288](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1288)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1292](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1292)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [dist/lib/core.ts:1293](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1293)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1294](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1294)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [dist/lib/core.ts:1295](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1295)

***

### $root

> **$root**: `IVue`

Defined in: [dist/lib/core.ts:1296](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1296)

***

### $slots

> **$slots**: `object`

Defined in: [dist/lib/core.ts:1297](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1297)

#### Index Signature

\[`key`: `string`\]: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

#### default

> **default**: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

***

### $watch()

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [dist/lib/core.ts:1301](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1301)

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

Defined in: [dist/lib/core.ts:1289](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1289)

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

Defined in: [dist/lib/core.ts:1290](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1290)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1291](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1291)

#### Returns

`Promise`\<`void`\>
