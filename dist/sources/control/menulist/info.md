菜单列表容器组件，用于包裹菜单项。

### 样式

使用 flex 布局，垂直排列菜单项。菜单列表具有圆角边框、背景色和阴影效果。

内部包含 menulist-item 和 menulist-split 子组件。菜单项具有悬停高亮效果。

支持嵌套子菜单，子菜单在行末方向展开显示。

弹出菜单超出视窗高度时，菜单内部可以滚动，隐藏浏览器原生滚动条。上下边缘的渐变与箭头提示剩余内容，可使用滚轮、触屏滑动或按住箭头滚动；到达对应边缘时隐藏提示。滚动父菜单时关闭其子菜单，避免子菜单与触发项位置错开。

### 弹层内容标记

菜单根节点使用通用的 `data-cg-pop-content` 标记。当它是 `[data-cg-pop]` 的直接子节点时，弹层采用纵向 Flex 布局，使内部内容可以在弹层的最大高度约束下收缩。其他需要自行处理溢出的弹层内容也可以使用此标记；内容节点需要设置 `min-height: 0` 和内联 `flex-shrink: 1`，并在内部提供滚动容器。

实际滚动容器使用 `data-cg-scroll`，允许 ClickGo 内的滚轮和触屏滚动事件。两种标记分别负责弹层布局和滚动事件。

### 示例

```xml
<menulist>
    <menulist-item>
        <template v-slot>File</template>
        <template v-slot:pop>
            <menulist>
                <menulist-item label="New"></menulist-item>
                <menulist-item label="Open"></menulist-item>
                <menulist-split></menulist-split>
                <menulist-item label="Exit"></menulist-item>
            </menulist>
        </template>
    </menulist-item>
    <menulist-item label="Edit"></menulist-item>
</menulist>
```