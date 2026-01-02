图标视图组件，以网格形式显示图标列表。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### must

`boolean` | `string`

是否必须选中一项，默认 false。

#### multi

`boolean` | `string`

是否多选，默认 true。

#### ctrl

`boolean` | `string`

多选时是否需要按住 Ctrl 键，默认 true。

#### selection

`boolean` | `string`

是否开启框选，默认 true。

#### gesture

`string[]` | `string`

手势配置。

#### scroll

`'auto'` | `'hidden'` | `'visible'`

滚动条模式，默认 `auto`。

#### size

`number` | `string`

图标尺寸，默认 100。

#### name

`boolean` | `string`

是否显示名称，默认 true。

#### data

`any[]`

图标数据列表。

#### modelValue

`number[]`

双向绑定，选中项的索引数组。

### 事件

#### beforeselect

`() => void`

选择前触发。

#### select

`(event: IIconviewSelectEvent) => void`

选择时触发，包含 `area` 信息。

#### afterselect

`() => void`

选择后触发。

#### itemclicked

`(event: IIconviewItemclickedEvent) => void`

点击项时触发，包含 `event` 和 `value`。

#### open

`(event: IIconviewOpenEvent) => void`

双击打开项时触发，包含 `value` 数组。

#### drop

`(event: IIconviewDropEvent) => void`

拖放时触发，包含 `self`、`from` 和 `to`。

#### client

`(val: number) => void`

可视高度变化时触发。

#### gesture

`(dir: string) => void`

手势操作时触发。

### 样式

使用 flex 布局，图标以网格形式排列。每个图标显示图片和标题文字。

选中项显示高亮边框。支持单选和多选模式。悬停时显示背景色变化。

### 示例

```xml
<iconview :data="icons" v-model="selected"></iconview>
```
