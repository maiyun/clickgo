[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showPop

# Function: showPop()

> **showPop**(`el`, `pop`, `direction`, `opt?`): `void`

Defined in: lib/form/popup.ts:57

获取 pop 显示出来的坐标并报系统全局记录

## Parameters

### el

`HTMLElement` \| [`IVue`](../../core/interfaces/IVue.md)

响应的元素

### pop

`HTMLElement` \| [`IVue`](../../core/interfaces/IVue.md) \| `undefined`

要显示 pop 元素

### direction

`"v"` \| `PointerEvent` \| `"h"` \| `"t"` \| \{ `x`: `number`; `y`: `number`; \}

要显示方向（以 $el 为准的 h 水平 v 垂直 t 垂直水平居中）或坐标

### opt?

size 自定义宽高；null 为 true 时为空也显示；autoPosition 随内容尺寸更新位置；autoScroll 随原元素位置更新；flow 默认加入 pop 流，不加入则不会自动隐藏；overflow 控制内容溢出；way 为托管方式

#### autoPosition?

`boolean`

#### autoScroll?

`boolean`

#### flow?

`boolean`

#### null?

`boolean`

#### overflow?

`"auto"` \| `"visible"`

滚动内容默认 auto；带外部箭头的提示框使用 visible

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

无返回值
