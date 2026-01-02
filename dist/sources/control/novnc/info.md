noVNC 远程桌面组件。

### 参数

#### modelValue

`{ url: string; pwd?: string; view?: boolean }`

连接配置对象，包含 WebSocket 地址、密码和是否仅查看模式。

### 事件

#### init

`() => void`

初始化完成时触发。

#### connect

`(event: { width: number; height: number }) => void`

连接成功时触发。

#### disconnect

`() => void`

断开连接时触发。

#### password

`() => void`

需要密码时触发。

#### fail

`() => void`

安全验证失败时触发。

#### desktopresize

`(event: { width: number; height: number }) => void`

桌面尺寸变化时触发。

#### clipboard

`(text: string) => void`

剪贴板事件触发。

### 样式

使用 flex 布局，远程桌面填满容器空间。支持鼠标和键盘操作。

可调整画质和缩放比例。支持剪贴板同步。

### 示例

```xml
<novnc :modelValue="{ url: wsUrl, pwd: password, view: false }" @connect="onConnect"></novnc>
```