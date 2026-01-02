栅格布局的子单元，需配合 `grid` 组件使用。

### 参数

#### direction

`'h'` | `'v'` | `undefined`

布局方向，覆盖父级设置。

#### gutter

`number` | `string`

间距，覆盖父级设置，默认 0。

#### alignH

`string` | `undefined`

水平对齐方式，覆盖父级设置。

#### alignV

`string` | `undefined`

垂直对齐方式，覆盖父级设置。

#### span

`number` | `string` | `undefined`

横跨列数。`-1` 代表横跨所有列，`-2` 代表跨剩余列。

### 样式

使用 flex 布局，作为 grid 的子单元参与栅格布局。支持设置跨列数来控制占据的宽度比例。

可独立设置布局方向、对齐方式和间距，覆盖父级 grid 的统一设置。

单元格默认填满分配的空间，内容区域支持通过 slot 自定义。

### 示例

```xml
<grid-cell :span="12">Full Width</grid-cell>
```