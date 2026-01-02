SVG 图标组件，用于显示自定义 SVG 图标。

### 参数

#### viewBox

`string`

SVG viewBox 属性，默认 `0 0 24 24`。

#### fill

`string`

SVG 填充颜色。

#### stroke

`string`

SVG 描边颜色。

#### layout

`string`

直接插入 SVG 内部标签，有的话优先显示本图形。

#### src

`string`

SVG 内容或 URL 地址。

### 样式

使用 flex 布局，图标居中显示。支持内联 SVG 代码或外部 SVG 文件。

图标颜色可通过 CSS 的 fill 或 color 属性控制。图标大小自适应容器。

### 示例

```xml
<svg src="<svg>...</svg>"></svg>
```
