终端组件（基于 xterm.js）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### theme

`string`

终端主题，默认 `black`。

### 事件

#### data

`(char: string) => void`

用户输入时触发。

#### resize

`(event: { cols: number; rows: number; width: number; height: number }) => void`

终端尺寸变化时触发。

#### init

`(term: any) => void`

终端初始化完成时触发，返回 xterm 实例。

### 样式

使用 flex 布局，终端填满容器空间。黑色背景白色文字的经典终端样式。

支持 ANSI 转义序列。可自定义颜色主题。支持选择复制。

### 示例

```xml
<xterm @data="onData" @init="onInit" ref="terminal"></xterm>
```