[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / connectWebMcp

# Function: connectWebMcp()

> **connectWebMcp**(`current`): `Promise`\<`boolean`\>

Defined in: [lib/command.ts:195](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L195)

手动将当前 App 已公开的命令发布到浏览器 WebMCP
公开命令注册或移除时框架自动同步，通常无需调用。
仅在发布失败需重试、主动撤销后需恢复，或浏览器稍后才提供 WebMCP 接口时调用。
同一浏览器接口下保留已发布工具，只补齐缺失项；不重置 App 的命令或业务状态。

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属应用

## Returns

`Promise`\<`boolean`\>

是否发布成功；浏览器不支持、App 已退出、发布中途撤销或注册失败时返回 false
