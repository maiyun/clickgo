[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / symlink

# Function: symlink()

> **symlink**(`current`, `filePath`, `linkPath`, `type?`): `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:401](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L401)

把源文件创建一个 link

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### filePath

`string`

源文件

### linkPath

`string`

连接路径

### type?

`"dir"` \| `"file"` \| `"junction"`

选项

## Returns

`Promise`\<`boolean`\>
