[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / getAgentGuide

# Function: getAgentGuide()

> **getAgentGuide**(`current?`, `options?`): `Promise`\<`string` \| `false` \| `null`\>

Defined in: [lib/command.ts:495](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L495)

生成简短英文接入说明，不嵌入临时 App ID；代理通过接口实时发现

## Parameters

### current?

[`TCurrent`](../../core/type-aliases/TCurrent.md)

校验当前 App 生命周期与凭据导出权限；省略时生成页面通用说明

### options?

[`IAgentOptions`](../interfaces/IAgentOptions.md) = `{}`

是否主动导出 HTTP 连接凭据，默认不包含

## Returns

`Promise`\<`string` \| `false` \| `null`\>

Markdown 说明；目标已退出为 null，无权限导出凭据为 false
