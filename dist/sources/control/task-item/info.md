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

是否包含多个窗体，默认 false。

### 样式

作为 task 的子组件，显示单个任务项。包含窗体图标和标题文本。

悬停时显示背景色变化。当前焦点窗体的任务项高亮显示。

点击行为由调用方处理；控件不读取或恢复窗体。显示模式和位置跟随父 task。bar 和 dock 的运行标记都位于 position 指定的一侧。dock 模式使用短横线，焦点应用的横线稍长；多窗体时，短线和小点作为一组居中显示。

### 示例

```xml
<task-item :selected="true"></task-item>
```
