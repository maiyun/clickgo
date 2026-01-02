对象查看器组件，用于在可缩放的画布上展示内容。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### bg

`'dot'` | `'grid'`

背景样式，默认 `dot`。

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

支持缩放和平移的画布容器。背景可显示点阵或网格。

可在内部放置 objviewer-item 子组件，支持连接线绘制。

### 示例

```xml
<objviewer>
    <objviewer-item label="Item 1">Content</objviewer-item>
</objviewer>
```