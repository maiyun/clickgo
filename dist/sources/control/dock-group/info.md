Dock 分组控件，使用稳定的字符串 `name` 管理选中项，不依赖子项顺序。

展开状态下，普通分组按内容自然高度布局，只有设置 `grow` 的分组共享剩余高度；总高度不足时按内容高度压缩并在内容区滚动。浮层也按内容高度显示，`grow` 浮层填充可用高度，最多 `400px`。分组标题栏右侧可折叠内容。可直接放在 `dock` 内，也可放在 `dock-column` 内。

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
