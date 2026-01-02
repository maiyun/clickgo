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
