自适应布局容器组件（旧版）。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

row 之间的间距，默认 0。

#### itemGutter

`number` | `string`

cell 之间的间距，默认 0。

### 样式

使用 flex 布局，子元素按指定方向排列。支持自适应和固定宽度的子元素混合使用。

配合 alayout-row 和 alayout-cell 子组件使用。填满父容器空间。

### 示例

```xml
<alayout direction="h">
    <alayout-row>
        <alayout-cell :width="200">Sidebar</alayout-cell>
        <alayout-cell>Content</alayout-cell>
    </alayout-row>
</alayout>
```
