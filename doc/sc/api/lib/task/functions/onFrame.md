[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / onFrame

# Function: onFrame()

> **onFrame**(`current`, `fun`, `opt`): `number`

Defined in: [dist/lib/task.ts:239](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L239)

创建 frame 监听，formId 存在则为窗体范围，否则为任务级范围

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### fun

() => `void` \| `Promise`\<`void`\>

监听回调

### opt

选项,count:执行次数，默认无限次,formId:限定在当前任务的某个窗体

#### count?

`number`

#### formId?

`string`

## Returns

`number`
