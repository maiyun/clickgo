标题组件，用于显示页面或区块标题。

### 参数

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

标题类型，默认 `default`。

#### arrow

`boolean` | `string` | `undefined`

双向绑定，是否显示箭头展开/收起状态。

### 样式

使用 flex 布局，左侧显示竖条装饰，右侧显示标题内容。

支持多种类型（default/primary/info/warning/danger）对应不同的竖条颜色。支持显示展开/收起箭头。

### 示例

```xml
<title type="primary">Main Title</title>
```