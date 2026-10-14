[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / checkUpdates

# Function: checkUpdates()

> **checkUpdates**(`current`): `Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

Defined in: [lib/native/update.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/update.ts#L28)

检测软件更新，主进程须 launcher({ updates: true }) 并配置 build.publish

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App 或窗体，要求 root 权限

## Returns

`Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

检测状态；开发/便携/未启用返回 disabled，无权限为 false，网页/旧宿主为 null
