桌面软件侧栏停靠容器。与 `dock-group`、`dock-item` 搭配使用；需要多列时，在 Dock 内并排放置 `dock-column`，每列拥有独立的宽度和展开偏好。单列旧用法保持兼容，业务状态由 Form/Panel 编排。

所属 Form 宽度小于 `600px` 时，Dock 自动收起。多列布局还会根据 Form、浏览器视窗和 `min-content-width` 提前收起空间不足的列，按插槽顺序优先收起前面的列；将重要的主列放在最后。尺寸恢复后自动恢复用户的展开偏好，不改写双向绑定值。所有列共享浮层调度，同一 Form 同时只显示一个 Dock 浮层。浮层的宽度和高度限制在所属 Form 与浏览器视窗的交集内。

顶部按钮与 Dock、DockColumn、Toolbox 共用原生 `sidebar-toggle`，采用相同的双箭头、底色、交互反馈和底部分隔线；Tip 随当前操作更新。

### 参数

#### expanded

`boolean` | `string`

双向绑定，是否展开，默认 `true`。

#### width

`number` | `string`

展开宽度，默认 `280`。

#### position

`'left'` | `'right'`

侧栏所在位置，控制边框、折叠箭头和浮动面板的展开方向，默认 `right`。

#### minContentWidth

`number` | `string`

多列布局为其他工作区保留的宽度，默认 `320` 像素。仅用于包含 `dock-column` 的 Dock；应包含工具箱、其他侧栏及工作区需要的宽度。

### 方法

#### toggle

`() => void`

切换展开状态。

#### closeFloat

`() => void`

关闭当前浮动面板。

### 示例

```xml
<dock v-model:expanded="expanded" position="left">
    <dock-group v-model="selected">
        <dock-item name="layers" label="Layers" lazy cache>
            <layer-list></layer-list>
        </dock-item>
    </dock-group>
</dock>
```

```xml
<dock position="right" min-content-width="360">
    <dock-column v-model:expanded="projectExpanded" width="220" label="Project">
        <dock-group v-model="projectTab" grow>
            <dock-item name="project" label="Project"></dock-item>
            <dock-item name="history" label="History"></dock-item>
        </dock-group>
    </dock-column>
    <dock-column v-model:expanded="settingsExpanded" width="300" label="Settings">
        <dock-group v-model="settingsTab" grow>
            <dock-item name="generate" label="Generate"></dock-item>
        </dock-group>
        <dock-group model-value="edit">
            <dock-item name="edit" label="Edit"></dock-item>
        </dock-group>
    </dock-column>
</dock>
```

同一个 Dock 中不要混用直接的 `dock-group` 与 `dock-column`。多列宽度由各列决定，根 Dock 的 `width` 不参与多列分配。
