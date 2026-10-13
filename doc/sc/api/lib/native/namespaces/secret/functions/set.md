[**Documents for clickgo**](../../../../../index.md)

***

[Documents for clickgo](../../../../../index.md) / [lib/native](../../../index.md) / [secret](../index.md) / set

# Function: set()

> **set**(`current`, `key`, `value`): `Promise`\<`boolean`\>

Defined in: [lib/native/secret.ts:34](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/secret.ts#L34)

加密后保存字符串，按 config.id 隔离，不退回明文

## Parameters

### current

[`TCurrent`](../../../../core/type-aliases/TCurrent.md)

当前 App

### key

`string`

非空 Unicode 存储键，最多 128 个 UTF-16 码元

### value

`string`

敏感字符串

## Returns

`Promise`\<`boolean`\>

是否保存成功，安全存储不可用为 false
