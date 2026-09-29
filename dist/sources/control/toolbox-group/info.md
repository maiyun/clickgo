工具箱内的工具分组，与 `toolbox` 配合使用。每组从新行开始，继承工具箱的单列/双列布局，并用原生主题分隔线区分工具用途。

没有独立参数；工具内容使用插槽，按钮状态由应用管理。

```xml
<toolbox columns="2" label="Tools">
    <toolbox-group>
        <button type="tool"><icon name="eye"></icon></button>
        <button type="tool"><icon name="plus"></icon></button>
    </toolbox-group>
</toolbox>
```
