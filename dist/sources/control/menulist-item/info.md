菜单列表项组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### alt

`string`

快捷键，以 `+` 分隔各键名，如 `Ctrl+Alt+T`、`Ctrl+Shift+S`。支持的修饰键：`Ctrl`、`Alt`、`Shift`、`Meta`，在 macOS 上会自动替换为对应符号（`⌘` `⌥` `⇧`）。若只传单个键名（如 `T`），则自动前置 `Ctrl`/`⌘`。快捷键仅在菜单项所属窗体获得焦点时生效，触发效果与点击菜单项一致。

#### altOnly

`boolean` | `string`

是否仅显示 `alt` 的快捷键提示，默认 false。模板中写作 `alt-only`。
开启后不注册、不拦截快捷键，鼠标点击和 check/radio 行为保持正常。
支持动态切换。适合快捷键已由编辑器或浏览器处理的菜单项。

#### type

`string`

菜单项类型，可选 `check`、`radio`。

#### label

`string`

radio 类型时的标签值。

#### modelValue

`string` | `boolean`

双向绑定，当前选中值。

### 事件

#### check

`(value: string | boolean) => void`

点击 check/radio 类型菜单项时触发。

### 样式

作为 menulist 的子组件，显示单个菜单项。使用 flex 布局，包含图标、文本和快捷键提示。

悬停时高亮显示背景色。check 类型显示勾选图标，radio 类型显示圆点图标。

可包含子菜单，悬停时在右侧展开。禁用时呈现灰色。

### 示例

```xml
<menulist-item label="Open" alt="Ctrl+O" @click="onOpen"></menulist-item>
```

```xml
<menulist-item alt="X" alt-only @click="onCut">剪切</menulist-item>
```
