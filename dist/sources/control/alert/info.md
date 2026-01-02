提示框组件，用于显示重要信息。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

提示框类型，默认 `default`。

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`number` | `string`

内容间距。

#### alignH

`string` | `undefined`

内容水平对齐方式。

#### alignV

`string` | `undefined`

内容垂直对齐方式。

#### close

`boolean`

是否显示关闭按钮，默认 false。

#### title

`string`

标题文本。

### 事件

#### close

`() => void`

点击关闭按钮时触发。

### 样式

使用 flex 布局，包含图标、内容区域和可选的关闭按钮。提示框具有圆角边框和背景色。

支持多种类型（default/primary/info/warning/danger/cg）对应不同的配色方案。可显示标题和自定义内容。

关闭按钮悬停时高亮显示。内容区域支持自定义布局方向和对齐方式。

### 示例

```xml
<alert type="warning" title="Warning">This is a warning message.</alert>
```
