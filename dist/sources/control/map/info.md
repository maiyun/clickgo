地图组件，支持 Google Maps 和基于 MapLibre GL JS 的天地图。

天地图模式沿用现有区域判定：瓦片级别小于 11 时全球使用天地图，其他级别在区域外使用海外矢量数据。公开缩放值比 MapLibre 原生值大 1，栅格瓦片级别按公开缩放值四舍五入；纯天地图视口不会请求海外矢量瓦片，跨区域时只请求包含海外部分的矢量瓦片。版权信息始终展开，并按中心所在瓦片和级别显示。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### factory

`'tianditu'` | `'google'`

地图服务商，默认 `google`。

#### akey

`string`

地图 API Key。Google 和默认天地图瓦片使用此参数；配置 `tdurlcn` 后可为空。

#### mapId

`string`

Google 地图 ID。默认为空，使用 `DEMO_MAP_ID` 供开发测试；生产环境应配置自己的 Google Map ID。修改后重新加载 Google 地图。

#### css

`string`

自定义 CSS 样式。

#### tdurlcn

`string`

天地图服务商下，国内地图部分瓦片地址模板，默认天地图瓦片。

#### tdhostintl

`string`

海外 OpenFreeMap 兼容镜像的主机名及可选端口，默认 `tiles.openfreemap.org`。仅填写主机名，不能包含协议、路径或查询参数；地图通过 HTTPS 加载该主机的 Liberty 样式及其关联资源。无效值通过 `error` 事件报告。

默认主机与自定义镜像均在一行显示 © OpenMapTiles 和 © OpenStreetMap contributors。

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

双向绑定，折线集合。编辑时至少保留两个节点。

#### polygons

`Record<string, IPolygon>`

双向绑定，多边形集合。编辑时至少保留三个节点。

#### overlays

`Record<string, IOverlay>`

自定义覆盖物集合。

修改底图地址、海外主机、版权或 CSS 参数会重新加载地图。

### 事件

#### init

`(map: { lib: any; map: any }) => void`

地图样式初始化完成时触发；瓦片仍可能在后台加载。`lib` 和 `map` 为所选地图引擎的原生对象；`tianditu` 使用 MapLibre GL JS。

#### error

`(error: unknown) => void`

地图引擎或海外底图加载失败时触发。海外底图失败不会阻止天地图使用；修改相关配置后重新加载。

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
<map factory="tianditu" akey="your-tianditu-key" :lat="39.90923" :lng="116.397428" :zoom="11"></map>
```