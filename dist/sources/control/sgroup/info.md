分组容器组件。

### 参数

#### direction

`'h'` | `'v'`

排列方向，默认 `h`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'`

类型样式，默认 `default`。

#### gutter

`number` | `string`

子元素间距。

#### alignH

`string` | `undefined`

水平对齐方式。

#### alignV

`string` | `undefined`

垂直对齐方式。

### 样式

使用 flex 布局，按钮按指定方向排列。按钮互斥选中，类似单选框功能。

选中的按钮显示主题色背景。相邻按钮共享边框。

### 示例

```xml
<sgroup v-model="selected">
    <button value="1">Option 1</button>
    <button value="2">Option 2</button>
</sgroup>
```