[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / ISchema

# Interface: ISchema

Defined in: [lib/command/types.ts:9](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L9)

JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝

## Properties

### $defs?

> `optional` **$defs?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command/types.ts:12](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L12)

***

### $ref?

> `optional` **$ref?**: `string`

Defined in: [lib/command/types.ts:11](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L11)

***

### $schema?

> `optional` **$schema?**: `string`

Defined in: [lib/command/types.ts:10](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L10)

***

### additionalProperties?

> `optional` **additionalProperties?**: `boolean` \| `ISchema`

Defined in: [lib/command/types.ts:20](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L20)

***

### allOf?

> `optional` **allOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command/types.ts:34](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L34)

***

### anyOf?

> `optional` **anyOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command/types.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L35)

***

### const?

> `optional` **const?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: [lib/command/types.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L33)

***

### default?

> `optional` **default?**: [`TJson`](../../tool/type-aliases/TJson.md)

Defined in: [lib/command/types.ts:15](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L15)

***

### description?

> `optional` **description?**: `string`

Defined in: [lib/command/types.ts:14](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L14)

***

### enum?

> `optional` **enum?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: [lib/command/types.ts:32](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L32)

***

### examples?

> `optional` **examples?**: [`TJson`](../../tool/type-aliases/TJson.md)[]

Defined in: [lib/command/types.ts:16](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L16)

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum?**: `number`

Defined in: [lib/command/types.ts:31](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L31)

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum?**: `number`

Defined in: [lib/command/types.ts:30](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L30)

***

### items?

> `optional` **items?**: `boolean` \| `ISchema`

Defined in: [lib/command/types.ts:21](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L21)

***

### maximum?

> `optional` **maximum?**: `number`

Defined in: [lib/command/types.ts:29](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L29)

***

### maxItems?

> `optional` **maxItems?**: `number`

Defined in: [lib/command/types.ts:23](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L23)

***

### maxLength?

> `optional` **maxLength?**: `number`

Defined in: [lib/command/types.ts:26](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L26)

***

### minimum?

> `optional` **minimum?**: `number`

Defined in: [lib/command/types.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L28)

***

### minItems?

> `optional` **minItems?**: `number`

Defined in: [lib/command/types.ts:22](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L22)

***

### minLength?

> `optional` **minLength?**: `number`

Defined in: [lib/command/types.ts:25](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L25)

***

### not?

> `optional` **not?**: `boolean` \| `ISchema`

Defined in: [lib/command/types.ts:37](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L37)

***

### oneOf?

> `optional` **oneOf?**: (`boolean` \| `ISchema`)[]

Defined in: [lib/command/types.ts:36](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L36)

***

### pattern?

> `optional` **pattern?**: `string`

Defined in: [lib/command/types.ts:27](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L27)

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `boolean` \| `ISchema`\>

Defined in: [lib/command/types.ts:18](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L18)

***

### required?

> `optional` **required?**: `string`[]

Defined in: [lib/command/types.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L19)

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/command/types.ts:13](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L13)

***

### type?

> `optional` **type?**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"array"` \| `"integer"` \| `"null"`

Defined in: [lib/command/types.ts:17](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L17)

***

### uniqueItems?

> `optional` **uniqueItems?**: `boolean`

Defined in: [lib/command/types.ts:24](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L24)
