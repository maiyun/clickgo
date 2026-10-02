[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / updateTray

# Function: updateTray()

> **updateTray**(`current`, `id`, `options`): `Promise`\<`boolean`\>

Defined in: [lib/task.ts:159](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L159)

更新自己的托盘；并发图标更新以最后发起的一次为准

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属任务

### id

`string`

托盘 ID

### options

`Partial`\<[`ITrayOptions`](../interfaces/ITrayOptions.md)\>

要修改的字段

## Returns

`Promise`\<`boolean`\>

是否仍拥有该托盘
