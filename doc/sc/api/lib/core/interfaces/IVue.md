[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [dist/lib/core.ts:1299](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1299)

Vue 实例

## Indexable

\[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1300](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1300)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1301](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1301)

***

### $el

> **$el**: `HTMLElement`

Defined in: [dist/lib/core.ts:1302](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1302)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1306](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1306)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [dist/lib/core.ts:1307](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1307)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1308](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1308)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [dist/lib/core.ts:1309](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1309)

***

### $root

> **$root**: `IVue`

Defined in: [dist/lib/core.ts:1310](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1310)

***

### $slots

> **$slots**: `object`

Defined in: [dist/lib/core.ts:1311](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1311)

#### Index Signature

\[`key`: `string`\]: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

#### default

> **default**: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

***

### $watch()

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [dist/lib/core.ts:1315](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1315)

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

Defined in: [dist/lib/core.ts:1303](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1303)

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

Defined in: [dist/lib/core.ts:1304](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1304)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1305](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1305)

#### Returns

`Promise`\<`void`\>
