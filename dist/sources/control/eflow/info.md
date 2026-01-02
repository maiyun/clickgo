流程图组件。

### 参数

#### gutter

`number` | `string`

子元素间距。

### 样式

使用相对定位容器，流程图填满容器空间。支持节点、连线的绘制。

节点可拖动定位。支持缩放和平移。

### 示例

```xml
<eflow :gutter="10">
    <div>Node 1</div>
    <div>Node 2</div>
</eflow>
```