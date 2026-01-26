描述列表行组件。

### 参数

#### stripe

`boolean` | `string`

是否显示条纹，默认 `false`。

### 样式

作为 `desc` 的子组件，包含 `desc-head` 和 `desc-cell`。使用表格行布局，控制子单元格的排列。

行高自适应内容。

### 示例

```xml
<desc-row>
    <desc-head>Name</desc-head>
    <desc-cell>Value</desc-cell>
</desc-row>
```