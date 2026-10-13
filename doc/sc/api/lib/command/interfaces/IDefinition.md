[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IDefinition

# Interface: IDefinition\<T\>

Defined in: [lib/command.ts:79](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L79)

应用声明一次，界面、浏览器代理和 Native 适配器共享执行函数

## Extends

- [`IMetadata`](IMetadata.md)

## Type Parameters

### T

`T` *extends* `Record`\<`string`, [`TJson`](../type-aliases/TJson.md)\> = `Record`\<`string`, [`TJson`](../type-aliases/TJson.md)\>

## Properties

### annotations?

> `optional` **annotations?**: `object`

Defined in: [lib/command.ts:67](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L67)

行为说明，不代替校验或授权

#### consequentialHint?

> `optional` **consequentialHint?**: `boolean`

WebMCP 的重要或不可逆现实效果说明

#### destructiveHint?

> `optional` **destructiveHint?**: `boolean`

#### idempotentHint?

> `optional` **idempotentHint?**: `boolean`

#### openWorldHint?

> `optional` **openWorldHint?**: `boolean`

#### readOnlyHint?

> `optional` **readOnlyHint?**: `boolean`

#### untrustedContentHint?

> `optional` **untrustedContentHint?**: `boolean`

#### Inherited from

[`IMetadata`](IMetadata.md).[`annotations`](IMetadata.md#annotations)

***

### concurrent?

> `optional` **concurrent?**: `boolean`

Defined in: [lib/command.ts:83](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L83)

默认拒绝同一命令并发；业务确认可并行时才开启

***

### description

> **description**: `string`

Defined in: [lib/command.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L63)

#### Inherited from

[`IMetadata`](IMetadata.md).[`description`](IMetadata.md#description)

***

### enabled?

> `optional` **enabled?**: () => `string` \| `boolean`

Defined in: [lib/command.ts:87](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L87)

true 为可用，false 或原因文本为不可用；每次执行重新检查

#### Returns

`string` \| `boolean`

***

### execute

> **execute**: (`args`, `context`) => [`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\> \| `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\>\>

Defined in: [lib/command.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L88)

#### Parameters

##### args

`T`

##### context

[`IContext`](IContext.md)

#### Returns

[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\> \| `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\>\>

***

### exposed?

> `optional` **exposed?**: `boolean`

Defined in: [lib/command.ts:81](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L81)

明确允许代理发现并调用；默认只允许应用内部调用

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: [lib/command.ts:64](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L64)

#### Type Declaration

##### type

> **type**: `"object"`

#### Inherited from

[`IMetadata`](IMetadata.md).[`inputSchema`](IMetadata.md#inputschema)

***

### name

> **name**: `string`

Defined in: [lib/command.ts:61](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L61)

#### Inherited from

[`IMetadata`](IMetadata.md).[`name`](IMetadata.md#name)

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: [lib/command.ts:65](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L65)

#### Inherited from

[`IMetadata`](IMetadata.md).[`outputSchema`](IMetadata.md#outputschema)

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/command.ts:85](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L85)

必须已经取得的框架权限；执行入口不弹授权窗

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L62)

#### Inherited from

[`IMetadata`](IMetadata.md).[`title`](IMetadata.md#title)
