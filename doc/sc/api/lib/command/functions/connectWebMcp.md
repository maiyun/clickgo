[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / connectWebMcp

# Function: connectWebMcp()

> **connectWebMcp**(`current`): `Promise`\<`boolean`\>

Defined in: [lib/command.ts:794](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L794)

显式重同步或重试当前 App 的工具发布；页面接入由框架自动管理

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属应用

## Returns

`Promise`\<`boolean`\>

是否同步成功；浏览器不支持、App 已退出或注册失败时返回 false
