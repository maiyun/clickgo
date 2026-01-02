QR 码组件，用于生成二维码。

### 参数

#### text

`string`

二维码内容，默认为 MAIYUN 官网地址。

#### options

`object`

配置选项，支持 margin、scale、small、width、color.dark、color.light 等。

### 样式

使用 canvas 渲染二维码。二维码居中显示在容器内。

支持自定义颜色和尺寸。加载时显示加载动画。

### 示例

```xml
<qrcode text="https://example.com" :options="{ width: 200 }"></qrcode>
```
