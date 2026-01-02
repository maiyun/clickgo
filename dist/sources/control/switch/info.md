开关选择器。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### size

`'s'` | `'m'` | `'l'`

尺寸，默认 `m`。

#### map

`{ 'true'?: any; 'false'?: any; }`

自定义 true/false 的值。

#### modelValue

`any`

双向绑定，开关状态值，默认 false。

### 事件

#### change

`(event: ISwitchChangeEvent) => void`

值改变时触发。

### 样式

使用 flex 布局，开关为胶囊形状，内含圆形滑块。支持三种尺寸（s/m/l）。

关闭状态为灰色背景，开启状态为主题色背景。滑块在左右两端之间滑动切换，具有平滑的过渡动画。

具有焦点轮廓和悬停效果，禁用时呈现灰色并禁止交互。

### 示例

```xml
<switch v-model="val"></switch>
```
