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

禁用日期列表，date 模式使用 YYYYMMDD，month 模式使用 YYYYMM。

#### modelValue

`number` | `string` | `undefined`

双向绑定，时间戳值（毫秒）。

month 模式归一到所选时区的当月 1 日 00:00:00.000；外部传入日期也会归一并同步绑定值。

#### mode

`'date'` | `'month'`

选择粒度，默认 date。month 使用年份导航和十二个月份按钮，隐藏日格与时间选择，忽略 time、hourminute、range 和 cursor。月份按钮复用全部内置语种的月份名称。

#### start

`number` | `string`

可选开始时间（秒/毫秒）。month 模式按所选时区的年月限制，包含边界所在月份。

#### end

`number` | `string`

可选结束时间（秒/毫秒）。month 模式按所选时区的年月限制，包含边界所在月份。

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

选中日期时触发。month 模式的 date 固定为 1，month 仍从 0 开始，time 为所选时区的月初毫秒时间戳。

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
<datepanel mode="month" v-model="monthTimestamp" :tz="0"></datepanel>
```
