菜单列表项组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### alt

`string`

快捷键提示文本。

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