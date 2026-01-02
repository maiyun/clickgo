表格列配置组件。

### 参数

#### label

`string`

列标题。

#### width

`number` | `string`

列宽度。

#### minWidth

`number` | `string`

最小列宽。

#### sort

`boolean` | `string`

是否可排序，默认 false。

#### direction

`'h'` | `'v'`

内部布局方向，默认 `h`。

#### gutter

`number` | `string`

内部元素间距。

#### alignH

`string` | `undefined`

内部水平对齐方式。

#### alignV

`string` | `undefined`

内部垂直对齐方式。

### 插槽

#### default

自定义列内容，可访问 `scope.row` 获取行数据。

### 样式

作为 table 的子组件，定义表格列配置。列头显示标题文本，可显示排序图标。

支持固定在左侧或右侧。列宽可设置固定值或自适应。

### 示例

```xml
<table-item label="Name" :width="100">
    <template #default="{ row }">{{ row.name }}</template>
</table-item>
```
