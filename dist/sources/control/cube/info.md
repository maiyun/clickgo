独立的等距设备标识，可用于列表、概览卡片或 Objviewer 节点的 icon 插槽。固定占位内使用 SVG 三面结构，不监听内容尺寸，也不参与父空间的连接与布局。

鼠标悬停时内部视觉层抬升、倾斜，配合顶面扫光、面光与落地阴影；外层占位和连线端点保持不变。动效由 CSS 管理，无计时器或动画回调依赖；减少动态效果时关闭位移、倾斜和扫光，仅保留色彩反馈。

### 参数

#### type

`'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg'`，默认 `cg`。使用框架语义色和用户主题色，三面明度随主题表面变化。

#### size

`'s' | 'm' | 'l' | 'xl'`，默认 `m`，固定占位分别为 `32 / 48 / 64 / 88px`。插槽不会撑大占位，请使用适当尺寸的 Icon 或简短文字。

### 插槽

默认插槽显示在顶面中央。Cube 本身不承担选择或动画事件；点击与状态由外层 Button、列表项或 Objviewer-item 负责。

### 示例

```xml
<cube type="info" size="m"><icon name="cpu" size="s"></icon></cube>
<objviewer-item node-id="server" variant="hub" label="Server" status="online">
    <template v-slot:icon><cube type="cg"><icon name="cpu" size="s"></icon></cube></template>
</objviewer-item>
```
