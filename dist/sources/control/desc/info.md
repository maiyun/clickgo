描述列表组件。

### 参数

#### border

`boolean` | `string`

是否显示边框，默认 true。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### stripe

`boolean` | `string`

是否显示条纹，默认 `false`。

#### collapse

`boolean` | `string`

是否折叠模式，默认 true。

#### size

`'s'` | `'m'` | `'l'` | `'xl'`

尺寸，默认 `m`。

### 样式

使用表格布局，展示键值对形式的描述信息。包含 `desc-row`、`desc-head`、`desc-cell` 子组件。

通过组合子组件可实现水平或垂直的布局方式。边框模式下显示单元格边框线。

标题列和内容列支持通过样式设置不同的宽度和对齐方式。

### 示例

```xml
<desc>
    <desc-row>
        <desc-head>Name</desc-head>
        <desc-cell>John</desc-cell>
    </desc-row>
</desc>
```