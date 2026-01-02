任务栏组件，用于显示最小化的窗体。

### 参数

#### position

`string`

任务栏位置，默认 bottom。

### 样式

使用 flex 布局，任务项水平排列。通常用于显示最小化的窗体。

任务项显示窗体图标和标题，点击可恢复窗体。支持拖拽排序。

当前焦点窗体的任务项高亮显示。

### 示例

```xml
<task>
    <task-item v-for="form in forms" :key="form.id" :form="form"></task-item>
</task>
```
