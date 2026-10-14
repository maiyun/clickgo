[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / downloadUpdate

# Function: downloadUpdate()

> **downloadUpdate**(`current`): `Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

Defined in: lib/native/update.ts:37

下载检测到的版本，合并并发下载，由 Native 校验文件

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App 或窗体，要求 root 权限，业务须先取得用户确认

## Returns

`Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

downloaded 表示校验完成，未就绪/失败为 error；无权限为 false，不支持为 null
