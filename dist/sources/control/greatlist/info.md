高性能列表组件，通常作为 `list` 或 `table` 的底层实现，也可直接使用。

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

#### contentWidth

`'fill'` | `'max'`

内容宽度模式，默认 `fill`。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### mode

`'default'` | `'view'` | `'iview'`

显示模式，默认 `default`。

#### map

`object`

数据映射配置。

#### data

`any[]`

列表数据。

#### sizes

`Record<string, number | undefined>`

尺寸配置。

#### modelValue

`number[]`

双向绑定，选中项的索引数组。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置。

### 事件

#### remove

`(event: IGreatlistRemoveEvent) => void`

移除项时触发，包含 `index` 和 `value`。

#### add

`(event: IGreatlistAddEvent) => void`

添加项时触发，包含 `index` 和 `value`。

#### change

`(event: IGreatlistChangeEvent) => void`

选中项改变时触发，包含 `value` 数组。

#### changed

`(event: IGreatlistChangedEvent) => void`

选中项改变后触发，包含 `value` 数组。

#### itemclicked

`(event: IGreatlistItemclickedEvent) => void`

点击项时触发，包含 `event`、`value` 和 `arrow`。

#### itemdblclicked

`(event: IGreatlistItemdblclickedEvent) => void`

双击项时触发，包含 `event`、`value` 和 `arrow`。

#### beforeselect

`() => void`

选择前触发。

#### select

`(event: IGreatlistSelectEvent) => void`

选择时触发，包含 `area` 信息。

#### afterselect

`() => void`

选择后触发。

#### clientwidth

`(val: number) => void`

可视宽度变化时触发。

#### client

`(val: number) => void`

可视高度变化时触发。

#### gesture

`(dir: string) => void`

手势操作时触发。

#### scrollheight

`(val: number) => void`

滚动高度变化时触发。

#### scrollwidth

`(val: number) => void`

滚动宽度变化时触发。

### 样式

使用 flex 布局，列表项垂直排列。支持虚拟滚动，仅渲染可视区域内的元素，优化大数据量性能。

每个列表项具有悬停高亮效果，选中项显示高亮背景。支持框选多个项。

支持多种显示模式，禁用时呈现灰色并禁止交互。

### 示例

```xml
<greatlist :data="items"></greatlist>
```