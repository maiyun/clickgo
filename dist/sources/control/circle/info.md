圆形标记组件，用于显示图标、文字或状态。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

类型颜色，默认 `default`。

#### plain

`boolean` | `string`

是否使用与 Tag 相同的朴素模式，默认 false。语义色和主题色使用柔和底色、对应文字色及边框；最终外观由主题决定。

#### pulse

`boolean` | `string`

是否启用同色扩散光圈，默认 false。光圈随 `type` 的语义色或主题色变化，实心与朴素模式均支持；圆点、内容及布局尺寸不参与缩放。启用系统“减少动态效果”时显示静态光圈。

这是布尔开关；`string` 仅兼容 XML 属性传值，并非动画名称或多种效果的枚举。可用 `pulse` 开启，或用 `:pulse="online"` 绑定布尔状态。

光圈向组件外侧绘制，放在 Flow 等滚动容器内时需在滚动区域内部留出空间，避免被 overflow 裁切。

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
<circle type="primary" pulse></circle>
<circle type="cg" :pulse="online"></circle>
```
