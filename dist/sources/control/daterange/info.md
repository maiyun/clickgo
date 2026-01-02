日期范围选择组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### modelValue

`Array<number | string>` | `string`

双向绑定，时间戳数组 [开始, 结束]。

#### tz

`number` | `string`

双向绑定，时区偏移（小时）。

#### start

`number` | `string`

可选开始时间限制。

#### end

`number` | `string`

可选结束时间限制。

#### time

`boolean` | `string`

是否显示时间选择，默认 true。

#### zone

`boolean` | `string`

是否显示时区选择，默认 false。

#### close

`boolean` | `string`

选择后是否自动关闭，默认 true。

### 事件

#### changed

`() => void`

值改变后触发。

### 样式

使用 flex 布局，包含开始和结束两个日期选择框。点击选择框弹出日期范围选择面板。

面板显示两个月份的日历，可选择日期范围。选中范围高亮显示连接区域。

支持时间和时区选择。禁用日期呈现灰色不可选。

### 示例

```xml
<daterange v-model="range" v-model:tz="tz"></daterange>
```
