[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / installUpdate

# Function: installUpdate()

> **installUpdate**(`current`): `Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

Defined in: [lib/native/update.ts:46](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/update.ts#L46)

安装本进程已下载的版本并重启，业务须先保存文档并确认

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 App 或窗体，要求 root 权限

## Returns

`Promise`\<`false` \| [`IUpdateState`](../interfaces/IUpdateState.md) \| `null`\>

restarting 表示安装开始；异步失败由 onUpdateState 通知，无权限为 false，不支持为 null
