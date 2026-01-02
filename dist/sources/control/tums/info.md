TUMS 监控组件。

### 参数

#### init

`{ type?: 'relay'; url: string; stream?: 'video' | 'sdvod'; volume?: number; sid: string; skey: string }`

初始化配置。

#### volume

`number`

音量，默认 80。

### 事件

#### init

`() => void`

初始化完成时触发。

#### playing

`() => void`

开始播放时触发。

#### disconnected

`() => void`

断开连接时触发。

### 样式

显示监控画面，支持多画面分屏显示。可切换不同的摄像头视角。

支持播放、暂停、截图等操作。具有全屏模式。

### 示例

```xml
<tums :init="{ url: 'xxx', sid: 'xxx', skey: 'xxx' }" @playing="onPlaying"></tums>
```
