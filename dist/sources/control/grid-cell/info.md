栅格布局子单元格，必须放在 `grid` 容器中使用，支持灵活的跨列配置。

### 参数

#### direction

`'h'` | `'v'` | `undefined`

单元格轴向布局方向。默认继承父级 `grid` 的 `direction` 设置。

#### gutter

`number` | `string`

单元格内部间距（px）。若设置，则覆盖父级 `grid` 的 `itemGutter` 参数。默认 `0`。

#### alignH

`string` | `undefined`

内容水平对齐方式。若设置，则覆盖父级全局对齐配置。

#### alignV

`string` | `undefined`

内容垂直对齐方式。若设置，则覆盖父级全局对齐配置。

#### span

`number` | `string`

基础跨列数。在 `m` 或 `l` 尺寸下，若未单独设置 `sizeM` 或 `sizeL`，则应用此值。默认 `0`。

#### sizeM

`number` | `string`

中等宽度下（600px - 1000px）的跨列数。设置为 `-1` 时强制跨 `1` 列。默认 `0`。

#### sizeL

`number` | `string`

大宽度下（>= 1000px）的跨列数。设置为 `-1` 时强制跨 `1` 列。默认 `0`。

### 事件

无

### 方法

无

### 插槽

无

### 样式

内部采用 flex 弹性布局，默认继承父容器的方向特性。通过 `align-items` 和 `justify-content` 属性，配合 `direction` 的状态，实现单元格内容的精准对齐与分布。

通过 CSS 的 `grid-column` 属性实现横跨多列功能。跨列逻辑会自动响应父容器的宽度状态：在小尺寸（s）模式下强制为单列堆叠，而在较高尺寸下则计算跨列偏移。

样式表现高度抽象，无背景、边框或强制的外边距。这使得单元格能够完美融合于各种设计风格中，开发者可以根据需要为其添加背景色或内阴影等视觉装饰。

### 示例

```xml
<grid-cell :span="2">Cell Content</grid-cell>
```
