图片上传组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### length

`number` | `string`

显示的图片数量限制，默认 6。

#### drag

`boolean` | `string`

是否可拖拽排序，默认 false。

#### pre

`string`

图片 URL 前缀。

#### multi

`boolean` | `string`

是否多选上传，默认 false。

#### progress

`number` | `undefined`

上传进度（0-100）。

#### modelValue

`Array<string | { title?: string; src: string; }>`

双向绑定，已上传的图片列表。

### 事件

#### select

`() => void`

点击上传按钮时触发。

#### remove

`(event: IUploaderRemoveEvent) => void`

删除图片时触发，可阻止。

#### changed

`() => void`

列表变化后触发。

### 样式

使用 flex 布局，图片以网格形式排列。每个图片显示缩略图，悬停显示删除按钮。

上传按钮显示加号图标，上传中显示进度条。支持拖拽排序图片顺序。

图片具有圆角边框，删除按钮悬停时高亮显示。

### 示例

```xml
<uploader v-model="images" @select="onSelect"></uploader>
```