[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / TResult

# Type Alias: TResult\<T\>

> **TResult**\<`T`\> = \{ `data`: `T`; `ok`: `true`; \} \| \{ `error`: \{ `code`: `string`; `message`: `string`; \}; `ok`: `false`; \}

Defined in: lib/command.ts:43

所有入口共用的结果；错误码用于程序判断，message 用于说明

## Type Parameters

### T

`T` *extends* [`TJson`](TJson.md) = [`TJson`](TJson.md)
