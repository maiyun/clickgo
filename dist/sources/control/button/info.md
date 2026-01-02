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
