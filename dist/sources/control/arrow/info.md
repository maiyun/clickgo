箭头切换组件，可用于表示展开/收起等切换状态。

### 参数

#### map

`{ 'true'?: any; 'false'?: any; }`

值映射配置。

#### modelValue

`any`

双向绑定，当前状态值，默认 false。

### 事件

#### change

`(event: clickgo.control.ISwitchChangeEvent) => void`

状态改变时触发。

### 样式

使用 flex 布局，显示箭头图标。点击可切换展开/收起状态。

图标颜色继承父元素的文字颜色。支持键盘操作。

### 示例

```xml
<arrow v-model="expanded"></arrow>
```