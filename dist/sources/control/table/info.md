表格组件，支持排序、列宽调整、固定列等。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### must

`boolean` | `string`

是否必须选中一项，默认 true。

#### multi

`boolean` | `string`

是否多选，默认 false。

#### ctrl

`boolean` | `string`

多选时是否需要按住 Ctrl 键，默认 true。

#### selection

`boolean` | `string`

是否开启框选，默认 false。

#### gesture

`string[]` | `string`

手势配置。

#### scroll

`'auto'` | `'hidden'` | `'visible'`

滚动条模式，默认 `auto`。

#### sort

`boolean` | `string`

是否允许排序，默认 false。

#### split

`boolean` | `string`

是否允许调整列宽，默认 false。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### fixed

`'left'` | `'right'` | `'both'` | `undefined`

固定列模式。

#### data

`any[]`

表格数据。

#### sizes

`Record<string, number | undefined>`

列宽配置。

#### modelValue

`Array<string | number>`

双向绑定，选中行的值。

#### mode

`'default'` | `'view'` | `'iview'`

显示模式，默认 `default`。

#### map

`object`

数据映射配置。

### 样式

使用 flex 布局，垂直排列表头和内容区域。支持排序、列宽调整、固定列等。

表格具有圆角边框（非朴素模式）。支持虚拟滚动优化大数据量渲染。

表头固定在顶部。支持固定列在左右两侧。选中行高亮显示。

### 示例

```xml
<table :data="tableData">
    <table-item label="Name" prop="name"></table-item>
</table>
```

### 事件

#### sort

`(event: ITableSortEvent) => void`

排序改变时触发，包含 `index`、`label` 和 `sort`。

#### select

`(event: IGreatlistSelectEvent) => void`

选择改变时触发，包含 `area` 信息。

#### itemclicked

`(event: IGreatlistItemclickedEvent) => void`

点击行时触发，包含 `event`、`value` 和 `arrow`。

#### gesture

`(dir: string) => void`

手势操作时触发。

### 样式

使用 flex 布局，包含表头和表体两部分。表头固定在顶部，表体支持滚动。支持虚拟滚动优化大数据量渲染。

表格具有边框和斑马纹效果。列头支持点击排序（显示排序图标）和拖拽调整宽度。支持固定左侧或右侧列。

选中行高亮显示，支持单选和多选模式。禁用时整体呈现灰色并禁止交互。

### 示例

```xml
<table :data="rows" v-model="selected">
    <table-item label="Name" prop="name"></table-item>
</table>
```