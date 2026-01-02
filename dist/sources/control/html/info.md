HTML 内容组件，用于渲染 HTML 字符串。

### 参数

#### html

`string`

HTML 内容字符串。

#### css

`string`

CSS 样式字符串。

### 样式

使用 block 布局，内部渲染解析后的 HTML 内容。支持基础的 HTML 标签和样式。

内容会进行安全处理，防止 XSS 攻击。链接默认在新窗口打开。

### 示例

```xml
<html :html="htmlString" :css="cssString"></html>
```