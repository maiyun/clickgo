导航菜单项组件。

### 参数

#### label

`string`

显示文本。

#### name

`string`

菜单项唯一标识，通常为 Panel 名称。

#### icon

`string`

菜单项图标。

#### show

`boolean` | `string`

双向绑定，子菜单是否展开，默认 false。

### 事件

#### select

`() => void`

选中时触发。

### 样式

作为 nav 的子组件，显示单个导航项。使用 flex 布局，包含图标和文本。

选中时显示高亮背景和左侧指示条。悬停时显示背景色变化。

支持嵌套子菜单，点击展开/折叠。

### 示例

```xml
<nav-item label="Home" name="home" icon="home"></nav-item>
```
