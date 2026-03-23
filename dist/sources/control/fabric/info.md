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

`string[]`

双向绑定当前激活图层列表，值为 fabric 对象 `name` 属性值的数组。`autoLayer` 为 `true` 时由控件根据用户交互自动更新；`autoLayer` 为 `false` 时可通过此属性从外部手动指定激活图层，支持同时传入多个 `name` 以实现多图层联动操作（拖动、自由变换等会同时影响所有指定图层）。无选中时为空数组 `[]`。

#### selector

`boolean` | `string`

是否显示框选矩形（拖拽空白区域来多选对象的虚线选框），默认为 `true`。

#### mode

`''` | `'pan'` | `'zoom'` | `'marquee'`

画布交互模式，默认为 `''`（正常模式）。`'pan'` 为平移模式（类似 PS 按住空格键），开启后所有对象不响应事件，拖拽任意位置将平移整个画布 viewport。`'zoom'` 为拖拽缩放模式（类似 PS Z 键），开启后所有对象不响应事件，在画布任意位置按住鼠标并左右拖动即可缩放：向右拖动放大，向左拖动缩小，鼠标按下的点在缩放过程中保持位置不动（锁定点缩放）。`'marquee'` 为选区模式（类似 PS 选框工具），开启后所有对象不响应事件，在画布任意位置按住鼠标并拖动来绘制矩形选区虚线框，释放后根据 `marqueeCompose` 模式将新选区与已有选区进行组合。

#### marqueeCompose

`'replace'` | `'add'` | `'subtract'` | `'intersect'`

选区组合模式，默认为 `'replace'`，仅在 `mode` 为 `'marquee'` 时有效。

- `'replace'` — 新选区替换已有选区
- `'add'` — 新选区与已有选区合并
- `'subtract'` — 从已有选区中减去新选区覆盖的区域
- `'intersect'` — 仅保留已有选区与新选区的交集部分

在 `'replace'` 模式下，若鼠标在已有选区内按下则进入移动选区状态（拖拽可移动整个选区）；在选区外按下则创建新选区并替换旧选区。

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

`(event: { detail: { prev: string[]; next: string[] } }) => void`

激活图层变更时触发（仅 `autoLayer` 为 `true` 时）。`event.detail.prev` 为变更前的图层 name 数组，`event.detail.next` 为变更后的图层 name 数组，取消选中时为空数组。同时选中多个对象时，`event.detail.next` 包含所有选中对象的 name。

#### marqueechange

`() => void`

选区变更时触发，包括创建新选区、移动选区、组合选区、清除选区等所有导致选区矩形列表发生变化的操作。可在此事件中读取 `access.marquee` 获取最新的选区数据。

#### layerlistchange

`() => void`

图层列表发生变化时触发。以下三种情况均会触发：调用 `addLayer` 新建空图层、调用 `removeLayer` 移除图层、通过 `canvas.add(obj)` 首次将某个新 `name` 对应的对象加入画布时自动注册。可在此事件中读取 `layers` 获取最新的图层列表。

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

#### access.marquee

`Array<{ x: number; y: number; width: number; height: number; }>`

当前选区矩形列表（canvas 内部坐标系），无选区时为空数组。每个矩形包含：
- `x` — 矩形左上角在 canvas 中的 x 坐标
- `y` — 矩形左上角在 canvas 中的 y 坐标
- `width` — 矩形宽度
- `height` — 矩形高度

使用 `subtract` 或 `add` 组合模式时，列表中可能包含多个矩形。

### 属性

#### layers

`string[]`

所有图层名称列表，具有响应式。包含两类图层：
- 通过 `addLayer` 创建的空图层（未包含任何对象）
- 通过 `canvas.add(obj)` 加入对象时自动注册的图层

注意：手动删除某图层内所有对象不会自动移除该图层，需显式调用 `removeLayer` 才能销毁。

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

#### clearMarquee

清除所有选区并触发 `marqueechange` 事件。切换 `mode` 不会自动清除选区，需用户手动调用此方法。

#### getMarqueeRect

```typescript
getMarqueeRect(): { x: number; y: number; width: number; height: number; } | null
```

获取所有选区的外接矩形（canvas 内部坐标）。如果存在多个选区矩形（`add`/`subtract` 模式产生），返回包含所有矩形的最小外接矩形。无选区时返回 `null`。

#### getMarqueeObjects

```typescript
getMarqueeObjects(): fabric.FabricObject[]
```

获取与选区有交集的 fabric 对象列表（排除内部画板矩形）。通过对象的包围盒与选区矩形进行交集判断。

#### getMarqueePolygon

```typescript
getMarqueePolygon(): Array<Array<{ x: number; y: number; }>>
```

获取选区外轮廓的多边形顶点数组（canvas 内部坐标）。对于 `add`/`subtract`/`intersect` 模式产生的不规则选区，会将所有矩形合并后提取外轮廓，并以顶点序列的形式返回。当选区存在多个不相交的独立区域时，返回多个多边形。无选区时返回空数组。

每个多边形为一组有序顶点，按顺序连接即可还原封闭轮廓（末尾顶点与起始顶点隐式闭合）。

#### setMarqueeRect

```typescript
setMarqueeRect(x: number, y: number, width: number, height: number): void
```

以编程方式设置选区为单个矩形（canvas 内部坐标），替换现有选区并触发 `marqueechange` 事件。

**参数**：
- `x` — 矩形左上角 x
- `y` — 矩形左上角 y
- `width` — 矩形宽度
- `height` — 矩形高度

#### addLayer

```typescript
addLayer(name: string): boolean
```

新建一个空图层。若 `name` 已在 `access.layers` 中则返回 `false`，否则将 `name` 加入 `access.layers` 并触发 `layerlistchange` 事件，返回 `true`。

**参数**：
- `name` — 图层名称，须唯一

#### removeLayer

```typescript
removeLayer(name: string): void
```

移除图层及其下属的所有 fabric 对象，并触发 `layerlistchange` 事件。若当前激活图层包含该 `name`，会同时从 `layer` prop 中移除并触发 `update:layer`。`name` 不存在时不做任何操作。

**参数**：
- `name` — 要移除的图层名称

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

<!-- 开启选区模式（类似 PS 选框工具） -->
<fabric mode="marquee" @init="init" @marqueechange="onMarqueeChange"></fabric>

<!-- 选区叠加模式 -->
<fabric mode="marquee" marquee-compose="add" @init="init"></fabric>

<!-- 选区减去模式 -->
<fabric mode="marquee" marquee-compose="subtract" @init="init"></fabric>
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
```

**使用选区功能**：
```typescript
// 清除所有选区
this.refs.fabric.clearMarquee();

// 以编程方式设置选区
this.refs.fabric.setMarqueeRect(100, 100, 200, 150);

// 获取选区外接矩形
const rect = this.refs.fabric.getMarqueeRect();
if (rect) {
    console.log(`选区: (${rect.x}, ${rect.y}) ${rect.width}×${rect.height}`);
}

// 获取选区内的对象
const objs = this.refs.fabric.getMarqueeObjects();
console.log(`选区内有 ${objs.length} 个对象`);
```

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
