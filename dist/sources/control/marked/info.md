Markdown 渲染组件。

### 参数

#### modelValue

`string`

Markdown 内容字符串。

#### css

`string`

CSS 样式字符串。

### 事件

#### init

`() => void`

初始化完成时触发。

### 样式

使用 block 布局，渲染解析后的 Markdown 内容。支持标题、列表、代码块、表格等常用语法。

代码块具有语法高亮。链接默认在新窗口打开。图片自适应宽度。

### 示例

```xml
<marked :modelValue="markdownText" @init="onInit"></marked>
```
