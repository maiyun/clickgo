Dock 的独立列容器，在同一 `dock` 内使用多个 `dock-column` 即可组成双列或多列侧栏。列内放置 `dock-group`，原有的分组切换、折叠、lazy/cache 和浮层访问保持一致。

顶部按钮与 Dock、DockColumn、Toolbox 共用原生 `sidebar-toggle`，采用相同的双箭头、底色、交互反馈和底部分隔线；Tip 随当前操作更新。

### 参数

#### expanded

`boolean` | `string`

双向绑定，用户希望当前列展开，默认 `true`。空间不足时只自动收起，不改变绑定值；恢复空间后重新展开。

#### width

`number` | `string`

展开时的像素宽度，默认 `280`，最小 `40`。收起宽度由主题决定。

#### label

`string`

列名称，用于展开/收起提示和按钮的无障碍名称，默认空字符串。

### 方法

#### toggle

`() => void`

切换本列展开偏好。自动收起时使用分组图标访问浮层，不能强行挤占工作区。

### 示例

```xml
<dock position="right">
    <dock-column v-model:expanded="expanded" width="240" label="Project">
        <dock-group v-model="tab" grow>
            <dock-item name="layers" label="Layers"></dock-item>
        </dock-group>
    </dock-column>
</dock>
```
