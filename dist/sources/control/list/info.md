列表组件，支持树形结构、多选、虚拟滚动等。

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

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### tree

`boolean` | `string`

是否树形结构，默认 false。

#### treeDefault

`number` | `string`

树形默认状态，默认 0。

#### async

`boolean` | `string`

是否异步加载子级，默认 false。

#### icon

`boolean` | `string`

是否显示图标，默认 false。

#### iconDefault

`string`

默认图标。

#### check

`boolean` | `string`

是否开启复选框模式，默认 false。

#### map

`object`

数据映射配置。

#### mode

`'default'` | `'view'` | `'iview'`

显示模式，默认 `default`。

#### data

`any[]` | `Record<string, string>`

列表数据。

#### disabledList

`string[]` | `string`

禁用项列表。

#### unavailableList

`string[]` | `string`

不可用项列表。

#### modelValue

`string[]` | `string`

双向绑定，选中项的值。

### 事件

#### remove

`(event: IListRemoveEvent) => void`

移除项时触发，包含 `index` 和 `value`。

#### add

`(event: IListAddEvent) => void`

添加项时触发，包含 `index` 和 `value`。

#### change

`(event: IListChangeEvent) => void`

选中项改变时触发，包含 `value` 数组。

#### changed

`(event: IListChangedEvent) => void`

选中项改变后触发，包含 `value` 数组。

#### itemclicked

`(event: IListItemclickedEvent) => void`

点击项时触发，包含 `event`、`value` 和 `arrow`。

#### itemdblclicked

`(event: IListItemdblclickedEvent) => void`

双击项时触发，包含 `event`、`value` 和 `arrow`。

#### label

`(labels: string[]) => void`

获取标签时触发。

#### item

`(items: any[]) => void`

获取项数据时触发。

#### load

`(value: string, callback: (children?: any[]) => void) => void`

异步加载子级时触发。

### 样式

使用 flex 布局，列表项垂直排列。支持虚拟滚动优化大数据量渲染。列表具有圆角边框（非朴素模式）。

每个列表项具有悬停高亮效果，选中项显示高亮背景。树形模式下显示展开/折叠图标，可显示自定义图标。

支持复选框模式，项前显示复选框。禁用项和不可用项呈现灰色样式。

### 示例

```xml
<list :data="items" v-model="selected"></list>
```
