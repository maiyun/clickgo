任务栏项组件。

### 参数

#### selected

`boolean` | `string`

是否选中，默认 false。

#### opened

`boolean` | `string`

是否打开，默认 false。

#### multi

`boolean` | `string`

是否多选模式，默认 false。

### 样式

作为 task 的子组件，显示单个任务项。包含窗体图标和标题文本。

悬停时显示背景色变化。当前焦点窗体的任务项高亮显示。

点击可恢复对应的最小化窗体。

### 示例

```xml
<task-item :selected="true"></task-item>
```
