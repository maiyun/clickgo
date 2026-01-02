[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / dialog

# Function: dialog()

> **dialog**(`options`): `Promise`\<`number`\>

Defined in: [dist/lib/native.ts:360](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L360)

弹出消息框

## Parameters

### options

选项

`string` | \{ `buttons?`: `string`[]; `detail?`: `string`; `message?`: `string`; `title?`: `string`; `type?`: `"error"` \| `"info"` \| `"question"` \| `"warning"`; \}

## Returns

`Promise`\<`number`\>

点击的按钮索引
