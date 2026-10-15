[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / encodeText

# Function: encodeText()

> **encodeText**(`text`, `options?`): `false` \| `Uint8Array`\<`ArrayBuffer`\>

Defined in: [lib/tool/encoding.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool/encoding.ts#L33)

将正文无损编码为字节，不自动规范化换行

## Parameters

### text

`string`

正文，不含文件头 BOM；正文自身的 U+FEFF 保留

### options?

[`ITextEncoding`](../interfaces/ITextEncoding.md) = `...`

编码及 BOM；默认 UTF-8 且无 BOM，GB18030 不允许 BOM

## Returns

`false` \| `Uint8Array`\<`ArrayBuffer`\>

新字节数组；非法 UTF-16 代理项、无损编码失败或无效选项为 false，不用替代字符
