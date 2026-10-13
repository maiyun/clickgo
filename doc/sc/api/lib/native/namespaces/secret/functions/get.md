[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [secret](../index.md) / get

# Function: get()

> **get**(`current`, `key`): `Promise`\<`string` \| `false` \| `null`\>

Defined in: [lib/native/secret.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/secret.ts#L19)

读取当前 App 的加密字符串，按 config.id 隔离

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

### key

`string`

非空 Unicode 存储键，最多 128 个 UTF-16 码元

## Returns

`Promise`\<`string` \| `false` \| `null`\>

字符串，未找到为 null，缺少有效 App ID、宿主、密钥服务或读取失败为 false
