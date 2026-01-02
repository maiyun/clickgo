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

双向绑定，当前步骤值。

### 样式

使用 flex 布局，步骤项水平排列。每个步骤显示序号/图标、标题和可选的描述文字。

当前步骤和已完成步骤显示主题色，未完成步骤显示灰色。步骤之间用连接线连接。

朴素模式下无背景色和边框。步骤项支持自定义图标。

### 示例

```xml
<step :data="steps" v-model="currentStep"></step>
```