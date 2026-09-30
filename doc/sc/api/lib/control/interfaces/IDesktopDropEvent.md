[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDesktopDropEvent

# Interface: IDesktopDropEvent

Defined in: [lib/control.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1354)

文件拖入桌面或目录，文件操作由应用决定

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1355)

#### event?

> `optional` **event?**: `PointerEvent`

原始松手指针事件，可读取 Ctrl/Shift/Alt；Pointer.js 1.8.0 起提供

#### from

> **from**: `object`[]

#### position

> **position**: [`IDesktopPosition`](IDesktopPosition.md)

#### self

> **self**: `boolean`

#### to

> **to**: [`IDesktopItem`](IDesktopItem.md) \| `null`
