时间线项组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

#### selected

`boolean` | `string`

是否选中状态，默认 false。

### 样式

作为 timeline 的子组件，显示单个时间点。左侧显示圆形时间点，右侧显示内容。

选中状态时显示高亮样式。时间点下方显示连接线（最后一项除外）。

内容区域支持通过 slot 自定义。

### 示例

```xml
<timeline-item :selected="true">Event content</timeline-item>
```