面包屑层级项，须作为 Breadcrumb 的直属子项。最后一项自动表示当前位置，使用 `aria-current="page"`，不可操作；其他项可通过点击或 Enter、Space 激活。

### 参数

#### name

`string`

层级标识，默认空字符串，事件中回退到 label。使用自定义内容时应提供 name。

#### label

`string`

显示文字，默认空字符串；可使用默认插槽替换。

#### icon

`string`

图标资源路径，默认空字符串，支持 SVG 和图片。图标为装饰内容，不重复朗读。

#### disabled

`boolean` | `string`

是否禁用当前项，默认 false。禁用项不触发 select，不进入键盘 Tab 顺序；Breadcrumb 的 disabled 同样生效。

### 事件

#### select

`(event: clickgo.control.IBreadcrumbSelectEvent) => void`

激活历史层级时触发一次，随后所属 Breadcrumb 触发相同的 select 事件。`event.detail` 为 `{ name: string, index: number }`，index 为当前显示顺序中的零起始索引。

### 插槽

- `default`：自定义显示内容，默认显示 label；可放图标、Label 等非交互内容，不嵌套按钮或链接。
