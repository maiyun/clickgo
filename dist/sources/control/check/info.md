复选框组件，用于在多个选项中进行多项选择。支持选中、未选中和不确定（Indeterminate）三种状态。

### 参数

#### disabled

`boolean` | `string`

是否禁用控件，默认 false。

#### name

`string`

控件名称，会在事件中进行返回，默认空字符串。

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