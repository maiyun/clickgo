日期时间选择器。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### disabledList

`string[]` | `string`

禁用日期列表，date 模式使用 YYYYMMDD，month 模式使用 YYYYMM。

#### modelValue

`number` | `string` | `undefined`

双向绑定，时间戳毫秒值。

month 模式将值归一到所选时区的当月 1 日 00:00:00.000；外部传入日期也会归一并同步绑定值。固定 UTC 月初时传 `:tz="0"`，不依赖设备时区。

#### mode

`'date'` | `'month'`

选择粒度，默认 date。month 只显示年份和月份，不提供日格或时间选择，并忽略 date、time、hourminute 参数；zone 和 tz 仍按原有规则工作。

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

可选开始时间，沿用 datepanel 的秒/毫秒约定；month 模式按所选时区的年月限制，包含边界所在月份。

#### end

`number` | `string`

可选结束时间，沿用 datepanel 的秒/毫秒约定；month 模式按所选时区的年月限制，包含边界所在月份。

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

是否显示清空按钮，默认 true。

### 事件

#### changed

`(event: IDateChangedEvent) => void`

值改变后触发，包含 `before` 和 `value`。month 模式选中月份或清空时触发，归一化外部赋值不视为用户选择。

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
<date mode="month" v-model="monthTimestamp" :tz="0"></date>
```
