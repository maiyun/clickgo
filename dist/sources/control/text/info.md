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