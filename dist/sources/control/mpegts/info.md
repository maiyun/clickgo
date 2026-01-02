流媒体播放器组件（基于 mpegts.js）。

### 参数

#### src

`string`

流媒体地址。

#### fsrc

`string`

全屏时的流媒体地址。

#### text

`string`

显示文本。

#### controls

`boolean` | `string`

是否显示控制条，默认 false。

#### volume

`number` | `string`

双向绑定，音量，默认 80。

#### play

`boolean` | `string`

双向绑定，是否播放，默认 false。

#### reset

`number`

自动销毁重置时间（0 为不自动重置，毫秒）。

### 事件

#### canplay

`() => void`

可以播放时触发。

#### init

`() => void`

初始化完成时触发。

### 样式

使用 flex 布局，播放器填满容器空间。支持 FLV 和 MPEG-TS 格式的流媒体。

适用于直播和点播场景。低延迟播放。

### 示例

```xml
<mpegts :src="streamUrl" :controls="true" v-model:play="isPlaying"></mpegts>
```
