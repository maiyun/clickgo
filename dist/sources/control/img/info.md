图片展示组件，支持多种来源。

### 参数

#### src

`string`

图片地址，支持 HTTP/HTTPS、Data URL、包内路径等。

#### mode

`string`

图片显示模式（对应 background-size），默认 `default`。

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`number` | `string`

内容间距。

#### alignH

`string` | `undefined`

内容水平对齐方式。

#### alignV

`string` | `undefined`

内容垂直对齐方式。

### 样式

使用相对定位容器，图片作为背景显示在绝对定位层。支持多种显示模式控制图片的缩放方式（contain/cover 等）。

内容区域使用 flex 布局，可通过 direction 控制水平或垂直排列，支持设置对齐方式和间距。

图片层默认居中显示，不重复平铺，支持通过 slot 在图片上层叠加自定义内容。

### 示例

```xml
<img src="https://example.com/image.png"></img>
```
