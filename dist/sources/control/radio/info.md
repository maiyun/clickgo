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
