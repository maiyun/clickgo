[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / ISchema

# Interface: ISchema

Defined in: lib/command/types.ts:9

JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝

## Properties

### $defs?

> `optional` **$defs?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: lib/command/types.ts:12

***

### $ref?

> `optional` **$ref?**: `string`

Defined in: lib/command/types.ts:11

***

### $schema?

> `optional` **$schema?**: `string`

Defined in: lib/command/types.ts:10

***

### additionalProperties?

> `optional` **additionalProperties?**: `boolean` \| `ISchema`

Defined in: lib/command/types.ts:20

***

### allOf?

> `optional` **allOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command/types.ts:34

***

### anyOf?

> `optional` **anyOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command/types.ts:35

***

### const?

> `optional` **const?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: lib/command/types.ts:33

***

### default?

> `optional` **default?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: lib/command/types.ts:15

***

### description?

> `optional` **description?**: `string`

Defined in: lib/command/types.ts:14

***

### enum?

> `optional` **enum?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: lib/command/types.ts:32

***

### examples?

> `optional` **examples?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: lib/command/types.ts:16

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum?**: `number`

Defined in: lib/command/types.ts:31

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum?**: `number`

Defined in: lib/command/types.ts:30

***

### items?

> `optional` **items?**: `boolean` \| `ISchema`

Defined in: lib/command/types.ts:21

***

### maximum?

> `optional` **maximum?**: `number`

Defined in: lib/command/types.ts:29

***

### maxItems?

> `optional` **maxItems?**: `number`

Defined in: lib/command/types.ts:23

***

### maxLength?

> `optional` **maxLength?**: `number`

Defined in: lib/command/types.ts:26

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: lib/command/types.ts:28

***

### minItems?

> `optional` **minItems?**: `number`

Defined in: lib/command/types.ts:22

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: lib/command/types.ts:25

***

### not?

> `optional` **not?**: `boolean` \| `ISchema`

Defined in: lib/command/types.ts:37

***

### oneOf?

> `optional` **oneOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command/types.ts:36

***

### pattern?

> `optional` **pattern?**: `string`

Defined in: lib/command/types.ts:27

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: lib/command/types.ts:18

***

### required?

> `optional` **required?**: `string`[]

Defined in: lib/command/types.ts:19

***

### title?

> `optional` **title?**: `string`

Defined in: lib/command/types.ts:13

***

### type?

> `optional` **type?**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"integer"` \| `"null"`

Defined in: lib/command/types.ts:17

***

### uniqueItems?

> `optional` **uniqueItems?**: `boolean`

Defined in: lib/command/types.ts:24
