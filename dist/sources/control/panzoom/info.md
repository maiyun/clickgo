平移缩放视口。插槽可承载 Canvas、SVG、图片等内容，不转换为图片，不接管内容重绘。支持鼠标拖动、双指平移与缩放、滚轮缩放，无原生滚动条。

### 参数

#### contentWidth

`number` | `string`，内容原始宽度，默认 `0`。Canvas 应与其绘图坐标宽度一致。

#### contentHeight

`number` | `string`，内容原始高度，默认 `0`。

#### modelValue

`number` | `string`，双向绑定绝对缩放比例，默认 `1`。`1` 表示内容像素与 CSS 像素一一对应，可直接绑定 Slider。外部更改比例时围绕视口中心缩放。

#### x

`number` | `string`，双向绑定水平偏移，单位为视口 CSS 像素，默认 `0`。

#### y

`number` | `string`，双向绑定垂直偏移，默认 `0`。

#### zoomMin

`number` | `string`，最小缩放比例，默认 `0.05`，必须大于 `0`。

#### zoomMax

`number` | `string`，最大缩放比例，默认 `20`，不得小于 `zoomMin`。

#### autoFit

`boolean` | `string`，默认 `true`。首次显示和内容尺寸改变时完整显示并居中；手动操作后调整视口保持当前比例和中心。调用 `zoomFit()` 后恢复随视口适应。仅重绘内容不会重置视图。保存/恢复指定视图时设为 `false`。

#### disabled

`boolean` | `string`，是否禁用用户交互，默认 `false`。禁用或卸载时结束活动手势，取消未提交的编辑。

#### mode

`'pan'` | `'edit'`，默认 `pan`。`edit` 模式单指/鼠标操作通过编辑事件交给调用方；第二指加入立即取消尚未提交的编辑并转为平移缩放，直到所有手指离开才允许下一次编辑。滚轮仍可缩放。

### 事件

#### change

视图改变时触发，参数为 `clickgo.control.IPanzoomView`：`{ zoom, x, y }`。可与 `v-model`、`v-model:x`、`v-model:y` 同时使用。

#### editstart

内容内单指/鼠标按下时触发。参数为 `clickgo.control.IPanzoomEditEvent`：`{ x, y, inside, event }`，坐标已转换为原始内容坐标。此时只能开始临时编辑，不应写入不可撤销的历史。

#### editmove

编辑移动时触发，参数同 `editstart`。移出内容后 `inside` 为 `false`，由调用方决定是否绘制。

#### editend

单指/鼠标正常抬起时提交编辑，参数同 `editstart`。调用方可在这里写入历史。

#### editcancel

第二指加入、滚轮打断、指针取消、窗口失焦、模式切换、禁用或卸载时取消编辑。调用方应恢复 `editstart` 前的状态。参数坐标为最后一次编辑位置，`event` 在主动销毁时可能不存在。每次编辑只产生一次 `editend` 或 `editcancel`。

### 方法

- `zoomTo(zoom, x?, y?)`：围绕视口内指定坐标缩放，默认视口中心。
- `zoomFit()`：完整显示并居中，比例仍受上下限约束。
- `zoomActual()`：以 `1:1` 居中，比例仍受上下限约束。
- `toLocal(clientX, clientY)`：浏览器坐标转内容坐标，返回 `{ x, y, inside }`。

控件自身聚焦时，`+` / `-` 缩放，`0` 适应，`1` 原始尺寸。不要在插槽上重复绑定 Pointer 手势；编辑请使用上述事件，保证多指取消语义。

### 示例

```xml
<panzoom ref="viewer" v-model="zoom" content-width="640" content-height="480" style="flex: 1;">
    <canvas ref="canvas" width="640" height="480"></canvas>
</panzoom>
<slider v-model="zoom" min="0.05" max="20" step="0.01" label="缩放"></slider>
<button @click="refs.viewer.zoomFit()">适应</button>
```
