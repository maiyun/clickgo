ECharts 图表组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### data

`Record<string, any>`

ECharts 配置选项。

#### theme

`'light'` | `'dark'`

主题，默认 `light`。

### 事件

#### init

`(chart: any) => void`

图表初始化完成时触发，返回 ECharts 实例。

### 样式

使用 flex 布局，图表填满容器空间。支持所有 ECharts 图表类型。

图表响应容器大小变化自动重绘。支持主题切换。

### 示例

```xml
<echarts :data="chartOption" theme="light" @init="onInit"></echarts>
```