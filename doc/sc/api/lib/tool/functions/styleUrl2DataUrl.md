[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / styleUrl2DataUrl

# Function: styleUrl2DataUrl()

> **styleUrl2DataUrl**(`path`, `style`, `files`): `Promise`\<`string`\>

Defined in: [dist/lib/tool.ts:324](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L324)

将 style 中的 url 转换成 base64 data url

## Parameters

### path

`string`

路径基准或以文件的路径为基准，以 / 结尾

### style

`string`

样式表

### files

`Record`\<`string`, `Blob` \| `string`\>

在此文件列表中查找

## Returns

`Promise`\<`string`\>
