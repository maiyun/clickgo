封装了 fabric.js 画布，可以对画布上元素进行拖拽、旋转、缩放，并支持仿 PS 的图层选择模式。

### 参数

#### disabled

`boolean` | `string`

禁用画布交互。

#### autoLayer

`boolean` | `string`

是否允许点击画布对象自动切换激活图层，默认为 `true`。关闭后只有通过 `layer` 属性手动指定的对象才能响应鼠标事件，其他对象完全穿透。

#### transform

`boolean` | `string`

是否显示控制点（自由变换句柄，即缩放/旋转手柄），默认为 `true`。关闭后激活对象仍可拖动，但不能通过控制点进行缩放和旋转。

#### layer

`string`

双向绑定当前激活图层的标识，值为 fabric 对象的 `name` 属性值，无选中时为空字符串。`autoLayer` 为 `false` 时可通过此属性从外部手动切换激活图层。

#### selector

`boolean` | `string`

是否显示框选矩形（拖拽空白区域来多选对象的虚线选框），默认为 `true`。

### 事件

#### init

`(canvas: fabric.Canvas) => void`

加载成功并初始化 fabric.js Canvas 对象后触发，可通过此对象调用所有原生 API。

#### layerchange

`(event: { detail: { prev: string; next: string } }) => void`

激活图层变更时触发（仅 `autoLayer` 为 `true` 时）。`event.detail.prev` 为变更前的图层 name，`event.detail.next` 为变更后的图层 name，取消选中时为空字符串。多选状态下 `event.detail.next` 同样为空字符串。

### 方法

无

### 插槽

无

### 样式

采用相对定位布局。内部包含 canvas 绘图区域，其宽高会随外部容器自动调整。在引擎加载期间，画布会显示 loading 过渡状态；若引擎模块获取失败，则会显示错误提示信息。

## 示例

```xml
<!-- 默认：自动切换图层 + 显示控制点 -->
<fabric v-model:layer="activeLayer" @init="init" @layerchange="onLayerChange"></fabric>

<!-- 仿 PS 普通模式：自动切换图层，但不显示控制点（只能拖动） -->
<fabric :transform="false" v-model:layer="activeLayer" @init="init" @layerchange="onLayerChange"></fabric>

<!-- 手动指定图层（外部面板切换），显示控制点 -->
<fabric :auto-layer="false" :layer="activeLayer" @init="init"></fabric>

<!-- 关闭框选矩形 -->
<fabric :selector="false" @init="init"></fabric>
```
