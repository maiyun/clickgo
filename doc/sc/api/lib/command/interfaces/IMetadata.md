[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IMetadata

# Interface: IMetadata

Defined in: lib/command/types.ts:62

与 MCP 工具描述对齐的公开命令元数据

## Extended by

- [`IDefinition`](IDefinition.md)
- [`IInfo`](IInfo.md)

## Properties

### annotations?

> `optional` **annotations?**: `object`

Defined in: lib/command/types.ts:69

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

Defined in: lib/command/types.ts:65

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: lib/command/types.ts:66

#### Type Declaration

##### type

> **type**: `"object"`

***

### name

> **name**: `string`

Defined in: lib/command/types.ts:63

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: lib/command/types.ts:67

***

### title?

> `optional` **title?**: `string`

Defined in: lib/command/types.ts:64
