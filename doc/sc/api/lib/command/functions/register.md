[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / register

# Function: register()

> **register**\<`T`\>(`current`, `definition`): `boolean`

Defined in: lib/command.ts:207

注册命令；重复名称、不支持的 schema 或已销毁的实例返回 false

## Type Parameters

### T

`T` *extends* `Record`\<`string`, [`TJson`](../type-aliases/TJson.md)\>

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属任务/Form/Panel；销毁时自动移除其命令

### definition

[`IDefinition`](../interfaces/IDefinition.md)\<`T`\>

元数据、可用条件与唯一业务执行函数

## Returns

`boolean`

是否注册成功
