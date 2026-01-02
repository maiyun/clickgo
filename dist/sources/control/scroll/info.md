滚动条组件，用于自定义滚动条样式。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### float

`boolean` | `string`

是否浮动显示，默认 false。

#### direction

`'h'` | `'v'`

滚动方向，`h` 为水平，`v` 为垂直，默认 `v`。

#### length

`number` | `string`

内容总长度，默认 1000。

#### client

`number` | `string`

可视区域长度，默认 100。

#### offset

`number` | `string`

双向绑定，当前滚动位置，默认 0。

### 事件

#### show

`() => void`

滚动条显示时触发。

#### roll

`() => void`

用户主动滚动时触发。

### 样式

使用 flex 布局，包含上/下（或左/右）控制按钮和滚动滑块。滑块大小根据 client/length 比例自动计算。

滚动条默认显示后自动隐藏，悬停或拖动时保持显示。浮动模式下悬浮在内容上方不占用空间。

滑块可拖动定位，点击轨道可快速跳转。具有平滑的显示/隐藏过渡动画。

### 示例

```xml
<scroll :length="1000" :client="100" v-model:offset="scrollTop"></scroll>
```
