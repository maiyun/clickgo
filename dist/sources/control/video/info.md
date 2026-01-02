视频播放器组件。

### 参数

#### src

`string`

视频地址。

#### controls

`boolean` | `string`

是否显示控制栏，默认 false。

#### loop

`boolean` | `string`

是否循环播放，默认 false。

#### muted

`boolean` | `string`

是否静音，默认 false。

#### volume

`number` | `string`

音量，默认 50。

#### play

`boolean` | `string`

双向绑定，是否正在播放，默认 false。

#### current

`number` | `string`

双向绑定，当前播放位置（秒），默认 0。

### 事件

#### durationchange

`(duration: number) => void`

时长变化时触发。

#### canplay

`() => void`

可以播放时触发。

#### canplaythrough

`() => void`

可以完整播放时触发。

#### ended

`() => void`

播放结束时触发。

#### error

`() => void`

加载错误时触发。

#### loadeddata

`() => void`

数据加载完成时触发。

#### loadedmetadata

`() => void`

元数据加载完成时触发。

#### playing

`() => void`

开始播放时触发。

#### progress

`() => void`

加载进度变化时触发。

#### seeked

`() => void`

跳转完成时触发。

#### seeking

`() => void`

正在跳转时触发。

#### waiting

`() => void`

等待缓冲时触发。

#### emptied

`() => void`

媒体内容变为空时触发。

#### loadstart

`() => void`

开始加载数据时触发。

#### ratechange

`() => void`

播放速率变化时触发。

#### readystatechange

`() => void`

就绪状态变化时触发。

#### seeked

`() => void`

跳转完成时触发。

#### seeking

`() => void`

正在跳转时触发。

#### stalled

`() => void`

数据加载停滞时触发。

#### suspend

`() => void`

数据加载挂起时触发。

### 样式

使用 flex 布局，视频填满容器空间。底部显示播放控制栏。

控制栏包含播放/暂停、进度条、音量、全屏按钮。支持快捷键操作。

### 示例

```xml
<video :src="videoUrl" v-model:play="isPlaying" v-model:current="currentTime"></video>
```
