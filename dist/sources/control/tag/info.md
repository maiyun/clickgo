用于标记和选择的标签组件。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

标签类型，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### size

`'xs'` | `'s'` | `'m'` | `'mh'` | `'l'` | `'lh'` | `'xl'` | `'xlh'`

尺寸，默认 `s`。

#### rsize

`'m'` | `'l'` | `'xl'`

圆角尺寸，默认 `l`。

#### close

`boolean`

是否显示关闭按钮，默认 false。

#### drag

`boolean`

是否可拖拽，默认 false。

#### inline

`boolean` | `string`

是否行内显示，默认 false。

### 事件

#### close

`() => void`

点击关闭按钮时触发。

#### drop

`(event: ITagDropEvent) => void`

拖拽放置时触发，包含 `before` 和 `after` 索引。

### 样式

使用 inline-flex 布局，内容居中显示。标签具有圆角边框，支持多种类型（default/primary/info/warning/danger/cg）对应不同的配色方案。

支持多种尺寸和圆角大小。朴素模式下显示为浅色背景深色文字。可显示关闭按钮（悬停时高亮）。

支持拖拽功能，拖拽时显示阴影效果。行内模式下不占满整行。

### 示例

```xml
<tag type="primary">Tag 1</tag>
```
