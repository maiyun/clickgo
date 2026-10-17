[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / success

# Function: success()

> **success**\<`T`\>(`data`, `files?`): [`TResult`](../type-aliases/TResult.md)\<`T`\>

Defined in: [lib/command.ts:38](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L38)

构造成功结果

## Type Parameters

### T

`T` *extends* [`TJson`](../../tool/type-aliases/TJson.md)

## Parameters

### data

`T`

可跨入口传输的 JSON 数据

### files?

[`IFileInfo`](../interfaces/IFileInfo.md)[]

本次命令明确交付的框架文件，可省略；不能传入其他 App 的文件

## Returns

[`TResult`](../type-aliases/TResult.md)\<`T`\>

成功结果
