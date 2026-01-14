栅格布局容器，用于实现基于列的网格布局，支持响应式列数切换。

### 参数

#### direction

`'h'` | `'v'`

布局方向，`h` 为水平，`v` 为垂直，默认 `'h'`。此属性决定单元格内容的默认轴向及对齐规则。

#### gutter

`number` | `string`

单元格之间的间距（px），默认 `0`。

#### itemGutter

`number` | `string`

子单元格内部的默认间距（px），默认 `0`。若子单元格未指定 `gutter` 则使用此值。

#### alignH

`string` | `undefined`

全部子单元格的全局水平对齐方式，可被子单元格自身的 `alignH` 覆盖。

#### alignV

`string` | `undefined`

全部子单元格的全局垂直对齐方式，可被子单元格自身的 `alignV` 覆盖。

#### sizeM

`number` | `string`

中等宽度（>= 600px 且 < 1000px）时的列数，默认 `2`。

#### sizeL

`number` | `string`

大宽度（>= 1000px）时的列数，默认 `4`。

### 事件

无

### 方法

无

### 插槽

无

### 样式

容器采用 `display: grid` 布局，通过 `grid-template-columns` 属性动态控制网格列数。系统自动监听容器宽度，并在 600px 和 1000px 阈值处进行响应式断点切换。

单元格间距通过 CSS 的 `gap` 属性实现，其值直接绑定到 `gutter` 参数。无论布局处于何种响应式状态，单元格之间的间距都能保持精确的一致性。

该组件作为结构性容器，不包含任何装饰性样式。它支持多层嵌套，能够稳定承载复杂的 `grid-cell` 布局，是构建工业级管理面板和响应式门户的核心底座。

### 示例

```xml
<grid :gutter="10" :size-m="3" :size-l="6">
    <grid-cell>Cell 1</grid-cell>
    <grid-cell :span="2">Cell 2</grid-cell>
</grid>
```
