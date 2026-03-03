描述列表行组件。

### 参数

#### stripe

`boolean` | `string`

是否显示条纹，默认 false。

#### hover

`boolean` | `string`

是否启用鼠标悬停 hover 效果，默认 false。

### 样式

作为 `desc` 的子组件，包含 `desc-head` 和 `desc-cell`。使用表格行布局，控制子单元格的排列。

行高自适应内容。启用 hover 后，鼠标移入时行内单元格背景会呈现悬停高亮效果。

### 示例

```xml
<desc-row hover>
    <desc-head>Name</desc-head>
    <desc-cell>Value</desc-cell>
</desc-row>
```