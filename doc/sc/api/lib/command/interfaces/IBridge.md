[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IBridge

# Interface: IBridge

Defined in: lib/command/types.ts:105

绑定一个应用实例，只能调用该实例明确公开的命令

## Properties

### execute

> **execute**: (`name`, `args?`, `options?`) => `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\>\>

Defined in: lib/command/types.ts:108

#### Parameters

##### name

`string`

##### args?

`Record`\<`string`, [`TJson`](../../tool/type-aliases/TJson.md)\>

##### options?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\>\>

***

### list

> **list**: () => [`IInfo`](IInfo.md)[]

Defined in: lib/command/types.ts:107

#### Returns

[`IInfo`](IInfo.md)[]

***

### taskId

> **taskId**: `string`

Defined in: lib/command/types.ts:106
