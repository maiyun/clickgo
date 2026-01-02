设置列表组件。

### 参数

### 样式

使用 block 布局，设置项垂直排列。具有圆角边框和背景色（非朴素模式）。

包含 setting-item 子组件。设置项之间有分隔线。

常用于设置页面的选项列表。

### 示例

```xml
<setting>
    <setting-item label="Option 1">
        <switch v-model="option1"></switch>
    </setting-item>
</setting>
```
