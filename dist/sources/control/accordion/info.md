折叠面板，由直属 Accordion-item 组成；允许嵌套独立 Accordion。单独加载 `/clickgo/control/accordion`，包内包含两种控件。

### 参数

#### modelValue

`string[]`

展开项的 name，默认 `[]`，可使用 `v-model` 绑定。去重后单选模式使用第一项；未出现的 name 保留，供条件渲染使用。外部值或模式变化时整理并同步绑定值，不触发 beforechange 或 changed；未绑定时控件维护自己的展开状态。

#### multiple

`boolean` | `string`

允许多项展开，默认 false。切换到单选时保留当前第一项。

#### disabled

`boolean` | `string`

禁止用户操作所有子项，默认 false；外部绑定仍可更新。

#### level

`number` | `string`

标题的无障碍层级，默认 3，限制为 1 至 6。

### 事件

#### beforechange

`(event: clickgo.control.IAccordionBeforeChangeEvent) => void`

用户操作前触发可取消事件，调用 `preventDefault()` 取消。`event.detail` 为 `{ value: string[], name: string, expanded: boolean }`。

#### changed

`(event: clickgo.control.IAccordionChangedEvent) => void`

用户操作提交后触发，`event.detail` 与 beforechange 结构相同。外部参数变化不触发这两个事件。`update:modelValue` 用于同步绑定。

### 插槽与键盘

默认插槽放直属 Accordion-item，支持条件渲染和带 key 的重排。Tab 依次访问启用的标题和展开面板的可聚焦内容；Enter 或 Space 切换，方向键及 Home/End 在启用的直属标题间移动焦点。收起包含焦点的面板时焦点回到其标题。

```xml
<accordion v-model="open" :multiple="true">
    <accordion-item name="details" label="Details">Content</accordion-item>
</accordion>
```
