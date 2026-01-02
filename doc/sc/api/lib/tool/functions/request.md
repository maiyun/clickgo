[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / request

# Function: request()

> **request**(`url`, `opt`): `Promise`\<`any`\>

Defined in: [dist/lib/tool.ts:1022](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1022)

发起一个网络请求，若是返回值是 JSON 则自动解析，否则直接返回字符串

## Parameters

### url

`string`

网址

### opt

[`IRequestOptions`](../interfaces/IRequestOptions.md)

选项

## Returns

`Promise`\<`any`\>
