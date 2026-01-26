自适应布局容器组件（新版，推荐）。

### 参数

#### gutter

`number` | `string`

cell 之间的间距，默认 0。

#### stripe

`boolean` | `string`

是否显示条纹，默认 `false`。

### 事件

#### direction

`(direction: 'h' | 'v') => void`

布局方向变化时触发，宽度 >= 600 时为 h，否则为 v。

### 样式

使用 flex 布局，支持嵌套的自适应布局。配合 alayout2-cell 子组件使用。

相比 alayout，alayout2 结构更简洁，直接包含 cell 子组件。根据宽度自动切换横竖布局。

### 示例

```xml
<alayout2 :gutter="10" @direction="onDirection">
    <alayout2-cell>Sidebar</alayout2-cell>
    <alayout2-cell>Content</alayout2-cell>
</alayout2>
```