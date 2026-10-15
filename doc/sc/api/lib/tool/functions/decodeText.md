[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / decodeText

# Function: decodeText()

> **decodeText**(`data`, `encoding?`): `false` \| [`IDecodedText`](../interfaces/IDecodedText.md)

Defined in: lib/tool/encoding.ts:23

严格解码文本；自动模式按 BOM 识别，否则采用 UTF-8，不猜测传统编码

## Parameters

### data

`ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\>

原始字节，Uint8Array 仅处理其视图范围

### encoding?

[`TTextEncoding`](../type-aliases/TTextEncoding.md)

显式编码；省略时自动识别，显式编码与 BOM 冲突时失败

## Returns

`false` \| [`IDecodedText`](../interfaces/IDecodedText.md)

正文与实际采用的编码/BOM；非法字节、不支持的编码或 UTF-32 BOM 为 false
