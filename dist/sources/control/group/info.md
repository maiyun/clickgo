分组容器组件，用于将内容分组显示。

### 参数

#### title

`string`

分组标题。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### hover

`boolean` | `string`

是否显示悬停效果，默认 false。

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`number` | `string`

内容间距。

#### alignH

`string` | `undefined`

内容水平对齐方式。

#### alignV

`string` | `undefined`

内容垂直对齐方式。

#### padding

`boolean` | `string`

是否显示内边距，默认 true。

#### position

`'top'` | `'right'` | `'bottom'` | `'left'`

标题位置，默认 `top`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### hue

`string` | `undefined`

自定义色相值。

### 样式

使用 flex 布局，包含标题区域和内容区域。分组具有圆角边框和背景色。

标题可显示在四个方向，具有对应的边框指示线。支持多种类型颜色和自定义色相。

hover 模式下悬停时显示阴影效果。朴素模式下无边框和背景。

### 示例

```xml
<group title="Basic Info">
    <content>...</content>
</group>
```
