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