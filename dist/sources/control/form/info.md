标准的窗体组件，支持拖拽、缩放、最大化、最小化等。

沉浸式 Native 的首个窗体不绘制外层圆角、边框和阴影，由系统负责实体窗口外形；不受主题和 `border` 参数影响。标题栏仍按 `border` 参数显示，窗体内其他控件的圆角和边框不受影响。网页、带系统标题栏的 Native 和后续窗体保持原有样式。

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

#### viewport

`boolean | string`，默认 `false`。以完整浏览器视口作为窗体布局边界，不扣除 ClickGo 任务栏；适用于最大化、拖动边界、缩放边界、吸附及初始居中。它不触发浏览器全屏、不改变窗体层级，也不自动最大化；配合 `state-max` 使用。最大化时切换此参数立即重新布局，视口和任务栏变化由框架统一刷新。还原保留最大化前的大小与位置。

未开启 `viewport` 时，所有窗体最大化均避开任务栏。`bottomMost` 只控制层级，置底窗体同样需要显式开启 `viewport` 才覆盖完整视口。内联 Form 不使用视口最大化，Native 实体窗体的最大化仍由系统处理。

#### loading

`boolean` | `string`

是否显示加载状态，默认 false。

#### minWidth

`number` | `string`

最小宽度，默认 200。沉浸式 Native 首个窗体会同步到实体窗口，后续修改也会同步。

#### minHeight

`number` | `string`

最小高度，默认 100。沉浸式 Native 首个窗体会同步到实体窗口，后续修改也会同步。

#### border

`'normal'` | `'thin'` | `'plain'` | `'none'`

边框样式，默认 `normal`。

#### background

`string`

CSS `background` 简写，默认 `''`，使用主题背景。可设置颜色、渐变或 `url(...)` 图片；图片应由应用加载为可访问的 URL 或数据 URL。不会自动读取 `/package/` 路径，也不叠加遮罩。

#### backgroundSize

`string`，默认 `''`，模板属性为 `background-size`。CSS 背景尺寸：`cover` 保持比例填满并裁切，`contain` 保持比例完整显示，`100% 100%` 拉伸，`auto` 原始尺寸，也支持长度和百分比。空值保留 `background` 简写或主题中的设置。

#### backgroundRepeat

`string`，默认 `''`，模板属性为 `background-repeat`。CSS 平铺方式：`no-repeat`、`repeat`、`repeat-x`、`repeat-y`、`space`、`round`。空值保留原有设置；未设置时按 CSS 默认 `repeat`。

#### backgroundPosition

`string`，默认 `''`，模板属性为 `background-position`。CSS 背景位置，如 `center`、`left top`、`right bottom`、百分比或长度。空值保留原有设置；未设置时按 CSS 默认 `0% 0%`。三个独立背景参数的非空值覆盖 `background` 简写中的对应设置，清空后恢复简写或主题设置。

#### padding

`string`

内边距，保留原有数字/CSS 长度格式。设为 `safe` 时，最大化 Form 的内容区自动避开 ClickGo 任务栏，而背景仍铺满窗体；随任务栏换边、出现、消失和视口缩放更新。普通最大化已扣除任务栏，不重复预留。还原或内联 Form 不应用安全留白。此预设不与自定义 padding 叠加。

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

关闭时触发，参数为 `IFormCloseEvent`，可调用 `event.preventDefault()` 阻止默认关闭。沉浸式 Native 首个窗体的系统关闭（如 Alt+F4）也会触发，此时 `event.detail.event` 为 `null`。程序调用 `form.close()` 不触发此事件，确认完成后可用它关闭窗体。

#### size

`(size: { width: number; height: number }) => void`

窗体实际显示尺寸变化时触发，首次挂载也会触发。浏览器模式下非最大化窗体的实际显示尺寸不超过视窗；应用可据此自行切换 `move`、`resize`、`min`、`max` 等参数。

### 样式

使用 flex 布局，包含标题栏和内容区域。标题栏显示图标、标题文本和控制按钮（最小化/最大化/关闭）。

窗体具有圆角边框、阴影效果。支持多种边框样式（normal/thin/plain/none）。可通过四边和四角拖拽调整大小。

加载状态时内容区域显示遮罩和加载动画。最大化时填满可用空间，最小化时收缩到任务栏。

### 示例

```xml
<form title="My Form" :width="500" :height="400" :move="move" :resize="resize" :max="max" @size="onSize">Content</form>
```


桌面底层可声明完整视口最大化及内容安全区，无需应用维护 left/top/width/height 或监听屏幕变化：

```xml
<form border="none" viewport state-max padding="safe" :background="wallpaper">
    <desktop :data="icons" v-model:positions="positions" plain keep-active style="flex: 1;"></desktop>
</form>
```

`bottomMost` 仍由所属 Form 设置，负责层级。
