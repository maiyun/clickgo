跑马灯组件，用于文字滚动展示。

### 参数

#### direction

`'left'` | `'right'` | `'top'` | `'bottom'`

滚动方向，默认 `left`。

#### speed

`number` | `string`

滚动速度，默认 1。

### 样式

使用相对定位容器，内容循环滚动显示。支持四个滚动方向。

悬停时可暂停滚动。滚动平滑无跳动。内容无缝循环。

### 示例

```xml
<marquee direction="left" :speed="50">Scrolling text...</marquee>
```
