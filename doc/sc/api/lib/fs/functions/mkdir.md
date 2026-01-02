[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / mkdir

# Function: mkdir()

> **mkdir**(`current`, `path`, `mode`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:827](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L827)

深度创建目录，如果最末目录存在，则自动创建成功

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要创建的路径，如 /a/b/c/

### mode

`number` = `0o755`

权限

## Returns

`Promise`\<`boolean`\>
