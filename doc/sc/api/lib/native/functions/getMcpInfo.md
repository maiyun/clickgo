[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / getMcpInfo

# Function: getMcpInfo()

> **getMcpInfo**(`current`): `Promise`\<`false` \| [`IMcpInfo`](../interfaces/IMcpInfo.md) \| `null`\>

Defined in: [lib/native.ts:87](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L87)

读取 Native 主进程启用的 MCP 连接设置

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App

## Returns

`Promise`\<`false` \| [`IMcpInfo`](../interfaces/IMcpInfo.md) \| `null`\>

连接设置；未启用为 null，无权限为 false
