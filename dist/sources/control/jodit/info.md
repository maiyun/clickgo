富文本编辑器组件（基于 Jodit）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### placeholder

`string`

占位符。

#### modelValue

`string`

双向绑定，HTML 内容。

#### theme

`'dark'` | `'light'`

主题，默认 `light`。

### 事件

#### imgselect

`(callback: (url: string, alt?: string) => void) => void`

选择图片时触发，参数为回调函数。

#### init

`(instance: any) => void`

编辑器初始化完成时触发。

#### text

`(text: string) => void`

纯文本内容变化时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。顶部显示工具栏，包含格式化按钮。

支持文字样式、段落、列表、表格、图片等。可视化编辑所见即所得。

### 示例

```xml
<jodit v-model="content" @init="onInit"></jodit>
```
