[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IMenulistItemCheckEvent

# Interface: IMenulistItemCheckEvent

Defined in: [lib/control.ts:1026](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1026)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1027](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1027)

#### label?

> `optional` **label?**: `string`

radio 模式下，当前项的 label 内容

#### value

> **value**: `string` \| `boolean`

当前要选中的项

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:970](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L970)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:971](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L971)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)
