描述列表单元格组件，用于显示描述内容。

### 参数

#### stripe

`boolean` | `string`

是否显示条纹，默认 `false`。

#### nopadding

`boolean` | `string`

是否移除内边距，默认 `false`。

#### colspan

`number` | `string`

单元格横向合并的列数，默认 `1`。

#### rowspan

`number` | `string`

单元格纵向合并的行数，默认 `1`。

### 样式

作为 `desc-row` 的子组件，显示描述内容。使用表格单元格布局。

样式由父组件 `desc` 的 `size`、`plain` 等参数控制。内容区域支持通过 slot 自定义。

### 示例

```xml
<desc-cell>Content</desc-cell>
```