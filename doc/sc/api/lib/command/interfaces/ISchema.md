[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / ISchema

# Interface: ISchema

Defined in: [lib/command.ts:15](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L15)

JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝

## Properties

### $defs?

> `optional` **$defs?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command.ts:18](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L18)

***

### $ref?

> `optional` **$ref?**: `string`

Defined in: [lib/command.ts:17](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L17)

***

### $schema?

> `optional` **$schema?**: `string`

Defined in: [lib/command.ts:16](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L16)

***

### additionalProperties?

> `optional` **additionalProperties?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:26](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L26)

***

### allOf?

> `optional` **allOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:40](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L40)

***

### anyOf?

> `optional` **anyOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:41](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L41)

***

### const?

> `optional` **const?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: [lib/command.ts:39](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L39)

***

### default?

> `optional` **default?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: [lib/command.ts:21](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L21)

***

### description?

> `optional` **description?**: `string`

Defined in: [lib/command.ts:20](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L20)

***

### enum?

> `optional` **enum?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: [lib/command.ts:38](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L38)

***

### examples?

> `optional` **examples?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: [lib/command.ts:22](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L22)

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum?**: `number`

Defined in: [lib/command.ts:37](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L37)

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum?**: `number`

Defined in: [lib/command.ts:36](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L36)

***

### items?

> `optional` **items?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:27](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L27)

***

### maximum?

> `optional` **maximum?**: `number`

Defined in: [lib/command.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L35)

***

### maxItems?

> `optional` **maxItems?**: `number`

Defined in: [lib/command.ts:29](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L29)

***

### maxLength?

> `optional` **maxLength?**: `number`

Defined in: [lib/command.ts:32](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L32)

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: [lib/command.ts:34](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L34)

***

### minItems?

> `optional` **minItems?**: `number`

Defined in: [lib/command.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L28)

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: [lib/command.ts:31](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L31)

***

### not?

> `optional` **not?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:43](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L43)

***

### oneOf?

> `optional` **oneOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:42](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L42)

***

### pattern?

> `optional` **pattern?**: `string`

Defined in: [lib/command.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L33)

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command.ts:24](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L24)

***

### required?

> `optional` **required?**: `string`[]

Defined in: [lib/command.ts:25](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L25)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L19)

***

### type?

> `optional` **type?**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"integer"` \| `"null"`

Defined in: [lib/command.ts:23](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L23)

***

### uniqueItems?

> `optional` **uniqueItems?**: `boolean`

Defined in: [lib/command.ts:30](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L30)
