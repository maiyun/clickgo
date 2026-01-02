PDF 查看器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### src

`string`

PDF 文件地址或 base64 数据。

#### page

`number` | `string`

当前页码，默认 1。

### 事件

#### loaded

`(pdf: any) => void`

PDF 加载完成时触发，返回 PDF 对象。

#### view

`(event: IPdfViewEvent) => void`

页面渲染时触发，包含页面尺寸信息（width/height/inwidth/inheight/pxwidth/pxheight）。

### 样式

使用 flex 布局，PDF 页面填满容器空间。底部显示翻页控制按钮和页码。

支持缩放、翻页操作。页面渲染清晰。加载时显示加载动画。

### 示例

```xml
<pdf :src="pdfUrl" v-model:page="currentPage"></pdf>
```