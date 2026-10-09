[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / execute

# Function: execute()

> **execute**(`current`, `name`, `args?`, `options?`): `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../type-aliases/TJson.md)\>\>

Defined in: lib/command.ts:456

应用界面直接执行已注册的业务命令

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属任务/Form

### name

`string`

命令名称

### args?

`Record`\<`string`, [`TJson`](../type-aliases/TJson.md)\> = `{}`

参数，默认空对象

### options?

取消信号

#### signal?

`AbortSignal`

## Returns

`Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../type-aliases/TJson.md)\>\>

业务结果
