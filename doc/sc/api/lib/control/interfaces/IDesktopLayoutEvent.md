[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDesktopLayoutEvent

# Interface: IDesktopLayoutEvent

Defined in: [lib/control.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1336)

自动重排或用户拖动完成后的布局快照

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1337)

#### overflow

> **overflow**: `string`[]

#### positions

> **positions**: [`TDesktopPositions`](../type-aliases/TDesktopPositions.md)

#### preferredPositions

> **preferredPositions**: [`TDesktopPositions`](../type-aliases/TDesktopPositions.md)

持久化位置，窗口临时缩小时不被覆盖

#### reason

> **reason**: [`TDesktopLayoutReason`](../type-aliases/TDesktopLayoutReason.md)
