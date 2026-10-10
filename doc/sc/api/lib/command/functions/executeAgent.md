[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / executeAgent

# Function: executeAgent()

> **executeAgent**(`taskId`, `name`, `args?`, `options?`): `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../type-aliases/TJson.md)\>\>

Defined in: [lib/command.ts:480](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L480)

代理直接按 taskId 执行公开命令，与界面共用校验和业务执行器

## Parameters

### taskId

`string`

目标 App

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

结构化结果；未公开或不存在的命令返回 not-found
