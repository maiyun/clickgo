菜单项组件，用于菜单栏的单个菜单项。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### alt

`string`

快捷键提示文本。

### 样式

作为 menu 的子组件，显示菜单项文本。悬停时高亮显示背景色。

点击后展开关联的下拉菜单列表。选中状态下保持高亮。

### 示例

```xml
<menu-item label="File">
    <menulist>...</menulist>
</menu-item>
```
