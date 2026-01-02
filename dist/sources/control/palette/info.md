调色板组件，用于颜色选择。

### 参数

#### modelValue

`string`

双向绑定，当前颜色值。

#### mode

`'hsl'` | `'rgb'` | `'hex'`

颜色模式，默认 `hsl`。

#### ok

`boolean`

是否显示确定按钮，默认 false。

### 事件

#### changed

`(event: IPaletteChangedEvent) => void`

颜色改变后触发，包含 `value`、`hsl` 和 `rgb` 信息。

#### ok

`() => void`

点击确定按钮时触发。

### 样式

使用 flex 布局，垂直排列颜色选择区域和控制区域。显示色相条和饱和度/亮度选择区域。

支持直接输入十六进制颜色值。包含预设颜色选项。拖动选择器实时预览颜色变化。

### 示例

```xml
<palette v-model="color"></palette>
```