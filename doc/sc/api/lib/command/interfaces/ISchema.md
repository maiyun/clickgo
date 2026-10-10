[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / ISchema

# Interface: ISchema

Defined in: [lib/command.ts:11](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L11)

JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝

## Properties

### $defs?

> `optional` **$defs?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command.ts:14](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L14)

***

### $ref?

> `optional` **$ref?**: `string`

Defined in: [lib/command.ts:13](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L13)

***

### $schema?

> `optional` **$schema?**: `string`

Defined in: [lib/command.ts:12](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L12)

***

### additionalProperties?

> `optional` **additionalProperties?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:22](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L22)

***

### allOf?

> `optional` **allOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:36](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L36)

***

### anyOf?

> `optional` **anyOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:37](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L37)

***

### const?

> `optional` **const?**: [`TJson`](../type-aliases/TJson.md)

Defined in: [lib/command.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L35)

***

### default?

> `optional` **default?**: [`TJson`](../type-aliases/TJson.md)

Defined in: [lib/command.ts:17](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L17)

***

### description?

> `optional` **description?**: `string`

Defined in: [lib/command.ts:16](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L16)

***

### enum?

> `optional` **enum?**: [`TJson`](../type-aliases/TJson.md)[]

Defined in: [lib/command.ts:34](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L34)

***

### examples?

> `optional` **examples?**: [`TJson`](../type-aliases/TJson.md)[]

Defined in: [lib/command.ts:18](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L18)

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum?**: `number`

Defined in: [lib/command.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L33)

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum?**: `number`

Defined in: [lib/command.ts:32](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L32)

***

### items?

> `optional` **items?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:23](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L23)

***

### maximum?

> `optional` **maximum?**: `number`

Defined in: [lib/command.ts:31](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L31)

***

### maxItems?

> `optional` **maxItems?**: `number`

Defined in: [lib/command.ts:25](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L25)

***

### maxLength?

> `optional` **maxLength?**: `number`

Defined in: [lib/command.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L28)

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: [lib/command.ts:30](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L30)

***

### minItems?

> `optional` **minItems?**: `number`

Defined in: [lib/command.ts:24](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L24)

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: [lib/command.ts:27](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L27)

***

### not?

> `optional` **not?**: `boolean` \| `ISchema`

Defined in: [lib/command.ts:39](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L39)

***

### oneOf?

> `optional` **oneOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command.ts:38](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L38)

***

### pattern?

> `optional` **pattern?**: `string`

Defined in: [lib/command.ts:29](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L29)

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command.ts:20](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L20)

***

### required?

> `optional` **required?**: `string`[]

Defined in: [lib/command.ts:21](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L21)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command.ts:15](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L15)

***

### type?

> `optional` **type?**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"integer"` \| `"null"`

Defined in: [lib/command.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L19)

***

### uniqueItems?

> `optional` **uniqueItems?**: `boolean`

Defined in: [lib/command.ts:26](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L26)
