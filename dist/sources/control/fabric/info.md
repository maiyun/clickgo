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

#### mode

`''` | `'pan'` | `'zoom'`

画布交互模式，默认为 `''`（正常模式）。`'pan'` 为平移模式（类似 PS 按住空格键），开启后所有对象不响应事件，拖拽任意位置将平移整个画布 viewport。`'zoom'` 为拖拽缩放模式（类似 PS Z 键），开启后所有对象不响应事件，在画布任意位置按住鼠标并左右拖动即可缩放：向右拖动放大，向左拖动缩小，鼠标按下的点在缩放过程中保持位置不动（锁定点缩放）。

#### zoomMin

`number` | `string`

画布最小缩放倍数，默认为 `0.01`（即 1%）。

#### zoomMax

`number` | `string`

画布最大缩放倍数，默认为 `100`（即 10000%）。

#### artboardWidth

`number` | `string`

画板宽度（像素），默认为 `0`（不启用画板）。与 `artboardHeight` 同时设置时生效：画布扩展为铺满整个控件，中间显示指定尺寸的白色画板，四周为灰色背景。此模式下控制点与拖拽响应在整个控件范围内有效，对象移到画板外时控制点依然可见。

#### artboardHeight

`number` | `string`

画板高度（像素），默认为 `0`（不启用画板）。

#### artboardBg

`string`

画板外背景色，支持任意 CSS 颜色字符串，默认为 `#7a7a7a`。空字符串表示透明，可以透过到 HTML 背景层。仅在启用画板模式（`artboardWidth` 和 `artboardHeight` 同时非 0）时有效。

#### artboardFill

`string`

画板内填充色，支持任意 CSS 颜色字符串，默认为 `#ffffff`（白色）。空字符串表示画板内容透明，可以透过到 HTML 背景层。仅在启用画板模式时有效。

### 事件

#### init

`(canvas: fabric.Canvas) => void`

加载成功并初始化 fabric.js Canvas 对象后触发，可通过此对象调用所有原生 API。

#### layerchange

`(event: { detail: { prev: string; next: string } }) => void`

激活图层变更时触发（仅 `autoLayer` 为 `true` 时）。`event.detail.prev` 为变更前的图层 name，`event.detail.next` 为变更后的图层 name，取消选中时为空字符串。多选状态下 `event.detail.next` 同样为空字符串。

### 属性

#### access.canvas

`fabric.Canvas | undefined`

fabric.js Canvas 对象，在 `init` 事件触发后可用。可通过此对象调用所有 fabric.js 原生 API，如添加/移除对象、获取图层列表、设置视图变换等。

#### access.artboard

`{ left: number; top: number; width: number; height: number; } | null`

当前画板在 canvas 中的位置与尺寸。启用画板模式时（`artboardWidth` 和 `artboardHeight` 同时非 0）此值为对象，包含：
- `left` — 画板左上角在 canvas 中的 x 坐标
- `top` — 画板左上角在 canvas 中的 y 坐标
- `width` — 画板宽度
- `height` — 画板高度

未启用画板模式时为 `null`。用户可据此计算对象相对于画板的坐标（如 `objLeft - access.artboard.left`）。

### 方法

#### zoomActual

恢复画布为实际像素（1:1，即缩放倍数为 1），同时将画板（或 canvas 原点）居中显示。

#### zoomFit

将画布缩放到恰好完整显示画板（有画板模式时）或 canvas（无画板时）的最大比例，同时居中显示。等同于「适应屏幕」。

#### zoomIn

以画布中心为锁定点放大，每次放大 1.25 倍。

#### zoomOut

以画布中心为锁定点缩小，每次缩小为原来的 1/1.25。

#### zoomTo

```typescript
zoomTo(zoom: number, screenX?: number, screenY?: number): void
```

将画布缩放到指定倍数，以 `(screenX, screenY)` 为锁定点（canvas 元素内的屏幕坐标），内部调用 fabric 原生 `zoomToPoint`。缩放结果受 `zoomMin` / `zoomMax` 限制。

**参数**：
- `zoom` — 目标缩放倍数
- `screenX` — 锁定点在 canvas 元素内的屏幕 x 坐标，默认 `0`
- `screenY` — 锁定点在 canvas 元素内的屏幕 y 坐标，默认 `0`

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

<!-- 启用画板模式：控件铺满容器，中间显示 800×600 的白色画板，四周灰色 -->
<fabric :artboard-width="800" :artboard-height="600" @init="init"></fabric>

<!-- 自定义画板模式颜色 -->
<fabric :artboard-width="800" :artboard-height="600" :artboard-bg="'#cccccc'" :artboard-fill="'#eeeeee'" @init="init"></fabric>

<!-- 透明画板：透过到背景 -->
<fabric :artboard-width="800" :artboard-height="600" :artboard-bg="''" :artboard-fill="''" @init="init"></fabric>

<!-- 开启平移模式（类似 PS 空格键） -->
<fabric mode="pan" @init="init"></fabric>

<!-- 开启拖拽缩放模式（类似 PS Z 键） -->
<fabric mode="zoom" @init="init"></fabric>
```

**使用缩放功能**：
```typescript
// 实际像素（1:1），画板居中
this.refs.fabric.zoomActual();

// 适应屏幕，画板居中
this.refs.fabric.zoomFit();

// 放大一级（以画布中心为锁定点）
this.refs.fabric.zoomIn();

// 缩小一级（以画布中心为锁定点）
this.refs.fabric.zoomOut();

// 自定义缩放到 2 倍，以指定点为锁定点
this.refs.fabric.zoomTo(2, 400, 300);

**在 TypeScript 中使用画板和 canvas API**：
```typescript
public init(canvas: fabric.Canvas): void {
    // canvas 为 fabric.Canvas 对象
    // 可调用任何 fabric.js 原生 API
    canvas.add(new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#ff0000'
    }));
    
    // 访问画板位置信息
    if (this.access.artboard) {
        console.log(`画板位置: (${this.access.artboard.left}, ${this.access.artboard.top})`);
        console.log(`画板尺寸: ${this.access.artboard.width} × ${this.access.artboard.height}`);
        
        // 计算对象相对于画板的坐标
        const allObjs = canvas.getObjects();
        allObjs.forEach(obj => {
            const relX = obj.left - this.access.artboard.left;
            const relY = obj.top - this.access.artboard.top;
            console.log(`对象在画板中的相对位置: (${relX}, ${relY})`);
        });
    }
}
