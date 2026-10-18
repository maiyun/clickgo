Objviewer 的直属节点。节点自己显示内容和状态，父空间负责位置与连接；不再承担通用 Layout 的职责。

### 参数

#### nodeId

`string`，默认空，必填的稳定唯一 ID，用于连接和选择。不使用 ref 或 DOM 引用作为端点。

#### label

`string`，名称，默认空，空时显示 nodeId。

#### description

`string`，辅助说明，默认空，可显示地址、位置、数量等。

#### icon

`string`，框架图标名称，默认空。hub 未提供时显示 cpu。

#### status

`'default' | 'online' | 'warning' | 'offline'`，默认 `default`。状态通过圆点与本地化文字共同表达，不只依靠颜色；语义色跟随主题。

#### statusLabel

`string`，默认空，覆盖状态文字，应用可用于“维护中”等业务状态说明。

#### variant

`'card' | 'hub'`，默认 `card`。卡片为 184px 宽、自然高度；中心节点为 144px 宽，含 72px 圆形标识。名称/描述自动换行，自定义内容的尺寸变化自动通知空间。父空间自动切换紧凑模式时优先展示名称和状态，辅助说明及卡片图标收起；完整说明保留在无障碍描述，应用也可根据选中 ID 显示详情。

#### pulse

`boolean | string`，默认 true，仅 online 状态显示 Circle 的同色光圈；减少动态效果时静止。

#### disabled

`boolean | string`，默认 false，禁止鼠标和键盘选择，状态与内容仍可见。

#### x

`number | string`，默认 `0`，manual 布局下的内容水平坐标。

#### y

`number | string`，默认 `0`，manual 布局下的内容垂直坐标。坐标可为负数，空间统一归一化并留白。

### 插槽

`icon` 自定义标识，可放 Icon、Cube 或图片；默认插槽在说明下增加内容。节点内独立按钮/输入不触发节点选择。选择事件由 Objviewer 统一发出。

### 示例

```xml
<objviewer-item node-id="worker" label="Background worker" status="warning" description="Queue waiting">
    <tag type="warning" plain size="xs">12 jobs</tag>
</objviewer-item>
```
