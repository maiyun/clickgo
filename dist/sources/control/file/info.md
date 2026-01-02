文件选择组件。

### 参数

#### accept

`string[]` | `string`

接受的文件类型。

#### multi

`boolean` | `string`

是否多选，默认 false。

#### dir

`boolean` | `string`

是否选择目录，默认 false。

### 事件

#### change

`(files: File[]) => void`

文件选择改变时触发。

### 样式

使用 flex 布局，显示文件选择按钮和已选文件列表。按钮具有圆角边框。

已选文件显示文件名和删除按钮。支持拖拽上传文件。

### 示例

```xml
<file v-model="files" accept="image/*" :multi="true"></file>
```