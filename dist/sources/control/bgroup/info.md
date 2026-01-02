按钮组组件（按钮贴贴），用于将多个按钮组合显示。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### type

`'default'` | `'tool'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

按钮类型，默认 `default`。

#### size

`'m'` | `'l'` | `'xl'`

按钮尺寸，默认 `m`。

### 样式

使用 flex 布局，按钮按指定方向排列。相邻按钮共享边框，首尾按钮保留圆角。

水平排列时左右相邻，垂直排列时上下相邻。按钮间无间距。

### 示例

```xml
<bgroup>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
</bgroup>
```