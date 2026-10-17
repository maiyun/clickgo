[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IMetadata

# Interface: IMetadata

Defined in: [lib/command/types.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L62)

与 MCP 工具描述对齐的公开命令元数据

## Extended by

- [`IDefinition`](IDefinition.md)
- [`IInfo`](IInfo.md)

## Properties

### annotations?

> `optional` **annotations?**: `object`

Defined in: [lib/command/types.ts:69](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L69)

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

***

### description

> **description**: `string`

Defined in: [lib/command/types.ts:65](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L65)

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: [lib/command/types.ts:66](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L66)

#### Type Declaration

##### type

> **type**: `"object"`

***

### name

> **name**: `string`

Defined in: [lib/command/types.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L63)

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: [lib/command/types.ts:67](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L67)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command/types.ts:64](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L64)
