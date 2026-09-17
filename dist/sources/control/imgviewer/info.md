图片查看器，支持鼠标拖动、双指移动与缩放、围绕鼠标位置的滚轮缩放。新图片完整显示并居中。

### 参数

#### src

`string[]` | `string`，图片地址或地址列表，默认空数组。支持包内路径、HTTP(S)、Data URL、Blob URL。Blob URL 的创建和释放由调用方负责。

#### modelValue

`number` | `string`，当前图片索引，默认 `0`，保持原有绑定含义。

#### zoom

`number` | `string`，双向绑定缩放比例，默认 `1`，范围 `0.05` 至 `5`。`1` 表示原始尺寸。切换图片时自动适应视口。

### 事件

#### change

视图变化时触发，参数为 `clickgo.control.IPanzoomView`，包含 `zoom`、`x`、`y`。

### 方法

- `zoomFit()`：完整显示并居中，调整视口大小时继续适应。
- `zoomActual()`：以原始尺寸居中显示。

### 示例

```xml
<imgviewer ref="viewer" :src="images" v-model="index" v-model:zoom="zoom" style="flex: 1;"></imgviewer>
<slider v-model="zoom" min="0.05" max="5" step="0.01" label="缩放"></slider>
<button @click="refs.viewer.zoomFit()">适应</button>
```
