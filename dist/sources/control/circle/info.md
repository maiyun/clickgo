圆形标记组件，用于显示图标、文字或状态。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### plain

`boolean` | `string`

是否使用与 Tag 相同的朴素模式，默认 false。语义色和主题色使用柔和底色、对应文字色及边框；最终外观由主题决定。

#### sub

`boolean` | `string`

是否作为父容器右上角的悬浮角标，默认 false。父容器应建立定位上下文；该参数不表示淡色模式。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `s`。

### 样式

使用 inline-flex 布局，内容居中显示。组件为圆形，支持多种尺寸和类型颜色，尺寸为固定直径，不会随插槽内容自动增大。

实心与朴素模式沿用 Tag 的语义色及主题色，基础样式不附加高光或阴影。内容区域可通过 slot 自定义，放置文字或图标时应选择足够的尺寸。

常用于显示状态指示、头像占位或图标包裹。

### 示例

```xml
<circle type="primary" size="xl">A</circle>
<circle type="cg" size="xl" plain>A</circle>
```
