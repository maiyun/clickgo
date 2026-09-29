侧栏顶部的轻量展开/收起按钮。Dock、DockColumn 和 Toolbox 共用此控件，统一双箭头、20px 高度、主题底色、悬停/按下反馈、键盘焦点和底部分隔线。

### 参数

#### expanded

`boolean` | `string`

双向绑定，当前是否展开，默认 `true`。

#### position

`'left'` | `'right'`

侧栏的逻辑侧边，默认 `right`。收起箭头指向外侧，展开箭头指向工作区；RTL 自动镜像。

#### label

`string`

侧栏名称，补充到操作提示中，默认空字符串。提示与无障碍名称随展开状态更新。

#### tipLabel

`string`

覆盖默认操作提示和无障碍名称，默认空字符串；可用于单列/双列等不同展开方式。

### 方法

#### toggle

`() => void`

发出 `update:expanded`，实际状态由宿主更新。

### 键盘

Enter/Space 请求切换一次展开状态；忽略持续按住时的重复事件，避免触发宿主的相同快捷键。Tab 保持正常焦点导航。

### 示例

```xml
<sidebar-toggle v-model:expanded="expanded" position="left" label="Project"></sidebar-toggle>
```
