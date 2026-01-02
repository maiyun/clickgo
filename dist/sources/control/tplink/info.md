TP-Link 监控插件组件。

### 参数

#### init

`{ sid: string; skey: string }`

初始化配置，包含 sid 和 skey。

#### controls

`boolean` | `string`

是否显示控制界面，默认 true。

#### layout

`Array<{ cellNum: number; rows: number; columns: number; cellList: Array<[number, number]> }>`

布局配置。

#### list

`Array<{ device: string; channel: number; index: number; mode: number; volume?: boolean }>`

播放列表。

#### range

`[number, number]` | `null`

回放时间范围，null 为实时播放。

#### volume

`number`

音量，最大 10。

### 事件

#### init

`() => void`

初始化完成时触发。

### 样式

显示监控控制界面，支持多画面分屏显示。可切换不同的摄像头视角。

支持播放、暂停、截图等操作。具有全屏模式。

### 示例

```xml
<tplink :init="{ sid: 'xxx', skey: 'xxx' }" :list="cameraList"></tplink>
```