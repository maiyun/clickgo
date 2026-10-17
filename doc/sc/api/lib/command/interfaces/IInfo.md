[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IInfo

# Interface: IInfo

Defined in: lib/command/types.ts:94

不包含函数或内部对象的独立快照

## Extends

- [`IMetadata`](IMetadata.md)

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

#### Inherited from

[`IMetadata`](IMetadata.md).[`annotations`](IMetadata.md#annotations)

***

### description

> **description**: `string`

Defined in: lib/command/types.ts:65

#### Inherited from

[`IMetadata`](IMetadata.md).[`description`](IMetadata.md#description)

***

### disabledReason

> **disabledReason**: `string`

Defined in: lib/command/types.ts:100

***

### enabled

> **enabled**: `boolean`

Defined in: lib/command/types.ts:99

***

### exposed

> **exposed**: `boolean`

Defined in: lib/command/types.ts:98

***

### formId

> **formId**: `string`

Defined in: lib/command/types.ts:96

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: lib/command/types.ts:66

#### Type Declaration

##### type

> **type**: `"object"`

#### Inherited from

[`IMetadata`](IMetadata.md).[`inputSchema`](IMetadata.md#inputschema)

***

### name

> **name**: `string`

Defined in: lib/command/types.ts:63

#### Inherited from

[`IMetadata`](IMetadata.md).[`name`](IMetadata.md#name)

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: lib/command/types.ts:67

#### Inherited from

[`IMetadata`](IMetadata.md).[`outputSchema`](IMetadata.md#outputschema)

***

### panelId

> **panelId**: `string`

Defined in: lib/command/types.ts:97

***

### running

> **running**: `number`

Defined in: lib/command/types.ts:101

***

### taskId

> **taskId**: `string`

Defined in: lib/command/types.ts:95

***

### title?

> `optional` **title?**: `string`

Defined in: lib/command/types.ts:64

#### Inherited from

[`IMetadata`](IMetadata.md).[`title`](IMetadata.md#title)
