[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / getAgentInfo

# Function: getAgentInfo()

> **getAgentInfo**(`current?`, `options?`): `Promise`\<`false` \| [`IAgentInfo`](../interfaces/IAgentInfo.md) \| `null`\>

Defined in: [lib/command.ts:399](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L399)

获取当前环境的统一接入信息，不另行维护命令清单或启用服务

## Parameters

### current?

[`TCurrent`](../../core/type-aliases/TCurrent.md)

限定目标 App；省略时由代理发现并选择 App

### options?

[`IAgentOptions`](../interfaces/IAgentOptions.md) = `{}`

是否主动导出 HTTP 连接凭据，默认不包含

## Returns

`Promise`\<`false` \| [`IAgentInfo`](../interfaces/IAgentInfo.md) \| `null`\>

独立信息；目标已退出为 null，无权限导出凭据为 false
