[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / putContent

# Function: putContent()

> **putContent**(`current`, `path`, `data`, `options`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:298](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L298)

写入文件内容

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

文件路径

### data

要写入的内容

`string` | `Blob`

### options

选项

#### encoding?

`BufferEncoding` \| `null`

#### flag?

`string` \| `number`

#### mode?

`string` \| `number`

## Returns

`Promise`\<`boolean`\>
