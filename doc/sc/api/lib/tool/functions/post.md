[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / post

# Function: post()

> **post**(`url`, `data`, `init?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/tool.ts:1156](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1156)

发起 POST 请求（除 FormData 外都会转换为 JSON 提交）

## Parameters

### url

`string`

网址

### data

数据

`Record`\<`string`, `any`\> | `FormData`

### init?

`RequestInit`

选项

## Returns

`Promise`\<`string` \| `Blob` \| `null`\>

文本或二进制数据，失败时返回 null
