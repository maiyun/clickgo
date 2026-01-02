日历组件，用于多日期选择。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### disabledList

`string[]` | `string`

禁用日期列表，如 20200101。

#### modelValue

`string[]` | `string`

双向绑定，选中的日期字符串数组。

#### start

`string`

可选开始日期（如 20200101）。

#### end

`string`

可选结束日期（如 20250101）。

#### yearmonth

`string`

双向绑定，当前显示的年月（如 202301）。

#### select

`string`

双向绑定，当前选中的单个日期。

#### jump

`boolean` | `string`

设置值时是否自动跳转，默认 true。

#### clearbtn

`boolean` | `string`

是否显示清空按钮，默认 true。

#### backbtn

`boolean` | `string`

是否显示返回今天按钮，默认 true。

### 事件

#### changed

`() => void`

选中日期改变后触发。

#### yearmonthchanged

`() => void`

年月改变后触发。

#### selected

`(event: ICalendarSelectedEvent) => void`

选中日期时触发。

### 样式

使用 flex 布局，包含年月切换区域和日期网格。日期网格显示当月所有日期和相邻月份的日期。

选中日期高亮显示，今天日期有特殊标记。禁用日期呈现灰色不可选。

支持年月快速切换。具有平滑的月份切换动画。

### 示例

```xml
<calendar v-model="selectedDates" :start="'20200101'" :end="'20251231'"></calendar>
```