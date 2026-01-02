[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / createTimer

# Function: createTimer()

> **createTimer**(`current`, `fun`, `delay`, `opt`): `number`

Defined in: [dist/lib/task.ts:1226](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1226)

创建 timer

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属的 taskId

### fun

() => `void` \| `Promise`\<`void`\>

执行函数

### delay

`number`

延迟/间隔，毫秒

### opt

[`ICreateTimerOptions`](../interfaces/ICreateTimerOptions.md) = `{}`

选项, formId: 可省略，省略代表生命周期为当前整个任务，否则只是当前窗体，immediate: 立即执行，默认 false，count: 执行次数，0 为无限次，默认 0

## Returns

`number`
