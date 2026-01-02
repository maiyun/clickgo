自适应布局单元格组件。

### 参数

#### span

`number` | `string`

占据列数，默认 1。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

作为 alayout-row 的子组件，显示单元格内容。使用 flex 布局。

根据 span 设置占据的列数，支持对齐方式配置。内容区域支持通过 slot 自定义。

### 示例

```xml
<alayout-cell :span="2">Content</alayout-cell>
```
