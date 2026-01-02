图片查看器组件，支持图片预览和操作。

### 参数

#### src

`string[]` | `string`

图片地址列表。

#### modelValue

`number` | `string`

双向绑定，当前显示的图片索引，默认 0。

### 样式

使用相对定位容器，图片居中显示，支持缩放和拖动。

底部显示操作工具栏，包含缩放、旋转、关闭等按钮。支持手势操作缩放。

### 示例

```xml
<imgviewer :src="imageUrl" @close="onClose"></imgviewer>
```
