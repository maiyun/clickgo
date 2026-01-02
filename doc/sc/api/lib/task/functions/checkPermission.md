[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / checkPermission

# Function: checkPermission()

> **checkPermission**(`taskId`, `vals`, `apply`, `applyHandler?`): `Promise`\<`boolean`[]\>

Defined in: [dist/lib/task.ts:912](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L912)

检测应用是否有相应的权限（如果 taskId 是 sysId 则直接成功）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要检查的 taskId

### vals

要检测的权限

`string` | `string`[]

### apply

`boolean` = `false`

如果没有权限是否自动弹出申请，默认为否

### applyHandler?

(`list`) => `void` \| `Promise`\<`void`\>

向用户申请成功的权限列表回调

## Returns

`Promise`\<`boolean`[]\>
