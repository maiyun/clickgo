进度条组件。

### 参数

#### modelValue

`number` | `string`

双向绑定，当前进度值（0-100），默认 0。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

进度条类型，默认 `default`。

### 样式

使用 flex 布局，包含背景轨道和进度填充条。进度条具有圆角样式。

支持多种类型（default/primary/info/warning/danger）对应不同的进度条颜色。进度填充条宽度根据 modelValue 值动态变化。

进度变化时具有平滑的过渡动画效果。

### 示例

```xml
<progress :modelValue="50" type="primary"></progress>
```
