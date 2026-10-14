[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / getUpdateState

# Function: getUpdateState()

> **getUpdateState**(`current`): `Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

Defined in: [lib/native/update.ts:55](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/update.ts#L55)

读取 Native 软件级更新状态快照

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App 或窗体，要求 root 权限

## Returns

`Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

当前状态，无权限为 false，网页或旧宿主不支持为 null
