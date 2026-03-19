步骤条组件。

### 参数

#### data

`Array<{ icon?: string; label?: string; value?: string; desc?: string; }>`

步骤数据列表。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### modelValue

`string`

双向绑定，当前步骤值。传入 `#` 时表示全部完成状态。

### 事件

#### click

点击步骤节点时触发。

参数：`detail.index` `number`，被点击节点的索引；`detail.value` `string`，被点击节点的值；`detail.label` `string`，被点击节点的标签文字。

### 样式

使用 flex 布局，步骤项水平排列。每个步骤显示序号/图标、标题和可选的描述文字。已完成步骤显示对勾图标（自定义图标步骤除外）。

当前步骤和已完成步骤显示对应主题色，未开始步骤显示默认颜色。非朴素模式下步骤之间以连接线相连，连接线颜色随完成进度变化。

朴素模式下以箭头替代连接线，步骤横向平铺排列，不显示描述文字。

### 示例

```xml
<step :data="steps" v-model="currentStep" @click="onStepClick"></step>
```