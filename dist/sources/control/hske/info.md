HSK 布局容器组件。

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

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

根据宽度自动调整尺寸样式。

### 示例

```xml
<hske direction="v" :gutter="10">
    <div>Item 1</div>
    <div>Item 2</div>
</hske>
```