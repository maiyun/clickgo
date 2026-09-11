数值滑块控件。适用于缩放、音量、透明度等连续或离散数值调整，支持鼠标、触摸和键盘操作。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 `false`。

#### label

`string`

无可见标签时提供给辅助技术的控件名称，默认空字符串。

#### max

`number` | `string`

最大值，默认 `100`。

#### min

`number` | `string`

最小值，默认 `0`。

#### modelValue

`number` | `string`

双向绑定的当前值，超出范围或不符合步长时自动修正。

#### showValue

`boolean` | `string`

是否在滑块右侧显示当前值，默认 `false`。

#### size

`'s'` | `'m'` | `'l'`

滑块尺寸，默认 `m`。

#### step

`number` | `string`

步长，必须大于 0，默认 `1`。

### 事件

#### input

拖动或按键调整时持续触发，参数为当前数值。

#### change

一次操作完成时触发，参数为最终数值。

### 示例

```xml
<slider v-model="zoom" min="25" max="400" step="25" show-value label="Zoom"></slider>
```
