[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IContext

# Interface: IContext

Defined in: [lib/command/types.ts:45](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L45)

执行来源仅用于展示与记录，不是授权凭证

## Properties

### createFile

> **createFile**: (`blob`, `options`) => `false` \| [`IFileInfo`](IFileInfo.md)

Defined in: [lib/command/types.ts:58](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L58)

保留已生成文件；用 success(data, [file]) 明确交付，不读取路径或重新生成

#### Parameters

##### blob

`Blob`

原文件，单份最多 64 MiB；每个 App 最多 8 份、合计 128 MiB

##### options

[`IFileOptions`](IFileOptions.md)

文件名及可选 MIME，默认使用 Blob.type 或 application/octet-stream

#### Returns

`false` \| [`IFileInfo`](IFileInfo.md)

十分钟有效的独立句柄，随所属范围销毁；参数/容量无效返回 false
仅在本次执行中有效；失败、取消、无效输出及未交付的文件自动释放，私有命令不公开文件

***

### formId

> **formId**: `string`

Defined in: [lib/command/types.ts:47](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L47)

***

### panelId

> **panelId**: `string`

Defined in: [lib/command/types.ts:48](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L48)

***

### signal

> **signal**: `AbortSignal`

Defined in: [lib/command/types.ts:50](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L50)

***

### source

> **source**: `"user"` \| `"agent"`

Defined in: [lib/command/types.ts:49](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L49)

***

### taskId

> **taskId**: `string`

Defined in: [lib/command/types.ts:46](https://github.com/maiyun/clickgo/blob/master/dist/lib/command/types.ts#L46)
