[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / showAgentGuide

# Function: showAgentGuide()

> **showAgentGuide**(`current`, `options?`): `Promise`\<`void`\>

Defined in: [lib/command/agent-guide.ts:14](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/agent-guide.ts#L14)

打开当前应用的 AI 接入说明，可复制给代理并查看已公开的命令

## Parameters

### current

[`AbstractForm`](../../form/classes/AbstractForm.md)

打开窗口的业务 Form

### options?

instructions 为可选的应用操作说明，作为纯文本追加到通用说明中

#### instructions?

`string`

## Returns

`Promise`\<`void`\>

窗口关闭后完成；发起方已关闭或正在加载时直接返回
