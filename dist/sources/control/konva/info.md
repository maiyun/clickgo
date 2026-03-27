TOAST UI Image Editor 的模块加载控件。控件本身不渲染任何可见内容，仅负责异步加载 `tui-image-editor` 库。加载成功后通过 `init` 事件将 `tui.ImageEditor` 类传递给父级，由父级自行创建编辑器实例。加载失败时触发 `error` 事件。

### 参数

### 事件

#### failed

`() => void`

加载 tui-image-editor 库失败时触发。

#### init

`(TuiImageEditor: any) => void`

库加载成功时触发，参数为 `tui.ImageEditor` 类本身。父级可使用该类创建图片编辑器实例：`new TuiImageEditor(containerElement, options)`。

### 样式

控件本身渲染为一个空 `<div>`，不占据任何视觉空间。图片编辑器的实际 UI 由父级将 `tui.ImageEditor` 实例化后渲染到指定容器中。

### 示例

```xml
<tuiimage @init="onInit" @failed="onFailed" style="flex: 1;"></tuiimage>
```

```ts
public onInit(TuiImageEditor: any): void {
    this.access.editor = new TuiImageEditor(this.refs.container, {
        'includeUI': {
            'uiSize': {
                'width': containerEl.clientWidth + 'px',
                'height': containerEl.clientHeight + 'px',
            },
            'menuBarPosition': 'left',
        },
        'cssMaxWidth': containerEl.clientWidth,
        'cssMaxHeight': containerEl.clientHeight,
    });
}

public onError(): void {
    // --- 加载失败处理 ---
}
```
