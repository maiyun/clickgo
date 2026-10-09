[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IMetadata

# Interface: IMetadata

Defined in: lib/command.ts:56

与 MCP 工具描述对齐的公开命令元数据

## Extended by

- [`IDefinition`](IDefinition.md)
- [`IInfo`](IInfo.md)

## Properties

### annotations?

> `optional` **annotations?**: `object`

Defined in: lib/command.ts:63

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

Defined in: lib/command.ts:59

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: lib/command.ts:60

#### Type Declaration

##### type

> **type**: `"object"`

***

### name

> **name**: `string`

Defined in: lib/command.ts:57

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: lib/command.ts:61

***

### title?

> `optional` **title?**: `string`

Defined in: lib/command.ts:58
