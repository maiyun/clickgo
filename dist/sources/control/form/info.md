标准的窗体组件，支持拖拽、缩放、最大化、最小化等。

### 参数

#### icon

`string`

窗体图标。

#### title

`string`

窗体标题，默认 `title`。

#### min

`boolean` | `string`

是否允许最小化，默认 true。

#### max

`boolean` | `string`

是否允许最大化，默认 true。

#### close

`boolean` | `string`

是否允许关闭，默认 true。

#### resize

`boolean` | `string`

是否允许调整大小，默认 true。

#### move

`boolean` | `string`

是否允许移动，默认 true。

#### loading

`boolean` | `string`

是否显示加载状态，默认 false。

#### minWidth

`number` | `string`

最小宽度，默认 200。

#### minHeight

`number` | `string`

最小高度，默认 100。

#### border

`'normal'` | `'thin'` | `'plain'` | `'none'`

边框样式，默认 `normal`。

#### background

`string`

背景颜色。

#### padding

`string`

内边距。

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### stateMin

`boolean` | `string`

双向绑定，最小化状态。

#### stateMax

`boolean` | `string`

双向绑定，最大化状态。

#### width

`number` | `string`

双向绑定，宽度，默认 300。

#### height

`number` | `string`

双向绑定，高度，默认 200。

#### left

`number` | `string`

双向绑定，左侧位置。

#### top

`number` | `string`

双向绑定，顶部位置。

### 事件

#### max

`() => void`

最大化时触发。

#### min

`() => void`

最小化时触发。

#### close

`() => void`

关闭时触发。

### 样式

使用 flex 布局，包含标题栏和内容区域。标题栏显示图标、标题文本和控制按钮（最小化/最大化/关闭）。

窗体具有圆角边框、阴影效果。支持多种边框样式（normal/thin/plain/none）。可通过四边和四角拖拽调整大小。

加载状态时内容区域显示遮罩和加载动画。最大化时填满可用空间，最小化时收缩到任务栏。

### 示例

```xml
<form title="My Form" :width="500" :height="400">Content</form>
```
