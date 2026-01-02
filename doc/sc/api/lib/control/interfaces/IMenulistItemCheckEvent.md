[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IMenulistItemCheckEvent

# Interface: IMenulistItemCheckEvent

Defined in: [dist/lib/control.ts:926](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L926)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:927](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L927)

#### label?

> `optional` **label**: `string`

radio 模式下，当前项的 label 内容

#### value

> **value**: `string` \| `boolean`

当前要选中的项

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:872](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L872)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:873](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L873)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)
