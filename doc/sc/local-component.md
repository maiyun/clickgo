# 局部应用组件与 Dock

大型软件中的工具选项、图层、历史记录等区域，通常属于当前 Form 的一部分，但代码和视图需要独立维护。此类内容使用 `AbstractComponent`，不要为了拆文件创建 Panel，也不要通过 mixin 合并多个 Form 类。

## 局部应用组件

每个组件由同名的 `.ts`、`.xml`、`.scss` 文件组成，组件类继承 `clickgo.form.AbstractComponent`。

```ts
import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractComponent {

    public props = {
        'modelValue': ''
    };

    public emits = {
        'update:modelValue': null
    };

    public change(value: string): void {
        this.emit('update:modelValue', value);
    }

}
```

在 Form 或 Panel 的 `components` 中局部注册。名称必须是包含连字符的小写 kebab-case，并且只在当前视图中生效。

```ts
import optionsCmp from './feature/brush/options/options';

export default class extends clickgo.form.AbstractForm {

    public readonly components = {
        'brush-options': optionsCmp
    };

    public brush = {
        'color': '#2563eb',
        'size': 18
    };

}
```

```xml
<brush-options v-model="brush"></brush-options>
```

局部组件支持 props、emits、slot、生命周期、样式隔离、ClickGo 控件和继续嵌套注册局部组件。需要保存 Canvas 编辑器等非响应式服务时，放入 `access`，并在 `onUnmounted` 中释放。

## Dock

Dock 只负责桌面软件侧栏的布局和生命周期，业务内容仍由局部组件实现。

```xml
<dock v-model:expanded="dockExpanded" :width="280">
    <dock-group v-model="optionTab">
        <dock-item name="brush" label="Brush" lazy cache>
            <brush-options v-model="brush"></brush-options>
        </dock-item>
        <dock-item name="pencil" label="Pencil" lazy cache>
            <pencil-options v-model="pencil"></pencil-options>
        </dock-item>
    </dock-group>
    <dock-group v-model="historyTab" v-model:collapsed="historyCollapsed" grow>
        <dock-item name="history" label="History" lazy cache="false">
            <history-state :state="history"></history-state>
        </dock-item>
    </dock-group>
</dock>
```

- `dock`：控制整列展开、收起和收起后的浮层。
- `dock-group`：管理一组标签。默认先按内容自然高度布局，再共享剩余空间，总高度不足时才滚动；`grow` 可提高剩余空间权重；通过 `v-model:collapsed` 控制折叠，折叠后其他组自动接管空间。
- `dock-item`：`lazy` 表示首次选中时挂载，`cache` 表示切走后是否保留实例。编辑状态一般缓存，大型预览或临时结果可设为 `cache="false"`。

Form 负责跨功能的状态和服务编排，局部组件负责单个功能的界面，Dock 负责空间分配。三者不要互相承载对方的职责。
