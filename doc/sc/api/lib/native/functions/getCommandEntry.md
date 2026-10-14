[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / getCommandEntry

# Function: getCommandEntry()

> **getCommandEntry**(): `Promise`\<[`ICommandEntry`](../interfaces/ICommandEntry.md) \| `null`\>

Defined in: [lib/native.ts:159](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L159)

取得软件自身的 CLI/stdio 入口和启动要求，无需读取连接凭据

## Returns

`Promise`\<[`ICommandEntry`](../interfaces/ICommandEntry.md) \| `null`\>

公开入口信息；普通网页或尚未支持此接口的宿主为 null
