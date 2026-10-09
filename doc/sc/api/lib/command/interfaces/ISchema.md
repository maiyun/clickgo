[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / ISchema

# Interface: ISchema

Defined in: lib/command.ts:11

JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝

## Properties

### $defs?

> `optional` **$defs?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: lib/command.ts:14

***

### $ref?

> `optional` **$ref?**: `string`

Defined in: lib/command.ts:13

***

### $schema?

> `optional` **$schema?**: `string`

Defined in: lib/command.ts:12

***

### additionalProperties?

> `optional` **additionalProperties?**: `boolean` \| `ISchema`

Defined in: lib/command.ts:22

***

### allOf?

> `optional` **allOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command.ts:36

***

### anyOf?

> `optional` **anyOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command.ts:37

***

### const?

> `optional` **const?**: [`TJson`](../type-aliases/TJson.md)

Defined in: lib/command.ts:35

***

### default?

> `optional` **default?**: [`TJson`](../type-aliases/TJson.md)

Defined in: lib/command.ts:17

***

### description?

> `optional` **description?**: `string`

Defined in: lib/command.ts:16

***

### enum?

> `optional` **enum?**: [`TJson`](../type-aliases/TJson.md)[]

Defined in: lib/command.ts:34

***

### examples?

> `optional` **examples?**: [`TJson`](../type-aliases/TJson.md)[]

Defined in: lib/command.ts:18

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum?**: `number`

Defined in: lib/command.ts:33

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum?**: `number`

Defined in: lib/command.ts:32

***

### items?

> `optional` **items?**: `boolean` \| `ISchema`

Defined in: lib/command.ts:23

***

### maximum?

> `optional` **maximum?**: `number`

Defined in: lib/command.ts:31

***

### maxItems?

> `optional` **maxItems?**: `number`

Defined in: lib/command.ts:25

***

### maxLength?

> `optional` **maxLength?**: `number`

Defined in: lib/command.ts:28

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: lib/command.ts:30

***

### minItems?

> `optional` **minItems?**: `number`

Defined in: lib/command.ts:24

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: lib/command.ts:27

***

### not?

> `optional` **not?**: `boolean` \| `ISchema`

Defined in: lib/command.ts:39

***

### oneOf?

> `optional` **oneOf?**: (`boolean` \| `ISchema`)[]

Defined in: lib/command.ts:38

***

### pattern?

> `optional` **pattern?**: `string`

Defined in: lib/command.ts:29

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: lib/command.ts:20

***

### required?

> `optional` **required?**: `string`[]

Defined in: lib/command.ts:21

***

### title?

> `optional` **title?**: `string`

Defined in: lib/command.ts:15

***

### type?

> `optional` **type?**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"integer"` \| `"null"`

Defined in: lib/command.ts:19

***

### uniqueItems?

> `optional` **uniqueItems?**: `boolean`

Defined in: lib/command.ts:26
