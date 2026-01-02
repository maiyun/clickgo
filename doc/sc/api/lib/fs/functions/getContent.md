[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / getContent

# Function: getContent()

读取完整文件或一段

## Param

当前任务 id（可传 null 将只读取完全公开数据，如 clickgo 文件夹）

## Param

文件路径

## Param

编码或选项

## Call Signature

> **getContent**(`current`, `path`, `options?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/fs.ts:129](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L129)

### Parameters

#### current

[`TCurrent`](../../core/type-aliases/TCurrent.md) | `null`

#### path

`string`

#### options?

##### after?

`string`

网络模式下携带后缀，如 ?123

##### end?

`number`

##### progress?

(`loaded`, `total`) => `void` \| `Promise`\<`void`\>

##### start?

`number`

### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

## Call Signature

> **getContent**(`current`, `path`, `options`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/fs.ts:136](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L136)

### Parameters

#### current

[`TCurrent`](../../core/type-aliases/TCurrent.md) | `null`

#### path

`string`

#### options

`BufferEncoding` | \{ `encoding`: `BufferEncoding`; `end?`: `number`; `progress?`: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>; `start?`: `number`; \}

### Returns

`Promise`\<`string` \| `null`\>
