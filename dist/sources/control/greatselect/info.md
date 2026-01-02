高级下拉选择器组件，支持更复杂的选择场景。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### multi

`boolean` | `string`

是否多选，默认 false。

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### area

`'all'` | `'text'` | `'arrow'`

点击区域，默认 `all`。

#### pop

`'greatlist'` | `'custom'`

弹出层类型，默认 `greatlist`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### padding

`string`

内边距，默认 `m`。

#### minWidth

`number`

弹出层最小宽度。

#### map

`object`

数据映射配置。

#### data

`any[]`

选项数据。

#### sizes

`Record<string, number | undefined>`

尺寸配置。

#### modelValue

`number[]`

双向绑定，选中项的索引数组。

### 事件

#### remove

`(event: IGreatlistRemoveEvent) => void`

移除选项时触发，包含 `index` 和 `value`。

#### add

`(event: IGreatlistAddEvent) => void`

添加选项时触发，包含 `index` 和 `value`。

#### change

`(event: IGreatlistChangeEvent) => void`

选中值改变时触发，包含 `value` 数组。

#### changed

`(event: IGreatlistChangedEvent) => void`

选中值改变后触发，包含 `value` 数组。

#### pop

`() => void`

弹出层显示时触发。

### 样式

使用 flex 布局，支持复杂的选项展示。下拉面板可显示图标、描述等额外信息。

支持搜索过滤、多选标签显示。面板具有虚拟滚动优化大数据量。

### 示例

```xml
<greatselect :data="options" v-model="selected"></greatselect>
```