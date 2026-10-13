[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [secret](../index.md) / isAvailable

# Function: isAvailable()

> **isAvailable**(`current`): `Promise`\<`boolean`\>

Defined in: lib/native/secret.ts:9

查询 Native 系统密钥服务，无需 root 权限

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

## Returns

`Promise`\<`boolean`\>

是否可以安全保存敏感字符串
