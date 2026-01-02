[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / run

# Function: run()

> **run**(`current`, `url`, `opt`): `Promise`\<`string` \| `number`\>

Defined in: [dist/lib/task.ts:386](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L386)

运行一个应用

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### url

app 路径（以 .cga 结尾的文件），或 APP 包对象

`string` | [`IApp`](../../core/interfaces/IApp.md)

### opt

[`ITaskRunOptions`](../interfaces/ITaskRunOptions.md) = `{}`

选项

## Returns

`Promise`\<`string` \| `number`\>

字符串代表成功，否则代表错误代号
