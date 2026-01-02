菜单列表容器组件，用于包裹菜单项。

### 样式

使用 flex 布局，垂直排列菜单项。菜单列表具有圆角边框、背景色和阴影效果。

内部包含 menulist-item 和 menulist-split 子组件。菜单项具有悬停高亮效果。

支持嵌套子菜单，子菜单在右侧展开显示。

### 示例

```xml
<menulist>
    <menulist-item label="Item 1"></menulist-item>
    <menulist-split></menulist-split>
    <menulist-item label="Item 2"></menulist-item>
</menulist>
```