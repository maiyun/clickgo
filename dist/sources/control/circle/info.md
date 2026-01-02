圆形/圆环组件，用于显示图标或状态。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### sub

`boolean` | `string`

是否为次级样式，默认 false。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `s`。

### 样式

使用 inline-flex 布局，内容居中显示。组件为圆形，支持多种尺寸和类型颜色。

朴素模式下显示为空心圆环。次级样式显示为较浅的颜色。内容区域可通过 slot 自定义。

常用于显示状态指示、头像占位或图标包裹。

### 示例

```xml
<circle type="primary" size="m">A</circle>
```