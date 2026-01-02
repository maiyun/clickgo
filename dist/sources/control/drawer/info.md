侧边滑出的抽屉组件。

### 参数

#### modelValue

`boolean` | `string`

双向绑定，是否显示，默认 false。

#### title

`string`

标题。

#### width

`number` | `string`

宽度，默认 `35%`。

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`number` | `string`

内容间距。

#### alignH

`string` | `undefined`

内容水平对齐方式。

#### alignV

`string` | `undefined`

内容垂直对齐方式。

#### close

`boolean` | `string`

点击遮罩层是否关闭，默认 false。

### 事件

#### changed

`() => void`

状态改变后触发。

### 样式

使用固定定位，从右侧滑出显示。抽屉具有标题栏和内容区域，标题栏包含标题文本和关闭按钮。

抽屉打开时背景显示半透明遮罩。具有平滑的滑入/滑出动画效果。

内容区域使用 flex 布局，支持自定义布局方向、对齐方式和间距。

### 示例

```xml
<drawer v-model="show" title="Drawer Title">Content</drawer>
```