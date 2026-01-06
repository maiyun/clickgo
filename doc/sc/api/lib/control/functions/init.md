[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / init

# Function: init()

> **init**(`taskId`, `opt`): `Promise`\<`number`\>

Defined in: [dist/lib/control.ts:488](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L488)

任务创建过程中，需要对 control 进行先行初始化，并将样式表插入到实际的任务 DOM 中

## Parameters

### taskId

`string`

要处理的任务 ID

### opt

#### progress?

(`loaded`, `total`, `path`) => `void` \| `Promise`\<`void`\>

控件加载进度

## Returns

`Promise`\<`number`\>
