[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / invokeUpdate

# Function: invokeUpdate()

> **invokeUpdate**(`current`, `action`): `Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

Defined in: [lib/native.ts:51](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L51)

接入固定的软件更新动作，不允许网页提供地址或安装路径

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

已确认有效的任务

### action

`"check"` \| `"download"` \| `"install"` \| `"state"`

固定更新动作

## Returns

`Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

更新状态；任务失效为 false，旧宿主缺少能力时为 null
