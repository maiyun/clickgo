[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / runThread

# Function: runThread()

> **runThread**(`current`, `cls`, `data?`): [`IThread`](../interfaces/IThread.md)

Defined in: [lib/task.ts:1931](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1931)

运行线程（同一个线程类只能运行一个）
线程类在独立的 Worker 中执行，不能使用主线程中的外部变量或模块。

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
