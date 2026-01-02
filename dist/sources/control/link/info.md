超链接组件。

### 参数

#### url

`string`

链接地址。

#### line

`boolean` | `string`

是否显示下划线，默认 false。

#### align

`'left'` | `'start'` | `'center'` | `'right'` | `'end'`

对齐方式，默认 `left`。

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### type

`'primary'` | `'info'` | `'warning'` | `'danger'` | `'plain'`

链接类型，默认 `info`。

### 样式

使用 flex 布局，文本可根据 align 参数设置对齐方式。链接具有不同的类型（primary/info/warning/danger/plain）对应不同的颜色。

支持显示下划线样式。链接文本支持自动换行，内容区域可通过 slot 自定义。

具有悬停变色效果，禁用时呈现灰色并禁止交互。

### 示例

```xml
<link url="https://example.com">Click me</link>
```
