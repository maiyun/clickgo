节点关系空间。以稳定 ID 声明节点与连接，自动布局和尺寸测量在控件内部完成；平移、滚轮、双指缩放和视口适应复用 Panzoom。不是 3D 场景或流程编辑器。

### 参数

#### edges

`clickgo.control.IObjviewerEdge[]`，默认 `[]`。每条连接含 `source`、`target` 节点 ID，可选 `label`、`status`（`default / online / warning / offline`）。端点不存在时暂不绘制，恢复节点后自动出现。状态与是否启用动画均由应用提供，不从端点猜测。

每条连接可独立设置动画：

- `animation`：`none / dash / dots`，默认 `none`；分别为静止连接、流动虚线、静止底线上的多个移动圆点。颜色跟随连接状态，选中关联节点时使用主题色。
- `direction`：`forward / reverse / both`，默认 `forward`；分别沿 source → target、target → source、同时双向流动。仅改变动画，不交换节点关系或改变布局。
- `duration`：周期秒数，默认 `3`，限制为 `0.25–60`；dots 为圆点走完整条路径的时间，dash 为虚线纹理的一个动画周期。
- `dotCount`：dots 模式每个方向的圆点数，默认 `3`，取整并限制为 `1–8`。圆点均匀错开，双向时两组错开半个间隔。

路径随节点、容器与布局变化更新；减少动态效果时隐藏移动圆点并停止虚线动画，保留静止连接。

#### layout

`'auto' | 'radial' | 'tree' | 'manual'`，默认 `auto`。自动模式在 600px 以下容器改为紧凑纵排与侧边关系线，宽容器使用环形。显式 radial 固定环形，以节点的可视标识中心定位；tree 分层适合设备树和依赖概览；manual 使用各节点的 x/y。支持环、孤立节点与多个连通分量，不持续运行力模拟。非紧凑布局使用直线；中心节点的标识与说明共同决定端点，连线遇到说明时止于说明外缘，不穿字或局部绕行。不提供通用避障路由或端口编辑。

#### root

`string`，默认空。优先根节点 ID；未提供时优先无入边节点，再选择连接较多的节点。

#### gap

`number | string`，默认 `48`，环形和分层布局的最小间隔，单位 CSS 像素，限制为 `24–400`。紧凑模式的纵向间隔固定为 24px。

#### bg

`'none' | 'dot' | 'grid'`，默认 `none`。

#### modelValue

`string`，当前选中节点 ID，默认空，可用 v-model。移除选中节点时清空绑定，不触发 select。

#### disabled

`boolean | string`，默认 false，禁用视图手势、工具栏和节点选择。

#### label

`string`，空间无障碍名称，由应用提供本地化文案。

### 事件

#### select

`clickgo.control.IObjviewerSelectEvent`：`detail: {nodeId, label}`。点击、Enter 或空格激活不同的可操作节点时触发；重复选择不触发。控件不执行业务跳转。

### 方法

- `fit()`：恢复完整显示，之后随视口缩放继续适应。
- `zoom(factor)`：围绕视口中心按相对比例缩放，如 `1.2`。用户缩放/平移后调整窗口保持当前比例和中心；内容边界变化重新适应。

### 插槽与尺寸

默认插槽仅放直属 objviewer-item，可用 v-for/v-if。节点 ID 必须非空且唯一；无效项隐藏，重复 ID 只使用第一项。`empty` 插槽自定义空态。

给容器明确高度或 flex 剩余空间；场景按真实节点尺寸及 48px 留白计算，不用屏幕坐标反推，也无需 addLine、动画回调或延时 refresh。首次完整显示，大图可通过工具栏/手势放大查看文字。0 大小或隐藏视口恢复后自动适应；减少动态效果时连接静止。

### 示例

```xml
<objviewer :edges="[{source: 'gateway', target: 'device', status: 'online', animation: 'dots', direction: 'both', duration: 3, dotCount: 3}]" root="gateway" v-model="selected" style="height:420px;">
    <objviewer-item node-id="gateway" variant="hub" label="Gateway" status="online" icon="cpu"></objviewer-item>
    <objviewer-item node-id="device" label="Device" description="Branch office" status="online"></objviewer-item>
</objviewer>
```
