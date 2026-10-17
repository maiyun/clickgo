[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IPageBridge

# Interface: IPageBridge

Defined in: [lib/command/types.ts:112](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L112)

框架向网页发布的统一入口；按任务选择应用，只访问明确公开的命令

## Properties

### execute

> **execute**: (`taskId`, `name`, `args?`, `options?`) => `Promise`\<[`TResult`](../type-aliases/TResult.md)\<[`TJson`](../../tool/type-aliases/TJson.md)\>\>

Defined in: [lib/command/types.ts:117](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L117)

#### Parameters

##### taskId

`string`

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

### getAgentGuide

> **getAgentGuide**: (`taskId?`) => `Promise`\<`string` \| `false` \| `null`\>

Defined in: [lib/command/types.ts:114](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L114)

#### Parameters

##### taskId?

`string`

#### Returns

`Promise`\<`string` \| `false` \| `null`\>

***

### getAgentInfo

> **getAgentInfo**: (`taskId?`) => `Promise`\<`false` \| [`IAgentInfo`](IAgentInfo.md) \| `null`\>

Defined in: [lib/command/types.ts:113](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L113)

#### Parameters

##### taskId?

`string`

#### Returns

`Promise`\<`false` \| [`IAgentInfo`](IAgentInfo.md) \| `null`\>

***

### list

> **list**: (`taskId`) => [`IInfo`](IInfo.md)[]

Defined in: [lib/command/types.ts:116](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L116)

#### Parameters

##### taskId

`string`

#### Returns

[`IInfo`](IInfo.md)[]

***

### listTasks

> **listTasks**: () => `object`[]

Defined in: [lib/command/types.ts:115](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L115)

#### Returns

`object`[]
