颜色选择器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### mode

`'hsl'` | `'rgb'` | `'hex'`

颜色模式，默认 `hsl`。

#### modelValue

`string`

双向绑定，当前颜色值。

### 事件

#### changed

`(event: IColoristChangedEvent) => void`

颜色改变后触发，包含 `value`、`hsl` 和 `rgb` 信息。

### 样式

使用 flex 布局，显示当前颜色预览块。点击弹出调色板面板。

面板包含色相选择、饱和度/亮度选择、透明度选择。支持十六进制和 RGBA 格式。

### 示例

```xml
<colorist v-model="color"></colorist>
```