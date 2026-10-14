[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / readApp

# Function: readApp()

> **readApp**(`blob`): `Promise`\<`false` \| [`IApp`](../interfaces/IApp.md)\>

Defined in: [lib/core.ts:722](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L722)

读取 CGA 应用包及其配置

## Parameters

### blob

`Blob`

CGA 应用包的二进制内容

## Returns

`Promise`\<`false` \| [`IApp`](../interfaces/IApp.md)\>

应用信息；包无法识别或缺少文本配置时返回 false
