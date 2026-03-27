Konva 库的模块加载控件。控件本身不渲染任何可见内容，仅负责异步加载 `konva` 库。加载成功后通过 `init` 事件将 Konva 核心对象传递给父级，由父级自行使用库的相关功能。加载失败时触发 `failed` 事件。

### 参数

### 事件

#### failed

`() => void`

加载 Konva 库失败时触发。

#### init

`(konva: any) => void`

库加载成功时触发，参数为 Konva 核心对象。

### 样式

控件本身渲染为一个空 `<div>`，不占据任何视觉空间。

### 示例

```xml
<konva @init="onInit" @failed="onFailed"></konva>
```

```ts
public onInit(konva: any): void {
    // --- Konva 库加载成功，可以开始使用 ---
    const stage = new konva.Stage({
        'container': this.refs.container,
        'width': 500,
        'height': 500,
    });
}

public onFailed(): void {
    // --- Konva 库加载失败处理 ---
}
```
