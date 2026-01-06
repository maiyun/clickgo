[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / postResponseJson

# Function: postResponseJson()

> **postResponseJson**(`url`, `data`, `init?`): `Promise`\<`any`\>

Defined in: [dist/lib/tool.ts:1285](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1285)

发起 POST 请求并解析 JSON 响应

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

`Promise`\<`any`\>

JSON 数据，失败时返回 null
