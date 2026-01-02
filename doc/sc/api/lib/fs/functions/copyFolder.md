[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / copyFolder

# Function: copyFolder()

> **copyFolder**(`current`, `from`, `to`, `ignore`): `Promise`\<`number`\>

Defined in: [dist/lib/fs.ts:1300](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1300)

复制文件夹里的内容到另一个地方，失败不会回滚

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### from

`string`

源，末尾加 /

### to

`string`

目标，末尾加 /

### ignore

`RegExp`[] = `[]`

忽略的文件

## Returns

`Promise`\<`number`\>
