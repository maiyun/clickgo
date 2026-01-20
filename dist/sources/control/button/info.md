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

#### pointer

`boolean` | `string`

是否启用指针效果，默认 false。

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

### 插槽

#### pop

下拉菜单插槽。

### 样式

按钮采用 flex 布局，内容水平居中对齐。支持多种类型（default/tool/primary/info/warning/danger），每种类型有对应的颜色主题，包括背景色、边框色和文字色。

支持朴素模式（plain），此时按钮无背景色，仅显示边框和文字。选中状态（checked）会改变按钮的外观以表示激活。

按钮有三种尺寸（m/l/xl），以及水平尺寸模式（sizeh）。area 属性控制点击区域，支持 all（全区域）、mark（标记）和 split（分割）模式。gutter 属性设置内部元素间距。

交互方面，按钮支持键盘导航（Enter 和空格键），有焦点轮廓、悬停高亮和按下激活效果。禁用状态下按钮变灰并不可点击。pointer 模式下鼠标悬停时显示指针光标效果。

### 示例

```xml
<button type="primary" @click="onClick">Primary Button</button>
<button type="danger" plain>Plain Danger</button>
```