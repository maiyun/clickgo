[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IFileOptions

# Interface: IFileOptions

Defined in: [lib/command/file.ts:21](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/file.ts#L21)

发布的是已生成 Blob，不读取路径、不上传或重新生成文件

## Properties

### fileName

> **fileName**: `string`

Defined in: [lib/command/file.ts:22](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/file.ts#L22)

***

### mimeType?

> `optional` **mimeType?**: `string`

Defined in: [lib/command/file.ts:24](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/file.ts#L24)

默认使用 Blob.type；为空时使用 application/octet-stream
