[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / activateTray

# Function: activateTray()

> **activateTray**(`current`, `id`, `menuId?`): `Promise`\<`boolean`\>

Defined in: [lib/task.ts:226](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L226)

当前系统任务栏投递点击/菜单命令到托盘所属 App 和 Form

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前系统任务栏

### id

`string`

托盘 ID

### menuId?

`string`

菜单 ID；省略表示左键点击

## Returns

`Promise`\<`boolean`\>

是否投递；过期、禁用或非系统任务栏的命令返回 false
