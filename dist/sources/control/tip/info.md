文字提示组件，通常跟随在其他控件后使用。

### 参数

#### label

`string`

提示内容。

#### maxwidth

`number`

最大宽度，默认 400。

#### direction

`'top'` | `'right'` | `'bottom'` | `'left'`

提示显示方向，默认 `top`。

#### immediate

`boolean` | `string`

是否在鼠标移出后立刻隐藏，默认 false。开启后提示层会禁用鼠标事件，无法再将鼠标快速移入提示层。

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

提示框使用绝对定位，悬浮在触发元素附近。可通过 `direction` 指定显示在上、右、下、左四个方向，空间不足时会自动翻转到对侧方向。

支持多种类型（default/primary/info/warning/danger/cg）对应不同的背景色。朴素模式下显示为浅色背景深色文字。

提示框具有淡入淡出的显示/隐藏动画，并带有对应方向的箭头。开启 `immediate` 后会在移出触发元素时立刻隐藏，并禁用提示层的鼠标交互。

### 示例

```xml
<tip label="This is a tip">
    <button>Hover me</button>
</tip>

<tip label="Right tip" direction="right">
	<button>Hover me</button>
</tip>

<tip label="Immediate tip" immediate>
	<button>Hover me</button>
</tip>
```