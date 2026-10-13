[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [secret](../index.md) / remove

# Function: remove()

> **remove**(`current`, `key`): `Promise`\<`boolean`\>

Defined in: [lib/native/secret.ts:44](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/secret.ts#L44)

删除加密记录，按 config.id 隔离

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

### key

`string`

非空 Unicode 存储键，最多 128 个 UTF-16 码元

## Returns

`Promise`\<`boolean`\>

是否删除成功，未找到时也返回成功
