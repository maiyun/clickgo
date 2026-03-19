侧栏面板子项控件，与 `sform-group` 搭配使用。每个子项在展开模式下作为选项卡页面显示内容，在收起模式下显示为图标按钮。

### 参数

#### label

`string`

选项卡显示文本。

#### icon

`string`

收起模式下显示的图标路径，支持 svg、图片或 Data URL。

### 事件

无。

### 方法

无。

### 样式

**布局结构**：flex 容器，默认隐藏，选中时显示，内容占满可用空间。

**视觉特征**：选中态通过 `display: flex` 切换显示，支持内容溢出滚动。

**交互响应**：由父级 `sform-group` 控制选中状态切换，无自身交互。

### 示例

```xml
<sform-group>
    <sform-item label="Colors" icon="/package/res/color.svg">
        <label>Color settings</label>
    </sform-item>
    <sform-item label="Layers" icon="/package/res/layer.svg">
        <label>Layer list</label>
    </sform-item>
</sform-group>
```
