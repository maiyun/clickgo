# 通用命令

从 ClickGo 6.10.0 开始，应用可以通过 `clickgo.command` 声明业务命令。按钮、菜单、快捷键、命令面板、浏览器代理和后续 Native MCP 适配器共用注册的执行函数及其校验。

## 声明与执行

在 Form 或 Panel 的 `onMounted` 中注册实例命令；应用级命令可以使用 AbstractApp 或 taskId 注册。名称在同一个 task 内唯一，不同 task 可以使用相同名称。同一应用内多个文档窗体的命令名称应包含目标标识，或由应用级命令通过参数明确选择目标。

```ts
import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public count = 0;

    /**
     * --- 注册一次业务动作 ---
     * @returns 无返回值
     */
    public onMounted(): void {
        const registered = clickgo.command.register<{ 'amount': number; }>(this, {
            'name': 'counter.add',
            'title': '增加计数',
            'description': '给当前计数增加指定数量，返回更新后的计数。',
            'inputSchema': {
                'type': 'object',
                'properties': { 'amount': { 'type': 'integer', 'minimum': 1, 'maximum': 10 } },
                'required': ['amount'],
                'additionalProperties': false,
            },
            'outputSchema': {
                'type': 'object',
                'properties': { 'count': { 'type': 'integer' } },
                'required': ['count'],
                'additionalProperties': false,
            },
            'exposed': true,
            'annotations': { 'readOnlyHint': false, 'destructiveHint': false, 'openWorldHint': false },
            'execute': (args) => {
                this.count += args['amount'];
                return clickgo.command.success({ 'count': this.count });
            },
        });
        if (!registered) {
            // --- 名称重复或规则不支持时，按应用需要显示初始化失败 ---
            return;
        }
    }

    /**
     * --- 所有普通界面入口调用此命令 ---
     * @returns 业务结果
     */
    public add(): Promise<clickgo.command.TResult> {
        return clickgo.command.execute(this, 'counter.add', { 'amount': 1 });
    }

}
```

模板按钮用 `@click="add"`；菜单项及其快捷键也绑定 `add`。快捷键继续使用 `menulist-item.alt`，保持既有 Form 焦点和 Panel 激活范围，不增加全局键盘监听。

`register` 返回 boolean。名称允许 1–128 个 ASCII 字母、数字、下划线、点或连字符；说明不能为空。规则错误或包含不支持的关键字时拒绝注册。注册的元数据及每次执行的输入、输出均复制为独立 JSON 数据，外部修改不能影响注册表或调用者数据。

## 可用状态、权限与结果

- `enabled` 每次执行重新检查，返回 true、false 或不可用原因文本。`list(current)` 返回元数据及当时的 `enabled`、`disabledReason`、`running` 快照；界面需要时重新读取。Form 隐藏、Panel 未激活和模态窗口出现不会自动禁止业务命令，相关业务条件在 `enabled` 中声明。
- `permissions` 检查已经获得的 ClickGo 权限，执行入口不弹出新的授权窗口。服务端鉴权、资源归属、幂等和业务确认仍由原有业务执行函数处理。
- 默认拒绝同一命令并发，权限检查前就取得执行占用。业务确认可以并行时显式设置 `concurrent: true`。不同命令会各自执行；共享资源互斥应声明共同的可用条件或由业务负责。
- 回调返回 `success(data)` 或 `failure(code, message)`。data 必须为 JSON 值，成功且无数据时传 null。结果是 `{ ok: true, data }` 或 `{ ok: false, error: { code, message } }`。
- 框架错误码包括 `not-found`、`invalid-input`、`invalid-output`、`unavailable`、`permission-denied`、`cancelled`、`execution-failed`。业务失败保留业务错误码；异常转换为通用错误，不直接公开堆栈和内部路径。

`execute(current, name, args, { signal })` 支持 AbortSignal，回调在第二个参数中取得 `context.signal`，可传给 fetch 或检查后提前返回。取消是协作式：不回滚已经产生的业务效果，忽略 signal 的业务仍可能继续执行；执行占用在回调实际结束时释放。

`context.taskId`、`formId`、`panelId` 指明注册范围。`context.source` 为 user 或 agent，只是调用入口的记录信息，不能作为授权凭据；通过普通界面操作的 AI 同样会标为 user。

Form 开始关闭时解除对应命令，Panel 卸载时解除自己的命令，task.end 开始时解除所有命令并断开 WebMCP。相关在途调用收到取消信号。使用控件对象注册时归属其 Form；需要独立 Panel 生命周期的命令使用 Panel 对象注册。临时命令也可显式 `unregister(current, name)` 或 `clear(current)`；普通 clear 后允许再次注册。

## 参数规则

规则采用 [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation) 的明确子集。输入根类型必须为 object；输出可提供 object 形式的 schema，并用 type 指定任意受支持的 JSON 类型。

支持：单个 `type`、`properties`、`required`、`additionalProperties`、`items`、`minItems`、`maxItems`、`uniqueItems`、`minLength`、`maxLength`、`pattern`、`minimum`、`maximum`、`exclusiveMinimum`、`exclusiveMaximum`、`enum`、`const`、`allOf`、`anyOf`、`oneOf`、`not`、`$defs` 与包内 JSON Pointer `$ref`。子 schema 可以为 true/false；有限数据结构支持递归引用。`title`、`description`、`default`、`examples` 作为说明保留。

不支持的关键字（例如 format、prefixItems、unevaluatedProperties）、远程引用、其他 dialect 和数组形式的 type 会拒绝注册。循环引用必须推进到子数据；在同一数据位置反复引用的规则也会拒绝注册，避免 not 等组合掩盖无法确定的校验结果。用 anyOf 表达多种类型。类型不转换，默认值不补齐，额外参数不删除；需要禁止未知字段时设置 additionalProperties: false。空参数接口可以声明 `{ type: 'object', additionalProperties: false }`。

字符串长度按 Unicode 码点计算，pattern 使用 Unicode 模式的 JavaScript 正则。输入、输出和 schema 只接受有限数字、稠密数组和普通 JSON 对象；不执行 getter、toJSON，不接受类实例、undefined 或循环数据。数据及校验嵌套深度限制为 64。

## 浏览器代理与 WebMCP

ClickGo 初始化时自动向网页发布不可修改的 `window['clickgo']['command']`。所有网页宿主使用同一入口，无需应用或宿主另外创建发布文件，也不依赖 WebMCP：

```ts
const api = window['clickgo']['command'];
const tasks = api.listTasks();
// --- 根据 id 和 name 选择目标 App，不依赖数组顺序 ---
const task = tasks.find(item => item.name === 'Your app');
if (task) {
    const commands = api.list(task.id);
    const command = commands.find(item => item.name === 'counter.add');
    if (command) {
        await api.execute(task.id, command.name, { 'amount': 2 });
    }
}
```

`listTasks()` 返回仍可使用的任务 ID 和应用名称；`list(taskId)` 返回该任务中 `exposed: true` 命令的名称、说明、参数规则及当前状态。命令名称在任务内部唯一，多个 App 可使用相同名称；执行时必须明确传入目标 taskId。未注册公开命令的 App 返回空列表，不能从界面自动推导业务命令。

`execute(taskId, name, args, { signal })` 按 agent 来源进入共享执行器，保留输入、状态、权限、并发、取消与输出检查。未公开的命令不能通过网页入口发现或执行。exposed 表示允许通过代理接口发现和调用，不能代替业务授权，也不限制普通界面本来可执行的操作。

网页入口直接读取框架的实时任务与命令状态，无需维护另一份发布表。新增、移除命令立即反映在列表中；Form 关闭后移除其命令，任务开始退出时从任务发现列表移除并停止执行。持有旧网页接口引用也不能继续执行已解除的命令。

`createBridge(current)` 仍可创建绑定单个 task 的不可修改接口，提供 list() 和 execute(name, args)，用于实例级集成及后续 Native/MCP 转发。普通网页接入使用上述统一入口即可。

### 没有 WebMCP 时的发现

框架统一发布接口，应用只需注册公开命令。宿主或应用应在可见的“AI 接口”说明中告诉代理：入口是 `window['clickgo']['command']`，先调用 listTasks 选择 App，再用 list(taskId) 获取命令名称、说明、输入规则和可用状态，根据返回的规则调用 execute(taskId, name, args)。命令列表来自框架，不另外维护静态清单。

页面提示是应用与代理之间的发现约定，不是浏览器自动识别的标准协议。只有工具允许执行页面 JavaScript 的代理才能直接调用；只允许读取、点击和输入的代理继续使用正常界面。不能因网页显示了 JS 示例，就假设所有 AI 客户端能够执行它。

Demo 的 desktop、webpage、cache 及 Native 网页宿主直接使用框架入口，不再单独发布 Demo 桥接。Demo 首屏提供 AI interface guide 按钮，也可通过 method → Library command 进入。界面展示统一入口、当前 taskId 和本窗体的调用代码；未打开命令示例 Form 时该 App 的命令列表为空。多个 Form 的命令包含各自的实例标识，调用时选择目标 Form。生产应用可把同样的发现说明放在帮助中的 AI 接口入口，普通用户继续使用按钮、菜单和快捷键。

在浏览器中调用 `await clickgo.command.connectWebMcp(this)`，根据当前 [WebMCP Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) 能力接入 document.modelContext。没有 API 或注册失败返回 false，不影响其他入口。接入后新增、移除命令会自动同步；工具名称包含 task 和注册实例标识，避免多个应用或迟到引用冲突。

`annotations` 支持 MCP 的 readOnlyHint、destructiveHint、idempotentHint、openWorldHint，以及 WebMCP 的 consequentialHint、untrustedContentHint。WebMCP 映射 readOnlyHint、consequentialHint、untrustedContentHint；未指定 consequentialHint 时使用 destructiveHint。此类说明是给客户端的提示，框架不据此跳过鉴权或自动弹出确认。需要业务确认的命令仍在唯一执行函数中确认。

`disconnectWebMcp(current)` 撤销该 task 的浏览器工具，不影响普通命令及已有桥接。当前 WebMCP 适配器基于 document.modelContext 和注册 AbortSignal 撤销机制，后续 API 变化只需调整适配器。

## 通过界面操作

`await clickgo.command.showPalette(this)` 打开 ClickGo 原生命令面板，显示命令说明、输入规则、JSON 参数输入及结构化结果。也可传 `{ exposedOnly: true }`，仅显示公开命令，并按代理入口执行。

命令面板使用父 Form Loading 保护创建阶段，显示后交给原生模态管理。这种展示 JSON 规则、参数和结果的面板适合开发调试，也可作为界面操作型代理的可选入口；应用不必向普通用户提供它。需要该入口时，在使用说明中告诉代理如何选择命令和填写参数。能调用 JS 桥接或 WebMCP 的代理直接调用接口，不需要打开面板。

## Native MCP 接入边界

本版本完成共享命令层、实例桥接与 WebMCP；不启动本地 MCP 服务。ClickGo Native 后续在主进程处理 MCP 连接及请求，将调用转发给目标应用的 bridge。业务函数仍在对应应用中执行，协议适配器不再实现一份业务逻辑。

对已打开的 GUI 应用，建议以 Streamable HTTP 连接当前进程；stdio 适合 MCP 客户端启动并管理的独立服务或连接器。两种传输使用同一份 tools/list 元数据与 tools/call 路由。协议和数据不依赖 Electron，其他 Native 宿主也可接入。

Streamable HTTP 实现需遵循 [MCP transport 规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) 的 loopback 绑定、Origin 校验和连接授权要求。云端运行的 MCP 客户端不能直接访问用户电脑的 loopback，需要其支持的本地连接组件；这与当前页面内的 WebMCP 是不同接入方式。

内置示例位于 Demo → method → Library command，可验证按钮、菜单、快捷键、实例桥接及命令面板共用计数状态。
