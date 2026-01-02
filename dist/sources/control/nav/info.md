侧边导航菜单组件。

### 参数

#### modelValue

`string`

双向绑定，当前选中的菜单项 Name。

#### default

`string`

默认选中的菜单项 Name。

#### hash

`boolean` | `string`

是否与 Form Hash 联动，默认 false。

#### show

`boolean` | `string` | `undefined`

双向绑定，是否显示（Pop 模式下）。

#### logo

`string`

Logo 图片地址。

### 事件

#### layer

`(mode: 'pop' | null) => void`

Layer 模式变化时触发。

#### qs

`(qs: Record<string, any>) => void`

Query String 参数变化时触发。

### 样式

使用 flex 布局，垂直排列导航项。导航具有固定宽度，可显示 Logo 图标。

菜单项具有悬停高亮效果，选中项显示高亮背景和左侧指示条。支持分组标题和图标显示。

Pop 模式下可折叠为图标栏，点击展开完整菜单。支持平滑的展开/收起动画。

### 示例

```xml
<nav v-model="activeName">
    <nav-item name="home">Home</nav-item>
</nav>
```