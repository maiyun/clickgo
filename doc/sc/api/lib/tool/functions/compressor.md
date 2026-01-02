[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / compressor

# Function: compressor()

> **compressor**\<`T`\>(`file`, `options`): `Promise`\<`false` \| `T`\>

Defined in: [dist/lib/tool.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L35)

压缩一个图片

## Type Parameters

### T

`T` *extends* `File` \| `Blob`

## Parameters

### file

`T`

文件或 blob 类型

### options

参数

#### maxHeight?

`number`

最高高度，默认无限

#### maxWidth?

`number`

最大宽度，默认无限

#### quality?

`number`

压缩质量，默认 0.8

## Returns

`Promise`\<`false` \| `T`\>
