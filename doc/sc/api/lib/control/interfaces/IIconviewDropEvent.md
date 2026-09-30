[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IIconviewDropEvent

# Interface: IIconviewDropEvent

Defined in: [lib/control.ts:1260](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1260)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1261](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1261)

#### event?

> `optional` **event?**: `PointerEvent`

原始松手指针事件，可读取 Ctrl/Shift/Alt；Pointer.js 1.8.0 起提供

#### from

> **from**: `object`[]

#### self

> **self**: `boolean`

#### to

> **to**: `object`

##### to.index

> **index**: `number`

##### to.path

> **path**: `string`

##### to.type

> **type**: `0` \| `1` \| `-1` \| `undefined`
