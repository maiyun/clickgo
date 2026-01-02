选项卡组件。

### 参数

#### tabPosition

`'top'` | `'right'` | `'bottom'` | `'left'`

选项卡位置，默认 `top`。

#### drag

`boolean` | `string`

是否可拖拽排序，默认 false。

#### close

`boolean` | `string`

是否显示关闭按钮，默认 false。

#### tabs

`Array<string | { label?: string; value?: string; drag?: boolean; close?: boolean; }>`

双向绑定，选项卡列表。

#### modelValue

`string`

双向绑定，当前选中的选项卡值。

### 事件

#### close

`(event: ITabCloseEvent) => void`

关闭选项卡时触发，可阻止。

#### change

`(event: ITabChangeEvent) => void`

切换选项卡前触发，可阻止。

#### changed

`(event: ITabChangedEvent) => void`

切换选项卡后触发。

### 样式

使用 flex 布局，包含选项卡头部和内容区域。选项卡头部支持四个方向（top/right/bottom/left）定位。

选中的选项卡高亮显示，具有底部/侧边指示条。支持拖拽排序和关闭按钮。内容超出时显示箭头按钮滚动。

选项卡切换时具有平滑的过渡动画。关闭按钮悬停时高亮显示。

### 示例

```xml
<tab v-model="activeTab" :tabs="['Tab1', 'Tab2', 'Tab3']">
    <div>Content</div>
</tab>
```
