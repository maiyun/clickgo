文字提示组件，通常跟随在其他控件后使用。

### 参数

#### label

`string`

提示内容。

#### maxwidth

`number`

最大宽度，默认 400。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

提示类型，默认 `default`。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### class

`string`

自定义样式类名。

### 样式

提示框使用绝对定位，悬浮在触发元素附近。提示内容具有圆角边框和背景色。

支持多种类型（default/primary/info/warning/danger/cg）对应不同的背景色。朴素模式下显示为浅色背景深色文字。

提示框具有淡入淡出的显示/隐藏动画，自动根据空间位置调整显示方向。

### 示例

```xml
<button>Hover me</button>
<tip label="This is a tip"></tip>
```