文章编辑器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### preview

`boolean` | `string`

双向绑定，是否预览模式，默认 false。

#### pre

`string`

图片前缀地址。

#### modelValue

`any[]`

双向绑定，内容数据。

### 事件

#### imgselect

`(callback: (url: string) => void) => void`

选择图片时触发，参数为回调函数，调用时传入图片 URL。

### 样式

使用 flex 布局，垂直排列工具栏和内容区域。编辑器填满容器空间。支持段落和图片混排编辑。

支持加粗、斜体等文本样式。可切换编辑/预览模式。

### 示例

```xml
<arteditor v-model="content" @imgselect="onSelect"></arteditor>
```
