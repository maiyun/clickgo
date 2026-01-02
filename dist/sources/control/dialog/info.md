模态对话框组件。

### 参数

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`string`

内容间距。

#### width

`number` | `string`

宽度。

#### height

`number` | `string`

高度。

#### padding

`boolean` | `string`

是否显示内边距，默认 true。

#### buttons

`string[]`

底部按钮列表，默认 `['OK']`。

### 事件

#### select

`(item: string) => void`

点击底部按钮时触发。

### 样式

使用 flex 布局，垂直排列内容区域和底部按钮区。

内容区域背景色为 `var(--g-plain-background)`，支持自定义布局方向和间距。

底部按钮区有上边框，水平排列，按钮间有间距。

### 示例

```xml
<dialog :buttons="['Yes', 'No']" @select="onSelect">Content</dialog>
```
