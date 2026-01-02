TUI 编辑器组件（Markdown 编辑器）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### modelValue

`string`

双向绑定，Markdown 内容。

#### visual

`boolean` | `string`

是否可视化模式，默认 false。

#### theme

`'dark'` | `'light'`

主题，默认 `light`。

### 事件

#### imgselect

`(callback: (url: string, opt?: { alt?: string; width?: number; height?: number; align?: string }) => void) => void`

选择图片时触发，参数为回调函数。

#### imgupload

`(event: ITuieditorImguploadEvent) => void`

上传图片时触发，包含 `file` 和 `callback`。

#### init

`(instance: any) => void`

编辑器初始化完成时触发。

#### html

`(html: string) => void`

HTML 内容变化时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。顶部显示工具栏。

支持编辑区和预览区并排显示或切换显示。工具栏包含 Markdown 格式化按钮。

### 示例

```xml
<tuieditor v-model="markdown" @init="onInit"></tuieditor>
```
