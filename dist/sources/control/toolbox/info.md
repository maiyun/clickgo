桌面创作软件的纵向工具箱，负责统一工具间距、分组、滚动和单列/双列切换。工具仍使用原生 `button type="tool"`，选中状态与执行逻辑由应用管理；可用 `tip` 提供工具说明。

顶部按钮与 Dock、DockColumn、Toolbox 共用原生 `sidebar-toggle`，采用相同的双箭头、底色、交互反馈和底部分隔线；Tip 随当前操作更新。

### 参数

#### columns

`number` | `string`

双向绑定，工具列数，支持 `1` 和 `2`，默认 `1`。

#### collapsible

`boolean` | `string`

是否显示单列/双列切换箭头，默认 `true`。

#### position

`'left'` | `'right'`

工具箱的逻辑侧边，用于绘制靠工作区一侧的边框和确定切换箭头方向，默认 `left`。展开双列时箭头指向工作区，收回单列时指向外侧；RTL 会自动镜像。

#### label

`string`

工具栏的无障碍名称，默认空字符串。

### 方法

#### toggleColumns

`() => void`

切换单列或双列。

### 键盘

顶部切换按钮支持 Enter/Space 切换列数。工具按钮继续支持 Enter/Space 执行。焦点位于工具时，方向键按实际位置移动到可用工具，Home/End 跳转到首尾工具；跳过禁用或隐藏的按钮。

### 示例

```xml
<toolbox v-model:columns="columns" label="Tools">
    <toolbox-group>
        <tip label="Browse" direction="right" immediate>
            <button type="tool" :checked="tool === 'browse'" @click="tool = 'browse'"><icon name="eye"></icon></button>
        </tip>
    </toolbox-group>
    <toolbox-group>
        <tip label="Add" direction="right" immediate>
            <button type="tool" :checked="tool === 'add'" @click="tool = 'add'"><icon name="plus"></icon></button>
        </tip>
    </toolbox-group>
</toolbox>
```
