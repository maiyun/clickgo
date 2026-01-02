栅格布局容器，用于实现灵活的页面布局。

### 参数

#### direction

`'h'` | `'v'`

布局方向，`h` 为水平，`v` 为垂直，默认 `h`。

#### gutter

`number` | `string`

子元素之间的间距，默认 0。

#### itemGutter

`number` | `string`

子元素内部的间距，默认 0。

#### alignH

`string` | `undefined`

所有子元素的水平对齐方式。

#### alignV

`string` | `undefined`

所有子元素的垂直对齐方式。

#### dense

`boolean`

是否紧凑布局，默认 true。

### 样式

使用 CSS Grid 布局，支持水平和垂直两种排列方向。子元素通过 grid-cell 组件定义，按照 span 值分配宽度。

支持设置统一的间距和对齐方式。紧凑模式下子元素会自动填充空白区域。

栅格系统基于 24 列，每个 grid-cell 可指定占据的列数。

### 示例

```xml
<grid :gutter="10">
    <grid-cell :span="6">Cell 1</grid-cell>
    <grid-cell :span="6">Cell 2</grid-cell>
</grid>
```
