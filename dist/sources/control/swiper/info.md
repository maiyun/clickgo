图片轮播组件。支持自动播放、循环切换、点击圆点导航及拖拽滑动，适用于首页 Banner、图集展示等场景。

### 参数

#### items

`string[]` | `Array<{ src: string; alt?: string }>`

幻灯片列表，可传入图片 URL 字符串数组，或包含 `src`/`alt` 属性的对象数组，默认 []。

#### autoplay

`boolean` | `string`

是否自动播放，默认 true。

#### interval

`number` | `string`

自动播放间隔时间（毫秒），默认 3000。

#### loop

`boolean` | `string`

是否循环播放，到达首/末张后回绕，默认 true。

#### modelValue

`number` | `string`

双向绑定，当前显示的幻灯片索引，默认 0。

#### fit

`string`

图片填充模式，对应 CSS `object-fit` 属性值，常见值包括 `cover`（默认）、`contain`、`fill`、`scale-down`。

### 事件

#### changed

`() => void`

幻灯片切换完成后触发。

### 方法

#### prev()

切换到上一张幻灯片。

#### next()

切换到下一张幻灯片。

#### go(index)

跳转到指定索引的幻灯片。

### 样式

组件使用 `overflow: hidden` 的 wrap 容器裁切内容。内部轨道（track）通过 CSS `transform: translateX` 平移展示当前幻灯片，切换时附带 `0.35s ease-in-out` 过渡动画；拖拽期间动画暂时关闭，手指松开后恢复，实现跟手效果。

每张幻灯片（slide）尺寸等于控件尺寸，图片使用 `object-fit: cover` 填满容器，保证不同比例的图片均能饱满展示。

底部圆点指示器以 `position: absolute` 浮于内容之上，当前激活项宽度拉宽形成胶囊形态，通过 CSS transition 平滑过渡。用户点击圆点或拖拽（超过控件宽度 30%）均可触发切换，并自动重置自动播放计时器。

### 示例

```xml
<swiper :items="items" v-model="current" :autoplay="true" :interval="3000" style="height: 300px;" />
```
