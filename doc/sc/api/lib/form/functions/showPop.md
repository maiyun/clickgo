[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showPop

# Function: showPop()

> **showPop**(`el`, `pop`, `direction`, `opt`): `void`

Defined in: [dist/lib/form.ts:2548](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2548)

获取 pop 显示出来的坐标并报系统全局记录

## Parameters

### el

响应的元素

`HTMLElement` | [`IVue`](../../core/interfaces/IVue.md)

### pop

要显示 pop 元素

`HTMLElement` | [`IVue`](../../core/interfaces/IVue.md) | `undefined`

### direction

要显示方向（以 $el 为准的 h 水平 v 垂直 t 垂直水平居中）或坐标

`"v"` | `PointerEvent` | `"t"` | `"h"` | \{ `x`: `number`; `y`: `number`; \}

### opt

width / height 显示的 pop 定义自定义宽/高度，可省略；null，true 代表为空也会显示，默认为 false; autoPosition, 因 pop 内部内容变动导致的自动更新 pop 位置，默认 false，autoScroll，因原元素位置变更导致 pop 位置变更，默认 false，flow: 是否加入 pop 流，默认加入，不加入的话将不会自动隐藏

#### autoPosition?

`boolean`

#### autoScroll?

`boolean`

#### flow?

`boolean`

#### null?

`boolean`

#### size?

\{ `height?`: `number`; `width?`: `number`; \}

#### size.height?

`number`

#### size.width?

`number`

#### way?

`"click"` \| `"normal"` \| `"hover"`

展示托管方式

## Returns

`void`
