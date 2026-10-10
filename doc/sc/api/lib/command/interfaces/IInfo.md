[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IInfo

# Interface: IInfo

Defined in: [lib/command.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L88)

不包含函数或内部对象的独立快照

## Extends

- [`IMetadata`](IMetadata.md)

## Properties

### annotations?

> `optional` **annotations?**: `object`

Defined in: [lib/command.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L63)

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

Defined in: [lib/command.ts:59](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L59)

#### Inherited from

[`IMetadata`](IMetadata.md).[`description`](IMetadata.md#description)

***

### disabledReason

> **disabledReason**: `string`

Defined in: [lib/command.ts:94](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L94)

***

### enabled

> **enabled**: `boolean`

Defined in: [lib/command.ts:93](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L93)

***

### exposed

> **exposed**: `boolean`

Defined in: [lib/command.ts:92](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L92)

***

### formId

> **formId**: `string`

Defined in: [lib/command.ts:90](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L90)

***

### inputSchema

> **inputSchema**: [`ISchema`](ISchema.md) & `object`

Defined in: [lib/command.ts:60](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L60)

#### Type Declaration

##### type

> **type**: `"object"`

#### Inherited from

[`IMetadata`](IMetadata.md).[`inputSchema`](IMetadata.md#inputschema)

***

### name

> **name**: `string`

Defined in: [lib/command.ts:57](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L57)

#### Inherited from

[`IMetadata`](IMetadata.md).[`name`](IMetadata.md#name)

***

### outputSchema?

> `optional` **outputSchema?**: [`ISchema`](ISchema.md)

Defined in: [lib/command.ts:61](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L61)

#### Inherited from

[`IMetadata`](IMetadata.md).[`outputSchema`](IMetadata.md#outputschema)

***

### panelId

> **panelId**: `string`

Defined in: [lib/command.ts:91](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L91)

***

### running

> **running**: `number`

Defined in: [lib/command.ts:95](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L95)

***

### taskId

> **taskId**: `string`

Defined in: [lib/command.ts:89](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L89)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command.ts:58](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L58)

#### Inherited from

[`IMetadata`](IMetadata.md).[`title`](IMetadata.md#title)
