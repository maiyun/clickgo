轻量化选项卡子项控件，与父级 `stab` 控件搭配使用。点击后通知父级更新选中索引，并在 `rect` 模式下自动上报自身宽度与位置以驱动滑块动画。

### 参数

#### disabled

`boolean` | `string`

是否禁用此项，禁用后不可点击选中，默认 false。

### 事件

无。

### 方法

无。

### 插槽

无（`default` 插槽用于放置选项卡标签文本或内容）。

### 样式

**布局结构**：块级 flex 元素，通过 `selected` 类标记当前选中状态，并从父级 `stab` 获取 `type` 类以切换对应外观。

**视觉特征**：`default`/`plain` 模式选中时显示主题色文字与底部 3px 指示线；`light` 模式选中时显示圆角灰色背景；`rect` 模式下元素叠在滑块之上，选中态保持默认文字色。

**交互响应**：点击时立即切换选中状态，`rect` 模式下同步触发 `resize` 上报位置给父级；所有状态变化均通过 `var(--g-transition)` 过渡动画。

### 示例

```html
<stab v-model="tab">
    <stab-item>Tab 1</stab-item>
    <stab-item>Tab 2</stab-item>
    <stab-item>Tab 3</stab-item>
</stab>
```
