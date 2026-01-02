图形绘制容器组件，用于绘制和操作 SVG 图形。

### 参数

#### modelValue

`Record<string, IDItem>`

图形数据对象，key 为图形 ID，value 为图形属性。

#### selected

`string[]` | `string`

双向绑定，当前选中的图形 ID 列表。

### 样式

使用 SVG 容器，支持绘制矩形、圆形、椭圆、线条、多边形等图形。选中的图形显示控制点。

支持框选多个图形，选中图形可拖动移动和调整大小。具有选区矩形指示框。

图形可设置移动和缩放权限。支持 Ctrl/Command 键多选。

### 示例

```xml
<box :modelValue="shapes" v-model:selected="selectedIds"></box>
```
