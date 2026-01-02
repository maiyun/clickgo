设置列表项组件。

### 参数

#### direction

`'h'` | `'v'`

布局方向，默认 `h`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式，默认 `center`。

#### title

`string`

设置项标题。

#### note

`string`

设置项描述文本。

### 样式

作为 setting 的子组件，显示单个设置项。左侧显示标题和描述，右侧显示控件区域。

使用 flex 布局，标题和描述垂直排列，控件右对齐。项之间有分隔线。

### 示例

```xml
<setting-item title="Dark Mode" note="Enable dark theme">
    <switch v-model="darkMode"></switch>
</setting-item>
```