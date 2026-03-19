侧栏面板分组控件，与 `sform` 和 `sform-item` 搭配使用。在展开模式下作为选项卡面板显示，在收起模式下作为图标按钮列显示。

### 参数

#### modelValue

`number`

双向绑定，当前选中的子项索引，从 0 开始，默认 `0`。

### 事件

无。

### 方法

#### select

`(index: number) => void`

选中指定索引的子项。

#### iconClick

`(index: number) => void`

收起模式下触发，通知父级 `sform` 打开浮动面板。

### 样式

**布局结构**：垂直 flex 容器。展开模式下上方为选项卡栏、下方为内容区域；收起模式下为垂直排列的图标按钮。

**视觉特征**：展开模式选项卡选中态显示主题色文字与底部指示线；收起模式图标按钮激活态显示主题色淡背景。

**交互响应**：展开模式下点击 tab 切换内容；收起模式下点击图标按钮弹出浮动面板。

### 示例

```xml
<sform>
    <sform-group>
        <sform-item label="Colors" icon="/package/res/color.svg">
            <label>Color content</label>
        </sform-item>
    </sform-group>
</sform>
```
