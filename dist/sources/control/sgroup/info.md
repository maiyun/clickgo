分组容器组件。

### 参数

#### direction

`'h'` | `'v'`

排列方向，默认 `h`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

类型样式，默认 `default`。

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

使用 flex 布局的简单分组容器，具有内边距、圆角和边框。`type` 改变边框的语义颜色。

仅有默认内容插槽，不管理选中状态。带标题、右侧操作和页脚的容器使用 group。

### 示例

```xml
<sgroup direction="v" gutter="8">
    <label mode="tip">Total revenue</label>
    <label size="xl">$128,430</label>
</sgroup>
```
