[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / post

# Function: post()

> **post**(`url`, `data`, `init?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/tool.ts:1185](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1185)

发起 POST 请求（除 FormData 外都会转换为 JSON 提交）

## Parameters

### url

`string`

网址

### data

`Record`\<`string`, `any`\> \| `FormData`

数据

### init?

`RequestInit`

选项

## Returns

`Promise`\<`string` \| `Blob` \| `null`\>

文本或二进制数据，失败时返回 null
