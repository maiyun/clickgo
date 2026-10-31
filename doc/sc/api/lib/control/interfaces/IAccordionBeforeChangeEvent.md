[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IAccordionBeforeChangeEvent

# Interface: IAccordionBeforeChangeEvent

Defined in: [lib/control.ts:1768](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1768)

用户切换折叠面板前的可取消事件

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1769](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1769)

#### expanded

> **expanded**: `boolean`

被操作项是否展开

#### name

> **name**: `string`

被操作项的标识

#### value

> **value**: `string`[]

切换后的展开项

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
