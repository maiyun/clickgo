布局容器组件。

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

#### wrap

`boolean` | `string`

是否换行，默认 false。

### 样式

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

填满父容器空间。支持设置对齐方式。常用于页面整体布局。

### 示例

```xml
<layout direction="v">
    <div>Header</div>
    <div style="flex: 1">Content</div>
    <div>Footer</div>
</layout>
```