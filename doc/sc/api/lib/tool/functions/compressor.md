[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / compressor

# Function: compressor()

> **compressor**\<`T`\>(`file`, `options?`): `Promise`\<`false` \| `T`\>

Defined in: [lib/tool.ts:57](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L57)

压缩图片，质量降档复用同一画布，保留方向校正及等比缩放

## Type Parameters

### T

`T` *extends* `File` \| `Blob`

## Parameters

### file

`T`

图片文件或 Blob；File 输入返回 File，转换格式时同步扩展名和 MIME 类型

### options?

[`ICompressorOptions`](../interfaces/ICompressorOptions.md) = `{}`

压缩参数

## Returns

`Promise`\<`false` \| `T`\>

压缩后的图片；参数无效、加载或编码失败、指定格式不受支持或无法满足大小上限时返回 false

## Example

```ts
const image = await clickgo.tool.compressor(file, {
    'mimeType': 'image/jpeg',
    'maxWidth': 2000,
    'quality': [0.9, 0.6, 0.5],
    'maxSize': 2 * 1024 * 1024,
});
```
