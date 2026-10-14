[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / IUpdateState

# Interface: IUpdateState

Defined in: lib/native/update.ts:13

Native 软件级更新状态，不含更新源、凭据和安装路径

## Properties

### currentVersion

> **currentVersion**: `string`

Defined in: lib/native/update.ts:16

***

### errorCode?

> `optional` **errorCode?**: `"check-failed"` \| `"download-failed"` \| `"not-ready"` \| `"install-failed"`

Defined in: lib/native/update.ts:20

***

### progress?

> `optional` **progress?**: [`IUpdateProgress`](IUpdateProgress.md)

Defined in: lib/native/update.ts:18

***

### reason?

> `optional` **reason?**: `"not-enabled"` \| `"development"` \| `"portable"`

Defined in: lib/native/update.ts:19

***

### status

> **status**: `"error"` \| `"idle"` \| `"checking"` \| `"available"` \| `"up-to-date"` \| `"disabled"` \| `"downloading"` \| `"downloaded"` \| `"restarting"`

Defined in: lib/native/update.ts:14

***

### version?

> `optional` **version?**: `string`

Defined in: lib/native/update.ts:17
