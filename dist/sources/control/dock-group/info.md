Dock 分组控件，使用稳定的字符串 `name` 管理选中项，不依赖子项顺序。

展开状态下，普通分组按内容自然高度布局，只有设置 `grow` 的分组共享剩余高度；总高度不足时压缩并在内容区滚动。可拖动相邻展开分组之间的横向分隔条，重新分配两组的总高度。手动高度优先于 `grow`，折叠、收起侧栏后仍保留；将 `height` 设为 `0` 可恢复自动布局。可直接放在 `dock` 内，也可放在 `dock-column` 内。

标题栏保留折叠按钮，提供 `menu` 插槽时另显示省略号菜单。收起侧栏后的浮层标题同样支持菜单。浮层按内容高度显示，`grow` 浮层填充 Form 与视窗内的可用高度。

标题栏保持单行，空间不足时标签文字省略，悬停通过 Tip 显示完整名称。标签过多时可横向滚动或使用滚轮浏览，不显示浏览器原生滚动条；折叠与菜单按钮保留在滚动区域外。

### 参数

#### modelValue

`string`

双向绑定，当前选中的 `dock-item` name。

#### collapsed

`boolean` | `string`

双向绑定，当前分组是否折叠，默认 `false`。

#### collapsible

`boolean` | `string`

是否显示分组折叠按钮，默认 `true`。

#### grow

`boolean` | `string`

是否填充所在 Dock 或 DockColumn 的剩余高度，默认 `false`。多个 `grow` 分组均分剩余空间。

#### height

`number` | `string`

双向绑定，分组包含标题、内容和边框的总高度，单位像素，默认 `0`（自动）。拖拽过程实时预览，完成后发出 `update:height`；Escape、指针取消或卸载撤销未完成调整，不提交事件。窗口空间不足时允许缩小，不覆盖保存值。

#### minHeight

`number` | `string`

拖拽时的总高度下限，默认 `60`，至少保留标题栏。若当前高度已低于下限，拖动不会强制放大分组。初始 `height` 不受此参数强制修正。

#### resizable

`boolean` | `string`

是否允许拖拽调整分组高度，默认 `true`；同时控制分隔条的键盘调整。相邻两组均展开且允许调整时显示分隔条，拖动时一组增高、另一组相应缩小，两组总高度不变。聚焦分隔条后，上下方向键每次调整 `10px`，同时按 Shift 调整 `1px`。

#### maxFloatHeight

`number` | `string`

收起侧栏后的浮层内容容器高度上限，默认 `0`，表示使用 Form 与视窗内的可用高度；正数为像素上限。

### 插槽

#### menu

标题栏省略号弹出的原生菜单内容，可放 `menulist`。作用域参数 `name` 为当前选中的 `dock-item` 名称；切换标签或展开模式时关闭菜单。未提供此插槽时隐藏菜单按钮。

```xml
<dock-group v-model="selected" v-model:height="panelHeight">
    <dock-item name="layers" label="Layers"></dock-item>
    <template v-slot:menu="{name}">
        <menulist>
            <menulist-item @click="resetPanel(name)">Reset panel</menulist-item>
        </menulist>
    </template>
</dock-group>
```

### 方法

#### toggleCollapsed

`() => void`

切换分组折叠状态。

### 示例

```xml
<dock-group v-model="selected" v-model:collapsed="collapsed" grow>
    <dock-item name="brush" label="Brush"></dock-item>
    <dock-item name="layers" label="Layers"></dock-item>
</dock-group>
```
