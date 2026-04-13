流程图组件。

### 参数

#### gutter

`number` | `string`

子元素间距，默认空。

#### direction

`'v'` | `'h'` | `''`

滚动方向限制。`v` 仅允许垂直滚动，内容宽度被约束在容器内不产生横向溢出；`h` 仅允许水平滚动，子元素以行方向排列，高度被约束在容器内不产生纵向溢出；默认空值时两个方向均可滚动。

#### state

`'idle'` | `'loading'` | `'complete'`

加载状态。`idle` 表示空闲可加载，`loading` 表示加载中会展示旋转动画，此时不触发 `load` 事件；`complete` 表示已加载完毕，显示完成图形（圆点加线条），也不再触发 `load` 事件。默认 `idle`。

### 事件

#### load

`(): void`

触底加载事件。当内容滚动至距底部 50px 以内时触发，仅在 `state` 为 `idle` 时生效。内容未填满容器时挂载后也会自动触发。

### 方法

#### toBottom

`(): void`

滚动到底部。

#### checkLoad

`(): void`

手动检查是否满足触底条件并触发 `load` 事件，一般无需直接调用。

### 样式

该控件采用 flex 布局，由顶部的画布区域和底部的横向滚动条区域组成。画布区域内部包含一个可平移的显示容器。

支持通过鼠标或触摸在非节点区域进行点击拖拽操作，从而实现画布的平移。当内容超出显示范围时，组件会自动显示自定义的 `cg-scroll` 滚动条，以保证在不同平台上具有一致的交互体验。

底部加载区域（`.load-footer`）在 `state` 为 `loading` 或 `complete` 时显示，居中展示加载或完成图形。图形颜色跟随主题变量 `--g-color`，以保证多主题的一致性和框架的跨语言通用性。

### 示例

```xml
<eflow direction="v" :gutter="10" :state="state" @load="onLoad">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
</eflow>
```

```typescript
public async onLoad(): Promise<void> {
    this.state = 'loading';
    const res = await fetchPage(++this.page);
    this.list.push(...res.items);
    this.state = res.hasMore ? 'idle' : 'complete';
}
```