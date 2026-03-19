侧栏面板容器控件，类似 Adobe Photoshop 右侧面板区域。支持展开和收起两种模式，与 `sform-group` 和 `sform-item` 搭配使用。展开模式下显示分组面板，收起模式下显示图标栏并支持浮动面板弹出。

### 参数

#### expanded

`boolean` | `string`

双向绑定，是否展开，默认 `true`。

#### width

`number` | `string`

展开模式下的面板宽度，默认 `280`。

### 事件

无。

### 方法

#### toggle

`() => void`

切换展开/收起状态。

#### toggleFloat

`(groupIndex: number, itemIndex: number) => void`

收起模式下打开或关闭指定分组的浮动面板。

#### closeFloat

`() => void`

关闭当前浮动面板。

### 样式

**布局结构**：垂直 flex 容器，顶部为展开/收起切换按钮，下方为内容区域。展开时显示完整面板宽度，收起时压缩为 40px 图标栏。

**视觉特征**：左侧带边框分隔，背景使用 `--g-plain-background`。切换按钮悬停时显示背景色变化。

**交互响应**：点击顶部按钮切换展开/收起状态；收起模式下点击分组图标弹出浮动面板。

### 示例

```xml
<sform :expanded="expanded" @update:expanded="expanded = $event">
    <sform-group>
        <sform-item label="Colors" icon="/package/res/color.svg">
            <label>Color settings</label>
        </sform-item>
        <sform-item label="Layers" icon="/package/res/layer.svg">
            <label>Layer list</label>
        </sform-item>
    </sform-group>
</sform>
```
