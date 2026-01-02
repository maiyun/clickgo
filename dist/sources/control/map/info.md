地图组件（基于高德地图）。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### factory

`'tianditu'` | `'google'`

地图服务商，默认 `google`。

#### akey

`string`

地图 API Key。

#### css

`string`

自定义 CSS 样式。

#### tdurlcn

`string`

天地图服务商下，国内地图部分瓦片地址模板，默认天地图瓦片。

#### tdurlintl

`string`

天地图服务商下，国际地图部分瓦片地址模板，默认 OSM 瓦片。

#### lat

`number`

双向绑定，中心纬度，默认 31.223704。

#### lng

`number`

双向绑定，中心经度，默认 121.366077。

#### zoom

`number` | `string`

双向绑定，缩放级别，默认 10。

#### zoomControl

`boolean` | `string`

是否显示缩放控件，默认 false。

#### markers

`Record<string, IMarker>`

双向绑定，标记点集合。

#### lines

`Record<string, ILine>`

双向绑定，折线集合。

#### polygons

`Record<string, IPolygon>`

双向绑定，多边形集合。

#### overlays

`Record<string, IOverlay>`

自定义覆盖物集合。

### 事件

#### init

`(map: { lib: any; map: any }) => void`

地图初始化完成时触发。

#### mapClick

`(location: { lat: number; lng: number }) => void`

点击地图空白处时触发。

#### markerClick

`(key: string) => void`

点击标记点时触发。

#### markerDrag

`(key: string) => void`

拖拽标记点时触发。

#### markerDragend

`(key: string) => void`

标记点拖拽结束时触发。

#### markerUpdate

`(key: string) => void`

标记点更新时触发。

#### overlayClick

`(key: string) => void`

点击自定义覆盖物时触发。

#### lineClick

`(key: string) => void`

点击折线时触发。

#### lineDrag

`(key: string) => void`

拖拽折线时触发。

#### lineDragend

`(key: string) => void`

折线拖拽结束时触发。

#### lineUpdate

`(key: string) => void`

折线更新时触发。

#### lineInsert

`(key: string, index: number) => void`

折线插入节点时触发。

#### lineRemove

`(key: string, index: number, location: { lat: number; lng: number }) => void`

折线移除节点时触发。

#### polygonClick

`(key: string) => void`

点击多边形时触发。

#### polygonDrag

`(key: string) => void`

拖拽多边形时触发。

#### polygonDragend

`(key: string) => void`

多边形拖拽结束时触发。

#### polygonUpdate

`(key: string) => void`

多边形更新时触发。

#### polygonInsert

`(key: string, index: number) => void`

多边形插入节点时触发。

#### polygonRemove

`(key: string, index: number, location: { lat: number; lng: number }) => void`

多边形移除节点时触发。

### 样式

使用 flex 布局，地图填满容器空间。支持缩放、拖动等交互操作。

可显示标记点、路线等图层。支持地图事件监听。

### 示例

```xml
<map akey="your-amap-key" :center="[116.397428, 39.90923]" :zoom="11"></map>
```