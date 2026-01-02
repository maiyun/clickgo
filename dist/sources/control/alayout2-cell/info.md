自适应布局单元格组件（新版）。

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

### 样式

作为 alayout2 的子组件，显示单元格内容。使用 flex 布局。

支持自定义内部布局方向和对齐方式。

### 示例

```xml
<alayout2-cell direction="v" :gutter="10">Content</alayout2-cell>
```
