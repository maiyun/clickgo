[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / onUpdateState

# Function: onUpdateState()

> **onUpdateState**(`current`, `handler`): `void`

Defined in: lib/native/update.ts:65

监听软件级公开状态及下载进度；不包含 URL、凭据或文件路径

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App 或窗体，不要求 root；控制更新仍须 root

### handler

(`state`) => `void` \| `Promise`\<`void`\>

状态回调，业务不需要定义 Native 事件名

## Returns

`void`

无返回值；窗体或任务销毁时自动解除，网页/旧宿主不会投递
