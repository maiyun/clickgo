工具栏分隔线组件，用于分隔不同功能组的命令。

### 样式

作为 Toolbar 默认插槽或右侧插槽的子组件，显示居中的竖向分隔线。

线宽为 1px，高度使用主题的 `--g-size-m`，颜色使用 `--g-border-color`，自动适应亮暗主题。命令间距由 Toolbar 管理，组件不额外添加边距，也不参与点击和键盘焦点。

组件无参数、事件或插槽，提供 `separator` 角色和 `vertical` 方向供辅助技术识别。

### 示例

```xml
<toolbar>
    <button type="tool">Open</button>
    <button type="tool">Save</button>
    <toolbar-split></toolbar-split>
    <button type="tool">Undo</button>
    <button type="tool">Redo</button>
</toolbar>
```
