[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / save

# Function: save()

> **save**(`options`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/native.ts:342](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L342)

弹出文件保存框

## Parameters

### options

选项

#### filters?

`object`[]

筛选的文件类型

#### path?

`string`

默认路径，不含 /storage/，如 /d/

## Returns

`Promise`\<`string` \| `null`\>

选择的保存路径，不含 /storage/
