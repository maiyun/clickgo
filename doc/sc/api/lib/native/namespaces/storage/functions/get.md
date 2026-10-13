[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [storage](../index.md) / get

# Function: get()

> **get**\<`T`\>(`current`, `key`): `Promise`\<`false` \| [`IStoredValue`](../interfaces/IStoredValue.md)\<`T`\> \| `null`\>

Defined in: [lib/native/storage.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/storage.ts#L19)

读取当前 App 的持久配置，按 config.id 隔离

## Type Parameters

### T

`T` *extends* [`TJson`](../../../../tool/type-aliases/TJson.md) = [`TJson`](../../../../tool/type-aliases/TJson.md)

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

### key

`string`

非空 Unicode 存储键，最多 128 个 UTF-16 码元

## Returns

`Promise`\<`false` \| [`IStoredValue`](../interfaces/IStoredValue.md)\<`T`\> \| `null`\>

JSON 值包装；未找到为 null，缺少有效 App ID、宿主或读取失败为 false
