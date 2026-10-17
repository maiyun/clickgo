[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / releaseFile

# Function: releaseFile()

> **releaseFile**(`current`, `fileId`): `boolean`

Defined in: [lib/command.ts:58](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L58)

主动释放旧导出的缓存，释放后代理不能继续读取；不删除磁盘文件

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

文件所属的 App/Form/Panel，Form/Panel 只能释放自身范围

### fileId

`string`

先前交付的文件标识

## Returns

`boolean`

是否找到并释放，已释放或不属于当前范围为 false
