立方体 3D 展示组件。

### 参数

#### hue

`string`

色调值，默认 `255`。

#### size

`'xs'` | `'s'` | `'m'` | `'mh'` | `'l'` | `'lh'` | `'xl'` | `'xlh'`

尺寸，默认 `s`。

### 事件

#### anistart

`() => void`

动画开始时触发。

#### aniend

`() => void`

动画结束时触发。

### 样式

使用 CSS 3D 变换实现立方体效果。顶面可通过插槽自定义内容。

支持鼠标悬停动画效果。具有透视效果和平滑的动画。

### 示例

```xml
<cube hue="180" size="m" @anistart="onStart">Top</cube>
```
