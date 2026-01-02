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