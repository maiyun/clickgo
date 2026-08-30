Dock 分组控件，使用稳定的字符串 `name` 管理选中项，不依赖子项顺序。

展开状态下，各分组先按内容自然高度布局，再共享剩余高度；总高度不足时才按内容高度压缩并在内容区滚动。`grow` 可提高某个分组分配剩余高度的权重。分组标题栏右侧可折叠内容，折叠后其他分组自动接管空间。

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

是否提高占用 Dock 剩余高度的权重，默认 `false`。

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
