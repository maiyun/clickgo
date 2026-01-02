TUI Markdown 查看器组件。

### 参数

#### modelValue

`string`

Markdown 内容。

### 事件

#### init

`(instance: any) => void`

初始化完成时触发。

### 样式

使用 flex 布局，渲染解析后的 Markdown 内容。支持 GFM 语法。

代码块具有语法高亮。表格、任务列表等扩展语法支持良好。

### 示例

```xml
<tuiviewer :modelValue="markdown"></tuiviewer>
```