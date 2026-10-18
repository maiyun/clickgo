独立的立方体设备标识，可用于列表、概览卡片或 Objviewer 节点的 icon 插槽。固定占位内以三个 SVG 平面构成三维立方体，按统一视点投影；不监听内容尺寸，也不参与父空间的连接与布局。

鼠标悬停时立方体向上和向前抬升并轻微转动，顶面与侧面的边随透视共同变化；顶面插槽、扫光同步跟随，落地阴影留在原处并变得柔和。外层占位和连线端点保持不变。动效由 CSS 三维面结构管理，无计时器或动画回调依赖；减少动态效果时保持静止立体姿态并关闭扫光，仅保留色彩反馈。

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
