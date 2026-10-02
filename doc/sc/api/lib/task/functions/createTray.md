[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / createTray

# Function: createTray()

> **createTray**(`current`, `options`): `Promise`\<`string` \| `false`\>

Defined in: [lib/task.ts:133](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L133)

注册托盘；不依赖当前是否存在任务栏

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属任务

### options

[`ITrayOptions`](../interfaces/ITrayOptions.md)

图标、提示和菜单

## Returns

`Promise`\<`string` \| `false`\>

托盘 ID，任务已结束时返回 false
