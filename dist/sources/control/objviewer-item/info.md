对象查看器项组件。

### 参数

#### hue

`string`

色调值，默认 `255`。

#### hover

`boolean` | `string`

是否启用悬停效果，默认 false。

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### border

`'solid'` | `'dotted'` | `'dashed'` | `'ani'`

边框样式，默认 `solid`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

#### label

`string`

标签文本。

### 样式

作为 objviewer 的子组件，显示单个卡片项。

支持不同的边框样式和色调。可显示标签文本。

### 示例

```xml
<objviewer-item label="Item 1">Content</objviewer-item>
```