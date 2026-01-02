用于展示文本信息的标签组件。

### 参数

#### mode

`'default'` | `'tip'` | `'mtip'` | `'date'` | `'important'` | `'click'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

显示模式，默认 `default`。

#### content

`string`

文本内容。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `s`。

#### align

`'left'` | `'start'` | `'center'` | `'right'` | `'end'`

对齐方式，默认 `left`。

#### nowrap

`boolean` | `string`

是否不换行，默认 false。

#### copy

`boolean` | `string`

是否允许复制，默认 false。

#### thru

`boolean` | `string`

是否显示删除线，默认 false。

#### time

`boolean` | `string`

是否显示时间（仅在 date 模式下有效），默认 true。

#### date

`boolean` | `string`

是否显示日期（仅在 date 模式下有效），默认 true。

#### zone

`boolean` | `string`

是否显示时区，默认 false。

#### tz

`number` | `string` | `undefined`

时区偏移量。

### 样式

使用 flex 布局，文本可根据 align 参数设置对齐方式。标签支持多种显示模式（default/tip/date/primary 等）对应不同的颜色和样式。

支持多种尺寸（s/m/l/xl），可设置不换行（超出显示省略号）和删除线效果。date 模式下可格式化显示日期时间。

tip 模式显示为辅助文本色，click 模式具有可点击的交互效果，各类型模式有对应的主题色。

### 示例

```xml
<label mode="primary">Primary Label</label>
```