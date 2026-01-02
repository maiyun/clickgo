下拉选择器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### editable

`boolean` | `string`

是否可编辑，默认 false。

#### multi

`boolean` | `string`

是否多选，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### search

`boolean` | `string`

是否可搜索，默认 false。

#### remote

`boolean` | `string`

是否远程搜索，默认 false。

#### remoteDelay

`number` | `string`

远程搜索延迟，默认 500ms。

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

#### map

`{ 'label'?: string; 'value'?: string; 'children'?: string; }`

数据映射配置。

#### padding

`string`

内边距，默认 `m`。

#### leftlabel

`boolean` | `string`

是否显示左侧标签，默认 true。

#### minWidth

`number`

弹出层最小宽度。

#### modelValue

`Array<string | number>`

双向绑定，选中的值。

#### placeholder

`string`

占位符。

#### data

`any[]` | `Record<string, string>`

选项数据。

#### disabledList

`string[]` | `string`

禁用选项列表。

#### unavailableList

`string[]` | `string`

不可用选项列表。

### 事件

#### add

`(event: ISelectAddEvent) => void`

添加选项时触发，包含 `index` 和 `value`。

#### added

`(event: ISelectAddedEvent) => void`

选项添加完成后触发，包含 `value`。

#### remove

`(event: ISelectRemoveEvent) => void`

移除选项时触发，包含 `index` 和 `value`。

#### removed

`(event: ISelectRemovedEvent) => void`

选项移除完成后触发，包含 `value`。

#### change

`(event: ISelectChangeEvent) => void`

值改变时触发，包含 `value` 数组。

#### changed

`(event: ISelectChangedEvent) => void`

值改变后触发，包含 `value` 数组。

#### tagclick

`(event: ISelectTagclickEvent) => void`

点击标签时触发，包含 `index`、`value` 和 `label`。

#### itemclicked

`(event: ISelectItemclickedEvent) => void`

点击选项时触发，包含 `event`、`value` 和 `arrow`。

#### remote

`(value: string, callback: () => void) => void`

远程搜索时触发。

#### load

`(value: string, callback: (children?: any[]) => void) => void`

异步加载子级时触发。

#### label

`(labels: string[]) => void`

获取标签时触发。

### 样式

使用 flex 布局，包含显示区域和下拉箭头。选择器具有圆角边框，点击后弹出下拉列表。

支持搜索框、多选标签显示。下拉列表支持虚拟滚动和树形结构。可显示选项图标。

获得焦点时边框高亮，禁用时呈现灰色并禁止交互。弹出层具有阴影效果。

### 示例

```xml
<select :data="options" v-model="selected"></select>
```
