[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / runThread

# Function: runThread()

> **runThread**(`current`, `cls`, `data?`): [`IThread`](../interfaces/IThread.md)

Defined in: [dist/lib/task.ts:1565](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1565)

运行线程（同一个线程文件只能运行一个）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### cls

() => [`AbstractThread`](../classes/AbstractThread.md)

线程类

### data?

`Record`\<`string`, `any`\>

线程初始化数据

## Returns

[`IThread`](../interfaces/IThread.md)
