[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IInfo

# Interface: IInfo

Defined in: [lib/command.ts:92](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L92)

不包含函数或内部对象的独立快照

## Extends

- [`IMetadata`](IMetadata.md)

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

### description

> **description**: `string`

Defined in: [lib/command.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L63)

#### Inherited from

[`IMetadata`](IMetadata.md).[`description`](IMetadata.md#description)

***

### disabledReason

> **disabledReason**: `string`

Defined in: [lib/command.ts:98](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L98)

***

### enabled

> **enabled**: `boolean`

Defined in: [lib/command.ts:97](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L97)

***

### exposed

> **exposed**: `boolean`

Defined in: [lib/command.ts:96](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L96)

***

### formId

> **formId**: `string`

Defined in: [lib/command.ts:94](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L94)

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

### panelId

> **panelId**: `string`

Defined in: [lib/command.ts:95](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L95)

***

### running

> **running**: `number`

Defined in: [lib/command.ts:99](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L99)

***

### taskId

> **taskId**: `string`

Defined in: [lib/command.ts:93](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L93)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L62)

#### Inherited from

[`IMetadata`](IMetadata.md).[`title`](IMetadata.md#title)
