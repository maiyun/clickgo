[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / on

# Function: on()

> **on**(`current`, `name`, `handler`, `once`, `formId?`): `void`

Defined in: [dist/lib/native.ts:78](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L78)

监听 native 传输过来的事件

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

### once

`boolean` = `false`

是否只监听一次

### formId?

`string`

限定某个窗体

## Returns

`void`
