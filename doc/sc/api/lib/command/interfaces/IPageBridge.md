[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IPageBridge

# Interface: IPageBridge

Defined in: lib/command.ts:106

框架向网页发布的统一入口；按任务选择应用，只访问明确公开的命令

## Properties

### execute

> **execute**: (`taskId`, `name`, `args?`, `options?`) => `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../type-aliases/TJson.md)\>\>

Defined in: lib/command.ts:109

#### Parameters

##### taskId

`string`

##### name

`string`

##### args?

`Record`\<`string`, [`TJson`](../type-aliases/TJson.md)\>

##### options?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../type-aliases/TJson.md)\>\>

***

### list

> **list**: (`taskId`) => [`IInfo`](IInfo.md)[]

Defined in: lib/command.ts:108

#### Parameters

##### taskId

`string`

#### Returns

[`IInfo`](IInfo.md)[]

***

### listTasks

> **listTasks**: () => `object`[]

Defined in: lib/command.ts:107

#### Returns

`object`[]
