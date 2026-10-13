[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [storage](../index.md) / set

# Function: set()

> **set**(`current`, `key`, `value`): `Promise`\<`boolean`\>

Defined in: [lib/native/storage.ts:39](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/storage.ts#L39)

保存当前 App 的持久配置，按 config.id 隔离

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

### key

`string`

非空 Unicode 存储键，最多 128 个 UTF-16 码元

### value

[`TJson`](../../../../tool/type-aliases/TJson.md)

JSON 配置值，完整记录最大 1 MiB

## Returns

`Promise`\<`boolean`\>

是否保存成功，普通网页或不支持此接口的宿主为 false
