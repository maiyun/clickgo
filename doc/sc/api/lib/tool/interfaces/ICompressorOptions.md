[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / ICompressorOptions

# Interface: ICompressorOptions

Defined in: [lib/tool.ts:31](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L31)

图片压缩参数，未指定大小上限时仅使用第一档质量

## Properties

### maxHeight?

> `optional` **maxHeight?**: `number`

Defined in: [lib/tool.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L35)

最高高度，默认无限

***

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: [lib/tool.ts:41](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L41)

文件大小上限，单位字节，须为正有限数；各档都超限时返回 false，不再额外缩小尺寸或降质

***

### maxWidth?

> `optional` **maxWidth?**: `number`

Defined in: [lib/tool.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L33)

最大宽度，默认无限

***

### mimeType?

> `optional` **mimeType?**: `"auto"` \| `"image/jpeg"` \| `"image/png"` \| `"image/webp"`

Defined in: [lib/tool.ts:39](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L39)

输出格式，默认 auto 保留压缩器的自动选择；JPEG 的透明区域填白

***

### quality?

> `optional` **quality?**: `number` \| readonly `number`[]

Defined in: [lib/tool.ts:37](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L37)

编码质量，取值 0 至 1，默认 0.8；数组按顺序尝试，仅 JPEG/WebP 支持调节质量
