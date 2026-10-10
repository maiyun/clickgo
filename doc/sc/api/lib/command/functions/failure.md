[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / failure

# Function: failure()

> **failure**(`code`, `message`): [`TResult`](../type-aliases/TResult.md)\<`never`\>

Defined in: [lib/command.ts:147](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L147)

构造业务失败结果，不抛异常

## Parameters

### code

`string`

稳定的业务错误码

### message

`string`

可公开的错误说明

## Returns

[`TResult`](../type-aliases/TResult.md)\<`never`\>

失败结果
