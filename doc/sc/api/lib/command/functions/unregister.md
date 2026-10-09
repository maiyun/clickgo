[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / unregister

# Function: unregister()

> **unregister**(`current`, `name`): `boolean`

Defined in: lib/command.ts:282

取消尚在执行的命令并解除注册；取消是协作式，不回滚已产生的业务效果

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属任务/Form/Panel

### name

`string`

命令名称

## Returns

`boolean`

是否找到并移除命令
