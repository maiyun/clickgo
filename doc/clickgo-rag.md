
quick-start.md
---

# 快速开始

## 安装

首先设置 ClickGo 模块的加载路径，然后使用 script 模块加载。

**index.html**

```html
<script type="importmap">
{
    "imports": {
        "clickgo": "https://cdn.jsdelivr.net/npm/clickgo@x.x.x/dist/index.js"
    }
}
</script>
<script type="module" src="index.js"></script>
```

也可以携带参数和全局变量。

```html
<script>
clickgo = {
    'config': {
        'cdn': 'https://cdn.jsdelivr.net',
    },
    'global': {},
};
</script>
```

**index.js**

```ts
import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    public async main(): Promise<void> {
        // --- 运行应用，例如运行一个 cga 文件 ---
        await clickgo.task.run(this._sysId, 'xxx.cga');
    }
}
clickgo.launcher(new Boot());
```

## 代码提示

安装 ClickGo 模块后，即可获得代码提示。

```sh
$ npm i clickgo --save-dev
$ npm i jszip --save-dev
$ npm i vue --save-dev
```

## 注意

ClickGo 会自动加载 Vue、jszip 库，所以**请勿**在 HTML 中手动引用这些库的 JS 和 CSS 文件。

global-style.md
---

# 全局样式

## 变量

ClickGo 使用 CSS 变量来控制全局样式和主题。这些变量通常定义在 `#cg-wrap` 下。

### 基础颜色

- `--cg`: 主题色
- `--cg-hover`: 主题色悬停状态
- `--cg-active`: 主题色激活状态
- `--cg-focus`: 主题色焦点状态
- `--cg-disabled`: 主题色禁用状态
- `--cg-bg`: 主题色浅色背景

### 状态颜色

- `--success`: 成功颜色
- `--info`: 信息颜色
- `--warning`: 警告颜色
- `--danger`: 危险颜色
- 各状态颜色均有对应的 `-hover`、`-active`、`-focus`、`-disabled` 和 `-bg` 变体。

### 控件通用颜色

- `--g-color`: 默认文字颜色
- `--g-background`: 默认背景颜色
- `--g-border-color`: 默认边框颜色
- `--g-plain-color`: 朴素/轻量文字颜色
- `--g-plain-background`: 朴素/轻量背景颜色
- `--g-plain-border-color`: 朴素/轻量边框颜色

### 布局与间距

- `--g-padding`: 标准内边距
- `--g-padding-s`: 小内边距
- `--g-padding-xs`: 超小内边距
- `--g-padding-l`: 大内边距
- `--g-padding-xl`: 超大内边距
- `--g-margin`: 标准外边距

### 圆角

- `--g-radius`: 标准圆角
- `--g-radius-l`: 较大圆角
- `--g-radius-xl`: 超大圆角

### 字号

- `--g-size`: 标准字号
- `--g-size-xs`: 超小字号
- `--g-size-m`: 中等字号
- `--g-size-l`: 较大字号
- `--g-size-xl`: 大字号
- `--g-size-xxl`: 超大字号

### 控件尺寸

- `--g-control`: 标准控件尺寸（如 check、radio 的宽度）
- `--g-control-m`: 中等控件尺寸
- `--g-control-l`: 较大控件尺寸

### 其他

- `--g-family`: 字体族
- `--g-line`: 行高
- `--g-cubic`: 全局贝塞尔缓动函数
- `--g-transition`: 全局过渡动画
- `--g-pure`: 纯底色（通常为白色或极浅色）
- `--face`: 表面颜色
- `--g-shadow`: 阴影

## 属性选择器

- `[data-cg-disabled]`: 禁用状态，会自动设置 `cursor: not-allowed;`。


# 控件
---

## alayout
---

自适应布局容器组件（旧版）。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

row 之间的间距，默认 0。

#### itemGutter

`number` | `string`

cell 之间的间距，默认 0。

### 样式

使用 flex 布局，子元素按指定方向排列。支持自适应和固定宽度的子元素混合使用。

配合 alayout-row 和 alayout-cell 子组件使用。填满父容器空间。

### 示例

```xml
<alayout direction="h">
    <alayout-row>
        <alayout-cell :width="200">Sidebar</alayout-cell>
        <alayout-cell>Content</alayout-cell>
    </alayout-row>
</alayout>
```

## alayout2
---

自适应布局容器组件（新版，推荐）。

### 参数

#### gutter

`number` | `string`

cell 之间的间距，默认 0。

### 事件

#### direction

`(direction: 'h' | 'v') => void`

布局方向变化时触发，宽度 >= 600 时为 h，否则为 v。

### 样式

使用 flex 布局，支持嵌套的自适应布局。配合 alayout2-cell 子组件使用。

相比 alayout，alayout2 结构更简洁，直接包含 cell 子组件。根据宽度自动切换横竖布局。

### 示例

```xml
<alayout2 :gutter="10" @direction="onDirection">
    <alayout2-cell>Sidebar</alayout2-cell>
    <alayout2-cell>Content</alayout2-cell>
</alayout2>
```

## alayout2-cell
---

自适应布局单元格组件（新版）。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

作为 alayout2 的子组件，显示单元格内容。使用 flex 布局。

支持自定义内部布局方向和对齐方式。

### 示例

```xml
<alayout2-cell direction="v" :gutter="10">Content</alayout2-cell>
```

## alayout-cell
---

自适应布局单元格组件。

### 参数

#### span

`number` | `string`

占据列数，默认 1。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

作为 alayout-row 的子组件，显示单元格内容。使用 flex 布局。

根据 span 设置占据的列数，支持对齐方式配置。内容区域支持通过 slot 自定义。

### 示例

```xml
<alayout-cell :span="2">Content</alayout-cell>
```

## alayout-row
---

自适应布局行组件。

### 样式

作为 alayout 的子组件，包含 alayout-cell 单元格。使用 flex 布局。

行间距由父组件 alayout 的 gutter 控制。子单元格水平排列。

### 示例

```xml
<alayout-row>
    <alayout-cell>Content</alayout-cell>
</alayout-row>
```

## alert
---

提示框组件，用于显示重要信息。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

提示框类型，默认 `default`。

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

`boolean`

是否显示关闭按钮，默认 false。

#### title

`string`

标题文本。

### 事件

#### close

`() => void`

点击关闭按钮时触发。

### 样式

使用 flex 布局，包含图标、内容区域和可选的关闭按钮。提示框具有圆角边框和背景色。

支持多种类型（default/primary/info/warning/danger/cg）对应不同的配色方案。可显示标题和自定义内容。

关闭按钮悬停时高亮显示。内容区域支持自定义布局方向和对齐方式。

### 示例

```xml
<alert type="warning" title="Warning">This is a warning message.</alert>
```

## arrow
---

箭头切换组件，可用于表示展开/收起等切换状态。

### 参数

#### map

`{ 'true'?: any; 'false'?: any; }`

值映射配置。

#### modelValue

`any`

双向绑定，当前状态值，默认 false。

### 事件

#### change

`(event: clickgo.control.ISwitchChangeEvent) => void`

状态改变时触发。

### 样式

使用 flex 布局，显示箭头图标。点击可切换展开/收起状态。

图标颜色继承父元素的文字颜色。支持键盘操作。

### 示例

```xml
<arrow v-model="expanded"></arrow>
```

## arteditor
---

文章编辑器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### preview

`boolean` | `string`

双向绑定，是否预览模式，默认 false。

#### pre

`string`

图片前缀地址。

#### modelValue

`any[]`

双向绑定，内容数据。

### 事件

#### imgselect

`(callback: (url: string) => void) => void`

选择图片时触发，参数为回调函数，调用时传入图片 URL。

### 样式

使用 flex 布局，垂直排列工具栏和内容区域。编辑器填满容器空间。支持段落和图片混排编辑。

支持加粗、斜体等文本样式。可切换编辑/预览模式。

### 示例

```xml
<arteditor v-model="content" @imgselect="onSelect"></arteditor>
```

## bgroup
---

按钮组组件（按钮贴贴），用于将多个按钮组合显示。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### type

`'default'` | `'tool'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

按钮类型，默认 `default`。

#### size

`'m'` | `'l'` | `'xl'`

按钮尺寸，默认 `m`。

### 样式

使用 flex 布局，按钮按指定方向排列。相邻按钮共享边框，首尾按钮保留圆角。

水平排列时左右相邻，垂直排列时上下相邻。按钮间无间距。

### 示例

```xml
<bgroup>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
</bgroup>
```

## box
---

图形绘制容器组件，用于绘制和操作 SVG 图形。

### 参数

#### modelValue

`Record<string, IDItem>`

图形数据对象，key 为图形 ID，value 为图形属性。

#### selected

`string[]` | `string`

双向绑定，当前选中的图形 ID 列表。

### 样式

使用 SVG 容器，支持绘制矩形、圆形、椭圆、线条、多边形等图形。选中的图形显示控制点。

支持框选多个图形，选中图形可拖动移动和调整大小。具有选区矩形指示框。

图形可设置移动和缩放权限。支持 Ctrl/Command 键多选。

### 示例

```xml
<box :modelValue="shapes" v-model:selected="selectedIds"></box>
```

## button
---

常用的操作按钮。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否为朴素按钮，默认 false。

#### checked

`boolean` | `string`

是否选中状态，默认 false。

#### type

`'default'` | `'tool'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

按钮类型，默认 `default`。

#### area

`'all'` | `'mark'` | `'split'`

点击区域模式，默认 `all`。

#### size

`'m'` | `'l'` | `'xl'`

尺寸，默认 `m`。

#### sizeh

`boolean` | `string`

是否使用水平尺寸模式，默认 false。

#### gutter

`number` | `string`

间距，默认 0。

### 样式

使用 flex 布局，内容居中显示。按钮具有圆角边框，支持多种类型（default/tool/primary/info/warning/danger）对应不同的配色方案。

按钮支持朴素模式（无背景色）和选中状态。支持三种尺寸（m/l/xl）和水平尺寸模式。split 模式下可显示下拉箭头。

具有焦点轮廓、悬停高亮和激活按下等交互状态。禁用时呈现灰色并禁止点击。

### 示例

```xml
<button type="primary" @click="onClick">Primary Button</button>
```

## calendar
---

日历组件，用于多日期选择。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### disabledList

`string[]` | `string`

禁用日期列表，如 20200101。

#### modelValue

`string[]` | `string`

双向绑定，选中的日期字符串数组。

#### start

`string`

可选开始日期（如 20200101）。

#### end

`string`

可选结束日期（如 20250101）。

#### yearmonth

`string`

双向绑定，当前显示的年月（如 202301）。

#### select

`string`

双向绑定，当前选中的单个日期。

#### jump

`boolean` | `string`

设置值时是否自动跳转，默认 true。

#### clearbtn

`boolean` | `string`

是否显示清空按钮，默认 true。

#### backbtn

`boolean` | `string`

是否显示返回今天按钮，默认 true。

### 事件

#### changed

`() => void`

选中日期改变后触发。

#### yearmonthchanged

`() => void`

年月改变后触发。

#### selected

`(event: ICalendarSelectedEvent) => void`

选中日期时触发。

### 样式

使用 flex 布局，包含年月切换区域和日期网格。日期网格显示当月所有日期和相邻月份的日期。

选中日期高亮显示，今天日期有特殊标记。禁用日期呈现灰色不可选。

支持年月快速切换。具有平滑的月份切换动画。

### 示例

```xml
<calendar v-model="selectedDates" :start="'20200101'" :end="'20251231'"></calendar>
```

## captcha
---

验证码组件，支持腾讯云和 Cloudflare 验证。

### 参数

#### factory

`'tc'` | `'cf'`

验证码服务商，`tc` 为腾讯云，`cf` 为 Cloudflare，默认 `tc`。

#### akey

`string`

验证码应用 Key。

### 事件

#### result

`(event: ICaptchaResultEvent) => void`

验证完成时触发，返回验证结果。

### 样式

使用 flex 布局，显示验证按钮。点击按钮弹出验证码弹窗。

按钮显示验证状态：待验证、验证中、验证成功、验证失败。不同状态有对应的图标和颜色。

验证中显示遮罩防止重复点击。支持多语言文字显示。

### 示例

```xml
<captcha factory="tc" akey="your-app-key" @result="onResult"></captcha>
```

## check
---

复选框组件，用于在多个选项中进行多项选择。支持选中、未选中和不确定（Indeterminate）三种状态。

### 参数

#### disabled

`boolean` | `string`

是否禁用控件，默认 false。

#### modelValue

`boolean` | `string`

双向绑定，控制选中状态，默认 false。

#### indeterminate

`boolean` | `string`

双向绑定，设置不确定状态，常用于全选/半选场景，默认 false。

### 事件

#### change

`(event: ICheckChangeEvent) => void`

值改变前触发，调用 `event.preventDefault()` 可阻止改变。

#### changed

`(event: ICheckChangedEvent) => void`

值改变后触发。

### 样式

使用 flex 布局，左侧为复选框图标，右侧为文本内容区域。复选框支持三种视觉状态：未选中（空心方框）、选中（带勾选图标）和不确定（带横杠）。

复选框具有圆角边框和阴影效果。选中和不确定状态下背景色会变为主题色。支持通过 slot 插入自定义内容。

支持键盘操作（空格/回车），具有焦点、悬停和激活等交互状态，禁用时呈现灰色并禁止交互。

### 示例

```xml
<check v-model="checked">选项</check>
```

## circle
---

圆形/圆环组件，用于显示图标或状态。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### sub

`boolean` | `string`

是否为次级样式，默认 false。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `s`。

### 样式

使用 inline-flex 布局，内容居中显示。组件为圆形，支持多种尺寸和类型颜色。

朴素模式下显示为空心圆环。次级样式显示为较浅的颜色。内容区域可通过 slot 自定义。

常用于显示状态指示、头像占位或图标包裹。

### 示例

```xml
<circle type="primary" size="m">A</circle>
```

## colorist
---

颜色选择器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### mode

`'hsl'` | `'rgb'` | `'hex'`

颜色模式，默认 `hsl`。

#### modelValue

`string`

双向绑定，当前颜色值。

### 事件

#### changed

`(event: IColoristChangedEvent) => void`

颜色改变后触发，包含 `value`、`hsl` 和 `rgb` 信息。

### 样式

使用 flex 布局，显示当前颜色预览块。点击弹出调色板面板。

面板包含色相选择、饱和度/亮度选择、透明度选择。支持十六进制和 RGBA 格式。

### 示例

```xml
<colorist v-model="color"></colorist>
```

## content
---

内容容器组件，用于统一管理内容布局。

### 参数

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

#### fill

`boolean` | `string`

是否填满父容器，默认 false。

### 方法

#### check

`(): boolean`

检查内部所有表单控件的必填项，返回是否通过。

### 样式

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

支持设置对齐方式。fill 模式下占满父容器空间。

常用于表单布局，可统一管理内部表单控件的校验。

### 示例

```xml
<content direction="v" :gutter="10">
    <text v-model="name" require></text>
    <button @click="submit">Submit</button>
</content>
```

## cube
---

立方体 3D 展示组件。

### 参数

#### hue

`string`

色调值，默认 `255`。

#### size

`'xs'` | `'s'` | `'m'` | `'mh'` | `'l'` | `'lh'` | `'xl'` | `'xlh'`

尺寸，默认 `s`。

### 事件

#### anistart

`() => void`

动画开始时触发。

#### aniend

`() => void`

动画结束时触发。

### 样式

使用 CSS 3D 变换实现立方体效果。顶面可通过插槽自定义内容。

支持鼠标悬停动画效果。具有透视效果和平滑的动画。

### 示例

```xml
<cube hue="180" size="m" @anistart="onStart">Top</cube>
```

## date
---

日期时间选择器。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### disabledList

`string[]` | `string`

禁用日期列表。

#### modelValue

`number` | `string` | `undefined`

双向绑定，时间戳毫秒值。

#### tz

`number` | `string`

双向绑定，时区偏移（小时）。

#### yearmonth

`string`

双向绑定，年月字符串（如 202301）。

#### hourminute

`string`

双向绑定，时分字符串。

#### start

`number` | `string`

可选开始时间。

#### end

`number` | `string`

可选结束时间。

#### date

`boolean` | `string`

是否显示日期，默认 true。

#### time

`boolean` | `string`

是否显示时间，默认 true。

#### zone

`boolean` | `string`

是否显示时区，默认 false。

#### close

`boolean` | `string`

选择后是否自动关闭，默认 true。

### 事件

#### changed

`(event: IDateChangedEvent) => void`

值改变后触发，包含 `value`、`zone` 和 `dates` 信息。

#### yearmonthchanged

`() => void`

年月改变时触发。

### 样式

使用 flex 布局，包含日期显示框和下拉面板。点击显示框弹出日期选择面板。

日期面板包含年月切换、日期网格。时间选择支持时分秒滚动选择。可显示时区信息。

选中日期高亮显示，禁用日期呈现灰色不可选。面板具有阴影效果和淡入淡出动画。

### 示例

```xml
<date v-model="timestamp"></date>
```

## datepanel
---

日期选择面板组件，用于内嵌日期时间选择。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### disabledList

`string[]` | `string`

禁用日期列表。

#### modelValue

`number` | `string` | `undefined`

双向绑定，时间戳值（毫秒）。

#### start

`number` | `string`

可选开始时间（秒/毫秒）。

#### end

`number` | `string`

可选结束时间（秒/毫秒）。

#### tz

`number` | `string`

双向绑定，时区偏移（小时）。

#### yearmonth

`string`

双向绑定，当前显示的年月，如 200708。

#### hourminute

`string`

双向绑定，时分秒字符串。

#### cursor

`string`

双向绑定，range 模式下鼠标年月日位置字符串。

#### jump

`boolean` | `string`

设置值时是否自动跳转，默认 true。

#### time

`boolean` | `string`

是否显示时间选择，默认 true。

#### zone

`boolean` | `string`

是否显示时区选择，默认 false。

#### range

`boolean` | `string`

是否开启范围选择模式，默认 false。

#### clearbtn

`boolean` | `string`

是否显示清空按钮，默认 true。

#### backbtn

`boolean` | `string`

是否显示返回今天按钮，默认 true。

### 事件

#### changed

`(event: IDatepanelChangedEvent) => void`

值改变后触发。

#### yearmonthchanged

`() => void`

年月改变后触发。

#### selected

`(event: IDatepanelSelectedEvent) => void`

选中日期时触发。

#### range

`(event: IDatepanelRangeEvent) => void`

范围选择完成时触发。

### 样式

使用 flex 布局，包含日期选择区和可选的时间选择区。日期网格显示当月日期。

时间选择使用滚轮选择器。可选显示时区选择器。范围模式下显示选择范围高亮。

选中日期高亮显示，禁用日期呈现灰色。具有平滑的切换动画。

### 示例

```xml
<datepanel v-model="timestamp" time></datepanel>
```

## daterange
---

日期范围选择组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### modelValue

`Array<number | string>` | `string`

双向绑定，时间戳数组 [开始, 结束]。

#### tz

`number` | `string`

双向绑定，时区偏移（小时）。

#### start

`number` | `string`

可选开始时间限制。

#### end

`number` | `string`

可选结束时间限制。

#### time

`boolean` | `string`

是否显示时间选择，默认 true。

#### zone

`boolean` | `string`

是否显示时区选择，默认 false。

#### close

`boolean` | `string`

选择后是否自动关闭，默认 true。

### 事件

#### changed

`() => void`

值改变后触发。

### 样式

使用 flex 布局，包含开始和结束两个日期选择框。点击选择框弹出日期范围选择面板。

面板显示两个月份的日历，可选择日期范围。选中范围高亮显示连接区域。

支持时间和时区选择。禁用日期呈现灰色不可选。

### 示例

```xml
<daterange v-model="range" v-model:tz="tz"></daterange>
```

## delete
---

移除按钮组件。通常用于包裹在其他组件外，当鼠标悬停时在右上角显示一个移除图标，点击图标可触发移除事件。

### 事件

#### close

`() => void`

点击移除图标时触发。

### 样式

使用 `relative` 定位包裹内容，移除图标使用 `absolute` 定位在右上角。

移除图标默认隐藏，当鼠标悬停在组件区域时显示。图标具有圆形背景、边框和阴影。

移除图标在悬停和激活状态下会切换为危险色背景，增强交互反馈。

### 示例

```xml
<delete @close="onClose">
    <button>Item</button>
</delete>
```

## desc
---

描述列表组件。

### 参数

#### border

`boolean` | `string`

是否显示边框，默认 true。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### collapse

`boolean` | `string`

是否折叠模式，默认 true。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `m`。

### 样式

使用表格布局，展示键值对形式的描述信息。包含 `desc-row`、`desc-head`、`desc-cell` 子组件。

通过组合子组件可实现水平或垂直的布局方式。边框模式下显示单元格边框线。

标题列和内容列支持通过样式设置不同的宽度和对齐方式。

### 示例

```xml
<desc>
    <desc-row>
        <desc-head>Name</desc-head>
        <desc-cell>John</desc-cell>
    </desc-row>
</desc>
```

## desc-cell
---

描述列表单元格组件，用于显示描述内容。

### 样式

作为 `desc-row` 的子组件，显示描述内容。使用表格单元格布局。

样式由父组件 `desc` 的 `size`、`plain` 等参数控制。内容区域支持通过 slot 自定义。

### 示例

```xml
<desc-cell>Content</desc-cell>
```

## desc-head
---

描述列表标题组件，用于显示描述标题。

### 样式

作为 `desc-row` 的子组件，显示描述标题。使用表格单元格布局。

样式由父组件 `desc` 的 `size`、`plain` 等参数控制。内容区域支持通过 slot 自定义。

### 示例

```xml
<desc-head>Title</desc-head>
```

## desc-row
---

描述列表行组件。

### 样式

作为 `desc` 的子组件，包含 `desc-head` 和 `desc-cell`。使用表格行布局，控制子单元格的排列。

行高自适应内容。

### 示例

```xml
<desc-row>
    <desc-head>Name</desc-head>
    <desc-cell>Value</desc-cell>
</desc-row>
```

## dialog
---

模态对话框组件。

### 参数

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`string`

内容间距。

#### width

`number` | `string`

宽度。

#### height

`number` | `string`

高度。

#### padding

`boolean` | `string`

是否显示内边距，默认 true。

#### buttons

`string[]`

底部按钮列表，默认 `['OK']`。

### 事件

#### select

`(item: string) => void`

点击底部按钮时触发。

### 样式

使用 flex 布局，垂直排列内容区域和底部按钮区。

内容区域背景色为 `var(--g-plain-background)`，支持自定义布局方向和间距。

底部按钮区有上边框，水平排列，按钮间有间距。

### 示例

```xml
<dialog :buttons="['Yes', 'No']" @select="onSelect">Content</dialog>
```

## drawer
---

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

## echarts
---

ECharts 图表组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### data

`Record<string, any>`

ECharts 配置选项。

#### theme

`'light'` | `'dark'`

主题，默认 `light`。

### 事件

#### init

`(chart: any) => void`

图表初始化完成时触发，返回 ECharts 实例。

### 样式

使用 flex 布局，图表填满容器空间。支持所有 ECharts 图表类型。

图表响应容器大小变化自动重绘。支持主题切换。

### 示例

```xml
<echarts :data="chartOption" theme="light" @init="onInit"></echarts>
```

## eflow
---

流程图组件。

### 参数

#### gutter

`number` | `string`

子元素间距，默认空。

### 方法

#### toBottom

`(): void`

滚动到底部。

### 样式

该控件采用 flex 布局，由顶部的画布区域和底部的横向滚动条区域组成。画布区域内部包含一个可平移的显示容器。

支持通过鼠标或触摸在非节点区域进行点击拖拽操作，从而实现画布的平移。当内容超出显示范围时，组件会自动显示自定义的 `cg-scroll` 滚动条，以保证在不同平台上具有一致的交互体验。

画布组件具备自适应能力，能够实时监听容器和内容的大小变化并更新滚动状态。支持通过 `gutter` 参数灵活设置内部子元素之间的布局间距。

### 示例

```xml
<eflow :gutter="10">
    <div>Node 1</div>
    <div>Node 2</div>
</eflow>
```

## empty
---

空状态占位组件，用于显示无数据时的提示。

### 参数

#### tip

`boolean` | `string`

是否显示提示文字，默认 false。

#### layer

`boolean` | `string`

是否显示为遮罩层模式，默认 true。

### 样式

使用 flex 布局，内容居中显示。显示空状态图标和可选的提示文字。

遮罩层模式下使用绝对定位覆盖父元素。非遮罩层模式下作为普通内容显示。

支持多语言提示文字，图标和文字颜色为辅助色。

### 示例

```xml
<empty :tip="true"></empty>
```

## file
---

文件选择组件。

### 参数

#### accept

`string[]` | `string`

接受的文件类型。

#### multi

`boolean` | `string`

是否多选，默认 false。

#### dir

`boolean` | `string`

是否选择目录，默认 false。

### 事件

#### change

`(files: File[]) => void`

文件选择改变时触发。

### 样式

使用 flex 布局，显示文件选择按钮和已选文件列表。按钮具有圆角边框。

已选文件显示文件名和删除按钮。支持拖拽上传文件。

### 示例

```xml
<file v-model="files" accept="image/*" :multi="true"></file>
```

## flow
---

流式布局容器组件，支持滚动和选区。

### 参数

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### selection

`boolean` | `string`

是否开启框选，默认 false。

#### gesture

`string[]` | `string`

手势配置。

#### gutter

`number` | `string`

内容间距。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置，默认 0。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置，默认 0。

### 事件

#### gesture

`(dir: string) => void`

触发手势时触发。

#### beforeselect

`() => void`

框选开始前触发。

#### afterselect

`() => void`

框选结束后触发。

#### select

`(event: IFlowSelectEvent) => void`

框选中触发，包含 `area` 信息。

#### clientwidth

`(val: number) => void`

内部可用宽度改变时触发。

#### clientheight

`(val: number) => void`

内部可用高度改变时触发。

#### scrollwidth

`(val: number) => void`

内部滚动宽度改变时触发。

#### scrollheight

`(val: number) => void`

内部滚动高度改变时触发。

### 样式

使用 flex 布局，支持水平和垂直滚动。子元素按指定方向和间距排列。

框选模式下可拖动创建选区矩形，选中区域内的元素。支持手势操作触发自定义事件。

内容超出时自动显示滚动条。滚动位置可双向绑定。

### 示例

```xml
<flow direction="v" :gutter="10" :selection="true">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</flow>
```

## form
---

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

## greatlist
---

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

## greatselect
---

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

## grid
---

栅格布局容器，用于实现基于列的网格布局，支持响应式列数切换。

### 参数

#### direction

`'h'` | `'v'`

布局方向，`h` 为水平，`v` 为垂直，默认 `'h'`。此属性决定单元格内容的默认轴向及对齐规则。

#### gutter

`number` | `string`

单元格之间的间距（px），默认 `0`。

#### itemGutter

`number` | `string`

子单元格内部的默认间距（px），默认 `0`。若子单元格未指定 `gutter` 则使用此值。

#### alignH

`string` | `undefined`

全部子单元格的全局水平对齐方式，可被子单元格自身的 `alignH` 覆盖。

#### alignV

`string` | `undefined`

全部子单元格的全局垂直对齐方式，可被子单元格自身的 `alignV` 覆盖。

#### sizeM

`number` | `string`

中等宽度（>= 600px 且 < 1000px）时的列数，默认 `2`。

#### sizeL

`number` | `string`

大宽度（>= 1000px）时的列数，默认 `4`。

### 事件

无

### 方法

无

### 插槽

无

### 样式

容器采用 `display: grid` 布局，通过 `grid-template-columns` 属性动态控制网格列数。系统自动监听容器宽度，并在 600px 和 1000px 阈值处进行响应式断点切换。

单元格间距通过 CSS 的 `gap` 属性实现，其值直接绑定到 `gutter` 参数。无论布局处于何种响应式状态，单元格之间的间距都能保持精确的一致性。

该组件作为结构性容器，不包含任何装饰性样式。它支持多层嵌套，能够稳定承载复杂的 `grid-cell` 布局，是构建工业级管理面板和响应式门户的核心底座。

### 示例

```xml
<grid :gutter="10" :size-m="3" :size-l="6">
    <grid-cell>Cell 1</grid-cell>
    <grid-cell :span="2">Cell 2</grid-cell>
</grid>
```


## grid-cell
---

栅格布局子单元格，必须放在 `grid` 容器中使用，支持灵活的跨列配置。

### 参数

#### direction

`'h'` | `'v'` | `undefined`

单元格轴向布局方向。默认继承父级 `grid` 的 `direction` 设置。

#### gutter

`number` | `string`

单元格内部间距（px）。若设置，则覆盖父级 `grid` 的 `itemGutter` 参数。默认 `0`。

#### alignH

`string` | `undefined`

内容水平对齐方式。若设置，则覆盖父级全局对齐配置。

#### alignV

`string` | `undefined`

内容垂直对齐方式。若设置，则覆盖父级全局对齐配置。

#### span

`number` | `string`

基础跨列数。在 `m` 或 `l` 尺寸下，若未单独设置 `sizeM` 或 `sizeL`，则应用此值。默认 `0`。

#### sizeM

`number` | `string`

中等宽度下（600px - 1000px）的跨列数。设置为 `-1` 时强制跨 `1` 列。默认 `0`。

#### sizeL

`number` | `string`

大宽度下（>= 1000px）的跨列数。设置为 `-1` 时强制跨 `1` 列。默认 `0`。

### 事件

无

### 方法

无

### 插槽

无

### 样式

内部采用 flex 弹性布局，默认继承父容器的方向特性。通过 `align-items` 和 `justify-content` 属性，配合 `direction` 的状态，实现单元格内容的精准对齐与分布。

通过 CSS 的 `grid-column` 属性实现横跨多列功能。跨列逻辑会自动响应父容器的宽度状态：在小尺寸（s）模式下强制为单列堆叠，而在较高尺寸下则计算跨列偏移。

样式表现高度抽象，无背景、边框或强制的外边距。这使得单元格能够完美融合于各种设计风格中，开发者可以根据需要为其添加背景色或内阴影等视觉装饰。

### 示例

```xml
<grid-cell :span="2">Cell Content</grid-cell>
```


## group
---

分组容器组件，用于将内容分组显示。

### 参数

#### title

`string`

分组标题。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### hover

`boolean` | `string`

是否显示悬停效果，默认 false。

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

#### padding

`boolean` | `string`

是否显示内边距，默认 true。

#### position

`'top'` | `'right'` | `'bottom'` | `'left'`

标题位置，默认 `top`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### hue

`string` | `undefined`

自定义色相值。

### 样式

使用 flex 布局，包含标题区域和内容区域。分组具有圆角边框和背景色。

标题可显示在四个方向，具有对应的边框指示线。支持多种类型颜色和自定义色相。

hover 模式下悬停时显示阴影效果。朴素模式下无边框和背景。

### 示例

```xml
<group title="Basic Info">
    <content>...</content>
</group>
```

## hske
---

HSK 布局容器组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

根据宽度自动调整尺寸样式。

### 示例

```xml
<hske direction="v" :gutter="10">
    <div>Item 1</div>
    <div>Item 2</div>
</hske>
```

## html
---

HTML 内容组件，用于渲染 HTML 字符串。

### 参数

#### html

`string`

HTML 内容字符串。

#### css

`string`

CSS 样式字符串。

### 样式

使用 block 布局，内部渲染解析后的 HTML 内容。支持基础的 HTML 标签和样式。

内容会进行安全处理，防止 XSS 攻击。链接默认在新窗口打开。

### 示例

```xml
<html :html="htmlString" :css="cssString"></html>
```

## icon
---

显示系统内置图标。

### 参数

#### name

`string`

图标名称。

#### size

`string`

图标尺寸，默认 `s`。

### 样式

使用 inline-block 布局，图标居中显示。图标为 SVG 格式，支持多种尺寸。

图标颜色继承父元素的文字颜色，可通过 CSS 的 color 属性自定义颜色。

图标保持等比例缩放，显示清晰无锯齿。

### 示例

```xml
<icon name="close"></icon>
```

## iconview
---

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

## img
---

图片展示组件，支持多种来源。

### 参数

#### src

`string`

图片地址，支持 HTTP/HTTPS、Data URL、包内路径等。

#### mode

`string`

图片显示模式（对应 background-size），默认 `default`。

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

### 样式

使用相对定位容器，图片作为背景显示在绝对定位层。支持多种显示模式控制图片的缩放方式（contain/cover 等）。

内容区域使用 flex 布局，可通过 direction 控制水平或垂直排列，支持设置对齐方式和间距。

图片层默认居中显示，不重复平铺，支持通过 slot 在图片上层叠加自定义内容。

### 示例

```xml
<img src="https://example.com/image.png"></img>
```

## imgviewer
---

图片查看器组件，支持图片预览和操作。

### 参数

#### src

`string[]` | `string`

图片地址列表。

#### modelValue

`number` | `string`

双向绑定，当前显示的图片索引，默认 0。

### 样式

使用相对定位容器，图片居中显示，支持缩放和拖动。

底部显示操作工具栏，包含缩放、旋转、关闭等按钮。支持手势操作缩放。

### 示例

```xml
<imgviewer :src="imageUrl" @close="onClose"></imgviewer>
```

## jodit
---

富文本编辑器组件（基于 Jodit）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### placeholder

`string`

占位符。

#### modelValue

`string`

双向绑定，HTML 内容。

#### theme

`'dark'` | `'light'`

主题，默认 `light`。

### 事件

#### imgselect

`(callback: (url: string, alt?: string) => void) => void`

选择图片时触发，参数为回调函数。

#### init

`(instance: any) => void`

编辑器初始化完成时触发。

#### text

`(text: string) => void`

纯文本内容变化时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。顶部显示工具栏，包含格式化按钮。

支持文字样式、段落、列表、表格、图片等。可视化编辑所见即所得。

### 示例

```xml
<jodit v-model="content" @init="onInit"></jodit>
```

## label
---

用于展示文本信息的标签组件。

### 参数

#### mode

`'default'` | `'tip'` | `'mtip'` | `'date'` | `'important'` | `'click'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

显示模式，默认 `default`。

#### content

`string`

文本内容。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `s`。

#### align

`'left'` | `'start'` | `'center'` | `'right'` | `'end'`

对齐方式，默认 `left`。

#### nowrap

`boolean` | `string`

是否不换行，默认 false。

#### copy

`boolean` | `string`

是否允许复制，默认 false。

#### thru

`boolean` | `string`

是否显示删除线，默认 false。

#### time

`boolean` | `string`

是否显示时间（仅在 date 模式下有效），默认 true。

#### date

`boolean` | `string`

是否显示日期（仅在 date 模式下有效），默认 true。

#### zone

`boolean` | `string`

是否显示时区，默认 false。

#### tz

`number` | `string` | `undefined`

时区偏移量。

### 样式

使用 flex 布局，文本可根据 align 参数设置对齐方式。标签支持多种显示模式（default/tip/date/primary 等）对应不同的颜色和样式。

支持多种尺寸（s/m/l/xl），可设置不换行（超出显示省略号）和删除线效果。date 模式下可格式化显示日期时间。

tip 模式显示为辅助文本色，click 模式具有可点击的交互效果，各类型模式有对应的主题色。

### 示例

```xml
<label mode="primary">Primary Label</label>
```

## layout
---

布局容器组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

#### wrap

`boolean` | `string`

是否换行，默认 false。

### 样式

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

填满父容器空间。支持设置对齐方式。常用于页面整体布局。

### 示例

```xml
<layout direction="v">
    <div>Header</div>
    <div style="flex: 1">Content</div>
    <div>Footer</div>
</layout>
```

## levelselect
---

级联选择器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### async

`boolean` | `string`

是否异步加载，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### map

`object`

数据映射配置。

#### padding

`string`

内边距。

#### minWidth

`number`

弹出层最小宽度。

#### modelValue

`string`

双向绑定，选中的值。

#### placeholder

`string`

占位符。

#### data

`any[]` | `Record<string, any>`

级联数据。

### 事件

#### label

`(labels: string[]) => void`

获取标签时触发。

#### load

`(value: string, callback: (children?: any[]) => void) => void`

异步加载时触发。

#### loaded

`() => void`

加载完成时触发。

#### level

`(event: ILevelselectLevelEvent) => void`

层级变化时触发，包含 `list`、`values` 和 `labels`。

### 样式

使用 flex 布局，显示当前选中路径。点击弹出级联选择面板。

面板多列显示，每列对应一个层级。选中项高亮显示，下级数据在右侧列展示。

### 示例

```xml
<levelselect :data="regions" v-model="selected"></levelselect>
```

## link
---

超链接组件。

### 参数

#### url

`string`

链接地址。

#### line

`boolean` | `string`

是否显示下划线，默认 false。

#### align

`'left'` | `'start'` | `'center'` | `'right'` | `'end'`

对齐方式，默认 `left`。

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### type

`'primary'` | `'info'` | `'warning'` | `'danger'` | `'plain'`

链接类型，默认 `info`。

### 样式

使用 flex 布局，文本可根据 align 参数设置对齐方式。链接具有不同的类型（primary/info/warning/danger/plain）对应不同的颜色。

支持显示下划线样式。链接文本支持自动换行，内容区域可通过 slot 自定义。

具有悬停变色效果，禁用时呈现灰色并禁止交互。

### 示例

```xml
<link url="https://example.com">Click me</link>
```

## list
---

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

## loading
---

加载中动画组件。

### 参数


### 样式

使用 flex 布局，动画居中显示。加载动画为旋转的方块样式，具有平滑的旋转动画效果。

支持三种尺寸（s/m/l），颜色继承父元素的文字颜色或使用主题色。

动画持续循环播放，直到组件被移除或隐藏。

### 示例

```xml
<loading></loading>
```

## map
---

地图组件（基于高德地图）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### factory

`'tianditu'` | `'google'`

地图服务商，默认 `google`。

#### akey

`string`

地图 API Key。

#### css

`string`

自定义 CSS 样式。

#### tdurlcn

`string`

天地图服务商下，国内地图部分瓦片地址模板，默认天地图瓦片。

#### tdurlintl

`string`

天地图服务商下，国际地图部分瓦片地址模板，默认 OSM 瓦片。

#### lat

`number`

双向绑定，中心纬度，默认 31.223704。

#### lng

`number`

双向绑定，中心经度，默认 121.366077。

#### zoom

`number` | `string`

双向绑定，缩放级别，默认 10。

#### zoomControl

`boolean` | `string`

是否显示缩放控件，默认 false。

#### markers

`Record<string, IMarker>`

双向绑定，标记点集合。

#### lines

`Record<string, ILine>`

双向绑定，折线集合。

#### polygons

`Record<string, IPolygon>`

双向绑定，多边形集合。

#### overlays

`Record<string, IOverlay>`

自定义覆盖物集合。

### 事件

#### init

`(map: { lib: any; map: any }) => void`

地图初始化完成时触发。

#### mapClick

`(location: { lat: number; lng: number }) => void`

点击地图空白处时触发。

#### markerClick

`(key: string) => void`

点击标记点时触发。

#### markerDrag

`(key: string) => void`

拖拽标记点时触发。

#### markerDragend

`(key: string) => void`

标记点拖拽结束时触发。

#### markerUpdate

`(key: string) => void`

标记点更新时触发。

#### overlayClick

`(key: string) => void`

点击自定义覆盖物时触发。

#### lineClick

`(key: string) => void`

点击折线时触发。

#### lineDrag

`(key: string) => void`

拖拽折线时触发。

#### lineDragend

`(key: string) => void`

折线拖拽结束时触发。

#### lineUpdate

`(key: string) => void`

折线更新时触发。

#### lineInsert

`(key: string, index: number) => void`

折线插入节点时触发。

#### lineRemove

`(key: string, index: number, location: { lat: number; lng: number }) => void`

折线移除节点时触发。

#### polygonClick

`(key: string) => void`

点击多边形时触发。

#### polygonDrag

`(key: string) => void`

拖拽多边形时触发。

#### polygonDragend

`(key: string) => void`

多边形拖拽结束时触发。

#### polygonUpdate

`(key: string) => void`

多边形更新时触发。

#### polygonInsert

`(key: string, index: number) => void`

多边形插入节点时触发。

#### polygonRemove

`(key: string, index: number, location: { lat: number; lng: number }) => void`

多边形移除节点时触发。

### 样式

使用 flex 布局，地图填满容器空间。支持缩放、拖动等交互操作。

可显示标记点、路线等图层。支持地图事件监听。

### 示例

```xml
<map akey="your-amap-key" :center="[116.397428, 39.90923]" :zoom="11"></map>
```

## marked
---

Markdown 渲染组件。

### 参数

#### modelValue

`string`

Markdown 内容字符串。

#### css

`string`

CSS 样式字符串。

### 事件

#### init

`() => void`

初始化完成时触发。

### 样式

使用 block 布局，渲染解析后的 Markdown 内容。支持标题、列表、代码块、表格等常用语法。

代码块具有语法高亮。链接默认在新窗口打开。图片自适应宽度。

### 示例

```xml
<marked :modelValue="markdownText" @init="onInit"></marked>
```

## marquee
---

跑马灯组件，用于文字滚动展示。

### 参数

#### direction

`'left'` | `'right'` | `'top'` | `'bottom'`

滚动方向，默认 `left`。

#### speed

`number` | `string`

滚动速度，默认 1。

### 样式

使用相对定位容器，内容循环滚动显示。支持四个滚动方向。

悬停时可暂停滚动。滚动平滑无跳动。内容无缝循环。

### 示例

```xml
<marquee direction="left" :speed="50">Scrolling text...</marquee>
```

## menu
---

菜单栏组件，用于顶部菜单。

### 样式

使用 flex 布局，菜单项水平排列。包含 menu-item 子组件。

菜单项具有悬停高亮效果。点击菜单项可展开下拉菜单。

常用于应用程序的顶部菜单栏。

### 示例

```xml
<menu>
    <menu-item label="File">
        <menulist>...</menulist>
    </menu-item>
</menu>
```

## menu-item
---

菜单项组件，用于菜单栏的单个菜单项。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### alt

`string`

快捷键提示文本。

### 样式

作为 menu 的子组件，显示菜单项文本。悬停时高亮显示背景色。

点击后展开关联的下拉菜单列表。选中状态下保持高亮。

### 示例

```xml
<menu-item label="File">
    <menulist>...</menulist>
</menu-item>
```

## menulist
---

菜单列表容器组件，用于包裹菜单项。

### 样式

使用 flex 布局，垂直排列菜单项。菜单列表具有圆角边框、背景色和阴影效果。

内部包含 menulist-item 和 menulist-split 子组件。菜单项具有悬停高亮效果。

支持嵌套子菜单，子菜单在右侧展开显示。

### 示例

```xml
<menulist>
    <menulist-item label="Item 1"></menulist-item>
    <menulist-split></menulist-split>
    <menulist-item label="Item 2"></menulist-item>
</menulist>
```

## menulist-item
---

菜单列表项组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### alt

`string`

快捷键提示文本。

#### type

`string`

菜单项类型，可选 `check`、`radio`。

#### label

`string`

radio 类型时的标签值。

#### modelValue

`string` | `boolean`

双向绑定，当前选中值。

### 事件

#### check

`(value: string | boolean) => void`

点击 check/radio 类型菜单项时触发。

### 样式

作为 menulist 的子组件，显示单个菜单项。使用 flex 布局，包含图标、文本和快捷键提示。

悬停时高亮显示背景色。check 类型显示勾选图标，radio 类型显示圆点图标。

可包含子菜单，悬停时在右侧展开。禁用时呈现灰色。

### 示例

```xml
<menulist-item label="Open" alt="Ctrl+O" @click="onOpen"></menulist-item>
```

## menulist-split
---

菜单列表分隔线组件。

### 样式

作为 menulist 的子组件，显示水平分隔线。用于分隔不同功能组的菜单项。

分隔线具有左右边距，颜色为边框色。

### 示例

```xml
<menulist-split></menulist-split>
```

## monaco
---

Monaco 代码编辑器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### modelValue

`string`

双向绑定，编辑器内容。

#### language

`string`

代码语言。

#### theme

`string`

编辑器主题。

#### files

`Record<string, any>`

双向绑定，文件列表配置。

### 事件

#### jump

`(info: { path: string; start: number; end?: number }) => void`

跳转时触发。

#### init

`(info: { monaco: any; instance: any }) => void`

编辑器初始化完成时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。支持语法高亮、自动补全、代码折叠。

支持多种编程语言。主题可随系统切换。具有行号和小地图。

### 示例

```xml
<monaco v-model="code" language="javascript" @init="onInit"></monaco>
```

## mpegts
---

流媒体播放器组件（基于 mpegts.js）。

### 参数

#### src

`string`

流媒体地址。

#### fsrc

`string`

全屏时的流媒体地址。

#### text

`string`

显示文本。

#### controls

`boolean` | `string`

是否显示控制条，默认 false。

#### volume

`number` | `string`

双向绑定，音量，默认 80。

#### play

`boolean` | `string`

双向绑定，是否播放，默认 false。

#### reset

`number`

自动销毁重置时间（0 为不自动重置，毫秒）。

### 事件

#### canplay

`() => void`

可以播放时触发。

#### init

`() => void`

初始化完成时触发。

### 样式

使用 flex 布局，播放器填满容器空间。支持 FLV 和 MPEG-TS 格式的流媒体。

适用于直播和点播场景。低延迟播放。

### 示例

```xml
<mpegts :src="streamUrl" :controls="true" v-model:play="isPlaying"></mpegts>
```

## nav
---

侧边导航菜单组件。

### 参数

#### modelValue

`string`

双向绑定，当前选中的菜单项 Name。

#### default

`string`

默认选中的菜单项 Name。

#### hash

`boolean` | `string`

是否与 Form Hash 联动，默认 false。

#### show

`boolean` | `string` | `undefined`

双向绑定，是否显示（Pop 模式下）。

#### logo

`string`

Logo 图片地址。

### 事件

#### layer

`(mode: 'pop' | null) => void`

Layer 模式变化时触发。

#### qs

`(qs: Record<string, any>) => void`

Query String 参数变化时触发。

### 样式

使用 flex 布局，垂直排列导航项。导航具有固定宽度，可显示 Logo 图标。

菜单项具有悬停高亮效果，选中项显示高亮背景和左侧指示条。支持分组标题和图标显示。

Pop 模式下可折叠为图标栏，点击展开完整菜单。支持平滑的展开/收起动画。

### 示例

```xml
<nav v-model="activeName">
    <nav-item name="home">Home</nav-item>
</nav>
```

## nav-item
---

导航菜单项组件。

### 参数

#### label

`string`

显示文本。

#### name

`string`

菜单项唯一标识，通常为 Panel 名称。

#### icon

`string`

菜单项图标。

#### show

`boolean` | `string`

双向绑定，子菜单是否展开，默认 false。

### 事件

#### select

`() => void`

选中时触发。

### 样式

作为 nav 的子组件，显示单个导航项。使用 flex 布局，包含图标和文本。

选中时显示高亮背景和左侧指示条。悬停时显示背景色变化。

支持嵌套子菜单，点击展开/折叠。

### 示例

```xml
<nav-item label="Home" name="home" icon="home"></nav-item>
```

## nav-title
---

导航菜单标题组件。

### 样式

作为 nav 的子组件，显示分组标题文本。文字较小，颜色为辅助色。

用于对导航项进行分组说明。上下有适当间距。

### 示例

```xml
<nav-title>Settings</nav-title>
```

## novnc
---

noVNC 远程桌面组件。

### 参数

#### modelValue

`{ url: string; pwd?: string; view?: boolean }`

连接配置对象，包含 WebSocket 地址、密码和是否仅查看模式。

### 事件

#### init

`() => void`

初始化完成时触发。

#### connect

`(event: { width: number; height: number }) => void`

连接成功时触发。

#### disconnect

`() => void`

断开连接时触发。

#### password

`() => void`

需要密码时触发。

#### fail

`() => void`

安全验证失败时触发。

#### desktopresize

`(event: { width: number; height: number }) => void`

桌面尺寸变化时触发。

#### clipboard

`(text: string) => void`

剪贴板事件触发。

### 样式

使用 flex 布局，远程桌面填满容器空间。支持鼠标和键盘操作。

可调整画质和缩放比例。支持剪贴板同步。

### 示例

```xml
<novnc :modelValue="{ url: wsUrl, pwd: password, view: false }" @connect="onConnect"></novnc>
```

## number
---

数字输入框组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### require

`boolean` | `string`

是否必填，默认 false。

#### modelValue

`string`

双向绑定，输入值，默认空字符串。

#### placeholder

`string`

占位符，默认空字符串。

#### max

`number` | `string` | `undefined`

最大值。

#### min

`number` | `string` | `undefined`

最小值。

### 事件

#### focus

`(e: FocusEvent) => void`

获得焦点时触发。

#### blur

`(e: FocusEvent) => void`

失去焦点时触发。

#### enter

`() => void`

按下回车键时触发。

#### beforechange

`(event: INumberBeforeChangeEvent) => void`

值改变前触发，包含 `value` 和 `change`，可调用 `preventDefault()` 阻止。

#### changed

`() => void`

值改变后触发。

#### minmaxchange

`(event: INumberMinMaxChangeEvent) => void`

数值超出范围时触发，包含 `before` 和 `value`，可调用 `preventDefault()` 阻止。

### 方法

#### focus

`(): void`

使输入框获得焦点。

### 样式

使用 flex 布局，包含输入框和增减按钮。输入框具有圆角边框。

支持朴素模式（无边框）。必填项在未输入时显示红色标记。增减按钮在输入框两侧或内部显示。

获得焦点时边框高亮，禁用时呈现灰色并禁止交互。支持右键菜单（复制/剪切/粘贴）。

### 示例

```xml
<number v-model="val" :min="0" :max="100"></number>
```

## objviewer
---

对象查看器组件，用于在可缩放的画布上展示内容。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### bg

`'dot'` | `'grid'`

背景样式，默认 `dot`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

支持缩放和平移的画布容器。背景可显示点阵或网格。

可在内部放置 objviewer-item 子组件，支持连接线绘制。

### 示例

```xml
<objviewer>
    <objviewer-item label="Item 1">Content</objviewer-item>
</objviewer>
```

## objviewer-item
---

对象查看器项组件。

### 参数

#### hue

`string`

色调值，默认 `255`。

#### hover

`boolean` | `string`

是否启用悬停效果，默认 false。

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### border

`'solid'` | `'dotted'` | `'dashed'` | `'ani'`

边框样式，默认 `solid`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

#### label

`string`

标签文本。

### 样式

作为 objviewer 的子组件，显示单个卡片项。

支持不同的边框样式和色调。可显示标签文本。

### 示例

```xml
<objviewer-item label="Item 1">Content</objviewer-item>
```

## page
---

分页组件。

### 参数

#### modelValue

`number` | `string`

双向绑定，当前页码，默认 1。

#### max

`number` | `string`

最大页数。

#### total

`number` | `string`

总条数。

#### count

`number` | `string`

每页条数，默认 10。

#### counts

`number[]` | `string`

每页条数选项列表。

#### control

`number` | `string`

显示的页码按钮数量，默认 2。

### 事件

#### change

`(event: IPageChangeEvent) => void`

页码改变时触发。

#### countchange

`(event: IPageCountchangeEvent) => void`

每页条数改变时触发。

#### countchanged

`(event: IPageCountchangedEvent) => void`

每页条数改变后触发。

### 样式

使用 flex 布局，包含页码按钮、上下页按钮和跳转输入框。当前页码高亮显示。

支持每页条数选择下拉框。页码过多时显示省略号和首尾页按钮。

按钮具有悬停和激活效果。显示总条数信息。

### 示例

```xml
<page v-model="currentPage" :total="100" :count="10"></page>
```

## palette
---

调色板组件，用于颜色选择。

### 参数

#### modelValue

`string`

双向绑定，当前颜色值。

#### mode

`'hsl'` | `'rgb'` | `'hex'`

颜色模式，默认 `hsl`。

#### ok

`boolean`

是否显示确定按钮，默认 false。

### 事件

#### changed

`(event: IPaletteChangedEvent) => void`

颜色改变后触发，包含 `value`、`hsl` 和 `rgb` 信息。

#### ok

`() => void`

点击确定按钮时触发。

### 样式

使用 flex 布局，垂直排列颜色选择区域和控制区域。显示色相条和饱和度/亮度选择区域。

支持直接输入十六进制颜色值。包含预设颜色选项。拖动选择器实时预览颜色变化。

### 示例

```xml
<palette v-model="color"></palette>
```

## panel
---

用于管理多个视图切换的面板组件。

### 参数

#### modelValue

`string`

当前显示的视图 Key。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### map

`Record<string, string | (new () => AbstractPanel)>` | `null`

视图映射表。

### 事件

#### go

`(event: IPanelGoEvent) => void`

跳转开始时触发，包含 `from` 和 `to`。

#### went

`(event: IPanelWentEvent) => void`

跳转完成后触发，包含 `result`、`from` 和 `to`。

### 样式

使用相对定位容器，内部视图使用绝对定位层叠显示。视图切换时具有滑动过渡动画。

非朴素模式下具有背景色。支持动态加载和缓存视图组件。

视图容器填满父元素空间，支持嵌套使用实现多级导航。

### 示例

```xml
<panel :map="map"></panel>
```

## pdf
---

PDF 查看器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### src

`string`

PDF 文件地址或 base64 数据。

#### page

`number` | `string`

当前页码，默认 1。

### 事件

#### loaded

`(pdf: any) => void`

PDF 加载完成时触发，返回 PDF 对象。

#### view

`(event: IPdfViewEvent) => void`

页面渲染时触发，包含页面尺寸信息（width/height/inwidth/inheight/pxwidth/pxheight）。

### 样式

使用 flex 布局，PDF 页面填满容器空间。底部显示翻页控制按钮和页码。

支持缩放、翻页操作。页面渲染清晰。加载时显示加载动画。

### 示例

```xml
<pdf :src="pdfUrl" v-model:page="currentPage"></pdf>
```

## progress
---

进度条组件。

### 参数

#### modelValue

`number` | `string`

双向绑定，当前进度值（0-100），默认 0。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

进度条类型，默认 `default`。

### 样式

使用 flex 布局，包含背景轨道和进度填充条。进度条具有圆角样式。

支持多种类型（default/primary/info/warning/danger）对应不同的进度条颜色。进度填充条宽度根据 modelValue 值动态变化。

进度变化时具有平滑的过渡动画效果。

### 示例

```xml
<progress :modelValue="50" type="primary"></progress>
```

## property
---

属性面板组件，用于显示和编辑对象属性。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### sort

`'kind'` | `'letter'`

双向绑定，排序方式，默认 `kind`。

#### type

`'property'` | `'event'`

双向绑定，显示类型，默认 `property`。

#### desc

`boolean` | `string`

是否显示描述，默认 true。

#### modelValue

`any[]`

双向绑定，属性数据列表。

### 样式

使用 flex 布局，垂直排列工具栏、内容区域和描述区域。每行显示属性名和对应的编辑控件。

支持按类别或字母排序。可切换显示属性或事件。不同类型的值使用不同的编辑控件。

### 示例

```xml
<property v-model="props" v-model:sort="sortBy" v-model:type="viewType"></property>
```

## qrcode
---

QR 码组件，用于生成二维码。

### 参数

#### text

`string`

二维码内容，默认为 MAIYUN 官网地址。

#### options

`object`

配置选项，支持 margin、scale、small、width、color.dark、color.light 等。

### 样式

使用 canvas 渲染二维码。二维码居中显示在容器内。

支持自定义颜色和尺寸。加载时显示加载动画。

### 示例

```xml
<qrcode text="https://example.com" :options="{ width: 200 }"></qrcode>
```

## radio
---

单选框组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### value

`string`

单选框的值。

#### modelValue

`string`

双向绑定，当前选中的值。

### 事件

#### change

`(event: IRadioChangeEvent) => void`

值改变时触发。

### 样式

使用 flex 布局，左侧为圆形单选框，右侧为文本内容区域。单选框支持选中和未选中两种视觉状态。

单选框为圆形边框，选中时内部显示实心圆点，颜色为主题色。支持通过 slot 插入自定义内容。

支持键盘操作，具有焦点、悬停和激活等交互状态，禁用时呈现灰色并禁止交互。

### 示例

```xml
<radio v-model="val" value="1">Option 1</radio>
<radio v-model="val" value="2">Option 2</radio>
```

## scroll
---

滚动条组件，用于自定义滚动条样式。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### float

`boolean` | `string`

是否浮动显示，默认 false。

#### direction

`'h'` | `'v'`

滚动方向，`h` 为水平，`v` 为垂直，默认 `v`。

#### length

`number` | `string` | `HTMLElement` | `AbstractControl`

内容总长度，默认 1000。若传入对象，则会自动根据 `direction` 监听其尺寸。

#### client

`number` | `string` | `HTMLElement` | `AbstractControl`

可视区域长度，默认 100。若传入对象，则会自动根据 `direction` 监听其尺寸。

#### offset

`number` | `string`

双向绑定，当前滚动位置，默认 0。

### 事件

#### show

`() => void`

滚动条显示时触发。

#### roll

`() => void`

用户主动滚动时触发。

### 样式

使用 flex 布局，包含上/下（或左/右）控制按钮和滚动滑块。滑块大小根据 client/length 比例自动计算。

滚动条默认显示后自动隐藏，悬停或拖动时保持显示。浮动模式下悬浮在内容上方不占用空间。

滑块可拖动定位，点击轨道可快速跳转。具有平滑的显示/隐藏过渡动画。

### 示例

```xml
<scroll :length="1000" :client="100" v-model:offset="scrollTop"></scroll>
```

## select
---

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

## setting
---

设置列表组件。

### 参数

### 样式

使用 block 布局，设置项垂直排列。具有圆角边框和背景色（非朴素模式）。

包含 setting-item 子组件。设置项之间有分隔线。

常用于设置页面的选项列表。

### 示例

```xml
<setting>
    <setting-item label="Option 1">
        <switch v-model="option1"></switch>
    </setting-item>
</setting>
```

## setting-item
---

设置列表项组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式，默认 `center`。

#### title

`string`

设置项标题。

#### note

`string`

设置项描述文本。

### 样式

作为 setting 的子组件，显示单个设置项。左侧显示标题和描述，右侧显示控件区域。

使用 flex 布局，标题和描述垂直排列，控件右对齐。项之间有分隔线。

### 示例

```xml
<setting-item title="Dark Mode" note="Enable dark theme">
    <switch v-model="darkMode"></switch>
</setting-item>
```

## sgroup
---

分组容器组件。

### 参数

#### direction

`'h'` | `'v'`

排列方向，默认 `h`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

类型样式，默认 `default`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

使用 flex 布局，按钮按指定方向排列。按钮互斥选中，类似单选框功能。

选中的按钮显示主题色背景。相邻按钮共享边框。

### 示例

```xml
<sgroup v-model="selected">
    <button value="1">Option 1</button>
    <button value="2">Option 2</button>
</sgroup>
```

## step
---

步骤条组件。

### 参数

#### data

`Array<{ icon?: string; label?: string; value?: string; desc?: string; }>`

步骤数据列表。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### modelValue

`string`

双向绑定，当前步骤值。

### 样式

使用 flex 布局，步骤项水平排列。每个步骤显示序号/图标、标题和可选的描述文字。

当前步骤和已完成步骤显示主题色，未完成步骤显示灰色。步骤之间用连接线连接。

朴素模式下无背景色和边框。步骤项支持自定义图标。

### 示例

```xml
<step :data="steps" v-model="currentStep"></step>
```

## svg
---

SVG 图标组件，用于显示自定义 SVG 图标。

### 参数

#### viewBox

`string`

SVG viewBox 属性，默认 `0 0 24 24`。

#### fill

`string`

SVG 填充颜色。

#### stroke

`string`

SVG 描边颜色。

#### layout

`string`

直接插入 SVG 内部标签，有的话优先显示本图形。

#### src

`string`

SVG 内容或 URL 地址。

### 样式

使用 flex 布局，图标居中显示。支持内联 SVG 代码或外部 SVG 文件。

图标颜色可通过 CSS 的 fill 或 color 属性控制。图标大小自适应容器。

### 示例

```xml
<svg src="<svg>...</svg>"></svg>
```

## switch
---

开关选择器。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### size

`'s'` | `'m'` | `'l'`

尺寸，默认 `m`。

#### map

`{ 'true'?: any; 'false'?: any; }`

自定义 true/false 的值。

#### modelValue

`any`

双向绑定，开关状态值，默认 false。

### 事件

#### change

`(event: ISwitchChangeEvent) => void`

值改变时触发。

### 样式

使用 flex 布局，开关为胶囊形状，内含圆形滑块。支持三种尺寸（s/m/l）。

关闭状态为灰色背景，开启状态为主题色背景。滑块在左右两端之间滑动切换，具有平滑的过渡动画。

具有焦点轮廓和悬停效果，禁用时呈现灰色并禁止交互。

### 示例

```xml
<switch v-model="val"></switch>
```

## tab
---

选项卡组件。

### 参数

#### tabPosition

`'top'` | `'right'` | `'bottom'` | `'left'`

选项卡位置，默认 `top`。

#### drag

`boolean` | `string`

是否可拖拽排序，默认 false。

#### close

`boolean` | `string`

是否显示关闭按钮，默认 false。

#### tabs

`Array<string | { label?: string; value?: string; drag?: boolean; close?: boolean; }>`

双向绑定，选项卡列表。

#### modelValue

`string`

双向绑定，当前选中的选项卡值。

### 事件

#### close

`(event: ITabCloseEvent) => void`

关闭选项卡时触发，可阻止。

#### change

`(event: ITabChangeEvent) => void`

切换选项卡前触发，可阻止。

#### changed

`(event: ITabChangedEvent) => void`

切换选项卡后触发。

### 样式

使用 flex 布局，包含选项卡头部和内容区域。选项卡头部支持四个方向（top/right/bottom/left）定位。

选中的选项卡高亮显示，具有底部/侧边指示条。支持拖拽排序和关闭按钮。内容超出时显示箭头按钮滚动。

选项卡切换时具有平滑的过渡动画。关闭按钮悬停时高亮显示。

### 示例

```xml
<tab v-model="activeTab" :tabs="['Tab1', 'Tab2', 'Tab3']">
    <div>Content</div>
</tab>
```

## table
---

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

## table-item
---

表格列配置组件。

### 参数

#### label

`string`

列标题。

#### width

`number` | `string`

列宽度。

#### minWidth

`number` | `string`

最小列宽。

#### sort

`boolean` | `string`

是否可排序，默认 false。

#### direction

`'h'` | `'v'`

内部布局方向，默认 `h`。

#### gutter

`number` | `string`

内部元素间距。

#### alignH

`string` | `undefined`

内部水平对齐方式。

#### alignV

`string` | `undefined`

内部垂直对齐方式。

### 插槽

#### default

自定义列内容，可访问 `scope.row` 获取行数据。

### 样式

作为 table 的子组件，定义表格列配置。列头显示标题文本，可显示排序图标。

支持固定在左侧或右侧。列宽可设置固定值或自适应。

### 示例

```xml
<table-item label="Name" :width="100">
    <template #default="{ row }">{{ row.name }}</template>
</table-item>
```

## tag
---

用于标记和选择的标签组件。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

标签类型，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### size

`'xs'` | `'s'` | `'m'` | `'mh'` | `'l'` | `'lh'` | `'xl'` | `'xlh'`

尺寸，默认 `s`。

#### rsize

`'m'` | `'l'` | `'xl'`

圆角尺寸，默认 `l`。

#### close

`boolean`

是否显示关闭按钮，默认 false。

#### drag

`boolean`

是否可拖拽，默认 false。

#### inline

`boolean` | `string`

是否行内显示，默认 false。

### 事件

#### close

`() => void`

点击关闭按钮时触发。

#### drop

`(event: ITagDropEvent) => void`

拖拽放置时触发，包含 `before` 和 `after` 索引。

### 样式

使用 inline-flex 布局，内容居中显示。标签具有圆角边框，支持多种类型（default/primary/info/warning/danger/cg）对应不同的配色方案。

支持多种尺寸和圆角大小。朴素模式下显示为浅色背景深色文字。可显示关闭按钮（悬停时高亮）。

支持拖拽功能，拖拽时显示阴影效果。行内模式下不占满整行。

### 示例

```xml
<tag type="primary">Tag 1</tag>
```

## task
---

任务栏组件，用于显示最小化的窗体。

### 参数

#### position

`string`

任务栏位置，默认 bottom。

### 样式

使用 flex 布局，任务项水平排列。通常用于显示最小化的窗体。

任务项显示窗体图标和标题，点击可恢复窗体。支持拖拽排序。

当前焦点窗体的任务项高亮显示。

### 示例

```xml
<task>
    <task-item v-for="form in forms" :key="form.id" :form="form"></task-item>
</task>
```

## task-item
---

任务栏项组件。

### 参数

#### selected

`boolean` | `string`

是否选中，默认 false。

#### opened

`boolean` | `string`

是否打开，默认 false。

#### multi

`boolean` | `string`

是否多选模式，默认 false。

### 样式

作为 task 的子组件，显示单个任务项。包含窗体图标和标题文本。

悬停时显示背景色变化。当前焦点窗体的任务项高亮显示。

点击可恢复对应的最小化窗体。

### 示例

```xml
<task-item :selected="true"></task-item>
```

## text
---

文本输入框组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### wrap

`boolean` | `string`

是否换行，默认 true。

#### maxlength

`number` | `string`

最大长度，0 为不限制，默认 0。

#### scroll

`boolean` | `string`

是否允许滚动，默认 true。

#### gesture

`string[]` | `string`

手势配置，默认 []。

#### type

`'text'` | `'multi'` | `'password'` | `'number'`

输入类型，默认 `text`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### require

`boolean` | `string`

是否必填，默认 false。

#### rule

`string` | `RegExp`

验证规则，默认空。

#### padding

`string`

内边距大小，可选 `0`, `xs`, `s`, `m`, `l`, `xl`，默认 `m`。

#### keyboard

`boolean` | `string`

是否启用虚拟键盘，默认 false。

#### modelValue

`string`

双向绑定，绑定值，默认空字符串。

#### placeholder

`string`

占位符，默认空字符串。

#### selectionStart

`number` | `string`

双向绑定，选区开始位置，默认 0。

#### selectionEnd

`number` | `string`

双向绑定，选区结束位置，默认 0。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置，默认 0。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置，默认 0。

#### max

`number` | `string` | `undefined`

最大值（仅 number 类型有效）。

#### min

`number` | `string` | `undefined`

最小值（仅 number 类型有效）。

### 事件

#### focus

`(e: FocusEvent) => void`

获得焦点时触发。

#### blur

`(e: FocusEvent) => void`

失去焦点时触发。

#### enter

`() => void`

按下回车键时触发。

#### gesture

`(dir: string) => void`

触发手势时触发。

#### input

`() => void`

输入时触发。

#### clientwidth

`(val: number) => void`

内部可用宽度改变时触发。

#### clientheight

`(val: number) => void`

内部可用高度改变时触发。

#### scrollwidth

`(val: number) => void`

内部滚动宽度改变时触发。

#### scrollheight

`(val: number) => void`

内部滚动高度改变时触发。

#### beforechange

`(e: ITextBeforeChangeEvent) => void`

值改变前触发，可阻止。

#### changed

`() => void`

值改变后触发。

#### minmaxchange

`(e: ITextMinMaxChangeEvent) => void`

数值超出范围时触发。

### 方法

#### focus

`(): void`

使输入框获得焦点。

### 插槽

#### default

右键菜单内容。

#### before

输入框外部前置内容。

#### prepend

输入框内部前置内容。

#### append

输入框内部后置内容。

#### after

输入框外部后置内容。

### 样式

使用 flex 布局，支持单行和多行模式。单行模式下包含前置/后置插槽、输入框、数字控制按钮、虚拟键盘图标和密码切换图标。多行模式支持纵向和横向滚动条。

具有圆边框，支持朴素模式（无边框）。必填项在未输入时显示红色标记。支持通过 `padding` 参数自定义内边距。

获得焦点时边框高亮。数字模式下控制按钮有悬停和点击效果。支持手势操作和右键菜单。

### 示例

```xml
<text v-model="val" placeholder="Please input"></text>
```

## timeline
---

时间线组件。

### 参数

### 样式

使用 block 布局，时间线项垂直排列。左侧显示时间点和连接线，右侧显示内容。

时间点为圆形图标，连接线为竖直虚线。最后一项不显示连接线。

朴素模式下时间点更小更简洁。

### 示例

```xml
<timeline>
    <timeline-item>Event 1</timeline-item>
    <timeline-item>Event 2</timeline-item>
</timeline>
```

## timeline-item
---

时间线项组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

#### selected

`boolean` | `string`

是否选中状态，默认 false。

### 样式

作为 timeline 的子组件，显示单个时间点。左侧显示圆形时间点，右侧显示内容。

选中状态时显示高亮样式。时间点下方显示连接线（最后一项除外）。

内容区域支持通过 slot 自定义。

### 示例

```xml
<timeline-item :selected="true">Event content</timeline-item>
```

## tip
---

文字提示组件，通常跟随在其他控件后使用。

### 参数

#### label

`string`

提示内容。

#### maxwidth

`number`

最大宽度，默认 400。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

提示类型，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### class

`string`

自定义样式类名。

### 样式

提示框使用绝对定位，悬浮在触发元素附近。提示内容具有圆角边框和背景色。

支持多种类型（default/primary/info/warning/danger/cg）对应不同的背景色。朴素模式下显示为浅色背景深色文字。

提示框具有淡入淡出的显示/隐藏动画，自动根据空间位置调整显示方向。

### 示例

```xml
<button>Hover me</button>
<tip label="This is a tip"></tip>
```

## title
---

标题组件，用于显示页面或区块标题。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

标题类型，默认 `default`。

#### arrow

`boolean` | `string` | `undefined`

双向绑定，是否显示箭头展开/收起状态。

### 样式

使用 flex 布局，左侧显示竖条装饰，右侧显示标题内容。

支持多种类型（default/primary/info/warning/danger）对应不同的竖条颜色。支持显示展开/收起箭头。

### 示例

```xml
<title type="primary">Main Title</title>
```

## tplink
---

TP-Link 监控插件组件。

### 参数

#### init

`{ sid: string; skey: string }`

初始化配置，包含 sid 和 skey。

#### controls

`boolean` | `string`

是否显示控制界面，默认 true。

#### layout

`Array<{ cellNum: number; rows: number; columns: number; cellList: Array<[number, number]> }>`

布局配置。

#### list

`Array<{ device: string; channel: number; index: number; mode: number; volume?: boolean }>`

播放列表。

#### range

`[number, number]` | `null`

回放时间范围，null 为实时播放。

#### volume

`number`

音量，最大 10。

### 事件

#### init

`() => void`

初始化完成时触发。

### 样式

显示监控控制界面，支持多画面分屏显示。可切换不同的摄像头视角。

支持播放、暂停、截图等操作。具有全屏模式。

### 示例

```xml
<tplink :init="{ sid: 'xxx', skey: 'xxx' }" :list="cameraList"></tplink>
```

## tuieditor
---

TUI 编辑器组件（Markdown 编辑器）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### modelValue

`string`

双向绑定，Markdown 内容。

#### visual

`boolean` | `string`

是否可视化模式，默认 false。

#### theme

`'dark'` | `'light'`

主题，默认 `light`。

### 事件

#### imgselect

`(callback: (url: string, opt?: { alt?: string; width?: number; height?: number; align?: string }) => void) => void`

选择图片时触发，参数为回调函数。

#### imgupload

`(event: ITuieditorImguploadEvent) => void`

上传图片时触发，包含 `file` 和 `callback`。

#### init

`(instance: any) => void`

编辑器初始化完成时触发。

#### html

`(html: string) => void`

HTML 内容变化时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。顶部显示工具栏。

支持编辑区和预览区并排显示或切换显示。工具栏包含 Markdown 格式化按钮。

### 示例

```xml
<tuieditor v-model="markdown" @init="onInit"></tuieditor>
```

## tuiviewer
---

TUI Markdown 查看器组件。

### 参数

#### modelValue

`string`

Markdown 内容。

### 事件

#### init

`(instance: any) => void`

初始化完成时触发。

### 样式

使用 flex 布局，渲染解析后的 Markdown 内容。支持 GFM 语法。

代码块具有语法高亮。表格、任务列表等扩展语法支持良好。

### 示例

```xml
<tuiviewer :modelValue="markdown"></tuiviewer>
```

## tums
---

TUMS 监控组件。

### 参数

#### init

`{ type?: 'relay'; url: string; stream?: 'video' | 'sdvod'; volume?: number; sid: string; skey: string }`

初始化配置。

#### volume

`number`

音量，默认 80。

### 事件

#### init

`() => void`

初始化完成时触发。

#### playing

`() => void`

开始播放时触发。

#### disconnected

`() => void`

断开连接时触发。

### 样式

显示监控画面，支持多画面分屏显示。可切换不同的摄像头视角。

支持播放、暂停、截图等操作。具有全屏模式。

### 示例

```xml
<tums :init="{ url: 'xxx', sid: 'xxx', skey: 'xxx' }" @playing="onPlaying"></tums>
```

## uploader
---

图片上传组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### length

`number` | `string`

显示的图片数量限制，默认 6。

#### drag

`boolean` | `string`

是否可拖拽排序，默认 false。

#### pre

`string`

图片 URL 前缀。

#### multi

`boolean` | `string`

是否多选上传，默认 false。

#### progress

`number` | `undefined`

上传进度（0-100）。

#### modelValue

`Array<string | { title?: string; src: string; }>`

双向绑定，已上传的图片列表。

### 事件

#### select

`() => void`

点击上传按钮时触发。

#### remove

`(event: IUploaderRemoveEvent) => void`

删除图片时触发，可阻止。

#### changed

`() => void`

列表变化后触发。

### 样式

使用 flex 布局，图片以网格形式排列。每个图片显示缩略图，悬停显示删除按钮。

上传按钮显示加号图标，上传中显示进度条。支持拖拽排序图片顺序。

图片具有圆角边框，删除按钮悬停时高亮显示。

### 示例

```xml
<uploader v-model="images" @select="onSelect"></uploader>
```

## vflow
---

虚拟列表流组件，支持高性能渲染大量数据。

### 参数

#### direction

`'h'` | `'v'`

滚动方向，默认 `h`。

#### selection

`boolean` | `string`

是否开启框选，默认 false。

#### gesture

`string[]` | `string`

手势配置。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置。

#### data

`any[]` | `number`

列表数据或数量。

#### sizes

`Record<string, number | undefined>`

尺寸配置。

### 事件

#### gesture

`(dir: string) => void`

手势操作时触发。

#### beforeselect

`() => void`

选择前触发。

#### select

`(event: IFlowSelectEvent) => void`

选择时触发，包含 `area` 信息。

#### afterselect

`() => void`

选择后触发。

#### clientwidth

`(val: number) => void`

可视宽度变化时触发。

#### clientheight

`(val: number) => void`

可视高度变化时触发。

#### scrollwidth

`(val: number) => void`

滚动宽度变化时触发。

#### scrollheight

`(val: number) => void`

滚动高度变化时触发。

### 样式

使用虚拟滚动技术，仅渲染可视区域内的元素。支持水平和垂直两种滚动方向。

支持框选功能，可配置手势操作。适用于大数据量的列表渲染。

### 示例

```xml
<vflow :data="items" direction="v"></vflow>
```

## video
---

视频播放器组件。

### 参数

#### src

`string`

视频地址。

#### controls

`boolean` | `string`

是否显示控制栏，默认 false。

#### loop

`boolean` | `string`

是否循环播放，默认 false。

#### muted

`boolean` | `string`

是否静音，默认 false。

#### volume

`number` | `string`

音量，默认 50。

#### play

`boolean` | `string`

双向绑定，是否正在播放，默认 false。

#### current

`number` | `string`

双向绑定，当前播放位置（秒），默认 0。

### 事件

#### durationchange

`(duration: number) => void`

时长变化时触发。

#### canplay

`() => void`

可以播放时触发。

#### canplaythrough

`() => void`

可以完整播放时触发。

#### ended

`() => void`

播放结束时触发。

#### error

`() => void`

加载错误时触发。

#### loadeddata

`() => void`

数据加载完成时触发。

#### loadedmetadata

`() => void`

元数据加载完成时触发。

#### playing

`() => void`

开始播放时触发。

#### progress

`() => void`

加载进度变化时触发。

#### seeked

`() => void`

跳转完成时触发。

#### seeking

`() => void`

正在跳转时触发。

#### waiting

`() => void`

等待缓冲时触发。

#### emptied

`() => void`

媒体内容变为空时触发。

#### loadstart

`() => void`

开始加载数据时触发。

#### ratechange

`() => void`

播放速率变化时触发。

#### readystatechange

`() => void`

就绪状态变化时触发。

#### seeked

`() => void`

跳转完成时触发。

#### seeking

`() => void`

正在跳转时触发。

#### stalled

`() => void`

数据加载停滞时触发。

#### suspend

`() => void`

数据加载挂起时触发。

### 样式

使用 flex 布局，视频填满容器空间。底部显示播放控制栏。

控制栏包含播放/暂停、进度条、音量、全屏按钮。支持快捷键操作。

### 示例

```xml
<video :src="videoUrl" v-model:play="isPlaying" v-model:current="currentTime"></video>
```

## web
---

网页嵌入组件（iframe）。

### 参数

#### src

`string`

网页地址。

### 样式

使用 iframe 元素，填满容器空间。无边框显示。

### 示例

```xml
<web :src="pageUrl"></web>
```

## xterm
---

终端组件（基于 xterm.js）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### theme

`string`

终端主题，默认 `black`。

### 事件

#### data

`(char: string) => void`

用户输入时触发。

#### resize

`(event: { cols: number; rows: number; width: number; height: number }) => void`

终端尺寸变化时触发。

#### init

`(term: any) => void`

终端初始化完成时触发，返回 xterm 实例。

### 样式

使用 flex 布局，终端填满容器空间。黑色背景白色文字的经典终端样式。

支持 ANSI 转义序列。可自定义颜色主题。支持选择复制。

### 示例

```xml
<xterm @data="onData" @init="onInit" ref="terminal"></xterm>
```
clickgo/classes/AbstractBoot.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / AbstractBoot

# Abstract Class: AbstractBoot

Defined in: [dist/clickgo.ts:161](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L161)

全局类

## Constructors

### Constructor

> **new AbstractBoot**(`opt`): `AbstractBoot`

Defined in: [dist/clickgo.ts:181](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L181)

#### Parameters

##### opt

###### debug?

`boolean`

#### Returns

`AbstractBoot`

## Properties

### \_sysId

> `protected` **\_sysId**: `string` = `''`

Defined in: [dist/clickgo.ts:167](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L167)

切勿传给 App

## Methods

### isDebug()

> **isDebug**(): `boolean`

Defined in: [dist/clickgo.ts:177](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L177)

判断当前是否是 debug 模式

#### Returns

`boolean`

***

### main()

> `abstract` **main**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L190)

入口方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:205](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L205)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../../lib/core/interfaces/IConfig.md)

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### n

`TK`

##### v

`T`\[`TK`\]

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`taskId`, `formId`, `error`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:193](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L193)

全局错误事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### error

`Error`

##### info

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:261](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L261)

窗体丢失焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormCreated()

> **onFormCreated**(`taskId`, `formId`, `title`, `icon`, `showInSystemTask`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:211](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L211)

窗体创建事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

##### showInSystemTask

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFlash()

> **onFormFlash**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:267](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L267)

窗体闪烁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFocused()

> **onFormFocused**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:255](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L255)

窗体获得焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormHashChange()

> **onFormHashChange**(`taskId`, `formId`, `value`, `data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L279)

窗体的 formHash 改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`string`

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormIconChanged()

> **onFormIconChanged**(`taskId`, `formId`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:231](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L231)

窗体图标改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormRemoved()

> **onFormRemoved**(`taskId`, `formId`, `title`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:219](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L219)

窗体销毁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowChanged()

> **onFormShowChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L249)

窗体显示状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowInSystemTaskChange()

> **onFormShowInSystemTaskChange**(`taskId`, `formId`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L273)

窗体是否显示在任务栏属性改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMaxChanged()

> **onFormStateMaxChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:243](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L243)

窗体最大化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMinChanged()

> **onFormStateMinChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:237](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L237)

窗体最小化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormTitleChanged()

> **onFormTitleChanged**(`taskId`, `formId`, `title`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:225](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L225)

窗体标题改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onHashChanged()

> **onHashChanged**(`hash`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:305](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L305)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:311](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L311)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:317](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L317)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L299)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoad()

> **onRuntimeFileLoad**(`url`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:323](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L323)

环境文件准备加载时的事件

#### Parameters

##### url

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoaded()

> **onRuntimeFileLoaded**(`url`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L329)

环境文件加载完成的事件

#### Parameters

##### url

`string`

##### state

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:199](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L199)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:293](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L293)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:287](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L287)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### setSysId()

> **setSysId**(`sysId`): `void`

Defined in: [dist/clickgo.ts:169](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L169)

#### Parameters

##### sysId

`string`

#### Returns

`void`

clickgo/functions/getCdn.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / getCdn

# Function: getCdn()

> **getCdn**(): `string`

Defined in: [dist/clickgo.ts:99](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L99)

获取当前 cdn 前缀

## Returns

`string`

clickgo/functions/getDevice.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / getDevice

# Function: getDevice()

> **getDevice**(): `object`

Defined in: [dist/clickgo.ts:125](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L125)

获取当前设备信息（支持 native 和 web）

## Returns

`object`

### os

> **os**: `"unknown"` \| `"android"` \| `"linux"` \| `"ios"` \| `"windows"` \| `"macos"`

### type

> **type**: `"unknown"` \| `"mobile"` \| `"desktop"`

clickgo/functions/getDirname.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / getDirname

# Function: getDirname()

> **getDirname**(): `string`

Defined in: [dist/clickgo.ts:77](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L77)

获取当前 ClickGo 所在的目录，不以 / 结尾

## Returns

`string`

clickgo/functions/getPlatform.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / getPlatform

# Function: getPlatform()

> **getPlatform**(): `Platform` \| `"web"`

Defined in: [dist/clickgo.ts:112](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L112)

获取当前平台（web 则只返回 web）

## Returns

`Platform` \| `"web"`

clickgo/functions/getVersion.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / getVersion

# Function: getVersion()

> **getVersion**(): `string`

Defined in: [dist/clickgo.ts:65](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L65)

获取当前版本

## Returns

`string`

clickgo/functions/hasFrame.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / hasFrame

# Function: hasFrame()

> **hasFrame**(): `boolean`

Defined in: [dist/clickgo.ts:156](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L156)

是否含有窗体外边框

## Returns

`boolean`

clickgo/functions/isNative.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / isNative

# Function: isNative()

> **isNative**(): `boolean`

Defined in: [dist/clickgo.ts:71](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L71)

是否是 native 环境

## Returns

`boolean`

clickgo/functions/launcher.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / launcher

# Function: launcher()

> **launcher**(`boot`): `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:340](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L340)

启动 ClickGo

## Parameters

### boot

[`AbstractBoot`](../classes/AbstractBoot.md)

启动类

## Returns

`Promise`\<`void`\>

clickgo/index.md
---

[**Documents for clickgo**](../index.md)

***

[Documents for clickgo](../index.md) / clickgo

# clickgo

## Classes

- [AbstractBoot](classes/AbstractBoot.md)

## Variables

- [global](variables/global.md)
- [modules](variables/modules.md)

## Functions

- [getCdn](functions/getCdn.md)
- [getDevice](functions/getDevice.md)
- [getDirname](functions/getDirname.md)
- [getPlatform](functions/getPlatform.md)
- [getVersion](functions/getVersion.md)
- [hasFrame](functions/hasFrame.md)
- [isNative](functions/isNative.md)
- [launcher](functions/launcher.md)

## References

### control

Renames and re-exports [lib/control](../lib/control/index.md)

***

### core

Renames and re-exports [lib/core](../lib/core/index.md)

***

### dom

Renames and re-exports [lib/dom](../lib/dom/index.md)

***

### form

Renames and re-exports [lib/form](../lib/form/index.md)

***

### fs

Renames and re-exports [lib/fs](../lib/fs/index.md)

***

### native

Renames and re-exports [lib/native](../lib/native/index.md)

***

### storage

Renames and re-exports [lib/storage](../lib/storage/index.md)

***

### task

Renames and re-exports [lib/task](../lib/task/index.md)

***

### theme

Renames and re-exports [lib/theme](../lib/theme/index.md)

***

### tool

Renames and re-exports [lib/tool](../lib/tool/index.md)

***

### zip

Renames and re-exports [lib/zip](../lib/zip/index.md)

clickgo/variables/global.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / global

# Variable: global

> `const` **global**: `any`

Defined in: [dist/clickgo.ts:94](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L94)

用户定义的全局对象

clickgo/variables/modules.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / modules

# Variable: modules

> `const` **modules**: `object`

Defined in: [dist/clickgo.ts:43](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L43)

原生模块

## Type Declaration

## Index Signature

\[`key`: `string`\]: `any`

其他任何模块

### clickgo

> **clickgo**: *typeof* [`clickgo`](../index.md)

### jszip

> **jszip**: `__module`

原生 jszip

### pointer

> **pointer**: `__module`

原生 pointer

### tums-player

> **tums-player**: [`ITumsPlayer`](../../lib/core/interfaces/ITumsPlayer.md)

原生 tums-player 对象（在 default 里）

### vue

> **vue**: `__module`

原生 vue

index.md
---

**Documents for clickgo**

***

# Documents for clickgo

## Modules

- [clickgo](clickgo/index.md)
- [lib/control](lib/control/index.md)
- [lib/core](lib/core/index.md)
- [lib/dom](lib/dom/index.md)
- [lib/form](lib/form/index.md)
- [lib/fs](lib/fs/index.md)
- [lib/native](lib/native/index.md)
- [lib/storage](lib/storage/index.md)
- [lib/task](lib/task/index.md)
- [lib/theme](lib/theme/index.md)
- [lib/tool](lib/tool/index.md)
- [lib/zip](lib/zip/index.md)

lib/control/classes/AbstractControl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / AbstractControl

# Abstract Class: AbstractControl

Defined in: [dist/lib/control.ts:40](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L40)

窗体的抽象类

## Constructors

### Constructor

> **new AbstractControl**(): `AbstractControl`

#### Returns

`AbstractControl`

## Properties

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| (`payload`) => `boolean`\> = `{}`

Defined in: [dist/lib/control.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L273)

组件参数，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [dist/lib/control.ts:267](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L267)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [dist/lib/control.ts:270](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L270)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [dist/lib/control.ts:276](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L276)

组件的子插槽

## Accessors

### alignHComp

#### Get Signature

> **get** **alignHComp**(): `string` \| `undefined`

Defined in: [dist/lib/control.ts:178](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L178)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### alignVComp

#### Get Signature

> **get** **alignVComp**(): `string` \| `undefined`

Defined in: [dist/lib/control.ts:195](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L195)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [dist/lib/control.ts:167](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L167)

layout 中 :class 的转义

##### Returns

> (`cla`): `string`

###### Parameters

###### cla

`any`

###### Returns

`string`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [dist/lib/control.ts:57](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L57)

当前的控件名称

##### Returns

`string`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: [dist/lib/control.ts:87](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L87)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/control.ts:43](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L43)

当前文件在包内的路径

##### Returns

`string`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [dist/lib/control.ts:51](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L51)

当前的窗体创建的位数

##### Returns

`number`

***

### fl

#### Get Signature

> **get** **fl**(): (`key`, `data?`) => `string`

Defined in: [dist/lib/control.ts:157](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L157)

获取窗体语言内容

##### Returns

> (`key`, `data?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### Returns

`string`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [dist/lib/control.ts:124](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L124)

当前窗体是否有焦点

##### Returns

`boolean`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [dist/lib/control.ts:69](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L69)

当前组件所在的窗体 ID

##### Returns

`string`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`) => `string`

Defined in: [dist/lib/control.ts:137](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L137)

获取语言内容

##### Returns

> (`key`, `data?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### Returns

`string`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [dist/lib/control.ts:129](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L129)

获取当前语言名

##### Returns

`string`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:238](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L238)

等待渲染

##### Returns

> (): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

***

### parent

#### Get Signature

> **get** **parent**(): `AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [dist/lib/control.ts:341](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L341)

获取上层控件

##### Returns

`AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [dist/lib/control.ts:366](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L366)

根据 control access 查询上层控件

##### Returns

> (`name`, `val`): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

###### Parameters

###### name

`string`

###### val

`string`

###### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [dist/lib/control.ts:348](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L348)

根据 control name 查询上层控件

##### Returns

> (`controlName`): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

###### Parameters

###### controlName

`string`

###### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [dist/lib/control.ts:75](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L75)

当前控件所在运行窗体的包内路径不以 / 结尾

##### Returns

`string`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [dist/lib/control.ts:81](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L81)

样式独占前缀

##### Returns

`string`

***

### propArray

#### Get Signature

> **get** **propArray**(): (`name`) => `any`[]

Defined in: [dist/lib/control.ts:323](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L323)

获取 props 中的 array 类型的值

##### Returns

> (`name`): `any`[]

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [dist/lib/control.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L302)

获取 props 中的 boolean 类型的值

##### Returns

> (`name`): `boolean`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [dist/lib/control.ts:316](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L316)

获取 props 中的 int 类型的值

##### Returns

> (`name`): `number`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [dist/lib/control.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L309)

获取 props 中的 number 类型的值

##### Returns

> (`name`): `number`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`number`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

Defined in: [dist/lib/control.ts:231](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L231)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

***

### rootControl

#### Get Signature

> **get** **rootControl**(): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [dist/lib/control.ts:117](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L117)

当前组件如果在开发控件层面被包裹了，则可以获取到包裹他的组件对象

##### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [dist/lib/control.ts:98](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L98)

当前控件所在窗体的窗体对象

##### Returns

[`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### slotsAll

#### Get Signature

> **get** **slotsAll**(): (`name`) => `any`[]

Defined in: [dist/lib/control.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L279)

获取某插槽所有子类

##### Returns

> (`name`): `any`[]

###### Parameters

###### name

`string`

###### Returns

`any`[]

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [dist/lib/control.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L63)

当前组件所在的任务 ID

##### Returns

`string`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [dist/lib/control.ts:246](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L246)

判断当前事件可否执行

#### Parameters

##### e

鼠标、触摸、键盘事件

`PointerEvent` | `KeyboardEvent`

#### Returns

`boolean`

***

### emit()

> **emit**(`name`, ...`v`): `void`

Defined in: [dist/lib/control.ts:334](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L334)

向上反应事件

#### Parameters

##### name

`string`

事件名

##### v

...`any`

事件值

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:387](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L387)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:395](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L395)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:412](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L412)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:404](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L404)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:391](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L391)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:400](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L400)

控件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:416](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L416)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L408)

#### Returns

`void` \| `Promise`\<`void`\>

***

### trigger()

> **trigger**(`name`, `param1`, `param2`): `Promise`\<`void`\>

Defined in: [dist/lib/control.ts:257](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L257)

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1

参数1

`string` | `boolean` | `Error`

##### param2

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt`): () => `void`

Defined in: [dist/lib/control.ts:217](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L217)

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractControl`

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

##### TR

`TR`

#### Parameters

##### name

监视的属性或 prop 值

`TK` | () => `TR`

##### cb

(`val`, `old`) => `void` \| `Promise`\<`void`\>

回调

##### opt

参数

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

> (): `void`

##### Returns

`void`

lib/control/functions/buildComponents.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / buildComponents

# Function: buildComponents()

> **buildComponents**(`taskId`, `formId`, `path`): `false` \| `Record`\<`string`, `any`\>

Defined in: [dist/lib/control.ts:725](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L725)

初始化获取新窗体的控件 component（init 后执行）

## Parameters

### taskId

`string`

任务 id

### formId

`string`

窗体 id

### path

`string`

窗体路径基准（包内路径）不以 / 结尾

## Returns

`false` \| `Record`\<`string`, `any`\>

lib/control/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / init

# Function: init()

> **init**(`taskId`, `opt`): `Promise`\<`number`\>

Defined in: [dist/lib/control.ts:488](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L488)

任务创建过程中，需要对 control 进行先行初始化，并将样式表插入到实际的任务 DOM 中

## Parameters

### taskId

`string`

要处理的任务 ID

### opt

#### progress?

(`loaded`, `total`, `path`) => `void` \| `Promise`\<`void`\>

控件加载进度

## Returns

`Promise`\<`number`\>

lib/control/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/control.ts:32](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L32)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/control/functions/read.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / read

# Function: read()

> **read**(`blob`): `Promise`\<`false` \| [`TControlPackage`](../type-aliases/TControlPackage.md)\>

Defined in: [dist/lib/control.ts:426](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L426)

将 cgc 文件 blob 转换为 control 对象

## Parameters

### blob

`Blob`

文件 blob

## Returns

`Promise`\<`false` \| [`TControlPackage`](../type-aliases/TControlPackage.md)\>

lib/control/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/control

# lib/control

## Classes

- [AbstractControl](classes/AbstractControl.md)

## Interfaces

- [ICalendarSelectedEvent](interfaces/ICalendarSelectedEvent.md)
- [ICaptchaResultEvent](interfaces/ICaptchaResultEvent.md)
- [ICheckChangedEvent](interfaces/ICheckChangedEvent.md)
- [ICheckChangeEvent](interfaces/ICheckChangeEvent.md)
- [IChecklistAddEvent](interfaces/IChecklistAddEvent.md)
- [IChecklistItemclickedEvent](interfaces/IChecklistItemclickedEvent.md)
- [IChecklistRemoveEvent](interfaces/IChecklistRemoveEvent.md)
- [IColoristChangedEvent](interfaces/IColoristChangedEvent.md)
- [IControl](interfaces/IControl.md)
- [IControlConfig](interfaces/IControlConfig.md)
- [ICustomEvent](interfaces/ICustomEvent.md)
- [IDateChangedEvent](interfaces/IDateChangedEvent.md)
- [IDatepanelChangedEvent](interfaces/IDatepanelChangedEvent.md)
- [IDatepanelRangeEvent](interfaces/IDatepanelRangeEvent.md)
- [IDatepanelSelectedEvent](interfaces/IDatepanelSelectedEvent.md)
- [IFormCloseEvent](interfaces/IFormCloseEvent.md)
- [IFormMaxEvent](interfaces/IFormMaxEvent.md)
- [IFormMinEvent](interfaces/IFormMinEvent.md)
- [IGreatlistAddEvent](interfaces/IGreatlistAddEvent.md)
- [IGreatlistChangedEvent](interfaces/IGreatlistChangedEvent.md)
- [IGreatlistChangeEvent](interfaces/IGreatlistChangeEvent.md)
- [IGreatlistItemclickedEvent](interfaces/IGreatlistItemclickedEvent.md)
- [IGreatlistItemdblclickedEvent](interfaces/IGreatlistItemdblclickedEvent.md)
- [IGreatlistRemoveEvent](interfaces/IGreatlistRemoveEvent.md)
- [IGreatselectAddEvent](interfaces/IGreatselectAddEvent.md)
- [IGreatselectChangedEvent](interfaces/IGreatselectChangedEvent.md)
- [IGreatselectChangeEvent](interfaces/IGreatselectChangeEvent.md)
- [IGreatselectRemoveEvent](interfaces/IGreatselectRemoveEvent.md)
- [IIconviewDropEvent](interfaces/IIconviewDropEvent.md)
- [IIconviewItemclickedEvent](interfaces/IIconviewItemclickedEvent.md)
- [IIconviewOpenEvent](interfaces/IIconviewOpenEvent.md)
- [IIconviewSelectEvent](interfaces/IIconviewSelectEvent.md)
- [ILevelselectLevelEvent](interfaces/ILevelselectLevelEvent.md)
- [IListAddEvent](interfaces/IListAddEvent.md)
- [IListChangedEvent](interfaces/IListChangedEvent.md)
- [IListChangeEvent](interfaces/IListChangeEvent.md)
- [IListItemclickedEvent](interfaces/IListItemclickedEvent.md)
- [IListItemdblclickedEvent](interfaces/IListItemdblclickedEvent.md)
- [IListRemoveEvent](interfaces/IListRemoveEvent.md)
- [IMenulistItemCheckEvent](interfaces/IMenulistItemCheckEvent.md)
- [INavItemSelectEvent](interfaces/INavItemSelectEvent.md)
- [INumberBeforeChangeEvent](interfaces/INumberBeforeChangeEvent.md)
- [INumberMinMaxChangeEvent](interfaces/INumberMinMaxChangeEvent.md)
- [IObjviewerLine](interfaces/IObjviewerLine.md)
- [IObjviewerLineObj](interfaces/IObjviewerLineObj.md)
- [IPaletteChangedEvent](interfaces/IPaletteChangedEvent.md)
- [IPanelGoEvent](interfaces/IPanelGoEvent.md)
- [IPanelWentEvent](interfaces/IPanelWentEvent.md)
- [IPdfViewEvent](interfaces/IPdfViewEvent.md)
- [IRadioChangeEvent](interfaces/IRadioChangeEvent.md)
- [ISelectAddedEvent](interfaces/ISelectAddedEvent.md)
- [ISelectAddEvent](interfaces/ISelectAddEvent.md)
- [ISelectChangedEvent](interfaces/ISelectChangedEvent.md)
- [ISelectChangeEvent](interfaces/ISelectChangeEvent.md)
- [ISelectItemclickedEvent](interfaces/ISelectItemclickedEvent.md)
- [ISelectRemoteEvent](interfaces/ISelectRemoteEvent.md)
- [ISelectRemovedEvent](interfaces/ISelectRemovedEvent.md)
- [ISelectRemoveEvent](interfaces/ISelectRemoveEvent.md)
- [ISelectTagclickEvent](interfaces/ISelectTagclickEvent.md)
- [ISwitchChangeEvent](interfaces/ISwitchChangeEvent.md)
- [ITabChangedEvent](interfaces/ITabChangedEvent.md)
- [ITabChangeEvent](interfaces/ITabChangeEvent.md)
- [ITabCloseEvent](interfaces/ITabCloseEvent.md)
- [ITableSortEvent](interfaces/ITableSortEvent.md)
- [ITagDropEvent](interfaces/ITagDropEvent.md)
- [ITextBeforeChangeEvent](interfaces/ITextBeforeChangeEvent.md)
- [ITextMinMaxChangeEvent](interfaces/ITextMinMaxChangeEvent.md)
- [ITuieditorImguploadEvent](interfaces/ITuieditorImguploadEvent.md)
- [IUploaderRemoveEvent](interfaces/IUploaderRemoveEvent.md)

## Type Aliases

- [TControlPackage](type-aliases/TControlPackage.md)

## Functions

- [buildComponents](functions/buildComponents.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [read](functions/read.md)

lib/control/interfaces/ICalendarSelectedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ICalendarSelectedEvent

# Interface: ICalendarSelectedEvent

Defined in: [dist/lib/control.ts:949](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L949)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:950](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L950)

#### date

> **date**: `string`

#### month

> **month**: `string`

#### type

> **type**: `"click"` \| `"default"`

#### value

> **value**: `string`

#### year

> **year**: `string`

lib/control/interfaces/ICaptchaResultEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ICaptchaResultEvent

# Interface: ICaptchaResultEvent

Defined in: [dist/lib/control.ts:1098](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1098)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1099](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1099)

#### result

> **result**: `number`

#### token

> **token**: `string`

lib/control/interfaces/ICheckChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ICheckChangedEvent

# Interface: ICheckChangedEvent

Defined in: [dist/lib/control.ts:888](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L888)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:889](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L889)

#### indeterminate

> **indeterminate**: `boolean`

#### value

> **value**: `boolean`

lib/control/interfaces/ICheckChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ICheckChangeEvent

# Interface: ICheckChangeEvent

Defined in: [dist/lib/control.ts:881](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L881)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:882](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L882)

#### indeterminate

> **indeterminate**: `boolean`

#### value

> **value**: `boolean`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IChecklistAddEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IChecklistAddEvent

# Interface: IChecklistAddEvent

Defined in: [dist/lib/control.ts:1201](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1201)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1202](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1202)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IChecklistItemclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IChecklistItemclickedEvent

# Interface: IChecklistItemclickedEvent

Defined in: [dist/lib/control.ts:1208](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1208)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1209](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1209)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `string`

lib/control/interfaces/IChecklistRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IChecklistRemoveEvent

# Interface: IChecklistRemoveEvent

Defined in: [dist/lib/control.ts:1194](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1194)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1195](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1195)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IColoristChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IColoristChangedEvent

# Interface: IColoristChangedEvent

Defined in: [dist/lib/control.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1321)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1322](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1322)

#### hsl?

> `optional` **hsl**: `object`

对象

##### hsl.a

> **a**: `number`

##### hsl.h

> **h**: `number`

##### hsl.l

> **l**: `number`

##### hsl.s

> **s**: `number`

#### rgb?

> `optional` **rgb**: `object`

##### rgb.a

> **a**: `number`

##### rgb.b

> **b**: `number`

##### rgb.g

> **g**: `number`

##### rgb.r

> **r**: `number`

#### value

> **value**: `string`

颜色值

lib/control/interfaces/IControl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IControl

# Interface: IControl

Defined in: [dist/lib/control.ts:858](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L858)

控件对象

## Properties

### config

> **config**: [`IControlConfig`](IControlConfig.md)

Defined in: [dist/lib/control.ts:861](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L861)

控件对象配置文件

***

### files

> **files**: `Record`\<`string`, `Blob` \| `string`\>

Defined in: [dist/lib/control.ts:863](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L863)

所有已加载的文件内容

***

### type

> **type**: `"control"`

Defined in: [dist/lib/control.ts:859](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L859)

lib/control/interfaces/IControlConfig.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IControlConfig

# Interface: IControlConfig

Defined in: [dist/lib/control.ts:840](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L840)

控件文件包的 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/control.ts:844](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L844)

***

### code

> **code**: `string`

Defined in: [dist/lib/control.ts:847](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L847)

不带扩展名，系统会在末尾添加 .js

***

### layout

> **layout**: `string`

Defined in: [dist/lib/control.ts:849](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L849)

不带扩展名，系统会在末尾添加 .html

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [dist/lib/control.ts:854](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L854)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [dist/lib/control.ts:841](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L841)

***

### style

> **style**: `string`

Defined in: [dist/lib/control.ts:851](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L851)

不带扩展名，系统会在末尾添加 .css

***

### ver

> **ver**: `number`

Defined in: [dist/lib/control.ts:842](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L842)

***

### version

> **version**: `string`

Defined in: [dist/lib/control.ts:843](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L843)

lib/control/interfaces/ICustomEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ICustomEvent

# Interface: ICustomEvent

Defined in: [dist/lib/control.ts:874](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L874)

Custom Event

## Extended by

- [`ICheckChangeEvent`](ICheckChangeEvent.md)
- [`INumberBeforeChangeEvent`](INumberBeforeChangeEvent.md)
- [`INumberMinMaxChangeEvent`](INumberMinMaxChangeEvent.md)
- [`ITextBeforeChangeEvent`](ITextBeforeChangeEvent.md)
- [`ITextMinMaxChangeEvent`](ITextMinMaxChangeEvent.md)
- [`IMenulistItemCheckEvent`](IMenulistItemCheckEvent.md)
- [`IDatepanelRangeEvent`](IDatepanelRangeEvent.md)
- [`IFormCloseEvent`](IFormCloseEvent.md)
- [`IGreatlistChangeEvent`](IGreatlistChangeEvent.md)
- [`IGreatlistRemoveEvent`](IGreatlistRemoveEvent.md)
- [`IGreatlistAddEvent`](IGreatlistAddEvent.md)
- [`IGreatselectChangeEvent`](IGreatselectChangeEvent.md)
- [`IGreatselectRemoveEvent`](IGreatselectRemoveEvent.md)
- [`IGreatselectAddEvent`](IGreatselectAddEvent.md)
- [`IUploaderRemoveEvent`](IUploaderRemoveEvent.md)
- [`IChecklistRemoveEvent`](IChecklistRemoveEvent.md)
- [`IChecklistAddEvent`](IChecklistAddEvent.md)
- [`IListChangeEvent`](IListChangeEvent.md)
- [`IListRemoveEvent`](IListRemoveEvent.md)
- [`IListAddEvent`](IListAddEvent.md)
- [`INavItemSelectEvent`](INavItemSelectEvent.md)
- [`IPanelGoEvent`](IPanelGoEvent.md)
- [`IRadioChangeEvent`](IRadioChangeEvent.md)
- [`ISelectAddEvent`](ISelectAddEvent.md)
- [`ISelectRemoveEvent`](ISelectRemoveEvent.md)
- [`ISelectChangeEvent`](ISelectChangeEvent.md)
- [`ISwitchChangeEvent`](ISwitchChangeEvent.md)
- [`ITabChangeEvent`](ITabChangeEvent.md)
- [`ITabCloseEvent`](ITabCloseEvent.md)
- [`ITableSortEvent`](ITableSortEvent.md)
- [`IFormDialogSelectEvent`](../../form/interfaces/IFormDialogSelectEvent.md)
- [`IFormPromptSelectEvent`](../../form/interfaces/IFormPromptSelectEvent.md)

## Properties

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

lib/control/interfaces/IDateChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDateChangedEvent

# Interface: IDateChangedEvent

Defined in: [dist/lib/control.ts:940](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L940)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:941](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L941)

#### before?

> `optional` **before**: `number`

#### value?

> `optional` **value**: `number`

lib/control/interfaces/IDatepanelChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDatepanelChangedEvent

# Interface: IDatepanelChangedEvent

Defined in: [dist/lib/control.ts:968](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L968)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:969](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L969)

#### before?

> `optional` **before**: `number`

#### value?

> `optional` **value**: `number`

lib/control/interfaces/IDatepanelRangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDatepanelRangeEvent

# Interface: IDatepanelRangeEvent

Defined in: [dist/lib/control.ts:961](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L961)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:962](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L962)

#### end

> **end**: `number`

#### start

> **start**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IDatepanelSelectedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDatepanelSelectedEvent

# Interface: IDatepanelSelectedEvent

Defined in: [dist/lib/control.ts:975](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L975)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:976](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L976)

#### date

> **date**: `number`

#### day

> **day**: `number`

#### month

> **month**: `number`

#### str

> **str**: `string`

#### time

> **time**: `number`

#### year

> **year**: `number`

lib/control/interfaces/IFormCloseEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IFormCloseEvent

# Interface: IFormCloseEvent

Defined in: [dist/lib/control.ts:988](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L988)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:989](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L989)

#### event

> **event**: `MouseEvent`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IFormMaxEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IFormMaxEvent

# Interface: IFormMaxEvent

Defined in: [dist/lib/control.ts:994](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L994)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:995](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L995)

#### action

> **action**: `"click"` \| `"move"`

#### event

> **event**: `MouseEvent` \| `TouchEvent` \| `null`

#### history

> **history**: \{ `height`: `number`; `left`: `number`; `top`: `number`; `width`: `number`; \} \| `null`

最大化之前的窗体位置

#### max

> **max**: `boolean`

当前是否时最大化状态

lib/control/interfaces/IFormMinEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IFormMinEvent

# Interface: IFormMinEvent

Defined in: [dist/lib/control.ts:1010](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1010)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1011](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1011)

#### action

> **action**: `"click"` \| `"method"`

#### event

> **event**: `MouseEvent` \| `TouchEvent` \| `null`

#### history

> **history**: \{ `height`: `number`; `left`: `number`; `top`: `number`; `width`: `number`; \} \| `null`

最小化之前的窗体位置

#### min

> **min**: `boolean`

当前是否时最小化状态

lib/control/interfaces/IGreatlistAddEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistAddEvent

# Interface: IGreatlistAddEvent

Defined in: [dist/lib/control.ts:1047](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1047)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1048](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1048)

#### index

> **index**: `number`

#### value

> **value**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IGreatlistChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistChangedEvent

# Interface: IGreatlistChangedEvent

Defined in: [dist/lib/control.ts:1034](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1034)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1035](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1035)

#### value

> **value**: `number`[]

lib/control/interfaces/IGreatlistChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistChangeEvent

# Interface: IGreatlistChangeEvent

Defined in: [dist/lib/control.ts:1028](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1028)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1029](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1029)

#### value

> **value**: `number`[]

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IGreatlistItemclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistItemclickedEvent

# Interface: IGreatlistItemclickedEvent

Defined in: [dist/lib/control.ts:1054](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1054)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1055](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1055)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `number`

lib/control/interfaces/IGreatlistItemdblclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistItemdblclickedEvent

# Interface: IGreatlistItemdblclickedEvent

Defined in: [dist/lib/control.ts:1062](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1062)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1063](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1063)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `number`

lib/control/interfaces/IGreatlistRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatlistRemoveEvent

# Interface: IGreatlistRemoveEvent

Defined in: [dist/lib/control.ts:1040](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1040)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1041](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1041)

#### index

> **index**: `number`

#### value

> **value**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IGreatselectAddEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatselectAddEvent

# Interface: IGreatselectAddEvent

Defined in: [dist/lib/control.ts:1090](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1090)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1091](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1091)

#### value

> **value**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IGreatselectChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatselectChangedEvent

# Interface: IGreatselectChangedEvent

Defined in: [dist/lib/control.ts:1078](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1078)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1079](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1079)

#### value

> **value**: `number`[]

lib/control/interfaces/IGreatselectChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatselectChangeEvent

# Interface: IGreatselectChangeEvent

Defined in: [dist/lib/control.ts:1072](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1072)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1073](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1073)

#### value

> **value**: `number`[]

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IGreatselectRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IGreatselectRemoveEvent

# Interface: IGreatselectRemoveEvent

Defined in: [dist/lib/control.ts:1084](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1084)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1085](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1085)

#### value

> **value**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IIconviewDropEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IIconviewDropEvent

# Interface: IIconviewDropEvent

Defined in: [dist/lib/control.ts:1147](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1147)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1148](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1148)

#### from

> **from**: `object`[]

#### self

> **self**: `boolean`

#### to

> **to**: `object`

##### to.index

> **index**: `number`

##### to.path

> **path**: `string`

##### to.type

> **type**: `0` \| `1` \| `-1` \| `undefined`

lib/control/interfaces/IIconviewItemclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IIconviewItemclickedEvent

# Interface: IIconviewItemclickedEvent

Defined in: [dist/lib/control.ts:1134](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1134)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1135](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1135)

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `number`

lib/control/interfaces/IIconviewOpenEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IIconviewOpenEvent

# Interface: IIconviewOpenEvent

Defined in: [dist/lib/control.ts:1141](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1141)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1142](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1142)

#### value

> **value**: `number`[]

lib/control/interfaces/IIconviewSelectEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IIconviewSelectEvent

# Interface: IIconviewSelectEvent

Defined in: [dist/lib/control.ts:1163](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1163)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1164](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1164)

#### area

> **area**: `object`

##### area.ctrl

> **ctrl**: `boolean`

##### area.empty

> **empty**: `boolean`

##### area.end

> **end**: `number`

##### area.height

> **height**: `number`

##### area.shift

> **shift**: `boolean`

##### area.start

> **start**: `number`

##### area.width

> **width**: `number`

##### area.x

> **x**: `number`

##### area.y

> **y**: `number`

lib/control/interfaces/ILevelselectLevelEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ILevelselectLevelEvent

# Interface: ILevelselectLevelEvent

Defined in: [dist/lib/control.ts:1181](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1181)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1182](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1182)

#### labels

> **labels**: `string`[]

#### list

> **list**: `object`[]

#### values

> **values**: `string`[]

lib/control/interfaces/IListAddEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListAddEvent

# Interface: IListAddEvent

Defined in: [dist/lib/control.ts:1237](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1237)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1238](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1238)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IListChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListChangedEvent

# Interface: IListChangedEvent

Defined in: [dist/lib/control.ts:1224](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1224)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1225](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1225)

#### value

> **value**: `string`[]

lib/control/interfaces/IListChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListChangeEvent

# Interface: IListChangeEvent

Defined in: [dist/lib/control.ts:1218](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1218)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1219](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1219)

#### value

> **value**: `string`[]

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IListItemclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListItemclickedEvent

# Interface: IListItemclickedEvent

Defined in: [dist/lib/control.ts:1244](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1244)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1245](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1245)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `string`

lib/control/interfaces/IListItemdblclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListItemdblclickedEvent

# Interface: IListItemdblclickedEvent

Defined in: [dist/lib/control.ts:1252](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1252)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1253](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1253)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `string`

lib/control/interfaces/IListRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IListRemoveEvent

# Interface: IListRemoveEvent

Defined in: [dist/lib/control.ts:1230](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1230)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1231](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1231)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IMenulistItemCheckEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IMenulistItemCheckEvent

# Interface: IMenulistItemCheckEvent

Defined in: [dist/lib/control.ts:929](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L929)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:930](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L930)

#### label?

> `optional` **label**: `string`

radio 模式下，当前项的 label 内容

#### value

> **value**: `string` \| `boolean`

当前要选中的项

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/INavItemSelectEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / INavItemSelectEvent

# Interface: INavItemSelectEvent

Defined in: [dist/lib/control.ts:1262](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1262)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1263](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1263)

#### name

> **name**: `string`

#### selected

> **selected**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/INumberBeforeChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / INumberBeforeChangeEvent

# Interface: INumberBeforeChangeEvent

Defined in: [dist/lib/control.ts:897](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L897)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:898](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L898)

#### change?

> `optional` **change**: `string`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/INumberMinMaxChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / INumberMinMaxChangeEvent

# Interface: INumberMinMaxChangeEvent

Defined in: [dist/lib/control.ts:904](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L904)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:905](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L905)

#### before

> **before**: `string`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IObjviewerLine.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IObjviewerLine

# Interface: IObjviewerLine

Defined in: [dist/lib/control.ts:1472](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1472)

## Properties

### end

> **end**: [`IObjviewerLineObj`](IObjviewerLineObj.md)

Defined in: [dist/lib/control.ts:1476](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1476)

***

### hue?

> `optional` **hue**: `string`

Defined in: [dist/lib/control.ts:1478](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1478)

默认 255

***

### name?

> `optional` **name**: `string`

Defined in: [dist/lib/control.ts:1474](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1474)

-- 可自定义线段的名称

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/control.ts:1479](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1479)

***

### start

> **start**: [`IObjviewerLineObj`](IObjviewerLineObj.md)

Defined in: [dist/lib/control.ts:1475](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1475)

***

### stroke?

> `optional` **stroke**: `"down"` \| `"solid"` \| `"dashed"` \| `"up"`

Defined in: [dist/lib/control.ts:1481](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1481)

默认 solid

lib/control/interfaces/IObjviewerLineObj.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IObjviewerLineObj

# Interface: IObjviewerLineObj

Defined in: [dist/lib/control.ts:1484](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1484)

## Properties

### obj

> **obj**: `HTMLElement` \| [`AbstractControl`](../classes/AbstractControl.md)

Defined in: [dist/lib/control.ts:1485](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1485)

***

### pos

> **pos**: `"b"` \| `"tr"` \| `"lt"` \| `"t"` \| `"r"` \| `"rb"` \| `"bl"` \| `"l"`

Defined in: [dist/lib/control.ts:1486](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1486)

lib/control/interfaces/IPaletteChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IPaletteChangedEvent

# Interface: IPaletteChangedEvent

Defined in: [dist/lib/control.ts:1299](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1299)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1300](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1300)

#### hsl?

> `optional` **hsl**: `object`

对象

##### hsl.a

> **a**: `number`

##### hsl.h

> **h**: `number`

##### hsl.l

> **l**: `number`

##### hsl.s

> **s**: `number`

#### rgb?

> `optional` **rgb**: `object`

##### rgb.a

> **a**: `number`

##### rgb.b

> **b**: `number`

##### rgb.g

> **g**: `number`

##### rgb.r

> **r**: `number`

#### value

> **value**: `string`

颜色值

lib/control/interfaces/IPanelGoEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IPanelGoEvent

# Interface: IPanelGoEvent

Defined in: [dist/lib/control.ts:1271](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1271)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1272](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1272)

#### from

> **from**: `string`

#### to

> **to**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/IPanelWentEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IPanelWentEvent

# Interface: IPanelWentEvent

Defined in: [dist/lib/control.ts:1278](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1278)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1279](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1279)

#### from

> **from**: `string`

#### result

> **result**: `boolean`

#### to

> **to**: `string`

lib/control/interfaces/IPdfViewEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IPdfViewEvent

# Interface: IPdfViewEvent

Defined in: [dist/lib/control.ts:1107](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1107)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1108](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1108)

#### height

> **height**: `number`

高度 point

#### inheight

> **inheight**: `number`

高度英寸

#### inwidth

> **inwidth**: `number`

宽度英寸

#### pxheight

> **pxheight**: `number`

高度像素

#### pxwidth

> **pxwidth**: `number`

宽度像素

#### width

> **width**: `number`

宽度 point

lib/control/interfaces/IRadioChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IRadioChangeEvent

# Interface: IRadioChangeEvent

Defined in: [dist/lib/control.ts:1288](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1288)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1289](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1289)

#### selected

> **selected**: `string`

选中的值

#### value

> **value**: `string`

设定的值

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ISelectAddedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectAddedEvent

# Interface: ISelectAddedEvent

Defined in: [dist/lib/control.ts:1358](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1358)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1359](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1359)

#### index

> **index**: `number`

#### value

> **value**: `string`

lib/control/interfaces/ISelectAddEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectAddEvent

# Interface: ISelectAddEvent

Defined in: [dist/lib/control.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1343)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1344](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1344)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ISelectChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectChangedEvent

# Interface: ISelectChangedEvent

Defined in: [dist/lib/control.ts:1379](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1379)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1380](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1380)

#### before

> **before**: `string`[]

#### value

> **value**: `string`[]

lib/control/interfaces/ISelectChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectChangeEvent

# Interface: ISelectChangeEvent

Defined in: [dist/lib/control.ts:1373](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1373)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1374](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1374)

#### value

> **value**: `string`[]

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ISelectItemclickedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectItemclickedEvent

# Interface: ISelectItemclickedEvent

Defined in: [dist/lib/control.ts:1400](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1400)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1401](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1401)

#### arrow

> **arrow**: `boolean`

#### event

> **event**: `MouseEvent` \| `TouchEvent`

#### value

> **value**: `string`

lib/control/interfaces/ISelectRemoteEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoteEvent

# Interface: ISelectRemoteEvent

Defined in: [dist/lib/control.ts:1393](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1393)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1394](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1394)

#### callback()

> **callback**: (`data?`) => `Promise`\<`void`\>

##### Parameters

###### data?

`any`[] | `Record`\<`string`, `string`\>

##### Returns

`Promise`\<`void`\>

#### value

> **value**: `string`

lib/control/interfaces/ISelectRemovedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemovedEvent

# Interface: ISelectRemovedEvent

Defined in: [dist/lib/control.ts:1365](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1365)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1366](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1366)

#### index

> **index**: `number`

#### mode

> **mode**: `"list"` \| `"backspace"` \| `"tag"`

#### value

> **value**: `string`

lib/control/interfaces/ISelectRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoveEvent

# Interface: ISelectRemoveEvent

Defined in: [dist/lib/control.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1350)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1351)

#### index

> **index**: `number`

#### mode

> **mode**: `"list"` \| `"backspace"` \| `"tag"`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ISelectTagclickEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectTagclickEvent

# Interface: ISelectTagclickEvent

Defined in: [dist/lib/control.ts:1386](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1386)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1387](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1387)

#### index

> **index**: `number`

#### value

> **value**: `string`

lib/control/interfaces/ISwitchChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISwitchChangeEvent

# Interface: ISwitchChangeEvent

Defined in: [dist/lib/control.ts:1410](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1410)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1411](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1411)

#### value

> **value**: `boolean`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITabChangedEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITabChangedEvent

# Interface: ITabChangedEvent

Defined in: [dist/lib/control.ts:1424](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1424)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1425](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1425)

#### value

> **value**: `string`

lib/control/interfaces/ITabChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITabChangeEvent

# Interface: ITabChangeEvent

Defined in: [dist/lib/control.ts:1418](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1418)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1419](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1419)

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITabCloseEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITabCloseEvent

# Interface: ITabCloseEvent

Defined in: [dist/lib/control.ts:1430](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1430)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1431](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1431)

#### index

> **index**: `number`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITableSortEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [dist/lib/control.ts:1439](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1439)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1440](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1440)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITagDropEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITagDropEvent

# Interface: ITagDropEvent

Defined in: [dist/lib/control.ts:1463](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1463)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1464](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1464)

#### after

> **after**: `number`

#### before

> **before**: `number`

lib/control/interfaces/ITextBeforeChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITextBeforeChangeEvent

# Interface: ITextBeforeChangeEvent

Defined in: [dist/lib/control.ts:913](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L913)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:914](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L914)

#### change?

> `optional` **change**: `string`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITextMinMaxChangeEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITextMinMaxChangeEvent

# Interface: ITextMinMaxChangeEvent

Defined in: [dist/lib/control.ts:920](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L920)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:921](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L921)

#### before

> **before**: `string`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/interfaces/ITuieditorImguploadEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITuieditorImguploadEvent

# Interface: ITuieditorImguploadEvent

Defined in: [dist/lib/control.ts:1449](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1449)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1450](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1450)

#### callback()

> **callback**: (`url`, `opt?`) => `void` \| `Promise`\<`void`\>

##### Parameters

###### url

`string`

###### opt?

###### align?

`string`

###### alt?

`string`

###### height?

`number`

###### width?

`number`

##### Returns

`void` \| `Promise`\<`void`\>

#### file

> **file**: `Blob`

lib/control/interfaces/IUploaderRemoveEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IUploaderRemoveEvent

# Interface: IUploaderRemoveEvent

Defined in: [dist/lib/control.ts:1126](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1126)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1127](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1127)

#### index

> **index**: `number`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

lib/control/type-aliases/TControlPackage.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / TControlPackage

# Type Alias: TControlPackage

> **TControlPackage** = `Record`\<`string`, [`IControl`](../interfaces/IControl.md)\>

Defined in: [dist/lib/control.ts:867](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L867)

控件文件包

lib/core/classes/AbstractApp.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / AbstractApp

# Abstract Class: AbstractApp

Defined in: [dist/lib/core.ts:56](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L56)

App 抽象类

## Constructors

### Constructor

> **new AbstractApp**(): `AbstractApp`

#### Returns

`AbstractApp`

## Properties

### filename

> **filename**: `string` = `''`

Defined in: [dist/lib/core.ts:59](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L59)

当前 js 文件在包内的完整路径

***

### taskId

> **taskId**: `string` = `''`

Defined in: [dist/lib/core.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L62)

系统会自动设置本项

## Methods

### main()

> `abstract` **main**(`data`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:65](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L65)

App 的入口文件

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L88)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../interfaces/IConfig.md)

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### n

`TK`

##### v

`T`\[`TK`\]

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`taskId`, `formId`, `error`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:76](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L76)

全局错误事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### error

`Error`

##### info

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:144](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L144)

窗体丢失焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormCreated()

> **onFormCreated**(`taskId`, `formId`, `title`, `icon`, `showInSystemTask`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:94](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L94)

窗体创建事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

##### showInSystemTask

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFlash()

> **onFormFlash**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:150](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L150)

窗体闪烁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFocused()

> **onFormFocused**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:138](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L138)

窗体获得焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormHashChange()

> **onFormHashChange**(`taskId`, `formId`, `value`, `data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:162](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L162)

窗体的 formHash 改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`string`

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormIconChanged()

> **onFormIconChanged**(`taskId`, `formId`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:114](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L114)

窗体图标改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormRemoved()

> **onFormRemoved**(`taskId`, `formId`, `title`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:102](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L102)

窗体销毁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowChanged()

> **onFormShowChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:132](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L132)

窗体显示状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowInSystemTaskChange()

> **onFormShowInSystemTaskChange**(`taskId`, `formId`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:156](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L156)

窗体是否显示在任务栏属性改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMaxChanged()

> **onFormStateMaxChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:126](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L126)

窗体最大化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMinChanged()

> **onFormStateMinChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:120](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L120)

窗体最小化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormTitleChanged()

> **onFormTitleChanged**(`taskId`, `formId`, `title`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:108](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L108)

窗体标题改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onHashChanged()

> **onHashChanged**(`hash`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:188](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L188)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:194](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L194)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:200](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L200)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:182](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L182)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:82](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L82)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L176)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L170)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### run()

> **run**(`form`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:71](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L71)

以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败

#### Parameters

##### form

[`AbstractForm`](../../form/classes/AbstractForm.md)

窗体对象

#### Returns

`Promise`\<`void`\>

lib/core/functions/back.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / back

# Function: back()

> **back**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:719](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L719)

对浏览器做返回操作

## Parameters

### current

[`TCurrent`](../type-aliases/TCurrent.md)

当前任务 id

## Returns

`Promise`\<`boolean`\>

lib/core/functions/checkModule.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / checkModule

# Function: checkModule()

> **checkModule**(`name`): `boolean`

Defined in: [dist/lib/core.ts:1044](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1044)

检查特殊模块是否注册

## Parameters

### name

`string`

模块名

## Returns

`boolean`

lib/core/functions/fetchApp.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / fetchApp

# Function: fetchApp()

> **fetchApp**(`taskId`, `url`, `opt`): `Promise`\<[`IApp`](../interfaces/IApp.md) \| `null`\>

Defined in: [dist/lib/core.ts:529](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L529)

从网址下载应用

## Parameters

### taskId

`string`

所属任务 ID

### url

`string`

对于当前网页的相对、绝对路径，以 .cga 结尾的文件

### opt

[`ICoreFetchAppOptions`](../interfaces/ICoreFetchAppOptions.md) = `{}`

选项

## Returns

`Promise`\<[`IApp`](../interfaces/IApp.md) \| `null`\>

lib/core/functions/getAvailArea.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getAvailArea

# Function: getAvailArea()

> **getAvailArea**(): [`IAvailArea`](../interfaces/IAvailArea.md)

Defined in: [dist/lib/core.ts:600](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L600)

获取屏幕可用区域

## Returns

[`IAvailArea`](../interfaces/IAvailArea.md)

lib/core/functions/getHash.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getHash

# Function: getHash()

> **getHash**(): `string`

Defined in: [dist/lib/core.ts:676](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L676)

获取当前浏览器的 hash

## Returns

`string`

lib/core/functions/getHost.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getHost

# Function: getHost()

> **getHost**(): `string`

Defined in: [dist/lib/core.ts:683](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L683)

获取当前浏览器的 host

## Returns

`string`

lib/core/functions/getLocation.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getLocation

# Function: getLocation()

> **getLocation**(): `string`

Defined in: [dist/lib/core.ts:711](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L711)

获取当前的浏览器的 url

## Returns

`string`

lib/core/functions/getModule.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getModule

# Function: getModule()

获取模块内容，通常用于异步加载模块时使用

## Param

模块名

## Call Signature

> **getModule**(`name`): `Promise`\<[`ITumsPlayer`](../interfaces/ITumsPlayer.md) \| `null`\>

Defined in: [dist/lib/core.ts:1048](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1048)

### Parameters

#### name

`"tums-player"`

### Returns

`Promise`\<[`ITumsPlayer`](../interfaces/ITumsPlayer.md) \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<\{ \} \| `null`\>

Defined in: [dist/lib/core.ts:1049](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1049)

### Parameters

#### name

`"mpegts"`

### Returns

`Promise`\<\{ \} \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<`any`\>

Defined in: [dist/lib/core.ts:1050](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1050)

### Parameters

#### name

`string`

### Returns

`Promise`\<`any`\>

lib/core/functions/hash.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / hash

# Function: hash()

> **hash**(`current`, `hash`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:661](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L661)

修改浏览器 hash

## Parameters

### current

[`TCurrent`](../type-aliases/TCurrent.md)

当前任务 id

### hash

`string`

修改的值，不含 #

## Returns

`Promise`\<`boolean`\>

lib/core/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / init

# Function: init()

> **init**(): `void`

Defined in: [dist/lib/core.ts:1112](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1112)

## Returns

`void`

lib/core/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/core.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L33)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/core/functions/loadModule.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / loadModule

# Function: loadModule()

> **loadModule**(`name`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:1067](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1067)

加载模块，返回 true / false

## Parameters

### name

`string`

模块名

## Returns

`Promise`\<`boolean`\>

lib/core/functions/location.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / location

# Function: location()

> **location**(`current`, `url`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:696](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L696)

对浏览器做跳转操作

## Parameters

### current

[`TCurrent`](../type-aliases/TCurrent.md)

当前任务 id

### url

`string`

要跳转的新 URL

## Returns

`Promise`\<`boolean`\>

lib/core/functions/open.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / open

# Function: open()

> **open**(`url`): `void`

Defined in: [dist/lib/core.ts:735](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L735)

打开新的标签页

## Parameters

### url

`string`

要访问的网址

## Returns

`void`

lib/core/functions/readApp.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / readApp

# Function: readApp()

> **readApp**(`blob`): `Promise`\<`false` \| [`IApp`](../interfaces/IApp.md)\>

Defined in: [dist/lib/core.ts:467](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L467)

cga blob 文件解包

## Parameters

### blob

`Blob`

blob 对象

## Returns

`Promise`\<`false` \| [`IApp`](../interfaces/IApp.md)\>

lib/core/functions/regModule.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / regModule

# Function: regModule()

> **regModule**(`current`, `name`, `opt`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:1015](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1015)

注册模块

## Parameters

### current

[`TCurrent`](../type-aliases/TCurrent.md)

当前任务 id

### name

`string`

模块名

### opt

选项

#### func?

() => `any`

除 ESM 模式外必填

#### version?

`string`

ESM 模式必填

## Returns

`Promise`\<`boolean`\>

lib/core/functions/setBoot.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / setBoot

# Function: setBoot()

> **setBoot**(`b`): `void`

Defined in: [dist/lib/core.ts:209](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L209)

## Parameters

### b

[`AbstractBoot`](../../../clickgo/classes/AbstractBoot.md)

## Returns

`void`

lib/core/functions/trigger.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / trigger

# Function: trigger()

> **trigger**(`name`, `taskId`, `formId`, `param1`, `param2`, `param3`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L266)

主动触发系统级事件，用 this.trigger 替代

## Parameters

### name

[`TGlobalEvent`](../type-aliases/TGlobalEvent.md)

### taskId

`string` | `boolean` | `KeyboardEvent`

### formId

`string` | `boolean` | `Record`\<`string`, `any`\> | `null`

### param1

`string` | `boolean` | `Error`

### param2

`string` | `Record`\<`string`, `any`\>

### param3

`boolean` = `true`

## Returns

`Promise`\<`void`\>

lib/core/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/core

# lib/core

## Classes

- [AbstractApp](classes/AbstractApp.md)

## Interfaces

- [IApp](interfaces/IApp.md)
- [IAppConfig](interfaces/IAppConfig.md)
- [IAvailArea](interfaces/IAvailArea.md)
- [IConfig](interfaces/IConfig.md)
- [IConfigLauncherItem](interfaces/IConfigLauncherItem.md)
- [ICoreFetchAppOptions](interfaces/ICoreFetchAppOptions.md)
- [ITumsPlayer](interfaces/ITumsPlayer.md)
- [IVApp](interfaces/IVApp.md)
- [IVNode](interfaces/IVNode.md)
- [IVue](interfaces/IVue.md)
- [IVueConfig](interfaces/IVueConfig.md)
- [IVueObject](interfaces/IVueObject.md)

## Type Aliases

- [IVueOptionMergeFunction](type-aliases/IVueOptionMergeFunction.md)
- [TCurrent](type-aliases/TCurrent.md)
- [TGlobalEvent](type-aliases/TGlobalEvent.md)

## Variables

- [config](variables/config.md)

## Functions

- [back](functions/back.md)
- [checkModule](functions/checkModule.md)
- [fetchApp](functions/fetchApp.md)
- [getAvailArea](functions/getAvailArea.md)
- [getHash](functions/getHash.md)
- [getHost](functions/getHost.md)
- [getLocation](functions/getLocation.md)
- [getModule](functions/getModule.md)
- [hash](functions/hash.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [loadModule](functions/loadModule.md)
- [location](functions/location.md)
- [open](functions/open.md)
- [readApp](functions/readApp.md)
- [regModule](functions/regModule.md)
- [setBoot](functions/setBoot.md)
- [trigger](functions/trigger.md)

lib/core/interfaces/IApp.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IApp

# Interface: IApp

Defined in: [dist/lib/core.ts:1244](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1244)

应用包解包后对象

## Properties

### config

> **config**: [`IAppConfig`](IAppConfig.md)

Defined in: [dist/lib/core.ts:1247](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1247)

控件对象配置文件

***

### files

> **files**: `Record`\<`string`, `Blob` \| `string`\>

Defined in: [dist/lib/core.ts:1249](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1249)

所有已加载的文件内容

***

### icon

> **icon**: `string`

Defined in: [dist/lib/core.ts:1251](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1251)

应用图标

***

### type

> **type**: `"app"`

Defined in: [dist/lib/core.ts:1245](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1245)

lib/core/interfaces/IAppConfig.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [dist/lib/core.ts:1255](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1255)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/core.ts:1263](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1263)

作者

***

### controls

> **controls**: `string`[]

Defined in: [dist/lib/core.ts:1266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1266)

将要加载的控件

***

### files?

> `optional` **files**: `string`[]

Defined in: [dist/lib/core.ts:1279](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1279)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/core.ts:1276](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1276)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1272](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1272)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [dist/lib/core.ts:1281](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1281)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [dist/lib/core.ts:1257](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1257)

应用名

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/core.ts:1270](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1270)

将自动申请的权限

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/core.ts:1274](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1274)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes**: `string`[]

Defined in: [dist/lib/core.ts:1268](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1268)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [dist/lib/core.ts:1259](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1259)

发行版本

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1261](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1261)

发行版本字符串

lib/core/interfaces/IAvailArea.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAvailArea

# Interface: IAvailArea

Defined in: [dist/lib/core.ts:1210](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1210)

屏幕可用区域

## Properties

### height

> **height**: `number`

Defined in: [dist/lib/core.ts:1214](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1214)

***

### left

> **left**: `number`

Defined in: [dist/lib/core.ts:1211](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1211)

***

### oheight

> **oheight**: `number`

Defined in: [dist/lib/core.ts:1216](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1216)

***

### owidth

> **owidth**: `number`

Defined in: [dist/lib/core.ts:1215](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1215)

***

### top

> **top**: `number`

Defined in: [dist/lib/core.ts:1212](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1212)

***

### width

> **width**: `number`

Defined in: [dist/lib/core.ts:1213](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1213)

lib/core/interfaces/IConfig.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IConfig

# Interface: IConfig

Defined in: [dist/lib/core.ts:1189](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1189)

Config 对象

## Properties

### desktop.icon.recycler

> **desktop.icon.recycler**: `boolean`

Defined in: [dist/lib/core.ts:1194](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1194)

***

### desktop.icon.storage

> **desktop.icon.storage**: `boolean`

Defined in: [dist/lib/core.ts:1193](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1193)

***

### desktop.path

> **desktop.path**: `string` \| `null`

Defined in: [dist/lib/core.ts:1196](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1196)

***

### desktop.wallpaper

> **desktop.wallpaper**: `string` \| `null`

Defined in: [dist/lib/core.ts:1195](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1195)

***

### launcher.list

> **launcher.list**: [`IConfigLauncherItem`](IConfigLauncherItem.md)[]

Defined in: [dist/lib/core.ts:1197](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1197)

***

### locale

> **locale**: `string`

Defined in: [dist/lib/core.ts:1190](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1190)

***

### task.pin

> **task.pin**: `Record`\<`string`, \{ `icon`: `string`; `name`: `string`; \}\>

Defined in: [dist/lib/core.ts:1192](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1192)

***

### task.position

> **task.position**: `"left"` \| `"top"` \| `"right"` \| `"bottom"`

Defined in: [dist/lib/core.ts:1191](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1191)

lib/core/interfaces/IConfigLauncherItem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IConfigLauncherItem

# Interface: IConfigLauncherItem

Defined in: [dist/lib/core.ts:1201](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1201)

Launcher 的 item 对象

## Properties

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/core.ts:1205](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1205)

***

### id?

> `optional` **id**: `string`

Defined in: [dist/lib/core.ts:1202](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1202)

***

### list?

> `optional` **list**: `object`[]

Defined in: [dist/lib/core.ts:1206](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1206)

#### icon

> **icon**: `string`

#### id?

> `optional` **id**: `string`

#### name

> **name**: `string`

#### path

> **path**: `string`

***

### name

> **name**: `string`

Defined in: [dist/lib/core.ts:1203](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1203)

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/core.ts:1204](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1204)

lib/core/interfaces/ICoreFetchAppOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ICoreFetchAppOptions

# Interface: ICoreFetchAppOptions

Defined in: [dist/lib/core.ts:1223](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1223)

现场下载 app 的参数

## Properties

### after?

> `optional` **after**: `string`

Defined in: [dist/lib/core.ts:1233](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1233)

网址后面附带的前缀，如 ?123

***

### notify?

> `optional` **notify**: `number` \| \{ `id?`: `number`; `loaded?`: `number`; `total?`: `number`; \}

Defined in: [dist/lib/core.ts:1224](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1224)

#### Type Declaration

`number`

\{ `id?`: `number`; `loaded?`: `number`; `total?`: `number`; \}

#### id?

> `optional` **id**: `number`

notify id

#### loaded?

> `optional` **loaded**: `number`

偏移基准

#### total?

> `optional` **total**: `number`

偏移总量

***

### progress()?

> `optional` **progress**: (`loaded`, `total`, `per`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1240](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1240)

下载进度

#### Parameters

##### loaded

`number`

已下载字节

##### total

`number`

总字节

##### per

`number`

含偏移进度百分比（0 - 1）

#### Returns

`void` \| `Promise`\<`void`\>

lib/core/interfaces/ITumsPlayer.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [dist/lib/core.ts:1367](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1367)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [dist/lib/core.ts:1368](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1368)

***

### startTalk()

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1370](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1370)

开始对讲

#### Parameters

##### opt

###### mode?

`"half_duplex"` \| `"vad"` \| `"aec"`

half_duplex-半双工模式,vad-VAD 人声检测模式,aec-AEC 全双工模式，默认 vad

###### sid

`string`

###### skey

`string`

###### url

`string`

#### Returns

`Promise`\<`void`\>

***

### stopTalk()

> **stopTalk**: () => `void`

Defined in: [dist/lib/core.ts:1378](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1378)

停止对讲

#### Returns

`void`

lib/core/interfaces/IVApp.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVApp

# Interface: IVApp

Defined in: [dist/lib/core.ts:1347](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1347)

Vue 应用

## Properties

### \_container

> **\_container**: `HTMLElement`

Defined in: [dist/lib/core.ts:1359](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1359)

***

### config

> **config**: [`IVueConfig`](IVueConfig.md)

Defined in: [dist/lib/core.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1350)

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1357](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1357)

## Methods

### component()

#### Call Signature

> **component**(`name`): `any`

Defined in: [dist/lib/core.ts:1348](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1348)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **component**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1349](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1349)

##### Parameters

###### name

`string`

###### config

`any`

##### Returns

`this`

***

### directive()

#### Call Signature

> **directive**(`name`): `any`

Defined in: [dist/lib/core.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1351)

##### Parameters

###### name

`string`

##### Returns

`any`

#### Call Signature

> **directive**(`name`, `config`): `this`

Defined in: [dist/lib/core.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1352)

##### Parameters

###### name

`string`

###### config

`any`

##### Returns

`this`

***

### mixin()

> **mixin**(`mixin`): `this`

Defined in: [dist/lib/core.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1353)

#### Parameters

##### mixin

`any`

#### Returns

`this`

***

### mount()

> **mount**(`rootContainer`): [`IVue`](IVue.md)

Defined in: [dist/lib/core.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1354)

#### Parameters

##### rootContainer

`string` | `HTMLElement`

#### Returns

[`IVue`](IVue.md)

***

### provide()

> **provide**\<`T`\>(`key`, `value`): `this`

Defined in: [dist/lib/core.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1355)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`this`

***

### unmount()

> **unmount**(): `void`

Defined in: [dist/lib/core.ts:1356](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1356)

#### Returns

`void`

lib/core/interfaces/IVNode.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVNode

# Interface: IVNode

Defined in: [dist/lib/core.ts:1310](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1310)

Vue 节点

## Indexable

\[`key`: `string`\]: `any`

## Properties

### children

> **children**: `object` & `IVNode`[]

Defined in: [dist/lib/core.ts:1311](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1311)

#### Type Declaration

##### default

> **default**: () => `IVNode`[] \| `undefined`

***

### props

> **props**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1315](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1315)

***

### type

> **type**: `symbol` \| `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1316)

lib/core/interfaces/IVue.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVue

# Interface: IVue

Defined in: [dist/lib/core.ts:1285](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1285)

Vue 实例

## Indexable

\[`key`: `string`\]: `any`

## Properties

### $attrs

> **$attrs**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1286](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1286)

***

### $data

> **$data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1287](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1287)

***

### $el

> **$el**: `HTMLElement`

Defined in: [dist/lib/core.ts:1288](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1288)

***

### $options

> **$options**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1292](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1292)

***

### $parent

> **$parent**: `IVue` \| `null`

Defined in: [dist/lib/core.ts:1293](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1293)

***

### $props

> **$props**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1294](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1294)

***

### $refs

> **$refs**: `Record`\<`string`, `HTMLElement` & `IVue`\>

Defined in: [dist/lib/core.ts:1295](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1295)

***

### $root

> **$root**: `IVue`

Defined in: [dist/lib/core.ts:1296](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1296)

***

### $slots

> **$slots**: `object`

Defined in: [dist/lib/core.ts:1297](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1297)

#### Index Signature

\[`key`: `string`\]: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

#### default

> **default**: (`o?`) => [`IVNode`](IVNode.md)[] \| `undefined`

***

### $watch()

> **$watch**: (`o`, `cb`, `opt?`) => `void`

Defined in: [dist/lib/core.ts:1301](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1301)

#### Parameters

##### o

`any`

##### cb

(`n`, `o`) => `void`

##### opt?

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

`void`

## Methods

### $emit()

> **$emit**(`name`, ...`arg`): `void`

Defined in: [dist/lib/core.ts:1289](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1289)

#### Parameters

##### name

`string`

##### arg

...`any`

#### Returns

`void`

***

### $forceUpdate()

> **$forceUpdate**(): `void`

Defined in: [dist/lib/core.ts:1290](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1290)

#### Returns

`void`

***

### $nextTick()

> **$nextTick**(): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1291](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1291)

#### Returns

`Promise`\<`void`\>

lib/core/interfaces/IVueConfig.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueConfig

# Interface: IVueConfig

Defined in: [dist/lib/core.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1337)

Vue 配置

## Properties

### globalProperties

> **globalProperties**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/core.ts:1339](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1339)

***

### optionMergeStrategies

> **optionMergeStrategies**: `Record`\<`string`, [`IVueOptionMergeFunction`](../type-aliases/IVueOptionMergeFunction.md)\>

Defined in: [dist/lib/core.ts:1341](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1341)

***

### performance

> **performance**: `boolean`

Defined in: [dist/lib/core.ts:1342](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1342)

## Methods

### errorHandler()?

> `optional` **errorHandler**(`err`, `instance`, `info`): `void`

Defined in: [dist/lib/core.ts:1338](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1338)

#### Parameters

##### err

`unknown`

##### instance

[`IVue`](IVue.md) | `null`

##### info

`string`

#### Returns

`void`

***

### isCustomElement()

> **isCustomElement**(`tag`): `boolean`

Defined in: [dist/lib/core.ts:1340](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1340)

#### Parameters

##### tag

`string`

#### Returns

`boolean`

***

### warnHandler()?

> `optional` **warnHandler**(`msg`, `instance`, `trace`): `void`

Defined in: [dist/lib/core.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1343)

#### Parameters

##### msg

`string`

##### instance

[`IVue`](IVue.md) | `null`

##### trace

`string`

#### Returns

`void`

lib/core/interfaces/IVueObject.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueObject

# Interface: IVueObject

Defined in: [dist/lib/core.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1321)

## Methods

### createApp()

> **createApp**(`opt`): [`IVApp`](IVApp.md)

Defined in: [dist/lib/core.ts:1322](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1322)

#### Parameters

##### opt

`any`

#### Returns

[`IVApp`](IVApp.md)

***

### h()

> **h**(`tag`, `props?`, `list?`): `any`

Defined in: [dist/lib/core.ts:1330](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1330)

#### Parameters

##### tag

`string`

##### props?

`any`[] | `Record`\<`string`, `any`\>

##### list?

`any`[]

#### Returns

`any`

***

### reactive()

> **reactive**\<`T`\>(`obj`): `T`

Defined in: [dist/lib/core.ts:1324](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1324)

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

***

### ref()

> **ref**\<`T`\>(`obj`): `object`

Defined in: [dist/lib/core.ts:1323](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1323)

#### Type Parameters

##### T

`T` *extends* `string` \| `number`

#### Parameters

##### obj

`T`

#### Returns

`object`

##### value

> **value**: `T`

***

### watch()

> **watch**(`v`, `cb`, `opt`): `void`

Defined in: [dist/lib/core.ts:1325](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1325)

#### Parameters

##### v

`any`

##### cb

(`n`, `o`) => `void` \| `Promise`\<`void`\>

##### opt

`Record`\<`string`, `string` \| `boolean`\>

#### Returns

`void`

lib/core/type-aliases/IVueOptionMergeFunction.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IVueOptionMergeFunction

# Type Alias: IVueOptionMergeFunction()

> **IVueOptionMergeFunction** = (`to`, `from`, `instance`) => `any`

Defined in: [dist/lib/core.ts:1334](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1334)

Vue 选项合并函数

## Parameters

### to

`unknown`

### from

`unknown`

### instance

[`IVue`](../interfaces/IVue.md)

## Returns

`any`

lib/core/type-aliases/TCurrent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / TCurrent

# Type Alias: TCurrent

> **TCurrent** = `string` \| [`AbstractForm`](../../form/classes/AbstractForm.md) \| [`AbstractPanel`](../../form/classes/AbstractPanel.md) \| [`AbstractControl`](../../control/classes/AbstractControl.md) \| [`AbstractApp`](../classes/AbstractApp.md)

Defined in: [dist/lib/core.ts:1362](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1362)

lib/core/type-aliases/TGlobalEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / TGlobalEvent

# Type Alias: TGlobalEvent

> **TGlobalEvent** = `"error"` \| `"screenResize"` \| `"configChanged"` \| `"formCreated"` \| `"formRemoved"` \| `"formTitleChanged"` \| `"formIconChanged"` \| `"formStateMinChanged"` \| `"formStateMaxChanged"` \| `"formShowChanged"` \| `"formFocused"` \| `"formBlurred"` \| `"formFlash"` \| `"formShowInSystemTaskChange"` \| `"formHashChange"` \| `"taskStarted"` \| `"taskEnded"` \| `"launcherFolderNameChanged"` \| `"hashChanged"` \| `"keydown"` \| `"keyup"`

Defined in: [dist/lib/core.ts:1220](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1220)

全局事件类型

lib/core/variables/config.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / config

# Variable: config

> **config**: [`IConfig`](../interfaces/IConfig.md)

Defined in: [dist/lib/core.ts:53](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L53)

Config 配置对象

lib/dom/functions/clearWatch.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatch

# Function: clearWatch()

> **clearWatch**(`taskId`): `void`

Defined in: [dist/lib/dom.ts:675](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L675)

清除某个任务下面的所有 watch 监视

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 id

## Returns

`void`

lib/dom/functions/clearWatchPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatchPosition

# Function: clearWatchPosition()

> **clearWatchPosition**(`formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:348](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L348)

清除某个窗体的所有 watch position 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余

## Parameters

### formId

`string`

窗体 id

### panelId?

`string`

若指定则只清除当前窗体的某个 panel 的 watch

## Returns

`void`

lib/dom/functions/clearWatchProperty.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatchProperty

# Function: clearWatchProperty()

> **clearWatchProperty**(`formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:972](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L972)

清除某个窗体的所有 watch property 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余

## Parameters

### formId

`string`

窗体 id

### panelId?

`string`

若指定则只清除当前窗体的某个 panel 的 watch

## Returns

`void`

lib/dom/functions/clearWatchSize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatchSize

# Function: clearWatchSize()

> **clearWatchSize**(`taskId`): `void`

Defined in: [dist/lib/dom.ts:493](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L493)

清除某个任务的所有 watch size 监视

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 id

## Returns

`void`

lib/dom/functions/clearWatchStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatchStyle

# Function: clearWatchStyle()

> **clearWatchStyle**(`formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:833](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L833)

清除某个窗体的所有 watch style 监视

## Parameters

### formId

`string`

窗体 id

### panelId?

`string`

若指定则只清除当前窗体的某个 panel 的 watch

## Returns

`void`

lib/dom/functions/createElement.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / createElement

# Function: createElement()

> **createElement**\<`T`\>(`tagName`): `HTMLElementTagNameMap`\[`T`\]

Defined in: [dist/lib/dom.ts:1426](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1426)

创建 element

## Type Parameters

### T

`T` *extends* keyof `HTMLElementTagNameMap`

## Parameters

### tagName

`T`

标签名

## Returns

`HTMLElementTagNameMap`\[`T`\]

lib/dom/functions/createToStyleList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / createToStyleList

# Function: createToStyleList()

> **createToStyleList**(`taskId`): `void`

Defined in: [dist/lib/dom.ts:136](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L136)

创建任务时连同一起创建的 style 标签

## Parameters

### taskId

`string`

任务 id

## Returns

`void`

lib/dom/functions/exitFullscreen.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / exitFullscreen

# Function: exitFullscreen()

> **exitFullscreen**(): `Promise`\<`boolean`\>

Defined in: [dist/lib/dom.ts:1407](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1407)

退出全屏

## Returns

`Promise`\<`boolean`\>

lib/dom/functions/findParentByClass.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / findParentByClass

# Function: findParentByClass()

> **findParentByClass**(`el`, `name`): `HTMLElement` \| `null`

Defined in: [dist/lib/dom.ts:1291](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1291)

通过 class 名查找上层所有标签是否存在

## Parameters

### el

`HTMLElement`

当前标签

### name

`string`

要查找的 class 名

## Returns

`HTMLElement` \| `null`

lib/dom/functions/findParentByData.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / findParentByData

# Function: findParentByData()

> **findParentByData**(`el`, `name`, `value?`): `HTMLElement` \| `null`

Defined in: [dist/lib/dom.ts:1261](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1261)

通过 data 名查找上层所有标签是否存在

## Parameters

### el

`HTMLElement`

当前标签

### name

`string`

要查找的 data 名

### value?

`string`

data 对应的值，留空则代表只要匹配了名就可以

## Returns

`HTMLElement` \| `null`

lib/dom/functions/findParentByTag.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / findParentByTag

# Function: findParentByTag()

> **findParentByTag**(`el`, `name`): `HTMLElement` \| `null`

Defined in: [dist/lib/dom.ts:1313](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1313)

通过 tagname 查找上层所有标签是否存在

## Parameters

### el

`HTMLElement`

当前标签

### name

`string`

要查找的 tagname 名，小写，如 table

## Returns

`HTMLElement` \| `null`

lib/dom/functions/fullscreen.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / fullscreen

# Function: fullscreen()

> **fullscreen**(): `Promise`\<`boolean`\>

Defined in: [dist/lib/dom.ts:1389](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1389)

全屏

## Returns

`Promise`\<`boolean`\>

lib/dom/functions/getElementRPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getElementRPosition

# Function: getElementRPosition()

> **getElementRPosition**(`el`, `wrap`): `object`

Defined in: [dist/lib/dom.ts:1431](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1431)

获取元素的相对位置信息

## Parameters

### el

`HTMLElement`

### wrap

`HTMLElement`

## Returns

`object`

### height

> **height**: `number`

### left

> **left**: `number`

### top

> **top**: `number`

### width

> **width**: `number`

lib/dom/functions/getRectPoint.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getRectPoint

# Function: getRectPoint()

> **getRectPoint**(`el`, `wrap`, `pos`): `object`

Defined in: [dist/lib/dom.ts:1449](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1449)

根据角位置获取八角坐标

## Parameters

### el

`HTMLElement`

### wrap

`HTMLElement`

### pos

`"b"` | `"tr"` | `"lt"` | `"t"` | `"r"` | `"rb"` | `"bl"` | `"l"`

## Returns

`object`

### x

> **x**: `number`

### y

> **y**: `number`

lib/dom/functions/getStyleCount.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getStyleCount

# Function: getStyleCount()

> **getStyleCount**(`taskId`, `type`): `number`

Defined in: [dist/lib/dom.ts:221](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L221)

获取任务中子类有几个子元素

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 ID

### type

类型

`"form"` | `"theme"` | `"control"`

## Returns

`number`

lib/dom/functions/getWatchCount.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getWatchCount

# Function: getWatchCount()

> **getWatchCount**(`taskId?`): `number`

Defined in: [dist/lib/dom.ts:519](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L519)

获取当前 watch 中的元素总数

## Parameters

### taskId?

`string`

留空则获取全部总数

## Returns

`number`

lib/dom/functions/getWatchInfo.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getWatchInfo

# Function: getWatchInfo()

> **getWatchInfo**(): [`IGetWatchInfoResult`](../interfaces/IGetWatchInfoResult.md)

Defined in: [dist/lib/dom.ts:998](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L998)

## Returns

[`IGetWatchInfoResult`](../interfaces/IGetWatchInfoResult.md)

lib/dom/functions/getWatchSizeCount.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / getWatchSizeCount

# Function: getWatchSizeCount()

> **getWatchSizeCount**(`taskId?`): `number`

Defined in: [dist/lib/dom.ts:381](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L381)

获取当前 watch size 中的元素总数

## Parameters

### taskId?

[`TCurrent`](../../core/type-aliases/TCurrent.md)

留空则获取全部总数

## Returns

`number`

lib/dom/functions/index.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / index

# Function: index()

> **index**(`el`): `number`

Defined in: [dist/lib/dom.ts:1335](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1335)

判断一个元素是当前同级的第几位

## Parameters

### el

`HTMLElement`

要判断的元素

## Returns

`number`

lib/dom/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / init

# Function: init()

> **init**(): `void`

Defined in: [dist/lib/dom.ts:1744](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1744)

## Returns

`void`

lib/dom/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/dom.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L28)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/dom/functions/inPage.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / inPage

# Function: inPage()

> **inPage**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:77](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L77)

判断一个元素是否还存在于页面当中

## Parameters

### el

`HTMLElement`

要判断的元素

## Returns

`boolean`

lib/dom/functions/isWatch.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / isWatch

# Function: isWatch()

> **isWatch**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:667](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L667)

检测一个标签是否正在被 watchSize

## Parameters

### el

`HTMLElement`

要检测的标签

## Returns

`boolean`

lib/dom/functions/isWatchPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / isWatchPosition

# Function: isWatchPosition()

> **isWatchPosition**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:339](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L339)

检测一个标签是否正在被 watchSize

## Parameters

### el

`HTMLElement`

要检测的标签

## Returns

`boolean`

lib/dom/functions/isWatchProperty.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / isWatchProperty

# Function: isWatchProperty()

> **isWatchProperty**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:963](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L963)

检测一个标签是否正在被 watchProperty

## Parameters

### el

`HTMLElement`

要检测的标签

## Returns

`boolean`

lib/dom/functions/isWatchSize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / isWatchSize

# Function: isWatchSize()

> **isWatchSize**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:485](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L485)

检测一个标签是否正在被 watchSize

## Parameters

### el

`HTMLElement`

要检测的标签

## Returns

`boolean`

lib/dom/functions/isWatchStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / isWatchStyle

# Function: isWatchStyle()

> **isWatchStyle**(`el`): `boolean`

Defined in: [dist/lib/dom.ts:824](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L824)

检测一个标签是否正在被 watchStyle

## Parameters

### el

`HTMLElement`

要检测的标签

## Returns

`boolean`

lib/dom/functions/pushStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / pushStyle

# Function: pushStyle()

> **pushStyle**(`taskId`, `style`, `type`, `formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:156](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L156)

将 style 内容写入 dom

## Parameters

### taskId

`string`

当前任务 ID

### style

`string`

样式内容

### type

插入的类型

`"form"` | `"global"` | `"theme"` | `"control"`

### formId

`string` = `''`

当前窗体 ID（global 下可空，theme 下为主题唯一标识符，control 下为控件名）

### panelId?

`string`

若是 panel 中创建的则需要指定 panelId，仅 type 为 form 有效

## Returns

`void`

lib/dom/functions/removeFromStyleList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / removeFromStyleList

# Function: removeFromStyleList()

> **removeFromStyleList**(`taskId`): `void`

Defined in: [dist/lib/dom.ts:144](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L144)

任务结束时需要移除 task 的所有 style

## Parameters

### taskId

`string`

任务 id

## Returns

`void`

lib/dom/functions/removeStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / removeStyle

# Function: removeStyle()

> **removeStyle**(`taskId`, `type`, `formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L180)

移除 style 样式 dom

## Parameters

### taskId

`string`

要移除的任务 ID

### type

移除的类型

`"form"` | `"global"` | `"theme"` | `"control"`

### formId

`string` = `''`

要移除的窗体 ID

### panelId?

`string`

type 为 form 模式下若不指定则当前 form 包含 panel 的样式都会被移除

## Returns

`void`

lib/dom/functions/setGlobalCursor.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / setGlobalCursor

# Function: setGlobalCursor()

> **setGlobalCursor**(`type?`): `void`

Defined in: [dist/lib/dom.ts:95](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L95)

设置全局鼠标样式

## Parameters

### type?

`string`

样式或留空，留空代表取消

## Returns

`void`

lib/dom/functions/setGlobalTransition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / setGlobalTransition

# Function: setGlobalTransition()

> **setGlobalTransition**(`enable`): `void`

Defined in: [dist/lib/dom.ts:114](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L114)

启用/禁用全局 transition

## Parameters

### enable

`boolean`

是否启用

## Returns

`void`

lib/dom/functions/siblings.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / siblings

# Function: siblings()

> **siblings**(`el`): `HTMLElement`[]

Defined in: [dist/lib/dom.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1353)

查找指定 el 的同级所有元素

## Parameters

### el

`HTMLElement`

基准

## Returns

`HTMLElement`[]

HTMLElement[]

lib/dom/functions/siblingsData.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / siblingsData

# Function: siblingsData()

> **siblingsData**(`el`, `name`): `HTMLElement`[]

Defined in: [dist/lib/dom.ts:1374](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1374)

查找指定 el 的同级的存在 data 的元素

## Parameters

### el

`HTMLElement`

基准

### name

`string`

data 名，不含 data-

## Returns

`HTMLElement`[]

HTMLElement[]

lib/dom/functions/unwatch.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / unwatch

# Function: unwatch()

> **unwatch**(`taskId`, `el`): `void`

Defined in: [dist/lib/dom.ts:646](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L646)

移除监视 Element 对象变动

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 id

### el

`HTMLElement`

要移除监视

## Returns

`void`

lib/dom/functions/unwatchPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / unwatchPosition

# Function: unwatchPosition()

> **unwatchPosition**(`el`): `void`

Defined in: [dist/lib/dom.ts:310](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L310)

移除监视 Element 对象位置

## Parameters

### el

`HTMLElement`

要移除监视

## Returns

`void`

lib/dom/functions/unwatchSize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / unwatchSize

# Function: unwatchSize()

> **unwatchSize**(`el`): `void`

Defined in: [dist/lib/dom.ts:471](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L471)

移除监视 Element 对象大小

## Parameters

### el

`HTMLElement`

要移除监视

## Returns

`void`

lib/dom/functions/watch.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watch

# Function: watch()

> **watch**(`current`, `el`, `cb`, `mode`, `immediate`): `boolean`

Defined in: [dist/lib/dom.ts:543](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L543)

添加 DOM 内容变化监视

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务

### el

`HTMLElement`

dom 对象

### cb

(`mutations`) => `void` \| `Promise`\<`void`\>

回调

### mode

监听模式，默认 default

`"default"` | `"style"` | `"text"` | `"child"` | `"childsub"`

### immediate

`boolean` = `false`

## Returns

`boolean`

lib/dom/functions/watchPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchPosition

# Function: watchPosition()

> **watchPosition**(`el`, `cb`, `immediate`): `boolean`

Defined in: [dist/lib/dom.ts:258](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L258)

添加监视 Element 对象位置，元素移除后自动停止监视，已经监视中的不会再次监视，请短时间使用（虽然本方法也可以监听 element 的大小改变，但这是监听位置改变的副产品，如果仅仅监听大小改变请使用效率更高的 watch size）

## Parameters

### el

`HTMLElement`

要监视的大小

### cb

(`state`) => `void` \| `Promise`\<`void`\>

回调函数

### immediate

`boolean` = `false`

立刻先执行一次回调

## Returns

`boolean`

lib/dom/functions/watchProperty.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchProperty

# Function: watchProperty()

> **watchProperty**(`el`, `name`, `cb`, `immediate`): `void`

Defined in: [dist/lib/dom.ts:894](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L894)

监听一个对象的属性变化

## Parameters

### el

`HTMLElement`

对象

### name

属性名

`string` | `string`[]

### cb

(`name`, `value`) => `void` \| `Promise`\<`void`\>

回调函数

### immediate

`boolean` = `false`

是否立即执行一次

## Returns

`void`

lib/dom/functions/watchSize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchSize

# Function: watchSize()

> **watchSize**(`current`, `el`, `cb`, `immediate`): `boolean`

Defined in: [dist/lib/dom.ts:430](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L430)

添加监视 Element 对象大小，元素移除后自动停止监视（浏览器原生效果），已经监视中的不会再次监视

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前执行的任务

### el

`HTMLElement`

要监视的大小

### cb

() => `void` \| `Promise`\<`void`\>

回调函数

### immediate

`boolean` = `false`

立刻先执行一次回调

## Returns

`boolean`

lib/dom/functions/watchStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchStyle

# Function: watchStyle()

> **watchStyle**(`el`, `name`, `cb`, `immediate`): `void`

Defined in: [dist/lib/dom.ts:753](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L753)

监听一个标签的计算后样式的变化

## Parameters

### el

`HTMLElement`

对象

### name

样式名

`string` | `string`[]

### cb

(`name`, `value`, `old`) => `void` \| `Promise`\<`void`\>

变更回调

### immediate

`boolean` = `false`

是否立刻执行一次

## Returns

`void`

lib/dom/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/dom

# lib/dom

## Interfaces

- [IDomSize](interfaces/IDomSize.md)
- [IGetWatchInfoResult](interfaces/IGetWatchInfoResult.md)
- [IWatchItem](interfaces/IWatchItem.md)
- [IWatchPositionItem](interfaces/IWatchPositionItem.md)
- [IWatchSizeItem](interfaces/IWatchSizeItem.md)

## Type Aliases

- [TDomBorder](type-aliases/TDomBorder.md)
- [TDomBorderCustom](type-aliases/TDomBorderCustom.md)

## Variables

- [dpi](variables/dpi.md)
- [hues](variables/hues.md)
- [is](variables/is.md)
- [mic](variables/mic.md)

## Functions

- [clearWatch](functions/clearWatch.md)
- [clearWatchPosition](functions/clearWatchPosition.md)
- [clearWatchProperty](functions/clearWatchProperty.md)
- [clearWatchSize](functions/clearWatchSize.md)
- [clearWatchStyle](functions/clearWatchStyle.md)
- [createElement](functions/createElement.md)
- [createToStyleList](functions/createToStyleList.md)
- [exitFullscreen](functions/exitFullscreen.md)
- [findParentByClass](functions/findParentByClass.md)
- [findParentByData](functions/findParentByData.md)
- [findParentByTag](functions/findParentByTag.md)
- [fullscreen](functions/fullscreen.md)
- [getElementRPosition](functions/getElementRPosition.md)
- [getRectPoint](functions/getRectPoint.md)
- [getStyleCount](functions/getStyleCount.md)
- [getWatchCount](functions/getWatchCount.md)
- [getWatchInfo](functions/getWatchInfo.md)
- [getWatchSizeCount](functions/getWatchSizeCount.md)
- [index](functions/index.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [inPage](functions/inPage.md)
- [isWatch](functions/isWatch.md)
- [isWatchPosition](functions/isWatchPosition.md)
- [isWatchProperty](functions/isWatchProperty.md)
- [isWatchSize](functions/isWatchSize.md)
- [isWatchStyle](functions/isWatchStyle.md)
- [pushStyle](functions/pushStyle.md)
- [removeFromStyleList](functions/removeFromStyleList.md)
- [removeStyle](functions/removeStyle.md)
- [setGlobalCursor](functions/setGlobalCursor.md)
- [setGlobalTransition](functions/setGlobalTransition.md)
- [siblings](functions/siblings.md)
- [siblingsData](functions/siblingsData.md)
- [unwatch](functions/unwatch.md)
- [unwatchPosition](functions/unwatchPosition.md)
- [unwatchSize](functions/unwatchSize.md)
- [watch](functions/watch.md)
- [watchPosition](functions/watchPosition.md)
- [watchProperty](functions/watchProperty.md)
- [watchSize](functions/watchSize.md)
- [watchStyle](functions/watchStyle.md)

lib/dom/interfaces/IDomSize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / IDomSize

# Interface: IDomSize

Defined in: [dist/lib/dom.ts:1834](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1834)

Element 的大小

## Properties

### border

> **border**: `object`

Defined in: [dist/lib/dom.ts:1847](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1847)

#### bottom

> **bottom**: `number`

#### left

> **left**: `number`

#### right

> **right**: `number`

#### top

> **top**: `number`

***

### bottom

> **bottom**: `number`

Defined in: [dist/lib/dom.ts:1837](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1837)

***

### clientHeight

> **clientHeight**: `number`

Defined in: [dist/lib/dom.ts:1853](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1853)

***

### clientWidth

> **clientWidth**: `number`

Defined in: [dist/lib/dom.ts:1854](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1854)

***

### height

> **height**: `number`

Defined in: [dist/lib/dom.ts:1840](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1840)

***

### innerHeight

> **innerHeight**: `number`

Defined in: [dist/lib/dom.ts:1856](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1856)

***

### innerWidth

> **innerWidth**: `number`

Defined in: [dist/lib/dom.ts:1855](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1855)

***

### left

> **left**: `number`

Defined in: [dist/lib/dom.ts:1838](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1838)

***

### padding

> **padding**: `object`

Defined in: [dist/lib/dom.ts:1841](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1841)

#### bottom

> **bottom**: `number`

#### left

> **left**: `number`

#### right

> **right**: `number`

#### top

> **top**: `number`

***

### right

> **right**: `number`

Defined in: [dist/lib/dom.ts:1836](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1836)

***

### scrollHeight

> **scrollHeight**: `number`

Defined in: [dist/lib/dom.ts:1858](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1858)

***

### scrollWidth

> **scrollWidth**: `number`

Defined in: [dist/lib/dom.ts:1857](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1857)

***

### top

> **top**: `number`

Defined in: [dist/lib/dom.ts:1835](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1835)

***

### width

> **width**: `number`

Defined in: [dist/lib/dom.ts:1839](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1839)

lib/dom/interfaces/IGetWatchInfoResult.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / IGetWatchInfoResult

# Interface: IGetWatchInfoResult

Defined in: [dist/lib/dom.ts:1886](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1886)

获取当前正在监视中的 property、style 和 position 的元素信息

## Properties

### default

> **default**: `Record`\<`string`, \{ `position`: \{ `count`: `number`; \}; `property`: \{ `count`: `number`; `list`: `string`[]; \}; `style`: \{ `count`: `number`; `list`: `string`[]; \}; \}\>

Defined in: [dist/lib/dom.ts:1888](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1888)

***

### formId

> **formId**: `string`

Defined in: [dist/lib/dom.ts:1887](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1887)

***

### panels

> **panels**: `Record`\<`string`, `Record`\<`string`, \{ `position`: \{ `count`: `number`; \}; `property`: \{ `count`: `number`; `list`: `string`[]; \}; `style`: \{ `count`: `number`; `list`: `string`[]; \}; \}\>\>

Defined in: [dist/lib/dom.ts:1901](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1901)

lib/dom/interfaces/IWatchItem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / IWatchItem

# Interface: IWatchItem

Defined in: [dist/lib/dom.ts:1879](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1879)

监视变化中的元素

## Properties

### el

> **el**: `HTMLElement`

Defined in: [dist/lib/dom.ts:1880](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1880)

***

### mo

> **mo**: `MutationObserver`

Defined in: [dist/lib/dom.ts:1881](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1881)

***

### taskId?

> `optional` **taskId**: `string`

Defined in: [dist/lib/dom.ts:1882](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1882)

lib/dom/interfaces/IWatchPositionItem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / IWatchPositionItem

# Interface: IWatchPositionItem

Defined in: [dist/lib/dom.ts:1862](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1862)

监视位置中的元素

## Properties

### el

> **el**: `HTMLElement`

Defined in: [dist/lib/dom.ts:1863](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1863)

***

### handler()

> **handler**: (`state`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/dom.ts:1865](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1865)

#### Parameters

##### state

###### position

`boolean`

###### size

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### rect

> **rect**: `DOMRect`

Defined in: [dist/lib/dom.ts:1864](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1864)

lib/dom/interfaces/IWatchSizeItem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / IWatchSizeItem

# Interface: IWatchSizeItem

Defined in: [dist/lib/dom.ts:1872](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1872)

监视大小中的元素

## Properties

### el

> **el**: `HTMLElement`

Defined in: [dist/lib/dom.ts:1873](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1873)

***

### handler()

> **handler**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/dom.ts:1874](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1874)

#### Returns

`void` \| `Promise`\<`void`\>

***

### taskId

> **taskId**: `string` \| `null`

Defined in: [dist/lib/dom.ts:1875](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1875)

lib/dom/type-aliases/TDomBorder.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / TDomBorder

# Type Alias: TDomBorder

> **TDomBorder** = `"lt"` \| `"t"` \| `"tr"` \| `"r"` \| `"rb"` \| `"b"` \| `"bl"` \| `"l"` \| `""`

Defined in: [dist/lib/dom.ts:1829](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1829)

方向类型，从左上开始

lib/dom/type-aliases/TDomBorderCustom.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / TDomBorderCustom

# Type Alias: TDomBorderCustom

> **TDomBorderCustom** = [`TDomBorder`](TDomBorder.md) \| \{ `height?`: `number`; `left`: `number`; `top?`: `number`; `width`: `number`; \}

Defined in: [dist/lib/dom.ts:1831](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1831)

lib/dom/variables/dpi.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / dpi

# Variable: dpi

> `const` **dpi**: `number`

Defined in: [dist/lib/dom.ts:86](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L86)

lib/dom/variables/hues.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / hues

# Variable: hues

> `const` **hues**: `string`[] = `[]`

Defined in: [dist/lib/dom.ts:52](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L52)

hue 色盘

lib/dom/variables/is.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / is

# Variable: is

> **is**: `object`

Defined in: [dist/lib/dom.ts:1240](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1240)

相关状态

## Type Declaration

### ctrl

> **ctrl**: `boolean`

### dark

> **dark**: `boolean`

是否是黑暗模式

### full

> **full**: `boolean`

当前是否是全屏

### keyboard

> **keyboard**: `boolean`

虚拟键盘是否正在显示

### meta

> **meta**: `boolean`

### move

> **move**: `boolean`

### shift

> **shift**: `boolean`

### transition

> **transition**: `boolean`

动画开启状态

lib/dom/variables/mic.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / mic

# Variable: mic

> `const` **mic**: `object`

Defined in: [dist/lib/dom.ts:1610](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1610)

麦克风通过 WebSocket 对讲

## Type Declaration

### start()

> **start**: (`ws`, `opts`) => `Promise`\<`boolean`\>

开始对讲

#### Parameters

##### ws

`string`

ws:// wss://

##### opts

选项

###### onProcess?

(`data`) => `void` \| `Promise`\<`void`\>

rms 音量回调

###### onStart?

() => `void` \| `Promise`\<`void`\>

开始事件回调，此时说话才会被发送

###### onStop?

() => `void` \| `Promise`\<`void`\>

结束事件回调，主动结束也会回调

###### onVoiceEnd?

() => `void` \| `Promise`\<`void`\>

有人声结束

###### onVoiceStart?

() => `void` \| `Promise`\<`void`\>

有人声开始

###### rtn?

`boolean`

需要初次 message 认证返回 { "result": 1 } 后才开始对讲，默认为 true

#### Returns

`Promise`\<`boolean`\>

### stop()

> **stop**: () => `void`

结束对讲

#### Returns

`void`

lib/form/classes/AbstractForm.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [dist/lib/form.ts:477](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L477)

窗体的抽象类

## Extends

- `AbstractCommon`

## Constructors

### Constructor

> **new AbstractForm**(): `AbstractForm`

#### Returns

`AbstractForm`

#### Inherited from

`AbstractCommon.constructor`

## Properties

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [dist/lib/form.ts:762](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L762)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [dist/lib/form.ts:485](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L485)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [dist/lib/form.ts:482](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L482)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [dist/lib/form.ts:633](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L633)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [dist/lib/form.ts:522](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L522)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [dist/lib/form.ts:527](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L527)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [dist/lib/form.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L249)

layout 中 :class 的转义

##### Returns

> (`cla`): `string`

###### Parameters

###### cla

`any`

###### Returns

`string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [dist/lib/form.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L176)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [dist/lib/form.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L180)

##### Parameters

###### v

`string`

##### Returns

`void`

#### Inherited from

`AbstractCommon.controlName`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: [dist/lib/form.ts:284](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L284)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/form.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L170)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [dist/lib/form.ts:488](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L488)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [dist/lib/form.ts:548](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L548)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [dist/lib/form.ts:494](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L494)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [dist/lib/form.ts:498](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L498)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:503](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L503)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [dist/lib/form.ts:507](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L507)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [dist/lib/form.ts:196](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L196)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [dist/lib/form.ts:640](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L640)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [dist/lib/form.ts:534](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L534)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [dist/lib/form.ts:230](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L230)

获取语言内容

##### Returns

> (`key`, `data?`, `origin?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### origin?

`boolean`

###### Returns

`string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [dist/lib/form.ts:621](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L621)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [dist/lib/form.ts:625](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L625)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [dist/lib/form.ts:222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L222)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:291](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L291)

等待渲染

##### Returns

> (): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [dist/lib/form.ts:210](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L210)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [dist/lib/form.ts:216](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L216)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [dist/lib/form.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L279)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [dist/lib/form.ts:554](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L554)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [dist/lib/form.ts:559](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L559)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [dist/lib/form.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L190)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [dist/lib/form.ts:512](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L512)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [dist/lib/form.ts:517](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L517)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [dist/lib/form.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L299)

判断当前事件可否执行

#### Parameters

##### e

鼠标、触摸、键盘事件

`PointerEvent` | `KeyboardEvent`

#### Returns

`boolean`

#### Inherited from

`AbstractCommon.allowEvent`

***

### close()

> **close**(): `void`

Defined in: [dist/lib/form.ts:755](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L755)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:687](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L687)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [dist/lib/form.ts:648](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L648)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:570](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L570)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [dist/lib/form.ts:747](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L747)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L329)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L337)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:349](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L349)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:341](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L341)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [dist/lib/form.ts:784](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L784)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* keyof [`IConfig`](../../core/interfaces/IConfig.md)

#### Parameters

##### n

keyof [`IConfig`](../../core/interfaces/IConfig.md)

##### v

[`IConfig`](../../core/interfaces/IConfig.md)\[`T`\]

#### Returns

`void`

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L333)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:840](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L840)

窗体丢失焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormCreated()

> **onFormCreated**(`taskId`, `formId`, `title`, `icon`, `showInSystemTask`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:790](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L790)

窗体创建事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

##### showInSystemTask

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFlash()

> **onFormFlash**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:846](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L846)

窗体闪烁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFocused()

> **onFormFocused**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:834](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L834)

窗体获得焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormHashChange()

> **onFormHashChange**(`taskId`, `formId`, `value`, `data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:858](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L858)

窗体的 formHash 改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`string`

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormIconChanged()

> **onFormIconChanged**(`taskId`, `formId`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:810](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L810)

窗体图标改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormRemoved()

> **onFormRemoved**(`taskId`, `formId`, `title`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:798](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L798)

窗体销毁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowChanged()

> **onFormShowChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:828](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L828)

窗体显示状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowInSystemTaskChange()

> **onFormShowInSystemTaskChange**(`taskId`, `formId`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:852](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L852)

窗体是否显示在任务栏属性改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMaxChanged()

> **onFormStateMaxChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:822](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L822)

窗体最大化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMinChanged()

> **onFormStateMinChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:816](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L816)

窗体最小化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormTitleChanged()

> **onFormTitleChanged**(`taskId`, `formId`, `title`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:804](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L804)

窗体标题改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onHashChanged()

> **onHashChanged**(`hash`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:884](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L884)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:890](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L890)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:896](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L896)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L878)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:766](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L766)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:772](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L772)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:778](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L778)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:872](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L872)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:866](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L866)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:353](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L353)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:345](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L345)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [dist/lib/form.ts:564](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L564)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [dist/lib/form.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L321)

给一个窗体发送一个对象，不会知道成功与失败状态

#### Parameters

##### fid

`string`

formId 要接收对象的 form id

##### obj

`Record`\<`string`, `any`\>

要发送的对象

#### Returns

`void`

#### Inherited from

`AbstractCommon.send`

***

### sendToPanel()

> **sendToPanel**(`panel`, `data`): `void`

Defined in: [dist/lib/form.ts:613](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L613)

发送一段数据到 panel 控件，本质上也是调用的 panel 控件的 send 方法

#### Parameters

##### panel

[`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### show()

> **show**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:701](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L701)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [dist/lib/form.ts:726](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L726)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1`, `param2`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L309)

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1

参数1

`string` | `boolean` | `Error`

##### param2

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.trigger`

***

### updateStep()

> **updateStep**(`index`, `value`): `boolean`

Defined in: [dist/lib/form.ts:675](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L675)

更新步进条，用于动态改变某个项的 hash 值时使用

#### Parameters

##### index

`number`

##### value

`string`

#### Returns

`boolean`

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt`): () => `void`

Defined in: [dist/lib/form.ts:265](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L265)

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractForm`

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

##### TR

`TR`

#### Parameters

##### name

监视的属性

`TK` | () => `TR`

##### cb

(`val`, `old`) => `void` \| `Promise`\<`void`\>

回调

##### opt

参数

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

> (): `void`

##### Returns

`void`

#### Inherited from

`AbstractCommon.watch`

lib/form/classes/AbstractPanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractPanel

# Abstract Class: AbstractPanel

Defined in: [dist/lib/form.ts:360](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L360)

Panel 控件抽象类

## Extends

- `AbstractCommon`

## Constructors

### Constructor

> **new AbstractPanel**(): `AbstractPanel`

#### Returns

`AbstractPanel`

#### Inherited from

`AbstractCommon.constructor`

## Properties

### qs

> **qs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [dist/lib/form.ts:424](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L424)

当前的 nav（若有）传递过来的 qs

## Accessors

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [dist/lib/form.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L249)

layout 中 :class 的转义

##### Returns

> (`cla`): `string`

###### Parameters

###### cla

`any`

###### Returns

`string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [dist/lib/form.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L176)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [dist/lib/form.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L180)

##### Parameters

###### v

`string`

##### Returns

`void`

#### Inherited from

`AbstractCommon.controlName`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: [dist/lib/form.ts:284](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L284)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/form.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L170)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [dist/lib/form.ts:432](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L432)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [dist/lib/form.ts:379](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L379)

获取母窗体的 formHash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`fh`): `void`

Defined in: [dist/lib/form.ts:384](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L384)

设置母窗体的 formHash

##### Parameters

###### fh

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:389](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L389)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [dist/lib/form.ts:393](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L393)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [dist/lib/form.ts:196](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L196)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [dist/lib/form.ts:230](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L230)

获取语言内容

##### Returns

> (`key`, `data?`, `origin?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### origin?

`boolean`

###### Returns

`string`

#### Inherited from

`AbstractCommon.l`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [dist/lib/form.ts:222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L222)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:291](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L291)

等待渲染

##### Returns

> (): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### panelId

#### Get Signature

> **get** **panelId**(): `string`

Defined in: [dist/lib/form.ts:363](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L363)

当前的 panel ID

##### Returns

`string`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [dist/lib/form.ts:210](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L210)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [dist/lib/form.ts:216](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L216)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [dist/lib/form.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L279)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:369](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L369)

当前 panel 所在窗体的窗体对象，系统会在创建时重写本函数

##### Returns

[`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

***

### rootPanel

#### Get Signature

> **get** **rootPanel**(): [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:374](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L374)

当前 panel 所在的 panel control 对象，系统会在创建时重写本函数

##### Returns

[`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [dist/lib/form.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L190)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [dist/lib/form.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L299)

判断当前事件可否执行

#### Parameters

##### e

鼠标、触摸、键盘事件

`PointerEvent` | `KeyboardEvent`

#### Returns

`boolean`

#### Inherited from

`AbstractCommon.allowEvent`

***

### clearQs()

> **clearQs**(): `void`

Defined in: [dist/lib/form.ts:427](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L427)

确定不再使用 qs 时可调用此方法清空，这样再次通过相同 qs 进入本 panel 依然会响应 qschange 事件

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:419](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L419)

目窗体完成当前步骤

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [dist/lib/form.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L408)

母窗体进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:398](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L398)

将母窗体的 form hash 回退

#### Returns

`Promise`\<`void`\>

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L329)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L337)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:349](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L349)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:341](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L341)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L333)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onHide()

> **onHide**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:447](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L447)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:452](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L452)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChange()

> **onQsChange**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:464](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L464)

qs 变动时调用，如果只是用来做 qs 数据处理，建议用此方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChangeShow()

> **onQsChangeShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:469](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L469)

无论是 show 还是 qschange 都会触发，优先触发 show 或 qschange 事件本身，之后触发这个

#### Parameters

##### e

[`IAbstractPanelQsChangeShowEvent`](../interfaces/IAbstractPanelQsChangeShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:458](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L458)

接收 send 传递过来的 data 数据（是 panel 控件的 send，不是 form 的 send）

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShow()

> **onShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:436](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L436)

#### Parameters

##### e

[`IAbstractPanelShowEvent`](../interfaces/IAbstractPanelShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShowed()

> **onShowed**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:441](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L441)

panel 已经完全显示后所要执行的

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:353](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L353)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:345](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L345)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [dist/lib/form.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L321)

给一个窗体发送一个对象，不会知道成功与失败状态

#### Parameters

##### fid

`string`

formId 要接收对象的 form id

##### obj

`Record`\<`string`, `any`\>

要发送的对象

#### Returns

`void`

#### Inherited from

`AbstractCommon.send`

***

### sendToRootPanel()

> **sendToRootPanel**(`data`): `void`

Defined in: [dist/lib/form.ts:403](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L403)

发送一段数据到自己这个 panel 控件，本质上也是调用的 panel 控件的 send 方法，主要用来实现发送给跳转后的 panel

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### trigger()

> **trigger**(`name`, `param1`, `param2`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L309)

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1

参数1

`string` | `boolean` | `Error`

##### param2

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.trigger`

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt`): () => `void`

Defined in: [dist/lib/form.ts:265](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L265)

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractPanel`

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

##### TR

`TR`

#### Parameters

##### name

监视的属性

`TK` | () => `TR`

##### cb

(`val`, `old`) => `void` \| `Promise`\<`void`\>

回调

##### opt

参数

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

> (): `void`

##### Returns

`void`

#### Inherited from

`AbstractCommon.watch`

lib/form/functions/alert.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / alert

# Function: alert()

> **alert**(`content`, `type?`): `number`

Defined in: [dist/lib/form.ts:2178](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2178)

从下方弹出 alert

## Parameters

### content

`string`

内容

### type?

样式，可留空

`"default"` | `"info"` | `"warning"` | `"danger"` | `"primary"` | `"cg"`

## Returns

`number`

lib/form/functions/appendToPop.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / appendToPop

# Function: appendToPop()

> **appendToPop**(`el`): `void`

Defined in: [dist/lib/form.ts:2427](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2427)

将标签追加到 pop 层

## Parameters

### el

`HTMLElement`

要追加的标签

## Returns

`void`

lib/form/functions/bindDrag.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / bindDrag

# Function: bindDrag()

> **bindDrag**(`e`): `void`

Defined in: [dist/lib/form.ts:1547](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1547)

绑定窗体拖动事件，在 pointerdown 中绑定

## Parameters

### e

`PointerEvent`

事件源

## Returns

`void`

lib/form/functions/bindResize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / bindResize

# Function: bindResize()

> **bindResize**(`e`, `border`): `void`

Defined in: [dist/lib/form.ts:1526](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1526)

绑定窗体拖动大小事件，在 pointerdown 中绑定

## Parameters

### e

`PointerEvent`

事件源

### border

[`TDomBorder`](../../dom/type-aliases/TDomBorder.md)

调整大小的方位

## Returns

`void`

lib/form/functions/changeFocus.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / changeFocus

# Function: changeFocus()

> **changeFocus**(`formId`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:1834](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1834)

改变 form 的焦点 class

## Parameters

### formId

`string` = `''`

变更后的 form id

## Returns

`Promise`\<`void`\>

lib/form/functions/changeFocusMaxZIndex.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / changeFocusMaxZIndex

# Function: changeFocusMaxZIndex()

> **changeFocusMaxZIndex**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:1989](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1989)

让最大的 z index 窗体获取焦点（不含 top 和最小化的）

## Returns

`Promise`\<`void`\>

lib/form/functions/close.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / close

# Function: close()

> **close**(`formId`): `boolean`

Defined in: [dist/lib/form.ts:1517](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1517)

关闭一个窗体

## Parameters

### formId

`string`

窗体 id

## Returns

`boolean`

lib/form/functions/confirm.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / confirm

# Function: confirm()

> **confirm**(`current`, `opt`): `Promise`\<`number` \| `boolean`\>

Defined in: [dist/lib/form.ts:3912](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L3912)

显示一个 confirm

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### opt

选项或者一段文字

`string` | [`IFormConfirmOptions`](../interfaces/IFormConfirmOptions.md)

## Returns

`Promise`\<`number` \| `boolean`\>

lib/form/functions/create.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / create

# Function: create()

> **create**\<`T`\>(`current`, `cls`, `data?`, `opt?`): `Promise`\<`T`\>

Defined in: [dist/lib/form.ts:3337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L3337)

创建一个窗体

## Type Parameters

### T

`T` *extends* [`AbstractForm`](../classes/AbstractForm.md)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### cls

路径字符串或 AbstractForm 类

`string` | () => `T`

### data?

`Record`\<`string`, `any`\>

要传递的对象

### opt?

其他替换选项

#### layout?

`string`

#### path?

`string`

cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准

#### style?

`string`

## Returns

`Promise`\<`T`\>

lib/form/functions/createPanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / createPanel

# Function: createPanel()

> **createPanel**\<`T`\>(`rootPanel`, `cls`, `opt`): `Promise`\<\{ `id`: `string`; `vapp`: [`IVApp`](../../core/interfaces/IVApp.md); `vroot`: `T`; \}\>

Defined in: [dist/lib/form.ts:2961](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2961)

创建 panel 对象，一般情况下无需使用

## Type Parameters

### T

`T` *extends* [`AbstractPanel`](../classes/AbstractPanel.md)

## Parameters

### rootPanel

[`AbstractControl`](../../control/classes/AbstractControl.md)

根 panel 控件

### cls

路径字符串或 AbstractPanel 类

`string` | () => `T`

### opt

选项

#### layout?

`string`

布局内容

#### path?

`string`

cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准

#### style?

`string`

样式内容

## Returns

`Promise`\<\{ `id`: `string`; `vapp`: [`IVApp`](../../core/interfaces/IVApp.md); `vroot`: `T`; \}\>

lib/form/functions/dialog.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / dialog

# Function: dialog()

> **dialog**(`current`, `opt`): `Promise`\<`string`\>

Defined in: [dist/lib/form.ts:3837](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L3837)

显示一个 dialog

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前窗体 id

### opt

选项或者一段文字

`string` | [`IFormDialogOptions`](../interfaces/IFormDialogOptions.md)

## Returns

`Promise`\<`string`\>

lib/form/functions/doFocusAndPopEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / doFocusAndPopEvent

# Function: doFocusAndPopEvent()

> **doFocusAndPopEvent**(`e`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:2763](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2763)

点下 pointerdown 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个

## Parameters

### e

`PointerEvent`

事件对象

## Returns

`Promise`\<`void`\>

lib/form/functions/flash.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / flash

# Function: flash()

> **flash**(`current`, `formId`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:4009](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4009)

让窗体闪烁

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属的 taskId

### formId

`string`

要闪烁的窗体 id，必填

## Returns

`Promise`\<`void`\>

lib/form/functions/get.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / get

# Function: get()

> **get**(`formId`): [`IFormInfo`](../interfaces/IFormInfo.md) \| `null`

Defined in: [dist/lib/form.ts:1618](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1618)

获取窗体信息

## Parameters

### formId

`string`

窗体 id

## Returns

[`IFormInfo`](../interfaces/IFormInfo.md) \| `null`

lib/form/functions/getActivePanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getActivePanel

# Function: getActivePanel()

> **getActivePanel**(`formId`): `string`[]

Defined in: [dist/lib/form.ts:1706](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1706)

获取窗体当前活跃中的 panelId 列表

## Parameters

### formId

`string`

要获取的窗体 id

## Returns

`string`[]

lib/form/functions/getFocus.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getFocus

# Function: getFocus()

> **getFocus**(): `string` \| `null`

Defined in: [dist/lib/form.ts:1693](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1693)

获取当前有焦点的窗体 form id

## Returns

`string` \| `null`

lib/form/functions/getHash.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getHash

# Function: getHash()

> **getHash**(`formId`): `string`

Defined in: [dist/lib/form.ts:1794](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1794)

获取窗体的 hash

## Parameters

### formId

`string`

## Returns

`string`

lib/form/functions/getList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getList

# Function: getList()

> **getList**(`taskId`): `Record`\<`string`, [`IFormInfo`](../interfaces/IFormInfo.md)\>

Defined in: [dist/lib/form.ts:1665](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1665)

获取 form list 的简略情况

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 ID

## Returns

`Record`\<`string`, [`IFormInfo`](../interfaces/IFormInfo.md)\>

lib/form/functions/getMaxZIndexID.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getMaxZIndexID

# Function: getMaxZIndexID()

> **getMaxZIndexID**(`current`, `out`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/form.ts:1937](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1937)

获取当前 z-index 值最大的 form id（除了 top 模式的窗体和最小化的窗体）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### out

排除选项

#### formIds?

`string`[]

#### taskIds?

`string`[]

## Returns

`Promise`\<`string` \| `null`\>

lib/form/functions/getRectByBorder.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getRectByBorder

# Function: getRectByBorder()

> **getRectByBorder**(`border`): `object`

Defined in: [dist/lib/form.ts:2001](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2001)

根据 border 方向 获取理论窗体大小

## Parameters

### border

[`TDomBorderCustom`](../../dom/type-aliases/TDomBorderCustom.md)

显示的位置代号

## Returns

`object`

### height

> **height**: `number`

### left

> **left**: `number`

### top

> **top**: `number`

### width

> **width**: `number`

lib/form/functions/getTaskId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getTaskId

# Function: getTaskId()

> **getTaskId**(`formId`): `string`

Defined in: [dist/lib/form.ts:1601](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1601)

根据窗体 id 获取 task id

## Parameters

### formId

`string`

窗体 id

## Returns

`string`

lib/form/functions/hash.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hash

# Function: hash()

> **hash**(`formId`, `hash`): `boolean`

Defined in: [dist/lib/form.ts:1774](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1774)

修改窗体 hash

## Parameters

### formId

`string`

要修改的窗体 ID

### hash

`string`

修改的值，不含 #

## Returns

`boolean`

lib/form/functions/hashBack.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hashBack

# Function: hashBack()

> **hashBack**(`formId`): `Promise`\<`boolean`\>

Defined in: [dist/lib/form.ts:1813](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1813)

将窗体的 hash 退回上一个

## Parameters

### formId

`string`

## Returns

`Promise`\<`boolean`\>

lib/form/functions/hideKeyboard.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hideKeyboard

# Function: hideKeyboard()

> **hideKeyboard**(): `void`

Defined in: [dist/lib/form.ts:1461](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1461)

隐藏系统级虚拟键盘

## Returns

`void`

lib/form/functions/hideLauncher.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hideLauncher

# Function: hideLauncher()

> **hideLauncher**(): `void`

Defined in: [dist/lib/form.ts:4046](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4046)

隐藏 launcher 界面

## Returns

`void`

lib/form/functions/hideNotify.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hideNotify

# Function: hideNotify()

> **hideNotify**(`notifyId`): `void`

Defined in: [dist/lib/form.ts:2393](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2393)

隐藏 notify

## Parameters

### notifyId

`number`

要隐藏的 notify id

## Returns

`void`

lib/form/functions/hidePop.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hidePop

# Function: hidePop()

> **hidePop**(`pop?`): `void`

Defined in: [dist/lib/form.ts:2662](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2662)

隐藏正在显示中的所有 pop，或指定 pop/el

## Parameters

### pop?

`HTMLElement` | [`IVue`](../../core/interfaces/IVue.md)

## Returns

`void`

lib/form/functions/hideRectangle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / hideRectangle

# Function: hideRectangle()

> **hideRectangle**(): `void`

Defined in: [dist/lib/form.ts:2164](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2164)

结束时请隐藏矩形

## Returns

`void`

lib/form/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / init

# Function: init()

> **init**(): `void`

Defined in: [dist/lib/form.ts:4060](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4060)

## Returns

`void`

lib/form/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/form.ts:32](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L32)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/form/functions/isJustPop.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / isJustPop

# Function: isJustPop()

> **isJustPop**(`el`): `boolean`

Defined in: [dist/lib/form.ts:2744](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2744)

检测 pop 是不是刚刚显示的

## Parameters

### el

`number` | `HTMLElement`

## Returns

`boolean`

lib/form/functions/max.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / max

# Function: max()

> **max**(`formId`): `boolean`

Defined in: [dist/lib/form.ts:1509](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1509)

最大化某个窗体

## Parameters

### formId

`string`

窗体 id

## Returns

`boolean`

lib/form/functions/min.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / min

# Function: min()

> **min**(`formId`): `boolean`

Defined in: [dist/lib/form.ts:1501](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1501)

最小化某个窗体

## Parameters

### formId

`string`

窗体 id

## Returns

`boolean`

lib/form/functions/moveRectangle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / moveRectangle

# Function: moveRectangle()

> **moveRectangle**(`border`): `void`

Defined in: [dist/lib/form.ts:2111](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2111)

移动矩形到新位置

## Parameters

### border

[`TDomBorderCustom`](../../dom/type-aliases/TDomBorderCustom.md)

显示的位置代号

## Returns

`void`

lib/form/functions/notify.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / notify

# Function: notify()

> **notify**(`opt`): `number`

Defined in: [dist/lib/form.ts:2239](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2239)

弹出右下角信息框

## Parameters

### opt

[`INotifyOptions`](../interfaces/INotifyOptions.md)

timeout 默认 5 秒，最大 10 分钟

## Returns

`number`

notify id，一定大于 0

lib/form/functions/notifyContent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / notifyContent

# Function: notifyContent()

> **notifyContent**(`notifyId`, `opt`): `void`

Defined in: [dist/lib/form.ts:2353](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2353)

修改 notify 的提示信息

## Parameters

### notifyId

`number`

notify id

### opt

[`INotifyContentOptions`](../interfaces/INotifyContentOptions.md)

参数

## Returns

`void`

lib/form/functions/notifyProgress.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / notifyProgress

# Function: notifyProgress()

> **notifyProgress**(`notifyId`, `per`): `void`

Defined in: [dist/lib/form.ts:2322](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2322)

修改 notify 的进度条进度

## Parameters

### notifyId

`number`

notify id

### per

`number`

进度，0 - 100 或 0% - 100% (0 - 1)

## Returns

`void`

lib/form/functions/prompt.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / prompt

# Function: prompt()

> **prompt**(`current`, `opt`): `Promise`\<`string`\>

Defined in: [dist/lib/form.ts:3949](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L3949)

显示一个输入框 dialog

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### opt

选项或者提示文字

`string` | [`IFormPromptOptions`](../interfaces/IFormPromptOptions.md)

## Returns

`Promise`\<`string`\>

lib/form/functions/refreshMaxPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / refreshMaxPosition

# Function: refreshMaxPosition()

> **refreshMaxPosition**(): `void`

Defined in: [dist/lib/form.ts:1567](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1567)

重置所有已经最大化的窗体大小和位置

## Returns

`void`

lib/form/functions/remove.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / remove

# Function: remove()

> **remove**(`formId`): `boolean`

Defined in: [dist/lib/form.ts:2832](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2832)

移除一个 form（关闭窗口）

## Parameters

### formId

`string`

要移除的 form id

## Returns

`boolean`

lib/form/functions/removeActivePanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / removeActivePanel

# Function: removeActivePanel()

> **removeActivePanel**(`current`, `formId`, `panelId`): `boolean`

Defined in: [dist/lib/form.ts:1716](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1716)

移除 form 中正在活跃中的 panel id （panel 本身被置于隐藏时）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### formId

`string`

所属 form id

### panelId

`string`

panel id

## Returns

`boolean`

lib/form/functions/removeFromPop.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / removeFromPop

# Function: removeFromPop()

> **removeFromPop**(`el`): `void`

Defined in: [dist/lib/form.ts:2435](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2435)

将标签从 pop 层移除

## Parameters

### el

`HTMLElement`

要移除的标签

## Returns

`void`

lib/form/functions/removePanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / removePanel

# Function: removePanel()

> **removePanel**(`id`, `vapp`, `el`): `boolean`

Defined in: [dist/lib/form.ts:2904](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2904)

移除 panel 挂载，通常发生在 panel 控件的 onBeforeUnmount 中

## Parameters

### id

`string`

panel id

### vapp

[`IVApp`](../../core/interfaces/IVApp.md)

panel 的 vapp 对象

### el

`HTMLElement`

panel 控件

## Returns

`boolean`

lib/form/functions/send.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / send

# Function: send()

> **send**(`formId`, `obj`): `void`

Defined in: [dist/lib/form.ts:1648](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1648)

给一个窗体发送一个对象，不会知道成功与失败状态，用 this.send 替代

## Parameters

### formId

`string`

要接收对象的 form id

### obj

`Record`\<`string`, `any`\>

要发送的对象

## Returns

`void`

lib/form/functions/setActivePanel.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / setActivePanel

# Function: setActivePanel()

> **setActivePanel**(`current`, `formId`, `panelId`): `boolean`

Defined in: [dist/lib/form.ts:1747](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1747)

将 form 中某个 panel 设置为活动的

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### formId

`string`

所属 form id

### panelId

`string`

panel id

## Returns

`boolean`

lib/form/functions/showCircular.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showCircular

# Function: showCircular()

> **showCircular**(`x`, `y`): `void`

Defined in: [dist/lib/form.ts:2086](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2086)

显示从小到大的圆圈动画特效对象

## Parameters

### x

`number`

X 坐标

### y

`number`

Y 坐标

## Returns

`void`

lib/form/functions/showKeyboard.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showKeyboard

# Function: showKeyboard()

> **showKeyboard**(): `void`

Defined in: [dist/lib/form.ts:1444](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1444)

显示系统级虚拟键盘

## Returns

`void`

lib/form/functions/showLauncher.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showLauncher

# Function: showLauncher()

> **showLauncher**(): `void`

Defined in: [dist/lib/form.ts:4036](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4036)

显示 launcher 界面

## Returns

`void`

lib/form/functions/showPop.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showPop

# Function: showPop()

> **showPop**(`el`, `pop`, `direction`, `opt`): `void`

Defined in: [dist/lib/form.ts:2548](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2548)

获取 pop 显示出来的坐标并报系统全局记录

## Parameters

### el

响应的元素

`HTMLElement` | [`IVue`](../../core/interfaces/IVue.md)

### pop

要显示 pop 元素

`HTMLElement` | [`IVue`](../../core/interfaces/IVue.md) | `undefined`

### direction

要显示方向（以 $el 为准的 h 水平 v 垂直 t 垂直水平居中）或坐标

`"v"` | `PointerEvent` | `"t"` | `"h"` | \{ `x`: `number`; `y`: `number`; \}

### opt

width / height 显示的 pop 定义自定义宽/高度，可省略；null，true 代表为空也会显示，默认为 false; autoPosition, 因 pop 内部内容变动导致的自动更新 pop 位置，默认 false，autoScroll，因原元素位置变更导致 pop 位置变更，默认 false，flow: 是否加入 pop 流，默认加入，不加入的话将不会自动隐藏

#### autoPosition?

`boolean`

#### autoScroll?

`boolean`

#### flow?

`boolean`

#### null?

`boolean`

#### size?

\{ `height?`: `number`; `width?`: `number`; \}

#### size.height?

`number`

#### size.width?

`number`

#### way?

`"click"` \| `"normal"` \| `"hover"`

展示托管方式

## Returns

`void`

lib/form/functions/showRectangle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / showRectangle

# Function: showRectangle()

> **showRectangle**(`x`, `y`, `border`): `void`

Defined in: [dist/lib/form.ts:2141](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2141)

显示从小到大的矩形动画特效对象

## Parameters

### x

`number`

起始位置

### y

`number`

起始位置

### border

[`TDomBorderCustom`](../../dom/type-aliases/TDomBorderCustom.md)

最大时位置代号

## Returns

`void`

lib/form/functions/superConfirm.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / superConfirm

# Function: superConfirm()

> **superConfirm**(`current`, `html`): `Promise`\<`boolean`\>

Defined in: [dist/lib/form.ts:1423](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1423)

显示系统级询问框

## Parameters

### current

`string`

### html

`string`

## Returns

`Promise`\<`boolean`\>

lib/form/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/form

# lib/form

## Classes

- [AbstractForm](classes/AbstractForm.md)
- [AbstractPanel](classes/AbstractPanel.md)

## Interfaces

- [IAbstractPanelQsChangeShowEvent](interfaces/IAbstractPanelQsChangeShowEvent.md)
- [IAbstractPanelShowEvent](interfaces/IAbstractPanelShowEvent.md)
- [IForm](interfaces/IForm.md)
- [IFormConfirmOptions](interfaces/IFormConfirmOptions.md)
- [IFormDialogOptions](interfaces/IFormDialogOptions.md)
- [IFormDialogSelectEvent](interfaces/IFormDialogSelectEvent.md)
- [IFormInfo](interfaces/IFormInfo.md)
- [IFormPromptOptions](interfaces/IFormPromptOptions.md)
- [IFormPromptSelectEvent](interfaces/IFormPromptSelectEvent.md)
- [IMoveDragOptions](interfaces/IMoveDragOptions.md)
- [INotifyContentOptions](interfaces/INotifyContentOptions.md)
- [INotifyOptions](interfaces/INotifyOptions.md)

## Variables

- [activePanels](variables/activePanels.md)
- [elements](variables/elements.md)
- [launcherRoot](variables/launcherRoot.md)
- [simpleSystemTaskRoot](variables/simpleSystemTaskRoot.md)

## Functions

- [alert](functions/alert.md)
- [appendToPop](functions/appendToPop.md)
- [bindDrag](functions/bindDrag.md)
- [bindResize](functions/bindResize.md)
- [changeFocus](functions/changeFocus.md)
- [changeFocusMaxZIndex](functions/changeFocusMaxZIndex.md)
- [close](functions/close.md)
- [confirm](functions/confirm.md)
- [create](functions/create.md)
- [createPanel](functions/createPanel.md)
- [dialog](functions/dialog.md)
- [doFocusAndPopEvent](functions/doFocusAndPopEvent.md)
- [flash](functions/flash.md)
- [get](functions/get.md)
- [getActivePanel](functions/getActivePanel.md)
- [getFocus](functions/getFocus.md)
- [getHash](functions/getHash.md)
- [getList](functions/getList.md)
- [getMaxZIndexID](functions/getMaxZIndexID.md)
- [getRectByBorder](functions/getRectByBorder.md)
- [getTaskId](functions/getTaskId.md)
- [hash](functions/hash.md)
- [hashBack](functions/hashBack.md)
- [hideKeyboard](functions/hideKeyboard.md)
- [hideLauncher](functions/hideLauncher.md)
- [hideNotify](functions/hideNotify.md)
- [hidePop](functions/hidePop.md)
- [hideRectangle](functions/hideRectangle.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [isJustPop](functions/isJustPop.md)
- [max](functions/max.md)
- [min](functions/min.md)
- [moveRectangle](functions/moveRectangle.md)
- [notify](functions/notify.md)
- [notifyContent](functions/notifyContent.md)
- [notifyProgress](functions/notifyProgress.md)
- [prompt](functions/prompt.md)
- [refreshMaxPosition](functions/refreshMaxPosition.md)
- [remove](functions/remove.md)
- [removeActivePanel](functions/removeActivePanel.md)
- [removeFromPop](functions/removeFromPop.md)
- [removePanel](functions/removePanel.md)
- [send](functions/send.md)
- [setActivePanel](functions/setActivePanel.md)
- [showCircular](functions/showCircular.md)
- [showKeyboard](functions/showKeyboard.md)
- [showLauncher](functions/showLauncher.md)
- [showPop](functions/showPop.md)
- [showRectangle](functions/showRectangle.md)
- [superConfirm](functions/superConfirm.md)

lib/form/interfaces/IAbstractPanelQsChangeShowEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IAbstractPanelQsChangeShowEvent

# Interface: IAbstractPanelQsChangeShowEvent

Defined in: [dist/lib/form.ts:4086](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4086)

AbstractPanel qsChange 显示事件

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4087](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4087)

#### action

> **action**: `"forword"` \| `"back"`

仅 nav 联动时有效，代表是前进还是回退

#### data

> **data**: `Record`\<`string`, `any`\>

#### nav

> **nav**: `boolean`

是否是 nav 模式

#### previous

> **previous**: `string`

仅 nav 联动时有效，代表上一个的 formHash 的值

#### qsChange

> **qsChange**: `boolean`

仅 nav 联动时有效，代表本次 qs 是否发生了变化

lib/form/interfaces/IAbstractPanelShowEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IAbstractPanelShowEvent

# Interface: IAbstractPanelShowEvent

Defined in: [dist/lib/form.ts:4071](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4071)

AbstractPanel 显示事件

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4072](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4072)

#### action

> **action**: `"forword"` \| `"back"`

仅 nav 联动时有效，代表是前进还是回退

#### data

> **data**: `Record`\<`string`, `any`\>

#### nav

> **nav**: `boolean`

是否是 nav 模式

#### previous

> **previous**: `string`

仅 nav 联动时有效，代表上一个的 formHash 的值

#### qsChange

> **qsChange**: `boolean`

仅 nav 联动时有效，代表本次 show 的时候 qs 是否发生了变化

lib/form/interfaces/IForm.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IForm

# Interface: IForm

Defined in: [dist/lib/form.ts:4101](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4101)

运行时 task 中的 form 对象

## Properties

### closed

> **closed**: `boolean`

Defined in: [dist/lib/form.ts:4106](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4106)

是否已经执行过了关闭窗体方法，此处加判断为了防止重复执行 close 导致的 bug

***

### id

> **id**: `string`

Defined in: [dist/lib/form.ts:4102](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4102)

***

### vapp

> **vapp**: [`IVApp`](../../core/interfaces/IVApp.md)

Defined in: [dist/lib/form.ts:4103](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4103)

***

### vroot

> **vroot**: [`IVue`](../../core/interfaces/IVue.md)

Defined in: [dist/lib/form.ts:4104](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4104)

lib/form/interfaces/IFormConfirmOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormConfirmOptions

# Interface: IFormConfirmOptions

Defined in: [dist/lib/form.ts:4192](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4192)

Confirm 选项

## Properties

### cancel?

> `optional` **cancel**: `boolean`

Defined in: [dist/lib/form.ts:4195](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4195)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4194](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4194)

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4193](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4193)

lib/form/interfaces/IFormDialogOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [dist/lib/form.ts:4155](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4155)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [dist/lib/form.ts:4159](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4159)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [dist/lib/form.ts:4158](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4158)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4157](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4157)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:4165](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4165)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [dist/lib/form.ts:4161](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4161)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [dist/lib/form.ts:4162](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4162)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [dist/lib/form.ts:4167](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4167)

传值，需要用 methods.x 读取

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/form.ts:4171](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4171)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4178](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4178)

点击按钮触发事件

#### Parameters

##### this

[`AbstractForm`](../classes/AbstractForm.md) & `object`

##### e

[`IFormDialogSelectEvent`](IFormDialogSelectEvent.md)

数据事件

##### button

`string`

按钮的文本

#### Returns

`void`

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/form.ts:4169](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4169)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4156](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4156)

lib/form/interfaces/IFormDialogSelectEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogSelectEvent

# Interface: IFormDialogSelectEvent

Defined in: [dist/lib/form.ts:4185](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4185)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4186](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4186)

#### button

> **button**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

lib/form/interfaces/IFormInfo.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormInfo

# Interface: IFormInfo

Defined in: [dist/lib/form.ts:4110](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4110)

Form 的简略情况，通常在 list 当中

## Properties

### focus

> **focus**: `boolean`

Defined in: [dist/lib/form.ts:4117](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4117)

***

### icon

> **icon**: `string`

Defined in: [dist/lib/form.ts:4113](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4113)

***

### show

> **show**: `boolean`

Defined in: [dist/lib/form.ts:4116](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4116)

***

### showInSystemTask

> **showInSystemTask**: `boolean`

Defined in: [dist/lib/form.ts:4118](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4118)

***

### stateMax

> **stateMax**: `boolean`

Defined in: [dist/lib/form.ts:4114](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4114)

***

### stateMin

> **stateMin**: `boolean`

Defined in: [dist/lib/form.ts:4115](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4115)

***

### taskId

> **taskId**: `string`

Defined in: [dist/lib/form.ts:4111](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4111)

***

### title

> **title**: `string`

Defined in: [dist/lib/form.ts:4112](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4112)

lib/form/interfaces/IFormPromptOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [dist/lib/form.ts:4199](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4199)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel**: `boolean`

Defined in: [dist/lib/form.ts:4207](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4207)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4203](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4203)

内容说明

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4214](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4214)

点击按钮触发事件

#### Parameters

##### this

[`AbstractForm`](../classes/AbstractForm.md) & `object`

##### e

[`IFormPromptSelectEvent`](IFormPromptSelectEvent.md)

数据事件

##### button

`boolean`

true 代表确定，false 代表取消

#### Returns

`void`

***

### text?

> `optional` **text**: `string`

Defined in: [dist/lib/form.ts:4205](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4205)

文本默认值

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4201](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4201)

标题

lib/form/interfaces/IFormPromptSelectEvent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptSelectEvent

# Interface: IFormPromptSelectEvent

Defined in: [dist/lib/form.ts:4221](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4221)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4222)

#### button

> **button**: `boolean`

true 代表确定，false 代表取消

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

lib/form/interfaces/IMoveDragOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IMoveDragOptions

# Interface: IMoveDragOptions

Defined in: [dist/lib/form.ts:4122](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4122)

移动 drag 到新位置函数的选项

## Properties

### height?

> `optional` **height**: `number`

Defined in: [dist/lib/form.ts:4126](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4126)

***

### icon?

> `optional` **icon**: `boolean`

Defined in: [dist/lib/form.ts:4127](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4127)

***

### left?

> `optional` **left**: `number`

Defined in: [dist/lib/form.ts:4124](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4124)

***

### top?

> `optional` **top**: `number`

Defined in: [dist/lib/form.ts:4123](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4123)

***

### width?

> `optional` **width**: `number`

Defined in: [dist/lib/form.ts:4125](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4125)

lib/form/interfaces/INotifyContentOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / INotifyContentOptions

# Interface: INotifyContentOptions

Defined in: [dist/lib/form.ts:4144](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4144)

notify 信息框的修改选项

## Properties

### content?

> `optional` **content**: `string`

Defined in: [dist/lib/form.ts:4146](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4146)

***

### note?

> `optional` **note**: `string`

Defined in: [dist/lib/form.ts:4147](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4147)

***

### progress?

> `optional` **progress**: `number`

Defined in: [dist/lib/form.ts:4149](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4149)

可顺便修改进度

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/form.ts:4151](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4151)

设置后将在 x 毫秒后隐藏，这不会大于创建时的设置的总时长

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4145](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4145)

lib/form/interfaces/INotifyOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / INotifyOptions

# Interface: INotifyOptions

Defined in: [dist/lib/form.ts:4131](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4131)

弹出 notify 信息框的选项

## Properties

### content?

> `optional` **content**: `string`

Defined in: [dist/lib/form.ts:4134](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4134)

正文

***

### icon?

> `optional` **icon**: `string` \| `null`

Defined in: [dist/lib/form.ts:4137](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4137)

***

### note?

> `optional` **note**: `string`

Defined in: [dist/lib/form.ts:4136](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4136)

浅色描述

***

### progress?

> `optional` **progress**: `boolean`

Defined in: [dist/lib/form.ts:4140](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4140)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/form.ts:4138](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4138)

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4132](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4132)

***

### type?

> `optional` **type**: `"progress"` \| `"info"` \| `"warning"` \| `"danger"` \| `"primary"`

Defined in: [dist/lib/form.ts:4139](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4139)

lib/form/variables/activePanels.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / activePanels

# Variable: activePanels

> `const` **activePanels**: `Record`\<`string`, `string`[]\> = `{}`

Defined in: [dist/lib/form.ts:1700](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1700)

当前活跃中的 panelId 列表

lib/form/variables/elements.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / elements

# Variable: elements

> `const` **elements**: `object`

Defined in: [dist/lib/form.ts:929](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L929)

## Type Declaration

### alert

> **alert**: `HTMLElement`

### circular

> **circular**: `HTMLDivElement`

### confirm

> **confirm**: `HTMLDivElement`

### init()

> **init**: () => `void`

#### Returns

`void`

### keyboard

> **keyboard**: `HTMLDivElement`

### launcher

> **launcher**: `HTMLDivElement`

### list

> **list**: `HTMLDivElement`

### notify

> **notify**: `HTMLElement`

### popList

> **popList**: `HTMLDivElement`

### rectangle

> **rectangle**: `HTMLDivElement`

### simpletask

> **simpletask**: `HTMLDivElement`

### wrap

> **wrap**: `HTMLDivElement`

lib/form/variables/launcherRoot.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / launcherRoot

# Variable: launcherRoot

> **launcherRoot**: [`IVue`](../../core/interfaces/IVue.md)

Defined in: [dist/lib/form.ts:924](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L924)

lib/form/variables/simpleSystemTaskRoot.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / simpleSystemTaskRoot

# Variable: simpleSystemTaskRoot

> **simpleSystemTaskRoot**: [`IVue`](../../core/interfaces/IVue.md)

Defined in: [dist/lib/form.ts:923](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L923)

lib/fs/functions/chmod.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / chmod

# Function: chmod()

> **chmod**(`current`, `path`, `mod`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:958](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L958)

修改权限

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要修改的路径

### mod

权限

`string` | `number`

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/copyFile.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / copyFile

# Function: copyFile()

> **copyFile**(`current`, `src`, `dest`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1351)

复制文件

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### src

`string`

源文件

### dest

`string`

目标文件

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/copyFolder.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / copyFolder

# Function: copyFolder()

> **copyFolder**(`current`, `from`, `to`, `ignore`): `Promise`\<`number`\>

Defined in: [dist/lib/fs.ts:1300](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1300)

复制文件夹里的内容到另一个地方，失败不会回滚

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### from

`string`

源，末尾加 /

### to

`string`

目标，末尾加 /

### ignore

`RegExp`[] = `[]`

忽略的文件

## Returns

`Promise`\<`number`\>

lib/fs/functions/getContent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / getContent

# Function: getContent()

读取完整文件或一段

## Param

当前任务 id（可传 null 将只读取完全公开数据，如 clickgo 文件夹）

## Param

文件路径

## Param

编码或选项

## Call Signature

> **getContent**(`current`, `path`, `options?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/fs.ts:129](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L129)

### Parameters

#### current

[`TCurrent`](../../core/type-aliases/TCurrent.md) | `null`

#### path

`string`

#### options?

##### after?

`string`

网络模式下携带后缀，如 ?123

##### end?

`number`

##### progress?

(`loaded`, `total`) => `void` \| `Promise`\<`void`\>

##### start?

`number`

### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

## Call Signature

> **getContent**(`current`, `path`, `options`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/fs.ts:136](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L136)

### Parameters

#### current

[`TCurrent`](../../core/type-aliases/TCurrent.md) | `null`

#### path

`string`

#### options

`BufferEncoding` | \{ `encoding`: `BufferEncoding`; `end?`: `number`; `progress?`: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>; `start?`: `number`; \}

### Returns

`Promise`\<`string` \| `null`\>

lib/fs/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/fs.ts:22](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L22)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/fs/functions/isDir.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / isDir

# Function: isDir()

> **isDir**(`current`, `path`): `Promise`\<`false` \| [`IStats`](../interfaces/IStats.md)\>

Defined in: [dist/lib/fs.ts:800](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L800)

判断是否是目录或目录是否存在，是的话返回 stats

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

判断路径

## Returns

`Promise`\<`false` \| [`IStats`](../interfaces/IStats.md)\>

lib/fs/functions/isFile.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / isFile

# Function: isFile()

> **isFile**(`current`, `path`): `Promise`\<`false` \| [`IStats`](../interfaces/IStats.md)\>

Defined in: [dist/lib/fs.ts:813](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L813)

判断是否是文件或文件是否存在，是的话返回 stats

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

判断路径

## Returns

`Promise`\<`false` \| [`IStats`](../interfaces/IStats.md)\>

lib/fs/functions/mkdir.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / mkdir

# Function: mkdir()

> **mkdir**(`current`, `path`, `mode`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:827](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L827)

深度创建目录，如果最末目录存在，则自动创建成功

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要创建的路径，如 /a/b/c/

### mode

`number` = `0o755`

权限

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/mount.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / mount

# Function: mount()

> **mount**(`current`, `name`, `handler`): `boolean`

Defined in: [dist/lib/fs.ts:89](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L89)

挂载到 mounted 目录下

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### name

`string`

目录名

### handler

[`IMountHandler`](../interfaces/IMountHandler.md)

回调相关

## Returns

`boolean`

lib/fs/functions/putContent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / putContent

# Function: putContent()

> **putContent**(`current`, `path`, `data`, `options`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:298](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L298)

写入文件内容

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

文件路径

### data

要写入的内容

`string` | `Blob`

### options

选项

#### encoding?

`BufferEncoding` \| `null`

#### flag?

`string` \| `number`

#### mode?

`string` \| `number`

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/readDir.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / readDir

# Function: readDir()

> **readDir**(`current`, `path`, `encoding?`): `Promise`\<[`IDirent`](../interfaces/IDirent.md)[]\>

Defined in: [dist/lib/fs.ts:1063](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1063)

获取文件夹下文件列表

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

文件夹路径

### encoding?

`BufferEncoding`

编码

## Returns

`Promise`\<[`IDirent`](../interfaces/IDirent.md)[]\>

lib/fs/functions/readLink.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / readLink

# Function: readLink()

> **readLink**(`current`, `path`, `encoding?`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/fs.ts:352](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L352)

读取链接的 target

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要读取的路径

### encoding?

`BufferEncoding`

编码

## Returns

`Promise`\<`string` \| `null`\>

lib/fs/functions/rename.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / rename

# Function: rename()

> **rename**(`current`, `oldPath`, `newPath`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1004](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1004)

重命名/移动 文件文件夹

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### oldPath

`string`

老名

### newPath

`string`

新名

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/rmdir.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / rmdir

# Function: rmdir()

> **rmdir**(`current`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L875)

删除空目录

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要删除的目录

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/rmdirDeep.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / rmdirDeep

# Function: rmdirDeep()

> **rmdirDeep**(`current`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:921](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L921)

删除一个非空目录
[ Danger ] [ 危险 ]

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

目录路径

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/stats.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / stats

# Function: stats()

> **stats**(`current`, `path`): `Promise`\<[`IStats`](../interfaces/IStats.md) \| `null`\>

Defined in: [dist/lib/fs.ts:578](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L578)

获取对象是否存在，存在则返回 stats 对象，否则返回 null

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

对象路径

## Returns

`Promise`\<[`IStats`](../interfaces/IStats.md) \| `null`\>

lib/fs/functions/symlink.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / symlink

# Function: symlink()

> **symlink**(`current`, `filePath`, `linkPath`, `type?`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:401](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L401)

把源文件创建一个 link

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### filePath

`string`

源文件

### linkPath

`string`

连接路径

### type?

选项

`"dir"` | `"file"` | `"junction"`

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/unlink.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / unlink

# Function: unlink()

> **unlink**(`current`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:453](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L453)

删除一个文件

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### path

`string`

要删除的文件路径

## Returns

`Promise`\<`boolean`\>

lib/fs/functions/unmount.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / unmount

# Function: unmount()

> **unmount**(`name`): `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:117](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L117)

卸载 mounted

## Parameters

### name

`string`

目录名

## Returns

`Promise`\<`boolean`\>

lib/fs/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/fs

# lib/fs

## Interfaces

- [IDirent](interfaces/IDirent.md)
- [IMountHandler](interfaces/IMountHandler.md)
- [IStats](interfaces/IStats.md)

## Functions

- [chmod](functions/chmod.md)
- [copyFile](functions/copyFile.md)
- [copyFolder](functions/copyFolder.md)
- [getContent](functions/getContent.md)
- [initSysId](functions/initSysId.md)
- [isDir](functions/isDir.md)
- [isFile](functions/isFile.md)
- [mkdir](functions/mkdir.md)
- [mount](functions/mount.md)
- [putContent](functions/putContent.md)
- [readDir](functions/readDir.md)
- [readLink](functions/readLink.md)
- [rename](functions/rename.md)
- [rmdir](functions/rmdir.md)
- [rmdirDeep](functions/rmdirDeep.md)
- [stats](functions/stats.md)
- [symlink](functions/symlink.md)
- [unlink](functions/unlink.md)
- [unmount](functions/unmount.md)

lib/fs/interfaces/IDirent.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IDirent

# Interface: IDirent

Defined in: [dist/lib/fs.ts:1450](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1450)

目录下项目

## Properties

### name

> **name**: `string`

Defined in: [dist/lib/fs.ts:1454](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1454)

## Methods

### isDirectory()

> **isDirectory**(): `boolean`

Defined in: [dist/lib/fs.ts:1452](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1452)

#### Returns

`boolean`

***

### isFile()

> **isFile**(): `boolean`

Defined in: [dist/lib/fs.ts:1451](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1451)

#### Returns

`boolean`

***

### isSymbolicLink()

> **isSymbolicLink**(): `boolean`

Defined in: [dist/lib/fs.ts:1453](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1453)

#### Returns

`boolean`

lib/fs/interfaces/IMountHandler.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IMountHandler

# Interface: IMountHandler

Defined in: [dist/lib/fs.ts:1406](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1406)

## Properties

### chmod()?

> `optional` **chmod**: (`path`, `mod`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1426](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1426)

#### Parameters

##### path

`string`

##### mod

`string` | `number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### copyFile()?

> `optional` **copyFile**: (`src`, `dest`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1429](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1429)

#### Parameters

##### src

`string`

##### dest

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### date?

> `optional` **date**: `Date`

Defined in: [dist/lib/fs.ts:1408](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1408)

挂载时间，无需设置

***

### getContent()?

> `optional` **getContent**: (`path`, `options?`) => `string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1409](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1409)

#### Parameters

##### path

`string`

##### options?

`BufferEncoding` | \{ `encoding?`: BufferEncoding \| undefined; `end?`: `number`; `progress?`: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>; `start?`: `number`; \}

#### Returns

`string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

***

### mkdir()?

> `optional` **mkdir**: (`path`, `mode?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1424](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1424)

#### Parameters

##### path

`string`

##### mode?

`number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### putContent()?

> `optional` **putContent**: (`path`, `data`, `options?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1415](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1415)

#### Parameters

##### path

`string`

##### data

`string` | `Blob`

##### options?

###### encoding?

`BufferEncoding` \| `null`

###### flag?

`string` \| `number`

###### mode?

`string` \| `number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### readDir()?

> `optional` **readDir**: (`path`, `encoding?`) => [`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

Defined in: [dist/lib/fs.ts:1428](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1428)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

[`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

***

### readLink()?

> `optional` **readLink**: (`path`, `encoding?`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1420](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1420)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### rename()?

> `optional` **rename**: (`oldPath`, `newPath`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1427](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1427)

#### Parameters

##### oldPath

`string`

##### newPath

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### rmdir()?

> `optional` **rmdir**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1425](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1425)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### stats()?

> `optional` **stats**: (`path`) => [`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1423](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1423)

#### Parameters

##### path

`string`

#### Returns

[`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

***

### symlink()?

> `optional` **symlink**: (`filePath`, `linkPath`, `type?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1421](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1421)

#### Parameters

##### filePath

`string`

##### linkPath

`string`

##### type?

`"dir"` | `"file"` | `"junction"`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### unlink()?

> `optional` **unlink**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1422](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1422)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

lib/fs/interfaces/IStats.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IStats

# Interface: IStats

Defined in: [dist/lib/fs.ts:1433](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1433)

文件/文件夹信息对象

## Properties

### atime

> **atime**: `Date`

Defined in: [dist/lib/fs.ts:1443](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1443)

***

### atimeMs

> **atimeMs**: `number`

Defined in: [dist/lib/fs.ts:1439](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1439)

***

### birthtime

> **birthtime**: `Date`

Defined in: [dist/lib/fs.ts:1446](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1446)

***

### birthtimeMs

> **birthtimeMs**: `number`

Defined in: [dist/lib/fs.ts:1442](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1442)

***

### blksize

> **blksize**: `number`

Defined in: [dist/lib/fs.ts:1438](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1438)

***

### ctime

> **ctime**: `Date`

Defined in: [dist/lib/fs.ts:1445](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1445)

***

### ctimeMs

> **ctimeMs**: `number`

Defined in: [dist/lib/fs.ts:1441](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1441)

***

### mtime

> **mtime**: `Date`

Defined in: [dist/lib/fs.ts:1444](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1444)

***

### mtimeMs

> **mtimeMs**: `number`

Defined in: [dist/lib/fs.ts:1440](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1440)

***

### size

> **size**: `number`

Defined in: [dist/lib/fs.ts:1437](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1437)

## Methods

### isDirectory()

> **isDirectory**(): `boolean`

Defined in: [dist/lib/fs.ts:1435](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1435)

#### Returns

`boolean`

***

### isFile()

> **isFile**(): `boolean`

Defined in: [dist/lib/fs.ts:1434](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1434)

#### Returns

`boolean`

***

### isSymbolicLink()

> **isSymbolicLink**(): `boolean`

Defined in: [dist/lib/fs.ts:1436](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1436)

#### Returns

`boolean`

lib/native/functions/activate.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / activate

# Function: activate()

> **activate**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:281](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L281)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`boolean`\>

lib/native/functions/clear.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / clear

# Function: clear()

> **clear**(`taskId`, `formId?`): `void`

Defined in: [dist/lib/native.ts:141](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L141)

清除某个窗体或某个任务的所有事件监听

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要清除的任务 ID

### formId?

`string`

窗体 ID，留空为清除任务的所有事件

## Returns

`void`

lib/native/functions/close.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / close

# Function: close()

> **close**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:293](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L293)

关闭当前 native 真实窗体，根据配置整个 native 任务可能结束也可能保留 node 不结束

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

## Returns

`Promise`\<`boolean`\>

lib/native/functions/dialog.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / dialog

# Function: dialog()

> **dialog**(`options`): `Promise`\<`number`\>

Defined in: [dist/lib/native.ts:360](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L360)

弹出消息框

## Parameters

### options

选项

`string` | \{ `buttons?`: `string`[]; `detail?`: `string`; `message?`: `string`; `title?`: `string`; `type?`: `"error"` \| `"info"` \| `"question"` \| `"warning"`; \}

## Returns

`Promise`\<`number`\>

点击的按钮索引

lib/native/functions/getListenerList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / getListenerList

# Function: getListenerList()

> **getListenerList**(`taskId?`): `Record`\<`string`, `Record`\<`string`, `Record`\<`string`, `number`\>\>\>

Defined in: [dist/lib/native.ts:164](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L164)

获取监听 native 事件的监听统计信息列表

## Parameters

### taskId?

[`TCurrent`](../../core/type-aliases/TCurrent.md)

为 undefined 则返回所有

## Returns

`Record`\<`string`, `Record`\<`string`, `Record`\<`string`, `number`\>\>\>

lib/native/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / init

# Function: init()

> **init**(): `void`

Defined in: [dist/lib/native.ts:391](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L391)

## Returns

`void`

lib/native/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/native.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L28)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/native/functions/invoke.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / invoke

# Function: invoke()

> **invoke**(`name`, ...`param`): `Promise`\<`any`\>

Defined in: [dist/lib/native.ts:205](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L205)

向 native 发送指令

## Parameters

### name

`string`

指令名

### param

...`any`[]

参数

## Returns

`Promise`\<`any`\>

lib/native/functions/invokeSys.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / invokeSys

# Function: invokeSys()

> **invokeSys**(`current`, `name`, ...`param`): `Promise`\<`any`\>

Defined in: [dist/lib/native.ts:218](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L218)

向 native 发送指令（系统级）

## Parameters

### current

`string`

仅支持 sysId

### name

`string`

指令名

### param

...`any`[]

参数

## Returns

`Promise`\<`any`\>

lib/native/functions/isMax.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / isMax

# Function: isMax()

> **isMax**(): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:384](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L384)

判断窗体是否是最大化状态

## Returns

`Promise`\<`boolean`\>

lib/native/functions/max.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / max

# Function: max()

> **max**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:247](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L247)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`boolean`\>

lib/native/functions/maximizable.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / maximizable

# Function: maximizable()

> **maximizable**(`current`, `val`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:301](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L301)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

### val

`boolean`

## Returns

`Promise`\<`boolean`\>

lib/native/functions/min.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / min

# Function: min()

> **min**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:255](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L255)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`boolean`\>

lib/native/functions/off.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / off

# Function: off()

> **off**(`current`, `name`, `formId?`): `void`

Defined in: [dist/lib/native.ts:122](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L122)

解绑监听的方法

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### name

`string`

方法名

### formId?

`string`

要清除的窗体的 ID

## Returns

`void`

lib/native/functions/on.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / on

# Function: on()

> **on**(`current`, `name`, `handler`, `once`, `formId?`): `void`

Defined in: [dist/lib/native.ts:78](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L78)

监听 native 传输过来的事件

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### name

`string`

事件名

### handler

(...`param`) => `any`

回调函数

### once

`boolean` = `false`

是否只监听一次

### formId?

`string`

限定某个窗体

## Returns

`void`

lib/native/functions/once.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / once

# Function: once()

> **once**(`current`, `name`, `handler`, `formId?`): `void`

Defined in: [dist/lib/native.ts:107](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L107)

监听 native 传输过来的事件（仅一次）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### name

`string`

事件名

### handler

(...`param`) => `any`

回调函数

### formId?

`string`

限定某个窗体

## Returns

`void`

lib/native/functions/open.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / open

# Function: open()

> **open**(`options`): `Promise`\<`string`[] \| `null`\>

Defined in: [dist/lib/native.ts:316](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L316)

弹出文件选择框

## Parameters

### options

选项

#### filters?

`object`[]

筛选的文件类型

#### path?

`string`

默认路径，不含 /storage/，如 /d/

#### props?

\{ `directory?`: `boolean`; `file?`: `boolean`; `multi?`: `boolean`; \}

#### props.directory?

`boolean`

允许选择文件夹，默认 false

#### props.file?

`boolean`

允许选择文件，默认 true

#### props.multi?

`boolean`

允许多选，默认 false

## Returns

`Promise`\<`string`[] \| `null`\>

选择的文件路径列表，不含 /storage/

lib/native/functions/ping.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / ping

# Function: ping()

> **ping**(`val`): `Promise`\<`string`\>

Defined in: [dist/lib/native.ts:377](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L377)

测试与 native 的连通性

## Parameters

### val

`string`

测试字符串

## Returns

`Promise`\<`string`\>

测试字符串

lib/native/functions/quit.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / quit

# Function: quit()

> **quit**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:231](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L231)

直接让整个 native 进程退出

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

## Returns

`Promise`\<`boolean`\>

lib/native/functions/restore.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / restore

# Function: restore()

> **restore**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L273)

从最小化还原

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`boolean`\>

lib/native/functions/save.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / save

# Function: save()

> **save**(`options`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/native.ts:342](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L342)

弹出文件保存框

## Parameters

### options

选项

#### filters?

`object`[]

筛选的文件类型

#### path?

`string`

默认路径，不含 /storage/，如 /d/

## Returns

`Promise`\<`string` \| `null`\>

选择的保存路径，不含 /storage/

lib/native/functions/size.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / size

# Function: size()

> **size**(`current`, `width`, `height`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:239](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L239)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

### width

`number`

### height

`number`

## Returns

`Promise`\<`boolean`\>

lib/native/functions/unmaximize.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / unmaximize

# Function: unmaximize()

> **unmaximize**(`current`): `Promise`\<`boolean`\>

Defined in: [dist/lib/native.ts:264](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L264)

从最大化还原

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`boolean`\>

lib/native/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/native

# lib/native

## Functions

- [activate](functions/activate.md)
- [clear](functions/clear.md)
- [close](functions/close.md)
- [dialog](functions/dialog.md)
- [getListenerList](functions/getListenerList.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [invoke](functions/invoke.md)
- [invokeSys](functions/invokeSys.md)
- [isMax](functions/isMax.md)
- [max](functions/max.md)
- [maximizable](functions/maximizable.md)
- [min](functions/min.md)
- [off](functions/off.md)
- [on](functions/on.md)
- [once](functions/once.md)
- [open](functions/open.md)
- [ping](functions/ping.md)
- [quit](functions/quit.md)
- [restore](functions/restore.md)
- [save](functions/save.md)
- [size](functions/size.md)
- [unmaximize](functions/unmaximize.md)

lib/storage/functions/all.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / all

# Function: all()

> **all**(): `Record`\<`string`, `number`\>

Defined in: [dist/lib/storage.ts:201](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L201)

获取所有存储在本地的应用列表，以 path: size 返回

## Returns

`Record`\<`string`, `number`\>

lib/storage/functions/clear.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / clear

# Function: clear()

> **clear**(`path`): `Promise`\<`number`\>

Defined in: [dist/lib/storage.ts:223](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L223)

移除某个应用的所有临时存储

## Parameters

### path

`string`

要移除的应用的 path（末尾 .cga 或带 / 的路径）

## Returns

`Promise`\<`number`\>

lib/storage/functions/get.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / get

# Function: get()

> **get**(`current`, `key`): `any`

Defined in: [dist/lib/storage.ts:85](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L85)

获取小型存储数据

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### key

`string`

存储键

## Returns

`any`

lib/storage/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/storage.ts:28](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L28)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/storage/functions/list.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / list

# Function: list()

> **list**(`current`): `Record`\<`string`, `number`\>

Defined in: [dist/lib/storage.ts:183](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L183)

获取当前任务的所有存储列表，key: size

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

## Returns

`Record`\<`string`, `number`\>

lib/storage/functions/remove.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / remove

# Function: remove()

> **remove**(`current`, `key`): `boolean`

Defined in: [dist/lib/storage.ts:152](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L152)

移除某个小型存储数据

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前 task id

### key

`string`

要移除的键

## Returns

`boolean`

lib/storage/functions/set.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/storage](../index.md) / set

# Function: set()

> **set**(`current`, `key`, `val`): `boolean`

Defined in: [dist/lib/storage.ts:111](https://github.com/maiyun/clickgo/blob/master/dist/lib/storage.ts#L111)

存储小型存储数据，单应用最大存储 1M

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### key

`string`

存储键

### val

存储值

`string` | `number` | `any`[] | `Record`\<`string`, `any`\>

## Returns

`boolean`

lib/storage/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/storage

# lib/storage

## Functions

- [all](functions/all.md)
- [clear](functions/clear.md)
- [get](functions/get.md)
- [initSysId](functions/initSysId.md)
- [list](functions/list.md)
- [remove](functions/remove.md)
- [set](functions/set.md)

lib/task/classes/AbstractThread.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [dist/lib/task.ts:1513](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1513)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [dist/lib/task.ts:1522](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1522)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/task.ts:1516](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1516)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [dist/lib/task.ts:1551](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1551)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1525](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1525)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1534](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1534)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1540](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1540)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1528](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1528)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [dist/lib/task.ts:1546](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1546)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

lib/task/enumerations/EIPTYPE.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / EIPTYPE

# Enumeration: EIPTYPE

Defined in: [dist/lib/task.ts:368](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L368)

initProgress 的 type

## Enumeration Members

### APP

> **APP**: `0`

Defined in: [dist/lib/task.ts:369](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L369)

***

### CONTROL

> **CONTROL**: `2`

Defined in: [dist/lib/task.ts:371](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L371)

***

### DONE

> **DONE**: `7`

Defined in: [dist/lib/task.ts:376](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L376)

***

### LOCAL

> **LOCAL**: `1`

Defined in: [dist/lib/task.ts:370](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L370)

***

### PERMISSION

> **PERMISSION**: `5`

Defined in: [dist/lib/task.ts:374](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L374)

***

### START

> **START**: `6`

Defined in: [dist/lib/task.ts:375](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L375)

***

### STYLE

> **STYLE**: `4`

Defined in: [dist/lib/task.ts:373](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L373)

***

### THEME

> **THEME**: `3`

Defined in: [dist/lib/task.ts:372](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L372)

lib/task/functions/checkPermission.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / checkPermission

# Function: checkPermission()

> **checkPermission**(`taskId`, `vals`, `apply`, `applyHandler?`): `Promise`\<`boolean`[]\>

Defined in: [dist/lib/task.ts:912](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L912)

检测应用是否有相应的权限（如果 taskId 是 sysId 则直接成功）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要检查的 taskId

### vals

要检测的权限

`string` | `string`[]

### apply

`boolean` = `false`

如果没有权限是否自动弹出申请，默认为否

### applyHandler?

(`list`) => `void` \| `Promise`\<`void`\>

向用户申请成功的权限列表回调

## Returns

`Promise`\<`boolean`[]\>

lib/task/functions/clearLocale.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / clearLocale

# Function: clearLocale()

> **clearLocale**(`taskId`): `void`

Defined in: [dist/lib/task.ts:1166](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1166)

清除任务的所有加载的语言包

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要清除的任务 id

## Returns

`void`

lib/task/functions/clearLocaleLang.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / clearLocaleLang

# Function: clearLocaleLang()

> **clearLocaleLang**(`current`): `void`

Defined in: [dist/lib/task.ts:1208](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1208)

清除 task 的语言设置

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

## Returns

`void`

lib/task/functions/clearSystem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / clearSystem

# Function: clearSystem()

> **clearSystem**(`taskId`): `Promise`\<`boolean`\>

Defined in: [dist/lib/task.ts:1375](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1375)

清除系统任务设定

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

清除的 taskId

## Returns

`Promise`\<`boolean`\>

lib/task/functions/createTimer.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / createTimer

# Function: createTimer()

> **createTimer**(`current`, `fun`, `delay`, `opt`): `number`

Defined in: [dist/lib/task.ts:1226](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1226)

创建 timer

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属的 taskId

### fun

() => `void` \| `Promise`\<`void`\>

执行函数

### delay

`number`

延迟/间隔，毫秒

### opt

[`ICreateTimerOptions`](../interfaces/ICreateTimerOptions.md) = `{}`

选项, formId: 可省略，省略代表生命周期为当前整个任务，否则只是当前窗体，immediate: 立即执行，默认 false，count: 执行次数，0 为无限次，默认 0

## Returns

`number`

lib/task/functions/end.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / end

# Function: end()

> **end**(`taskId`): `Promise`\<`boolean`\>

Defined in: [dist/lib/task.ts:1027](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1027)

完全结束任务

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要结束的任务 id

## Returns

`Promise`\<`boolean`\>

lib/task/functions/get.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / get

# Function: get()

> **get**(`taskId`): [`ITaskInfo`](../interfaces/ITaskInfo.md) \| `null`

Defined in: [dist/lib/task.ts:103](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L103)

获取任务简略信息

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 id

## Returns

[`ITaskInfo`](../interfaces/ITaskInfo.md) \| `null`

lib/task/functions/getFocus.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getFocus

# Function: getFocus()

> **getFocus**(`current`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/task.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L170)

获取当前有焦点的任务 ID

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`string` \| `null`\>

lib/task/functions/getList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getList

# Function: getList()

> **getList**(): [`ITaskInfo`](../interfaces/ITaskInfo.md)[]

Defined in: [dist/lib/task.ts:350](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L350)

获取 task list 的简略情况

## Returns

[`ITaskInfo`](../interfaces/ITaskInfo.md)[]

lib/task/functions/getOrigin.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getOrigin

# Function: getOrigin()

> **getOrigin**(`taskId`): [`ITask`](../interfaces/ITask.md) \| `null`

Defined in: [dist/lib/task.ts:126](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L126)

获取任务对象

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 ID

## Returns

[`ITask`](../interfaces/ITask.md) \| `null`

lib/task/functions/getOriginList.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getOriginList

# Function: getOriginList()

> **getOriginList**(`current`): `Promise`\<`Record`\<`string`, [`ITask`](../interfaces/ITask.md)\>\>

Defined in: [dist/lib/task.ts:73](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L73)

获取原始 list

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

## Returns

`Promise`\<`Record`\<`string`, [`ITask`](../interfaces/ITask.md)\>\>

lib/task/functions/getPermissions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getPermissions

# Function: getPermissions()

> **getPermissions**(`current`): `string`[]

Defined in: [dist/lib/task.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L337)

获取某个任务的已授权权限列表

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

## Returns

`string`[]

lib/task/functions/getRuntime.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / getRuntime

# Function: getRuntime()

> **getRuntime**(`current`, `taskId`): [`IRuntime`](../interfaces/IRuntime.md) \| `null`

Defined in: [dist/lib/task.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L62)

获取任务的 runtime 数据，仅系统可以获取

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### taskId

`string`

任务 ID

## Returns

[`IRuntime`](../interfaces/IRuntime.md) \| `null`

lib/task/functions/init.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / init

# Function: init()

> **init**(): `void`

Defined in: [dist/lib/task.ts:1463](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1463)

## Returns

`void`

lib/task/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/task.ts:33](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L33)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/task/functions/loadLocale.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / loadLocale

# Function: loadLocale()

> **loadLocale**(`taskId`, `lang`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/task.ts:1137](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1137)

加载 locale 文件 json

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

所属的 taskId

### lang

`string`

语言名，如 sc

### path

`string`

绝对或者相对 app 路径的地址

## Returns

`Promise`\<`boolean`\>

lib/task/functions/loadLocaleData.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / loadLocaleData

# Function: loadLocaleData()

> **loadLocaleData**(`taskId`, `lang`, `data`, `pre`): `void`

Defined in: [dist/lib/task.ts:1110](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1110)

加载 locale data 对象到 task

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 ID

### lang

`string`

语言名，如 sc

### data

`Record`\<`string`, `any`\>

数据

### pre

`string` = `''`

前置

## Returns

`void`

lib/task/functions/offFrame.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / offFrame

# Function: offFrame()

> **offFrame**(`current`, `ft`): `void`

Defined in: [dist/lib/task.ts:317](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L317)

移除 frame 监听

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### ft

`number`

监听 ID

## Returns

`void`

lib/task/functions/onFrame.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / onFrame

# Function: onFrame()

> **onFrame**(`current`, `fun`, `opt`): `number`

Defined in: [dist/lib/task.ts:239](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L239)

创建 frame 监听，formId 存在则为窗体范围，否则为任务级范围

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### fun

() => `void` \| `Promise`\<`void`\>

监听回调

### opt

选项,count:执行次数，默认无限次,formId:限定在当前任务的某个窗体

#### count?

`number`

#### formId?

`string`

## Returns

`number`

lib/task/functions/refreshSystemPosition.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / refreshSystemPosition

# Function: refreshSystemPosition()

> **refreshSystemPosition**(): `void`

Defined in: [dist/lib/task.ts:1407](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1407)

刷新系统任务的 form 的位置以及 length

## Returns

`void`

lib/task/functions/removeTimer.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / removeTimer

# Function: removeTimer()

> **removeTimer**(`current`, `timer`): `void`

Defined in: [dist/lib/task.ts:1293](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1293)

移除 timer

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### timer

`number`

ID

## Returns

`void`

lib/task/functions/run.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / run

# Function: run()

> **run**(`current`, `url`, `opt`): `Promise`\<`string` \| `number`\>

Defined in: [dist/lib/task.ts:386](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L386)

运行一个应用

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### url

app 路径（以 .cga 结尾的文件），或 APP 包对象

`string` | [`IApp`](../../core/interfaces/IApp.md)

### opt

[`ITaskRunOptions`](../interfaces/ITaskRunOptions.md) = `{}`

选项

## Returns

`Promise`\<`string` \| `number`\>

字符串代表成功，否则代表错误代号

lib/task/functions/runThread.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / runThread

# Function: runThread()

> **runThread**(`current`, `cls`, `data?`): [`IThread`](../interfaces/IThread.md)

Defined in: [dist/lib/task.ts:1565](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1565)

运行线程（同一个线程文件只能运行一个）

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### cls

() => [`AbstractThread`](../classes/AbstractThread.md)

线程类

### data?

`Record`\<`string`, `any`\>

线程初始化数据

## Returns

[`IThread`](../interfaces/IThread.md)

lib/task/functions/setFocus.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / setFocus

# Function: setFocus()

> **setFocus**(`id?`): `boolean`

Defined in: [dist/lib/task.ts:157](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L157)

设置 task focus id

## Parameters

### id?

`string`

task id 或 null

## Returns

`boolean`

lib/task/functions/setLocale.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / setLocale

# Function: setLocale()

> **setLocale**(`taskId`, `lang`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/task.ts:1183](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1183)

加载全新 locale（老 locale 的所有语言的缓存会被卸载）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要加载的任务 id

### lang

`string`

语言名，如 sc

### path

`string`

绝对或者相对 app 路径的地址

## Returns

`Promise`\<`boolean`\>

lib/task/functions/setLocaleLang.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / setLocaleLang

# Function: setLocaleLang()

> **setLocaleLang**(`current`, `lang`): `void`

Defined in: [dist/lib/task.ts:1193](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1193)

设置本 task 的语言 name

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### lang

`string`

语言名，如 sc

## Returns

`void`

lib/task/functions/setSystem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / setSystem

# Function: setSystem()

> **setSystem**(`taskId`, `formId`): `boolean`

Defined in: [dist/lib/task.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1337)

将任务注册为系统 task

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

task id

### formId

`string`

task bar 的 form id

## Returns

`boolean`

lib/task/functions/sleep.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / sleep

# Function: sleep()

> **sleep**(`current`, `fun`, `delay`): `number`

Defined in: [dist/lib/task.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1316)

暂停一小段时间

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 id

### fun

() => `void` \| `Promise`\<`void`\>

回调函数

### delay

`number`

暂停时间

## Returns

`number`

lib/task/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/task

# lib/task

## Enumerations

- [EIPTYPE](enumerations/EIPTYPE.md)

## Classes

- [AbstractThread](classes/AbstractThread.md)

## Interfaces

- [ICreateTimerOptions](interfaces/ICreateTimerOptions.md)
- [IRuntime](interfaces/IRuntime.md)
- [ISystemTaskInfo](interfaces/ISystemTaskInfo.md)
- [ITask](interfaces/ITask.md)
- [ITaskInfo](interfaces/ITaskInfo.md)
- [ITaskRunOptions](interfaces/ITaskRunOptions.md)
- [IThread](interfaces/IThread.md)

## Variables

- [systemTaskInfo](variables/systemTaskInfo.md)

## Functions

- [checkPermission](functions/checkPermission.md)
- [clearLocale](functions/clearLocale.md)
- [clearLocaleLang](functions/clearLocaleLang.md)
- [clearSystem](functions/clearSystem.md)
- [createTimer](functions/createTimer.md)
- [end](functions/end.md)
- [get](functions/get.md)
- [getFocus](functions/getFocus.md)
- [getList](functions/getList.md)
- [getOrigin](functions/getOrigin.md)
- [getOriginList](functions/getOriginList.md)
- [getPermissions](functions/getPermissions.md)
- [getRuntime](functions/getRuntime.md)
- [init](functions/init.md)
- [initSysId](functions/initSysId.md)
- [loadLocale](functions/loadLocale.md)
- [loadLocaleData](functions/loadLocaleData.md)
- [offFrame](functions/offFrame.md)
- [onFrame](functions/onFrame.md)
- [refreshSystemPosition](functions/refreshSystemPosition.md)
- [removeTimer](functions/removeTimer.md)
- [run](functions/run.md)
- [runThread](functions/runThread.md)
- [setFocus](functions/setFocus.md)
- [setLocale](functions/setLocale.md)
- [setLocaleLang](functions/setLocaleLang.md)
- [setSystem](functions/setSystem.md)
- [sleep](functions/sleep.md)

lib/task/interfaces/ICreateTimerOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ICreateTimerOptions

# Interface: ICreateTimerOptions

Defined in: [dist/lib/task.ts:1760](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1760)

## Properties

### count?

> `optional` **count**: `number`

Defined in: [dist/lib/task.ts:1764](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1764)

***

### formId?

> `optional` **formId**: `string`

Defined in: [dist/lib/task.ts:1761](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1761)

***

### immediate?

> `optional` **immediate**: `boolean`

Defined in: [dist/lib/task.ts:1763](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1763)

lib/task/interfaces/IRuntime.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IRuntime

# Interface: IRuntime

Defined in: [dist/lib/task.ts:1727](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1727)

## Properties

### dialogFormIds

> **dialogFormIds**: `string`[]

Defined in: [dist/lib/task.ts:1728](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1728)

***

### index

> **index**: `number`

Defined in: [dist/lib/task.ts:1730](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1730)

***

### permissions

> **permissions**: `string`[]

Defined in: [dist/lib/task.ts:1729](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1729)

lib/task/interfaces/ISystemTaskInfo.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ISystemTaskInfo

# Interface: ISystemTaskInfo

Defined in: [dist/lib/task.ts:1734](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1734)

系统任务信息

## Properties

### formId

> **formId**: `string`

Defined in: [dist/lib/task.ts:1736](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1736)

***

### length

> **length**: `number`

Defined in: [dist/lib/task.ts:1737](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1737)

***

### taskId

> **taskId**: `string`

Defined in: [dist/lib/task.ts:1735](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1735)

lib/task/interfaces/ITask.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [dist/lib/task.ts:1690](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1690)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [dist/lib/task.ts:1692](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1692)

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [dist/lib/task.ts:1693](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1693)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [dist/lib/task.ts:1707](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1707)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [dist/lib/task.ts:1702](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1702)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [dist/lib/task.ts:1694](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1694)

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [dist/lib/task.ts:1705](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1705)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [dist/lib/task.ts:1691](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1691)

***

### locale

> **locale**: `object`

Defined in: [dist/lib/task.ts:1695](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1695)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [dist/lib/task.ts:1700](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1700)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [dist/lib/task.ts:1724](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1724)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/task.ts:1722](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1722)

任务中的 timer 列表

lib/task/interfaces/ITaskInfo.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITaskInfo

# Interface: ITaskInfo

Defined in: [dist/lib/task.ts:1768](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1768)

Task 的简略情况，通常在 list 当中

## Properties

### current

> **current**: `string`

Defined in: [dist/lib/task.ts:1775](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1775)

***

### customTheme

> **customTheme**: `boolean`

Defined in: [dist/lib/task.ts:1771](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1771)

***

### formCount

> **formCount**: `number`

Defined in: [dist/lib/task.ts:1772](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1772)

***

### icon

> **icon**: `string`

Defined in: [dist/lib/task.ts:1773](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1773)

***

### locale

> **locale**: `string`

Defined in: [dist/lib/task.ts:1770](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1770)

***

### name

> **name**: `string`

Defined in: [dist/lib/task.ts:1769](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1769)

***

### path

> **path**: `string`

Defined in: [dist/lib/task.ts:1774](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1774)

lib/task/interfaces/ITaskRunOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITaskRunOptions

# Interface: ITaskRunOptions

Defined in: [dist/lib/task.ts:1740](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1740)

## Properties

### after?

> `optional` **after**: `string`

Defined in: [dist/lib/task.ts:1753](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1753)

如果是网络加载 cga，则网址后面会附带，如 ?123

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/task.ts:1755](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1755)

给 task 传值

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/task.ts:1741](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1741)

***

### initProgress()?

> `optional` **initProgress**: (`loaded`, `total`, `type`, `msg`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1743](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1743)

初始化进度回调

#### Parameters

##### loaded

`number`

##### total

`number`

##### type

[`EIPTYPE`](../enumerations/EIPTYPE.md)

##### msg

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### notify?

> `optional` **notify**: `boolean`

Defined in: [dist/lib/task.ts:1749](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1749)

显示 notify 窗口

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/task.ts:1757](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1757)

执行文件的基路径，一般在传入 APP 包时使用，以 .cga 结尾

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/task.ts:1751](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1751)

直接赋予此任务相应权限，有 "root" 权限的应用才能设置

***

### perProgress()?

> `optional` **perProgress**: (`per`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1747](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1747)

返回总加载进度百分比（0 - 1）

#### Parameters

##### per

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### progress()?

> `optional` **progress**: (`loaded`, `total`, `type`, `path`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1745](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1745)

加载进度回调（根据 type 分为不同阶段）

#### Parameters

##### loaded

`number`

##### total

`number`

##### type

`"control"` | `"app"`

##### path

`string`

#### Returns

`void` \| `Promise`\<`void`\>

lib/task/interfaces/IThread.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [dist/lib/task.ts:1678](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1678)

## Properties

### end()

> **end**: () => `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1686](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1686)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off()

> **off**: (`name`, `handler`) => `void`

Defined in: [dist/lib/task.ts:1682](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1682)

移除事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### on()

> **on**: (`name`, `handler`) => `void`

Defined in: [dist/lib/task.ts:1680](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1680)

绑定事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### send()

> **send**: (`data`) => `void`

Defined in: [dist/lib/task.ts:1684](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1684)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

lib/task/variables/systemTaskInfo.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / systemTaskInfo

# Variable: systemTaskInfo

> **systemTaskInfo**: [`ISystemTaskInfo`](../interfaces/ISystemTaskInfo.md)

Defined in: [dist/lib/task.ts:1330](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1330)

task 的信息

lib/theme/functions/clear.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / clear

# Function: clear()

> **clear**(`taskId`): `Promise`\<`void`\>

Defined in: [dist/lib/theme.ts:169](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L169)

清除一个 task 中所有加载的 theme（只能清除自定）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要清除的任务 id

## Returns

`Promise`\<`void`\>

lib/theme/functions/clearGlobal.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / clearGlobal

# Function: clearGlobal()

> **clearGlobal**(): `Promise`\<`void`\>

Defined in: [dist/lib/theme.ts:221](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L221)

清除全局主题

## Returns

`Promise`\<`void`\>

lib/theme/functions/initSysId.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / initSysId

# Function: initSysId()

> **initSysId**(`id`): `void`

Defined in: [dist/lib/theme.ts:31](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L31)

初始化系统级 ID，仅能设置一次

## Parameters

### id

`string`

系统级 ID

## Returns

`void`

lib/theme/functions/load.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / load

# Function: load()

> **load**(`taskId`, `theme?`): `Promise`\<`boolean`\>

Defined in: [dist/lib/theme.ts:91](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L91)

加载 theme 给任务

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要给某任务 ID 加载主题

### theme?

[`ITheme`](../interfaces/ITheme.md)

ITheme 对象，undefined 代表加载全局的默认主题

## Returns

`Promise`\<`boolean`\>

lib/theme/functions/read.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / read

# Function: read()

> **read**(`blob`): `Promise`\<`false` \| [`ITheme`](../interfaces/ITheme.md)\>

Defined in: [dist/lib/theme.ts:45](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L45)

cgt 文件 blob 转 IThemePkg 对象，会自动创建 object url，请注意释放

## Parameters

### blob

`Blob`

blob 对象

## Returns

`Promise`\<`false` \| [`ITheme`](../interfaces/ITheme.md)\>

lib/theme/functions/remove.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / remove

# Function: remove()

> **remove**(`taskId`, `name`): `Promise`\<`void`\>

Defined in: [dist/lib/theme.ts:142](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L142)

移除当前 task 的 theme（只能移除自定的）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

任务 ID

### name

`string`

要移除的主题

## Returns

`Promise`\<`void`\>

lib/theme/functions/setGlobal.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / setGlobal

# Function: setGlobal()

> **setGlobal**(`theme`, `current`): `Promise`\<`number`\>

Defined in: [dist/lib/theme.ts:194](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L194)

将 cgt 主题设置到全局所有任务

## Parameters

### theme

主题对象或主题路径（不带 .cgt）

`string` | [`ITheme`](../interfaces/ITheme.md)

### current

如果要读包内对象，则要传当前任务

[`TCurrent`](../../core/type-aliases/TCurrent.md) | `null`

## Returns

`Promise`\<`number`\>

lib/theme/functions/setMain.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / setMain

# Function: setMain()

> **setMain**(`color?`, `hue?`): `void`

Defined in: [dist/lib/theme.ts:241](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L241)

设置全局主色

## Parameters

### color?

`string`

如 oklch(.7 .2 43)，留空为还原

### hue?

`number`

主色的 hue 值，留空为还原

## Returns

`void`

lib/theme/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/theme

# lib/theme

## Interfaces

- [ITheme](interfaces/ITheme.md)
- [IThemeConfig](interfaces/IThemeConfig.md)

## Variables

- [global](variables/global.md)

## Functions

- [clear](functions/clear.md)
- [clearGlobal](functions/clearGlobal.md)
- [initSysId](functions/initSysId.md)
- [load](functions/load.md)
- [read](functions/read.md)
- [remove](functions/remove.md)
- [setGlobal](functions/setGlobal.md)
- [setMain](functions/setMain.md)

lib/theme/interfaces/ITheme.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / ITheme

# Interface: ITheme

Defined in: [dist/lib/theme.ts:259](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L259)

主题对象

## Properties

### config

> **config**: [`IThemeConfig`](IThemeConfig.md)

Defined in: [dist/lib/theme.ts:262](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L262)

主题对象配置文件

***

### files

> **files**: `Record`\<`string`, `Blob` \| `string`\>

Defined in: [dist/lib/theme.ts:264](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L264)

所有已加载的文件内容

***

### type

> **type**: `"theme"`

Defined in: [dist/lib/theme.ts:260](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L260)

lib/theme/interfaces/IThemeConfig.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / IThemeConfig

# Interface: IThemeConfig

Defined in: [dist/lib/theme.ts:268](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L268)

主题文件包的 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/theme.ts:272](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L272)

***

### files

> **files**: `string`[]

Defined in: [dist/lib/theme.ts:278](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L278)

将要加载的文件

***

### name

> **name**: `string`

Defined in: [dist/lib/theme.ts:269](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L269)

***

### style

> **style**: `string`

Defined in: [dist/lib/theme.ts:275](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L275)

不带扩展名，系统会在末尾添加 .css

***

### ver

> **ver**: `number`

Defined in: [dist/lib/theme.ts:270](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L270)

***

### version

> **version**: `string`

Defined in: [dist/lib/theme.ts:271](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L271)

lib/theme/variables/global.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/theme](../index.md) / global

# Variable: global

> **global**: [`ITheme`](../interfaces/ITheme.md) \| `null` = `null`

Defined in: [dist/lib/theme.ts:39](https://github.com/maiyun/clickgo/blob/master/dist/lib/theme.ts#L39)

当前全局主题

lib/tool/enumerations/ESTATE.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / ESTATE

# Enumeration: ESTATE

Defined in: [dist/lib/tool.ts:1741](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1741)

状态机状态

## Enumeration Members

### COMMENT

> **COMMENT**: `4`

Defined in: [dist/lib/tool.ts:1751](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1751)

注释

***

### NORMAL

> **NORMAL**: `0`

Defined in: [dist/lib/tool.ts:1743](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1743)

普通

***

### REG

> **REG**: `3`

Defined in: [dist/lib/tool.ts:1749](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1749)

正则

***

### STRING

> **STRING**: `2`

Defined in: [dist/lib/tool.ts:1747](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1747)

字符串

***

### WORD

> **WORD**: `1`

Defined in: [dist/lib/tool.ts:1745](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1745)

单词

lib/tool/functions/blob2ArrayBuffer.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / blob2ArrayBuffer

# Function: blob2ArrayBuffer()

> **blob2ArrayBuffer**(`blob`): `Promise`\<`ArrayBuffer`\>

Defined in: [dist/lib/tool.ts:148](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L148)

将 blob 对象转换为 ArrayBuffer

## Parameters

### blob

`Blob`

对象

## Returns

`Promise`\<`ArrayBuffer`\>

lib/tool/functions/blob2DataUrl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / blob2DataUrl

# Function: blob2DataUrl()

> **blob2DataUrl**(`blob`): `Promise`\<`string`\>

Defined in: [dist/lib/tool.ts:1485](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1485)

将 blob 对象转换为 base64 url

## Parameters

### blob

`Blob`

对象

## Returns

`Promise`\<`string`\>

lib/tool/functions/blob2Text.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / blob2Text

# Function: blob2Text()

> **blob2Text**(`blob`): `Promise`\<`string`\>

Defined in: [dist/lib/tool.ts:1466](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1466)

将 blob 对象转换为 text

## Parameters

### blob

`Blob`

对象

## Returns

`Promise`\<`string`\>

lib/tool/functions/clone.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / clone

# Function: clone()

> **clone**\<`T`\>(`obj`): `T`

Defined in: [dist/lib/tool.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L190)

完整的克隆一份数组/对象

## Type Parameters

### T

`T`

## Parameters

### obj

`T`

要克隆的对象

## Returns

`T`

lib/tool/functions/compar.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / compar

# Function: compar()

> **compar**(`before`, `after`): `object`

Defined in: [dist/lib/tool.ts:1513](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1513)

- 对比老值和新值，看看新值中哪些移除了，哪些新增了

## Parameters

### before

(`string` \| `number`)[]

老值

### after

(`string` \| `number`)[]

新值

## Returns

`object`

### add

> **add**: `Record`\<`string`, `number`\>

### length

> **length**: `object`

#### length.add

> **add**: `number`

#### length.remove

> **remove**: `number`

### remove

> **remove**: `Record`\<`string`, `number`\>

lib/tool/functions/compressor.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / compressor

# Function: compressor()

> **compressor**\<`T`\>(`file`, `options`): `Promise`\<`false` \| `T`\>

Defined in: [dist/lib/tool.ts:35](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L35)

压缩一个图片

## Type Parameters

### T

`T` *extends* `File` \| `Blob`

## Parameters

### file

`T`

文件或 blob 类型

### options

参数

#### maxHeight?

`number`

最高高度，默认无限

#### maxWidth?

`number`

最大宽度，默认无限

#### quality?

`number`

压缩质量，默认 0.8

## Returns

`Promise`\<`false` \| `T`\>

lib/tool/functions/escapeHTML.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / escapeHTML

# Function: escapeHTML()

> **escapeHTML**(`html`): `string`

Defined in: [dist/lib/tool.ts:750](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L750)

转义 HTML

## Parameters

### html

`string`

HTML 字符

## Returns

`string`

lib/tool/functions/eventsAttrWrap.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / eventsAttrWrap

# Function: eventsAttrWrap()

> **eventsAttrWrap**(`layout`): `string`

Defined in: [dist/lib/tool.ts:518](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L518)

对 layout 的 events 事件进行包裹

## Parameters

### layout

`string`

要包裹的 layout

## Returns

`string`

lib/tool/functions/execCommand.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / execCommand

# Function: execCommand()

> **execCommand**(`ac`): `void`

Defined in: [dist/lib/tool.ts:1500](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1500)

## Parameters

### ac

`string`

## Returns

`void`

lib/tool/functions/fetch.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / fetch

# Function: fetch()

> **fetch**(`url`, `init?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/tool.ts:1103](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1103)

发起 fetch 请求

## Parameters

### url

`string`

网址

### init?

`RequestInit`

选项

## Returns

`Promise`\<`string` \| `Blob` \| `null`\>

文本或二进制数据，失败时返回 null

lib/tool/functions/formatColor.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / formatColor

# Function: formatColor()

> **formatColor**(`color`): `number`[]

Defined in: [dist/lib/tool.ts:758](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L758)

将 rgb 或 hsl 等颜色转换为数字数组

## Parameters

### color

`string`

颜色字符串

## Returns

`number`[]

lib/tool/functions/formatSecond.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / formatSecond

# Function: formatSecond()

> **formatSecond**(`second`): `string`

Defined in: [dist/lib/tool.ts:1556](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1556)

将秒数格式化为 0:0:0 的字符串

## Parameters

### second

`number`

## Returns

`string`

lib/tool/functions/formatTime.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / formatTime

# Function: formatTime()

> **formatTime**(`ts`, `tz?`): `object`

Defined in: [dist/lib/tool.ts:1569](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1569)

将日期对象或毫秒级时间戳转换为字符串

## Parameters

### ts

时间戳或日期对象

`number` | `Date`

### tz?

`number`

传入要显示的时区，小时，如 8，默认以当前客户端时区为准

## Returns

`object`

### date

> **date**: `string`

### time

> **time**: `string`

### zone

> **zone**: `string`

lib/tool/functions/get.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / get

# Function: get()

> **get**(`url`, `init?`, `opt?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/tool.ts:1129](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1129)

发起 GET 请求

## Parameters

### url

`string`

网址

### init?

`RequestInit`

选项

### opt?

选项

#### retry?

`number`

重试次数，默认 3 次

## Returns

`Promise`\<`string` \| `Blob` \| `null`\>

文本或二进制数据，失败时返回 null

lib/tool/functions/getArray.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getArray

# Function: getArray()

> **getArray**(`param`): `any`[]

Defined in: [dist/lib/tool.ts:725](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L725)

根据参数获取最终的数组型，可传入类似 [1,2,3] 或 1,2,3

## Parameters

### param

参数

`string` | `any`[]

## Returns

`any`[]

lib/tool/functions/getBoolean.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getBoolean

# Function: getBoolean()

> **getBoolean**(`param`): `boolean`

Defined in: [dist/lib/tool.ts:699](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L699)

根据参数获取最终的布尔值

## Parameters

### param

参数

`string` | `number` | `boolean` | `undefined`

## Returns

`boolean`

lib/tool/functions/getClassPrototype.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getClassPrototype

# Function: getClassPrototype()

> **getClassPrototype**(`obj`, `over`, `level`): [`IClassPrototype`](../interfaces/IClassPrototype.md)

Defined in: [dist/lib/tool.ts:100](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L100)

获取 class 的所有 method 和 get/set

## Parameters

### obj

`object`

实例化 class 对象

### over

`string`[] = `[]`

不传入此参数

### level

`number` = `0`

不传入此参数

## Returns

[`IClassPrototype`](../interfaces/IClassPrototype.md)

lib/tool/functions/getMimeByPath.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getMimeByPath

# Function: getMimeByPath()

> **getMimeByPath**(`path`): `object`

Defined in: [dist/lib/tool.ts:626](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L626)

根据后缀、文件名或路径获取 mime 类型（简单版，完整版请使用 @litert/mime.js）

## Parameters

### path

`string`

后缀、文件名或路径

## Returns

`object`

### ext

> **ext**: `string`

### mime

> **mime**: `string`

lib/tool/functions/getNumber.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getNumber

# Function: getNumber()

> **getNumber**(`param`): `number`

Defined in: [dist/lib/tool.ts:714](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L714)

根据参数获取最终的数字型

## Parameters

### param

参数

`string` | `number`

## Returns

`number`

lib/tool/functions/getResponseJson.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / getResponseJson

# Function: getResponseJson()

> **getResponseJson**(`url`, `init?`): `Promise`\<`any`\>

Defined in: [dist/lib/tool.ts:1181](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1181)

发起 GET 请求并解析 JSON 响应

## Parameters

### url

`string`

网址

### init?

`RequestInit`

选项

## Returns

`Promise`\<`any`\>

JSON 数据，失败时返回 null

lib/tool/functions/hex2rgb.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / hex2rgb

# Function: hex2rgb()

> **hex2rgb**(`hex`): `object`

Defined in: [dist/lib/tool.ts:807](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L807)

hex 转换为 rgba，#27ae60ff, 27ae60 #fff

## Parameters

### hex

`string`

hex 字符串，无所谓带不带 #

## Returns

`object`

### a

> **a**: `number`

### b

> **b**: `number`

### g

> **g**: `number`

### r

> **r**: `number`

### rgb

> **rgb**: `string`

lib/tool/functions/hsl2rgb.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / hsl2rgb

# Function: hsl2rgb()

> **hsl2rgb**(`h`, `s?`, `l?`, `a?`, `decimal?`): `object`

Defined in: [dist/lib/tool.ts:951](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L951)

hsl 字符串转 rgb 数组

## Parameters

### h

h 值或 hsl(x, x, x) 或直接 x,x,x

`string` | `number`

### s?

s 值

`string` | `number`

### l?

l 值

`string` | `number`

### a?

a 值

`string` | `number`

### decimal?

`boolean` = `false`

是否保留小数

## Returns

`object`

### a

> **a**: `number`

### b

> **b**: `number`

### g

> **g**: `number`

### r

> **r**: `number`

### rgb

> **rgb**: `string`

lib/tool/functions/isEscapeChar.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isEscapeChar

# Function: isEscapeChar()

> **isEscapeChar**(`code`, `index`): `boolean`

Defined in: [dist/lib/tool.ts:1731](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1731)

判断字符是否是转义字符

## Parameters

### code

`string`

字符串

### index

`number`

字符在字符串中的位置

## Returns

`boolean`

是否是转义字符

lib/tool/functions/isEscaped.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isEscaped

# Function: isEscaped()

> **isEscaped**(`str`, `pos`): `boolean`

Defined in: [dist/lib/tool.ts:1660](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1660)

转义字符检查
检查指定位置的字符是否被转义

## Parameters

### str

`string`

字符串

### pos

`number`

检查位置

## Returns

`boolean`

是否被转义

lib/tool/functions/isFalsy.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isFalsy

# Function: isFalsy()

> **isFalsy**(`val`): `val is TFalsy`

Defined in: [dist/lib/tool.ts:2532](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2532)

判断一个值是否是虚假的（为 null/undefined/空字符串/false/0）

## Parameters

### val

`any`

要判断的值

## Returns

`val is TFalsy`

lib/tool/functions/isMs.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isMs

# Function: isMs()

> **isMs**(`time`): `boolean`

Defined in: [dist/lib/tool.ts:1596](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1596)

是否是毫秒

## Parameters

### time

`number`

要判断的时间戳

## Returns

`boolean`

lib/tool/functions/isTruthy.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isTruthy

# Function: isTruthy()

> **isTruthy**(`val`): `val is any`

Defined in: [dist/lib/tool.ts:2540](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2540)

判断一个值是否是真实的（不为 null/undefined/空字符串/false/0）

## Parameters

### val

`any`

要判断的值

## Returns

`val is any`

lib/tool/functions/layoutAddTagClassAndReTagName.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / layoutAddTagClassAndReTagName

# Function: layoutAddTagClassAndReTagName()

> **layoutAddTagClassAndReTagName**(`layout`, `retagname`): `string`

Defined in: [dist/lib/tool.ts:352](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L352)

给标签增加 tag-tagname 的 class，同时给标签增加 cg- 前导（仅字符串，不是操作真实 dom）

## Parameters

### layout

`string`

layout

### retagname

`boolean`

是否更改 tagname 为 cg-tagname

## Returns

`string`

lib/tool/functions/layoutClassPrepend.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / layoutClassPrepend

# Function: layoutClassPrepend()

> **layoutClassPrepend**(`layout`, `preps`): `string`

Defined in: [dist/lib/tool.ts:467](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L467)

给 class 增加 scope 的随机前缀，给 id 新增前缀

## Parameters

### layout

`string`

layout

### preps

`string`[]

前置标识符列表，特殊字符串 scope 会被替换为随机前缀

## Returns

`string`

lib/tool/functions/layoutInsertAttr.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / layoutInsertAttr

# Function: layoutInsertAttr()

> **layoutInsertAttr**(`layout`, `insert`, `opt`): `string`

Defined in: [dist/lib/tool.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L408)

给标签追加 attr，即使 attr 存在也会追加上一个新的（非真实 DOM 操作，仅仅是对字符串进行处理）

## Parameters

### layout

`string`

被追加

### insert

`string`

要追加

### opt

选项, ignore 忽略的标签，include 包含的标签

#### ignore?

`RegExp`[]

#### include?

`RegExp`[]

## Returns

`string`

lib/tool/functions/loadLink.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadLink

# Function: loadLink()

> **loadLink**(`url`, `pos`): `Promise`\<`boolean`\>

Defined in: [dist/lib/tool.ts:2464](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2464)

加载 css 文件

## Parameters

### url

`string`

css 文件网址

### pos

`"before"` | `"after"`

## Returns

`Promise`\<`boolean`\>

加载是否成功

lib/tool/functions/loadLinks.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadLinks

# Function: loadLinks()

> **loadLinks**(`urls`, `opt`): `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2490](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2490)

批量加载 css 文件

## Parameters

### urls

`string`[]

css 文件列表

### opt

选项

#### loaded?

(`url`, `state`) => `void`

## Returns

`Promise`\<`void`\>

lib/tool/functions/loadScript.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadScript

# Function: loadScript()

> **loadScript**(`url`): `Promise`\<`boolean`\>

Defined in: [dist/lib/tool.ts:2412](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2412)

加载脚本

## Parameters

### url

`string`

脚本网址

## Returns

`Promise`\<`boolean`\>

lib/tool/functions/loadScripts.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadScripts

# Function: loadScripts()

> **loadScripts**(`urls`, `opt`): `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2431](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2431)

批量加载 js 文件

## Parameters

### urls

`string`[]

js 文件列表

### opt

选项

#### loaded?

(`url`, `state`) => `void`

## Returns

`Promise`\<`void`\>

lib/tool/functions/loadStyle.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadStyle

# Function: loadStyle()

> **loadStyle**(`style`): `void`

Defined in: [dist/lib/tool.ts:2522](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2522)

加载 css 字符串

## Parameters

### style

`string`

css 字符串

## Returns

`void`

lib/tool/functions/logicalOr.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / logicalOr

# Function: logicalOr()

> **logicalOr**\<`T`, `T2`\>(`v1`, `v2`): \[`T`\] *extends* \[[`TFalsy`](../type-aliases/TFalsy.md)\] ? `T2` : `T`

Defined in: [dist/lib/tool.ts:2549](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2549)

类似 || 运算符的效果

## Type Parameters

### T

`T`

### T2

`T2`

## Parameters

### v1

`T`

比对值

### v2

`T2`

比对值

## Returns

\[`T`\] *extends* \[[`TFalsy`](../type-aliases/TFalsy.md)\] ? `T2` : `T`

lib/tool/functions/match.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / match

# Function: match()

> **match**(`str`, `regs`): `boolean`

Defined in: [dist/lib/tool.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L309)

传入正则进行匹配 str 是否有一项满足

## Parameters

### str

`string`

要检测的字符串

### regs

`RegExp`[]

正则列表

## Returns

`boolean`

lib/tool/functions/nextFrame.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / nextFrame

# Function: nextFrame()

> **nextFrame**(): `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:263](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L263)

等待浏览器帧

## Returns

`Promise`\<`void`\>

lib/tool/functions/parseArrayString.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / parseArrayString

# Function: parseArrayString()

> **parseArrayString**(`arrayStr`): `string`[]

Defined in: [dist/lib/tool.ts:1675](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1675)

数组字符串解析器
解析数组字符串为各元素组成的字符串数组

## Parameters

### arrayStr

`string`

数组字符串

## Returns

`string`[]

解析后的字符串数组

lib/tool/functions/parseUrl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / parseUrl

# Function: parseUrl()

> **parseUrl**(`url`): [`IUrl`](../interfaces/IUrl.md)

Defined in: [dist/lib/tool.ts:1307](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1307)

传输 url 并解析为 IUrl 对象

## Parameters

### url

`string`

url 字符串

## Returns

[`IUrl`](../interfaces/IUrl.md)

lib/tool/functions/post.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / post

# Function: post()

> **post**(`url`, `data`, `init?`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [dist/lib/tool.ts:1156](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1156)

发起 POST 请求（除 FormData 外都会转换为 JSON 提交）

## Parameters

### url

`string`

网址

### data

数据

`Record`\<`string`, `any`\> | `FormData`

### init?

`RequestInit`

选项

## Returns

`Promise`\<`string` \| `Blob` \| `null`\>

文本或二进制数据，失败时返回 null

lib/tool/functions/postResponseEventStream.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / postResponseEventStream

# Function: postResponseEventStream()

> **postResponseEventStream**(`url`, `data`, `opts`): `AbortController`

Defined in: [dist/lib/tool.ts:1204](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1204)

发起 JSON 请求并获得文本 SSE 响应

## Parameters

### url

`string`

网址

### data

`Record`\<`string`, `any`\>

数据

### opts

选项

#### init?

`RequestInit`

#### onData?

(`chunk`) => `void` \| `Promise`\<`void`\>

来数据了

#### onEnd?

() => `void` \| `Promise`\<`void`\>

结束事件回调，主动结束、错误也会回调

#### onInit?

(`data`) => `void` \| `Promise`\<`void`\>

初始化回调（不一定会有）

#### onStart?

() => `void` \| `Promise`\<`void`\>

连接成功建立的回调

#### onTimeout?

() => `void` \| `Promise`\<`void`\>

连接失败（onStart 前调用）

## Returns

`AbortController`

返回可随时中止的控制器

lib/tool/functions/postResponseJson.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / postResponseJson

# Function: postResponseJson()

> **postResponseJson**(`url`, `data`, `init?`): `Promise`\<`any`\>

Defined in: [dist/lib/tool.ts:1285](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1285)

发起 POST 请求并解析 JSON 响应

## Parameters

### url

`string`

网址

### data

数据

`Record`\<`string`, `any`\> | `FormData`

### init?

`RequestInit`

选项

## Returns

`Promise`\<`any`\>

JSON 数据，失败时返回 null

lib/tool/functions/purify.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / purify

# Function: purify()

> **purify**(`text`): `string`

Defined in: [dist/lib/tool.ts:288](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L288)

去除 html 的空白符、换行以及注释

## Parameters

### text

`string`

要纯净的字符串

## Returns

`string`

lib/tool/functions/queryParse.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / queryParse

# Function: queryParse()

> **queryParse**(`query`): `Record`\<`string`, `string` \| `string`[]\>

Defined in: [dist/lib/tool.ts:1626](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1626)

将 query string 转换为对象

## Parameters

### query

`string`

要转换的字符串

## Returns

`Record`\<`string`, `string` \| `string`[]\>

lib/tool/functions/queryStringify.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / queryStringify

# Function: queryStringify()

> **queryStringify**(`query`, `encode`): `string`

Defined in: [dist/lib/tool.ts:1605](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1605)

将对象转换为 query string

## Parameters

### query

`Record`\<`string`, `any`\>

要转换的对象

### encode

`boolean` = `true`

是否转义

## Returns

`string`

lib/tool/functions/rand.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / rand

# Function: rand()

> **rand**(`min`, `max`): `number`

Defined in: [dist/lib/tool.ts:651](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L651)

生成范围内的随机数

## Parameters

### min

`number`

最新范围

### max

`number`

最大范围

## Returns

`number`

lib/tool/functions/random.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / random

# Function: random()

> **random**(`length`, `source`, `block`): `string`

Defined in: [dist/lib/tool.ts:676](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L676)

生成随机字符串

## Parameters

### length

`number` = `8`

长度

### source

`string` = `RANDOM_LN`

字符源

### block

`string` = `''`

剔除字符

## Returns

`string`

随机字符串

lib/tool/functions/request.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / request

# Function: request()

> **request**(`url`, `opt`): `Promise`\<`any`\>

Defined in: [dist/lib/tool.ts:1016](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1016)

发起一个网络请求，若是返回值是 JSON 则自动解析，否则直接返回字符串

## Parameters

### url

`string`

网址

### opt

[`IRequestOptions`](../interfaces/IRequestOptions.md)

选项

## Returns

`Promise`\<`any`\>

lib/tool/functions/rgb2hex.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / rgb2hex

# Function: rgb2hex()

> **rgb2hex**(`r`, `g?`, `b?`, `a?`): `string`

Defined in: [dist/lib/tool.ts:775](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L775)

将 r, g, b 转换为 hex 字符串，不含 #

## Parameters

### r

r 或 rgb 用 , 分隔的字符串

`string` | `number`

### g?

可留空，g

`string` | `number`

### b?

可留空，b

`string` | `number`

### a?

`string` | `number`

## Returns

`string`

lib/tool/functions/rgb2hsl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / rgb2hsl

# Function: rgb2hsl()

> **rgb2hsl**(`r`, `g?`, `b?`, `a?`, `decimal?`): `object`

Defined in: [dist/lib/tool.ts:848](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L848)

rgb 字符串转 hsl 数组

## Parameters

### r

r 值或 rgb(x, x, x) 或直接 x,x,x

`string` | `number`

### g?

g 值

`string` | `number`

### b?

b 值

`string` | `number`

### a?

a 值

`string` | `number`

### decimal?

`boolean` = `false`

是否保留小数

## Returns

`object`

### a

> **a**: `number`

### h

> **h**: `number`

### hsl

> **hsl**: `string`

### l

> **l**: `number`

### s

> **s**: `number`

lib/tool/functions/runIife.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / runIife

# Function: runIife()

> **runIife**(`code`): `any`

Defined in: [dist/lib/tool.ts:25](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L25)

运行 iife 代码

## Parameters

### code

`string`

iife 代码

## Returns

`any`

模块对象

lib/tool/functions/sizeFormat.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / sizeFormat

# Function: sizeFormat()

> **sizeFormat**(`size`, `spliter`): `string`

Defined in: [dist/lib/tool.ts:163](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L163)

将文件大小格式化为带单位的字符串

## Parameters

### size

`number`

文件大小

### spliter

`string` = `' '`

分隔符

## Returns

`string`

lib/tool/functions/sleep.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / sleep

# Function: sleep()

> **sleep**(`ms`): `Promise`\<`boolean`\>

Defined in: [dist/lib/tool.ts:248](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L248)

等待毫秒

## Parameters

### ms

`number` = `0`

等待的毫秒，默认 0，最大 30 秒

## Returns

`Promise`\<`boolean`\>

lib/tool/functions/sleepFrame.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / sleepFrame

# Function: sleepFrame()

> **sleepFrame**(`count`): `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:275](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L275)

等待浏览器帧

## Parameters

### count

`number`

等待帧数最高 10 帧

## Returns

`Promise`\<`void`\>

lib/tool/functions/stateMachine.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / stateMachine

# Function: stateMachine()

> **stateMachine**(`code`, `start`, `process`): `void`

Defined in: [dist/lib/tool.ts:1761](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1761)

状态机

## Parameters

### code

`string`

代码

### start

`number`

开始位置

### process

(`event`) => `boolean`

处理函数

## Returns

`void`

是否继续

lib/tool/functions/stylePrepend.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / stylePrepend

# Function: stylePrepend()

> **stylePrepend**(`style`, `prep`): `object`

Defined in: [dist/lib/tool.ts:549](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L549)

给 class 前部增加唯一标识符

## Parameters

### style

`string`

样式内容

### prep

`string` = `''`

给 class、font 等增加前置

## Returns

`object`

### prep

> **prep**: `string`

### style

> **style**: `string`

lib/tool/functions/styleUrl2DataUrl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / styleUrl2DataUrl

# Function: styleUrl2DataUrl()

> **styleUrl2DataUrl**(`path`, `style`, `files`): `Promise`\<`string`\>

Defined in: [dist/lib/tool.ts:324](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L324)

将 style 中的 url 转换成 base64 data url

## Parameters

### path

`string`

路径基准或以文件的路径为基准，以 / 结尾

### style

`string`

样式表

### files

`Record`\<`string`, `Blob` \| `string`\>

在此文件列表中查找

## Returns

`Promise`\<`string`\>

lib/tool/functions/teleportGlue.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / teleportGlue

# Function: teleportGlue()

> **teleportGlue**(`layout`, `formId`): `string`

Defined in: [dist/lib/tool.ts:534](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L534)

对 layout 的 teleport 做转义处理为 vue 识别的内容

## Parameters

### layout

`string`

要处理的窗体或控件的 layout

### formId

`string`

要加入的 formId

## Returns

`string`

lib/tool/functions/urlAtom.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / urlAtom

# Function: urlAtom()

> **urlAtom**(`url`): `string`

Defined in: [dist/lib/tool.ts:1449](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1449)

处理 URL 中的 .. / . 等

## Parameters

### url

`string`

## Returns

`string`

lib/tool/functions/urlResolve.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / urlResolve

# Function: urlResolve()

> **urlResolve**(`from`, `to`): `string`

Defined in: [dist/lib/tool.ts:1390](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1390)

将相对路径根据基准路径进行转换

## Parameters

### from

`string`

基准路径

### to

`string`

相对路径

## Returns

`string`

lib/tool/functions/weightFormat.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / weightFormat

# Function: weightFormat()

> **weightFormat**(`weight`, `spliter`): `string`

Defined in: [dist/lib/tool.ts:177](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L177)

将毫克重量格式化为带单位的字符串

## Parameters

### weight

`number`

毫克重量

### spliter

`string` = `' '`

分隔符

## Returns

`string`

lib/tool/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/tool

# lib/tool

## Enumerations

- [ESTATE](enumerations/ESTATE.md)

## Interfaces

- [IClassPrototype](interfaces/IClassPrototype.md)
- [IRequestOptions](interfaces/IRequestOptions.md)
- [IUrl](interfaces/IUrl.md)

## Type Aliases

- [TFalsy](type-aliases/TFalsy.md)

## Variables

- [lang](variables/lang.md)
- [RANDOM\_L](variables/RANDOM_L.md)
- [RANDOM\_LN](variables/RANDOM_LN.md)
- [RANDOM\_LU](variables/RANDOM_LU.md)
- [RANDOM\_LUN](variables/RANDOM_LUN.md)
- [RANDOM\_LUNS](variables/RANDOM_LUNS.md)
- [RANDOM\_N](variables/RANDOM_N.md)
- [RANDOM\_U](variables/RANDOM_U.md)
- [RANDOM\_UN](variables/RANDOM_UN.md)
- [RANDOM\_V](variables/RANDOM_V.md)

## Functions

- [blob2ArrayBuffer](functions/blob2ArrayBuffer.md)
- [blob2DataUrl](functions/blob2DataUrl.md)
- [blob2Text](functions/blob2Text.md)
- [clone](functions/clone.md)
- [compar](functions/compar.md)
- [compressor](functions/compressor.md)
- [escapeHTML](functions/escapeHTML.md)
- [eventsAttrWrap](functions/eventsAttrWrap.md)
- [execCommand](functions/execCommand.md)
- [fetch](functions/fetch.md)
- [formatColor](functions/formatColor.md)
- [formatSecond](functions/formatSecond.md)
- [formatTime](functions/formatTime.md)
- [get](functions/get.md)
- [getArray](functions/getArray.md)
- [getBoolean](functions/getBoolean.md)
- [getClassPrototype](functions/getClassPrototype.md)
- [getMimeByPath](functions/getMimeByPath.md)
- [getNumber](functions/getNumber.md)
- [getResponseJson](functions/getResponseJson.md)
- [hex2rgb](functions/hex2rgb.md)
- [hsl2rgb](functions/hsl2rgb.md)
- [isEscapeChar](functions/isEscapeChar.md)
- [isEscaped](functions/isEscaped.md)
- [isFalsy](functions/isFalsy.md)
- [isMs](functions/isMs.md)
- [isTruthy](functions/isTruthy.md)
- [layoutAddTagClassAndReTagName](functions/layoutAddTagClassAndReTagName.md)
- [layoutClassPrepend](functions/layoutClassPrepend.md)
- [layoutInsertAttr](functions/layoutInsertAttr.md)
- [loadLink](functions/loadLink.md)
- [loadLinks](functions/loadLinks.md)
- [loadScript](functions/loadScript.md)
- [loadScripts](functions/loadScripts.md)
- [loadStyle](functions/loadStyle.md)
- [logicalOr](functions/logicalOr.md)
- [match](functions/match.md)
- [nextFrame](functions/nextFrame.md)
- [parseArrayString](functions/parseArrayString.md)
- [parseUrl](functions/parseUrl.md)
- [post](functions/post.md)
- [postResponseEventStream](functions/postResponseEventStream.md)
- [postResponseJson](functions/postResponseJson.md)
- [purify](functions/purify.md)
- [queryParse](functions/queryParse.md)
- [queryStringify](functions/queryStringify.md)
- [rand](functions/rand.md)
- [random](functions/random.md)
- [request](functions/request.md)
- [rgb2hex](functions/rgb2hex.md)
- [rgb2hsl](functions/rgb2hsl.md)
- [runIife](functions/runIife.md)
- [sizeFormat](functions/sizeFormat.md)
- [sleep](functions/sleep.md)
- [sleepFrame](functions/sleepFrame.md)
- [stateMachine](functions/stateMachine.md)
- [stylePrepend](functions/stylePrepend.md)
- [styleUrl2DataUrl](functions/styleUrl2DataUrl.md)
- [teleportGlue](functions/teleportGlue.md)
- [urlAtom](functions/urlAtom.md)
- [urlResolve](functions/urlResolve.md)
- [weightFormat](functions/weightFormat.md)

lib/tool/interfaces/IClassPrototype.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IClassPrototype

# Interface: IClassPrototype

Defined in: [dist/lib/tool.ts:84](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L84)

类原型信息

## Properties

### access

> **access**: `Record`\<`string`, \{ `get`: `any`; `set`: `any`; \}\>

Defined in: [dist/lib/tool.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L88)

访问器列表，key 为属性名，value 为包含 get 和 set 的对象，例如：{'prop1': { 'get': function() { ... }, 'set': function(v) { ... } }}

***

### method

> **method**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/tool.ts:86](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L86)

方法列表，key 为方法名，value 为函数体，例如：{'method1': function() { ... }}

lib/tool/interfaces/IRequestOptions.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [dist/lib/tool.ts:2627](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2627)

请求选项

## Properties

### body?

> `optional` **body**: `FormData`

Defined in: [dist/lib/tool.ts:2630](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2630)

***

### credentials?

> `optional` **credentials**: `boolean`

Defined in: [dist/lib/tool.ts:2628](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2628)

***

### end()?

> `optional` **end**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2639](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2639)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error()?

> `optional` **error**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2642](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2642)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: [dist/lib/tool.ts:2633](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2633)

***

### load()?

> `optional` **load**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2641](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2641)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method**: `"GET"` \| `"POST"`

Defined in: [dist/lib/tool.ts:2629](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2629)

***

### progress()?

> `optional` **progress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2640](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2640)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### responseType?

> `optional` **responseType**: `XMLHttpRequestResponseType`

Defined in: [dist/lib/tool.ts:2632](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2632)

***

### start()?

> `optional` **start**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2638](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2638)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/tool.ts:2631](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2631)

***

### uploadEnd()?

> `optional` **uploadEnd**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2637](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2637)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress()?

> `optional` **uploadProgress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2636](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2636)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadStart()?

> `optional` **uploadStart**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2635](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2635)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

lib/tool/interfaces/IUrl.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IUrl

# Interface: IUrl

Defined in: [dist/lib/tool.ts:2612](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2612)

网址对象

## Properties

### auth

> **auth**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2613](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2613)

***

### hash

> **hash**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2614](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2614)

***

### host

> **host**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2615](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2615)

***

### hostname

> **hostname**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2616](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2616)

***

### pass

> **pass**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2617](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2617)

***

### path

> **path**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2618](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2618)

***

### pathname

> **pathname**: `string`

Defined in: [dist/lib/tool.ts:2619](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2619)

***

### port

> **port**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2621](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2621)

***

### protocol

> **protocol**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2620](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2620)

***

### query

> **query**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2622](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2622)

***

### user

> **user**: `string` \| `null`

Defined in: [dist/lib/tool.ts:2623](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2623)

lib/tool/type-aliases/TFalsy.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / TFalsy

# Type Alias: TFalsy

> **TFalsy** = `false` \| `""` \| `0` \| `null` \| `undefined` \| *typeof* `NaN`

Defined in: [dist/lib/tool.ts:2646](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2646)

虚假值类型

lib/tool/variables/lang.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / lang

# Variable: lang

> `const` **lang**: `object`

Defined in: [dist/lib/tool.ts:2554](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2554)

语言相关

## Type Declaration

### codes

> **codes**: `string`[]

语言代号

### getCodeByAccept()

> **getCodeByAccept**: (`accept?`) => `string`

根据常用语言字符串获取语言 code

#### Parameters

##### accept?

`string`

常用字符串，如 zh-cn，或包含 zh-cn 的字符串，默认取浏览器的语言

#### Returns

`string`

### map

> **map**: `Record`\<`string`, `string`\>

浏览器常用映射为本语言

### names

> **names**: `string`[]

语言名称

lib/tool/variables/RANDOM_L.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_L

# Variable: RANDOM\_L

> `const` **RANDOM\_L**: `"abcdefghijklmnopqrstuvwxyz"` = `'abcdefghijklmnopqrstuvwxyz'`

Defined in: [dist/lib/tool.ts:660](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L660)

lib/tool/variables/RANDOM_LN.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_LN

# Variable: RANDOM\_LN

> `const` **RANDOM\_LN**: `string`

Defined in: [dist/lib/tool.ts:663](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L663)

lib/tool/variables/RANDOM_LU.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_LU

# Variable: RANDOM\_LU

> `const` **RANDOM\_LU**: `string`

Defined in: [dist/lib/tool.ts:664](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L664)

lib/tool/variables/RANDOM_LUN.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_LUN

# Variable: RANDOM\_LUN

> `const` **RANDOM\_LUN**: `string`

Defined in: [dist/lib/tool.ts:665](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L665)

lib/tool/variables/RANDOM_LUNS.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_LUNS

# Variable: RANDOM\_LUNS

> `const` **RANDOM\_LUNS**: `string`

Defined in: [dist/lib/tool.ts:667](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L667)

lib/tool/variables/RANDOM_N.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_N

# Variable: RANDOM\_N

> `const` **RANDOM\_N**: `"0123456789"` = `'0123456789'`

Defined in: [dist/lib/tool.ts:658](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L658)

lib/tool/variables/RANDOM_U.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_U

# Variable: RANDOM\_U

> `const` **RANDOM\_U**: `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"` = `'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`

Defined in: [dist/lib/tool.ts:659](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L659)

lib/tool/variables/RANDOM_UN.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_UN

# Variable: RANDOM\_UN

> `const` **RANDOM\_UN**: `string`

Defined in: [dist/lib/tool.ts:662](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L662)

lib/tool/variables/RANDOM_V.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / RANDOM\_V

# Variable: RANDOM\_V

> `const` **RANDOM\_V**: `"ACEFGHJKLMNPRSTWXY34567"` = `'ACEFGHJKLMNPRSTWXY34567'`

Defined in: [dist/lib/tool.ts:666](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L666)

lib/zip/classes/Zip.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / Zip

# Class: Zip

Defined in: [dist/lib/zip.ts:5](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L5)

## Constructors

### Constructor

> **new Zip**(`zip`): `Zip`

Defined in: [dist/lib/zip.ts:13](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L13)

#### Parameters

##### zip

`JSZip`

#### Returns

`Zip`

## Methods

### cd()

> **cd**(`dir`): `string`

Defined in: [dist/lib/zip.ts:334](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L334)

进入一个目录（不存在也能进入，需要自行判断）
返回进入后的路径值

#### Parameters

##### dir

`string`

相对路径或绝对路径

#### Returns

`string`

***

### generate()

> **generate**\<`T`\>(`options`): `Promise`\<[`IZipOutputByType`](../interfaces/IZipOutputByType.md)\[`T`\]\>

Defined in: [dist/lib/zip.ts:346](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L346)

打包 zip

#### Type Parameters

##### T

`T` *extends* keyof [`IZipOutputByType`](../interfaces/IZipOutputByType.md)

#### Parameters

##### options

选项

###### level?

`number`

###### onUpdate?

(`percent`, `currentFile`) => `void`

###### type?

`T`

#### Returns

`Promise`\<[`IZipOutputByType`](../interfaces/IZipOutputByType.md)\[`T`\]\>

***

### getContent()

读取完整文件

#### Param

文件路径

#### Param

返回类型

#### Call Signature

> **getContent**(`path`): `Promise`\<`string` \| `null`\>

Defined in: [dist/lib/zip.ts:18](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L18)

##### Parameters

###### path

`string`

##### Returns

`Promise`\<`string` \| `null`\>

#### Call Signature

> **getContent**\<`T`\>(`path`, `type`): `Promise`\<[`IZipOutputByType`](../interfaces/IZipOutputByType.md)\[`T`\] \| `null`\>

Defined in: [dist/lib/zip.ts:19](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L19)

##### Type Parameters

###### T

`T` *extends* keyof [`IZipOutputByType`](../interfaces/IZipOutputByType.md)

##### Parameters

###### path

`string`

###### type

`T`

##### Returns

`Promise`\<[`IZipOutputByType`](../interfaces/IZipOutputByType.md)\[`T`\] \| `null`\>

***

### getList()

> **getList**(): `Promise`\<`Record`\<`string`, `string` \| `Blob`\>\>

Defined in: [dist/lib/zip.ts:371](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L371)

获取 path 和 string/Blob 对应的文件列表

#### Returns

`Promise`\<`Record`\<`string`, `string` \| `Blob`\>\>

***

### isDir()

> **isDir**(`path`): `false` \| [`IZipStats`](../interfaces/IZipStats.md)

Defined in: [dist/lib/zip.ts:130](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L130)

判断是否是目录或目录是否存在，是的话返回 stats

#### Parameters

##### path

`string`

判断路径

#### Returns

`false` \| [`IZipStats`](../interfaces/IZipStats.md)

***

### isFile()

> **isFile**(`path`): `false` \| [`IZipStats`](../interfaces/IZipStats.md)

Defined in: [dist/lib/zip.ts:142](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L142)

判断是否是文件或文件是否存在，是的话返回 stats

#### Parameters

##### path

`string`

判断路径

#### Returns

`false` \| [`IZipStats`](../interfaces/IZipStats.md)

***

### putContent()

> **putContent**\<`T`\>(`path`, `data`, `options`): `void`

Defined in: [dist/lib/zip.ts:47](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L47)

写入文件内容

#### Type Parameters

##### T

`T` *extends* keyof [`IZipInputByType`](../interfaces/IZipInputByType.md)

#### Parameters

##### path

`string`

文件路径

##### data

[`IZipInputByType`](../interfaces/IZipInputByType.md)\[`T`\]

要写入的内容

##### options

选项

###### base64?

`boolean`

###### binary?

`boolean`

###### date?

`Date`

#### Returns

`void`

***

### pwd()

> **pwd**(): `string`

Defined in: [dist/lib/zip.ts:325](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L325)

获取当前目录，末尾不带 /

#### Returns

`string`

string

***

### readDir()

获取文件夹下文件列表

#### Param

文件夹路径

#### Param

选项

#### Call Signature

> **readDir**(`path?`, `opt?`): [`IZipItem`](../interfaces/IZipItem.md)[]

Defined in: [dist/lib/zip.ts:151](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L151)

读取目录，hasChildren: false, hasDir: true, pathAsKey: false

##### Parameters

###### path?

`string`

###### opt?

###### hasChildren?

`boolean`

###### hasDir?

`boolean`

###### pathAsKey?

`false`

##### Returns

[`IZipItem`](../interfaces/IZipItem.md)[]

#### Call Signature

> **readDir**(`path?`, `opt?`): `Record`\<`string`, [`IZipItem`](../interfaces/IZipItem.md)\>

Defined in: [dist/lib/zip.ts:152](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L152)

读取目录，hasChildren: false, hasDir: true, pathAsKey: false

##### Parameters

###### path?

`string`

###### opt?

###### hasChildren?

`boolean`

###### hasDir?

`boolean`

###### pathAsKey

`true`

##### Returns

`Record`\<`string`, [`IZipItem`](../interfaces/IZipItem.md)\>

***

### stats()

> **stats**(`path`): [`IZipStats`](../interfaces/IZipStats.md) \| `null`

Defined in: [dist/lib/zip.ts:71](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L71)

获取对象是否存在，存在则返回 stats 对象，否则返回 null

#### Parameters

##### path

`string`

对象路径

#### Returns

[`IZipStats`](../interfaces/IZipStats.md) \| `null`

***

### unlink()

> **unlink**(`path`): `void`

Defined in: [dist/lib/zip.ts:61](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L61)

删除一个文件/文件夹（深度删除）

#### Parameters

##### path

`string`

要删除的文件路径

#### Returns

`void`

lib/zip/functions/get.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / get

# Function: get()

> **get**(`data?`): `Promise`\<[`Zip`](../classes/Zip.md) \| `null`\>

Defined in: [dist/lib/zip.ts:426](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L426)

获取 zip 对象

## Parameters

### data?

[`TZipInputFileFormat`](../type-aliases/TZipInputFileFormat.md)

对象数据

## Returns

`Promise`\<[`Zip`](../classes/Zip.md) \| `null`\>

lib/zip/index.md
---

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / lib/zip

# lib/zip

## Classes

- [Zip](classes/Zip.md)

## Interfaces

- [IZipInputByType](interfaces/IZipInputByType.md)
- [IZipItem](interfaces/IZipItem.md)
- [IZipMetadata](interfaces/IZipMetadata.md)
- [IZipOutputByType](interfaces/IZipOutputByType.md)
- [IZipStats](interfaces/IZipStats.md)

## Type Aliases

- [TZipInputFileFormat](type-aliases/TZipInputFileFormat.md)
- [TZipInputType](type-aliases/TZipInputType.md)
- [TZipOutputType](type-aliases/TZipOutputType.md)

## Functions

- [get](functions/get.md)

lib/zip/interfaces/IZipInputByType.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / IZipInputByType

# Interface: IZipInputByType

Defined in: [dist/lib/zip.ts:470](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L470)

## Properties

### array

> **array**: `number`[]

Defined in: [dist/lib/zip.ts:473](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L473)

***

### arraybuffer

> **arraybuffer**: `ArrayBuffer`

Defined in: [dist/lib/zip.ts:475](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L475)

***

### base64

> **base64**: `string`

Defined in: [dist/lib/zip.ts:471](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L471)

***

### blob

> **blob**: `Blob`

Defined in: [dist/lib/zip.ts:476](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L476)

***

### string

> **string**: `string`

Defined in: [dist/lib/zip.ts:472](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L472)

***

### uint8array

> **uint8array**: `Uint8Array`

Defined in: [dist/lib/zip.ts:474](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L474)

lib/zip/interfaces/IZipItem.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / IZipItem

# Interface: IZipItem

Defined in: [dist/lib/zip.ts:441](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L441)

## Properties

### compressedSize

> **compressedSize**: `number`

Defined in: [dist/lib/zip.ts:443](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L443)

***

### date

> **date**: `Date`

Defined in: [dist/lib/zip.ts:445](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L445)

***

### isDirectory

> **isDirectory**: `boolean`

Defined in: [dist/lib/zip.ts:447](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L447)

***

### isFile

> **isFile**: `boolean`

Defined in: [dist/lib/zip.ts:446](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L446)

***

### name

> **name**: `string`

Defined in: [dist/lib/zip.ts:442](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L442)

***

### path

> **path**: `string`

Defined in: [dist/lib/zip.ts:448](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L448)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [dist/lib/zip.ts:444](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L444)

lib/zip/interfaces/IZipMetadata.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / IZipMetadata

# Interface: IZipMetadata

Defined in: [dist/lib/zip.ts:483](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L483)

## Properties

### currentFile

> **currentFile**: `string` \| `null`

Defined in: [dist/lib/zip.ts:485](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L485)

***

### percent

> **percent**: `number`

Defined in: [dist/lib/zip.ts:484](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L484)

lib/zip/interfaces/IZipOutputByType.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / IZipOutputByType

# Interface: IZipOutputByType

Defined in: [dist/lib/zip.ts:459](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L459)

## Properties

### array

> **array**: `number`[]

Defined in: [dist/lib/zip.ts:462](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L462)

***

### arraybuffer

> **arraybuffer**: `ArrayBuffer`

Defined in: [dist/lib/zip.ts:464](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L464)

***

### base64

> **base64**: `string`

Defined in: [dist/lib/zip.ts:460](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L460)

***

### blob

> **blob**: `Blob`

Defined in: [dist/lib/zip.ts:465](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L465)

***

### string

> **string**: `string`

Defined in: [dist/lib/zip.ts:461](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L461)

***

### uint8array

> **uint8array**: `Uint8Array`

Defined in: [dist/lib/zip.ts:463](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L463)

lib/zip/interfaces/IZipStats.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / IZipStats

# Interface: IZipStats

Defined in: [dist/lib/zip.ts:451](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L451)

## Properties

### compressedSize

> **compressedSize**: `number`

Defined in: [dist/lib/zip.ts:452](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L452)

***

### date

> **date**: `Date`

Defined in: [dist/lib/zip.ts:454](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L454)

***

### isDirectory

> **isDirectory**: `boolean`

Defined in: [dist/lib/zip.ts:456](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L456)

***

### isFile

> **isFile**: `boolean`

Defined in: [dist/lib/zip.ts:455](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L455)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [dist/lib/zip.ts:453](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L453)

lib/zip/type-aliases/TZipInputFileFormat.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / TZipInputFileFormat

# Type Alias: TZipInputFileFormat

> **TZipInputFileFormat** = [`IZipInputByType`](../interfaces/IZipInputByType.md)\[keyof [`IZipInputByType`](../interfaces/IZipInputByType.md)\]

Defined in: [dist/lib/zip.ts:481](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L481)

lib/zip/type-aliases/TZipInputType.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / TZipInputType

# Type Alias: TZipInputType

> **TZipInputType** = keyof [`IZipInputByType`](../interfaces/IZipInputByType.md)

Defined in: [dist/lib/zip.ts:479](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L479)

lib/zip/type-aliases/TZipOutputType.md
---

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/zip](../index.md) / TZipOutputType

# Type Alias: TZipOutputType

> **TZipOutputType** = keyof [`IZipOutputByType`](../interfaces/IZipOutputByType.md)

Defined in: [dist/lib/zip.ts:468](https://github.com/maiyun/clickgo/blob/master/dist/lib/zip.ts#L468)
