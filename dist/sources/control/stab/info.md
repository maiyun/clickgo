轻量化选项卡控件，与 `stab-item` 搭配使用，仅提供选项切换功能，无面板内容区域和方向设置。支持 `default`、`plain`、`light`、`rect` 四种外观样式。

### 参数

#### modelValue

`number`

双向绑定，当前选中的索引，从 0 开始，默认 `0`。

#### type

`string`

外观类型，可选 `default`（底线型）、`plain`（无底边框底线型）、`light`（胶囊型）、`rect`（矩形滑块型），默认 `'default'`。

### 事件

无。

### 样式

**布局结构**：水平 flex 容器，居中对齐，子元素为 `stab-item` 控件。

**视觉特征**：`default` 模式底部带 `.5px` 边框，`light` 模式为无边框间隔胶囊布局，`rect` 模式为圆角灰色背景容器，内有白色滑块通过 `::before` 伪元素实现过渡动画。

**交互响应**：`rect` 模式切换时滑块平滑移动，位置由子 `stab-item` 上报的宽度与偏移量通过 CSS 自定义属性驱动。

### 示例

```html
<stab v-model="tab" type="default">
    <stab-item>Tab 1</stab-item>
    <stab-item>Tab 2</stab-item>
    <stab-item>Tab 3</stab-item>
</stab>
```
