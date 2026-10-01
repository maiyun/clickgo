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

拖放时触发，包含 `self`、`from` 和 `to`。拖入空白区时 `to` 为 `{ index: -1, type: -1, path: '' }`，拖入目录时保留目录的索引和路径；可选 `event` 为原始指针事件，旧拖拽源可能不提供。控件只报告请求，文件移动、复制及数据更新由应用处理。

与 Desktop 共用 `clickgo.modules.pointer.drag()`，仍兼容 pointer 的 `type: 'fs'` 数据协议，可跨控件、Form 和 task 拖拽；取消、Esc、失焦和卸载不触发 drop。禁用控件不接收拖入，已被前景窗体遮挡的控件不会收到误投。

#### client

`(val: number) => void`

可视高度变化时触发。

#### gesture

`(dir: string) => void`

手势操作时触发。

### 样式

图标以固定格宽和间距排列，格宽为 `size + 80` 像素。容器缩放时只调整每行个数，剩余空间留在行尾；不足一格时收窄以适应容器。每个图标显示图片和标题文字。

支持单选和多选模式，悬停和选中使用半透明背景。`plain` 模式与 Desktop 共用半透明状态颜色和边框，可叠在父层画面上；Iconview 本身不提供背景图片参数。

### 示例

```xml
<iconview :data="icons" v-model="selected"></iconview>
```
