描述列表组件。

### 参数

#### border

`boolean` | `string`

是否显示内部边框，默认 true。

#### plain

`boolean` | `string`

是否显示轻量边框，默认 false。

#### stripe

`boolean` | `string`

是否显示斑马纹，默认 false。

#### collapse

`boolean` | `string`

是否折叠边框，默认 true。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `m`。

#### outside

`boolean` | `string`

是否显示外围边框，默认 true。

#### rowlr

`boolean` | `string`

每行中每个 cell 是否显示左右边框，默认 false。

### 样式

使用表格布局，展示键值对形式的描述信息。包含 `desc-row`、`desc-head`、`desc-cell` 子组件。

通过组合子组件可实现水平或垂直的布局方式。通过 `border` 和 `outside` 分别控制内部边框和外围边框，`rowlr` 可单独控制左右边框。

标题列和内容列支持通过样式设置不同的宽度和对齐方式。

### 示例

```xml
<desc border collapse outside>
    <desc-row hover>
        <desc-head>Name</desc-head>
        <desc-cell>John</desc-cell>
    </desc-row>
</desc>
```