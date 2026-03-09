封装了 fabric.js 画布，可以对画布上元素进行拖拽、旋转、缩放。

### 参数

#### disabled

`boolean` | `string`

禁用画布交互

### 事件

#### init

`(canvas: any) => void`

加载成功并初始化 fabric js 的 canvas 对象后触发，利用此抛出对象可执行原生的所有绘图和操作方法。

### 方法

无

### 插槽

无

### 样式

采用相对定位布局。内部包含 canvas 绘图区域，其宽高会随外部容器自动调整。在引擎加载期间，画布会显示 loading 过渡状态；若引擎模块获取失败，则会显示错误提示信息。

## 示例

```xml
<fabric @init="init"></fabric>
```
