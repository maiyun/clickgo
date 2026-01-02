[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / once

# Function: once()

> **once**(`current`, `name`, `handler`, `formId?`): `void`

Defined in: [dist/lib/native.ts:107](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L107)

监听 native 传输过来的事件（仅一次）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### name

`string`

事件名

### handler

(...`param`) => `any`

回调函数

### formId?

`string`

限定某个窗体

## Returns

`void`
