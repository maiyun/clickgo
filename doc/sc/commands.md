# 通用命令

从 ClickGo 6.10.0 开始，应用可以通过 `clickgo.command` 声明业务命令。按钮、菜单、快捷键、命令面板、浏览器代理和 Native MCP 适配器共用注册的执行函数及其校验。

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

框架内的代理适配器可以直接调用 `clickgo.command.listTasks()` 发现 App，再用 `clickgo.command.executeAgent(taskId, name, args, { signal })` 执行公开命令。该方法标记 agent 来源，并与普通 `execute()` 共用业务执行器；普通 execute 是应用界面入口，不限制为公开命令。

`createBridge(current)` 提供绑定单个 App 的可复用 list() 和 execute(name, args) 接口，适合向其他模块传递固定目标 App 的命令接口。每次请求已携带 taskId 的 Native/MCP 适配器直接调用 executeAgent，无需临时创建桥接。普通网页接入使用上述统一入口即可。

### 没有 WebMCP 时的发现

框架统一发布接口，应用只需注册公开命令。宿主或应用可以在可见的“AI 接口”入口展示下面由框架生成的说明，告诉代理如何发现和调用。命令列表来自框架，不另外维护静态清单。

页面提示是应用与代理之间的发现约定，不是浏览器自动识别的标准协议。只有工具允许执行页面 JavaScript 的代理才能直接调用；只允许读取、点击和输入的代理继续使用正常界面。不能因网页显示了 JS 示例，就假设所有 AI 客户端能够执行它。

Demo 的 desktop、webpage、cache 及 Native 网页宿主直接使用框架入口，不再单独发布 Demo 桥接。Demo 首屏提供 AI interface guide 按钮，也可通过 method → Library command 进入。Generate AI access guide 展示当前环境生成的简短接入说明，Show access information 展示结构化快照；未打开命令示例 Form 时该 App 的命令列表为空。多个 Form 的命令包含各自的实例标识，调用时选择目标 Form。生产应用可把相同的生成入口放在帮助中的 AI 接口入口，普通用户继续使用按钮、菜单和快捷键。

### 自动生成 AI 接入说明

在 App、Form 或 Panel 中调用统一 API，取得可以直接展示、复制或保存的英文 Markdown；不需要业务代码另写一份接入文案：

```ts
const guide = await clickgo.command.getAgentGuide(this);
if (guide === null || guide === false) {
    return;
}
this.agentGuide = guide;
```

`this` 用于确认当前 App 的生命周期与凭据导出权限；说明不嵌入 App 名称或临时 ID，代理通过接口发现并选择目标。`getAgentInfo(this)` 返回同一份结构化信息，包括 schemaVersion、App 快照、浏览器入口、WebMCP 状态及 Native 进程入口，方便应用自定义展示。目标 App 开始退出时返回 null。每次调用重新读取状态，不启用 MCP、不启动 GUI，也不执行业务命令。

默认只生成几句话：网页 JavaScript 入口与发现流程；Native 再增加一份 stdio 的 `command`/`args` 配置、CLI 的 `--help` 入口、启动要求和 HTTP 设置的获取位置。说明不嵌入 taskId、运行实例 ID、端口或命令清单；代理连接后实时查询 App 和命令说明、inputSchema。进程路径是当前安装的入口，软件重启后继续适用；迁移或重新安装后重新生成。CLI 参数由 `--help` 获取，MCP 工具由 `tools/list` 获取，不需要在介绍中重复完整手册。

网页代理也可直接取得说明或结构化信息：

```js
const api = window['clickgo']['command'];
const guide = await api.getAgentGuide();
const info = await api.getAgentInfo();
```

默认说明不包含 HTTP 凭据，网页地址也省略用户名、查询参数及 hash。若应用的连接设置界面需要主动导出带临时凭据的 HTTP 配置，可调用 `getAgentGuide(this, { 'includeMcpCredentials': true })` 或 getAgentInfo 的相同选项；仍要求当前 App 已获得 root 权限，无权限时返回 false。网页公开入口不接受这个导出选项，不能借目标 App 的 root 权限读取 token。带凭据的文本只用于用户授权的当前连接，不应发布到公开网页；重启后重新生成。

Native 主进程 `getCommandEntry()` 与 App 中的 `await clickgo.native.getCommandEntry()` 只返回进程入口和能力状态，不返回 URL/token。普通网页及不提供此方法的旧 Native 宿主返回 null，不猜测可执行文件路径。宿主显式使用的沙箱启动参数会保留在 args 中，使新进程采用相同启动方式。生成说明不能给 AI 客户端增加工具权限：客户端仍需支持页面 JavaScript、相应 MCP 传输或本地进程操作，业务负责说明的展示和复制入口。

框架启动时自动接入页面的 [WebMCP Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)。document.modelContext 是浏览器提供给整个页面的接口，没有每个 App 分别建立连接的握手过程。业务应用只需声明 `exposed: true` 命令，不调用接入方法，也不要求用户点击连接按钮。框架在内部按 App 管理工具的发布、同步和撤销；Form/Panel 卸载及 App 退出自动撤销所属工具，工具名称包含 task 和注册实例标识，避免多个应用或迟到引用冲突。

`getAgentInfo(this)` 返回的 webMcp.status 是页面级接入状态：unsupported 表示浏览器接口不支持，ready 表示浏览器接口已就绪。未启动 App、没有公开命令、某个工具还在注册或注册失败，都不会改变页面的接入状态；限定不同 App 得到的 status 也相同。此快照读取状态，不触发重新注册。

需要诊断工具发布时，可查看同一快照的 registrationStatus 和 publishedTaskIds。registrationStatus 针对所选 App：idle（没有发布工具）、registering（自动注册中）、ready（工具注册完成）、failed（工具注册失败，例如浏览器权限策略限制）；浏览器不支持时为 null，多个 App 的快照优先显示 failed，再显示 registering。publishedTaskIds 是已完成工具发布的 App ID 列表，不表示这些 App 分别连接了浏览器。浏览器不支持或注册失败不影响普通界面与网页 JavaScript 命令入口，生成说明时也会注明相应情况。

Boot、全部 App 和 Form 通过全局回调 `onWebMcpStatusChanged(status)` 接收同一页面级接入状态，无需 root 权限，也没有 taskId 参数。status 的类型为 `clickgo.command.TWebMcpStatus`：

```ts
/**
 * --- 通过全局事件更新页面的 WebMCP 接入状态 ---
 * @param status 浏览器接入状态
 * @returns 无返回值
 */
public onWebMcpStatusChanged(status: clickgo.command.TWebMcpStatus): void {
    this.webMcpStatus = status;
}
```

框架在 Boot.main 前初始化并通知接入状态，此时可以还没有 App 或命令。新建界面先用 `getAgentInfo(this)` 读取一次快照，之后由事件更新，无需定时轮询。初始化之后只在检测到页面级状态实际变化时通知，不回放历史；App 的命令新增、移除、重试、注册失败和退出均不会触发此事件。关闭的 Form 和正在退出的 App 不再接收通知，各接收者独立处理，异步回调及异常不阻塞框架或其他接收者。

`annotations` 支持 MCP 的 readOnlyHint、destructiveHint、idempotentHint、openWorldHint，以及 WebMCP 的 consequentialHint、untrustedContentHint。WebMCP 映射 readOnlyHint、consequentialHint、untrustedContentHint；未指定 consequentialHint 时使用 destructiveHint。此类说明是给客户端的提示，框架不据此跳过鉴权或自动弹出确认。需要业务确认的命令仍在唯一执行函数中确认。

`connectWebMcp(current)` 保留为显式重同步或重试当前 App 的工具发布入口，返回 false 表示浏览器不支持、App 已退出或注册失败；正常接入流程无需调用。`disconnectWebMcp(current)` 撤销该 task 当前的浏览器工具，不改变页面级接入状态，也不影响普通命令及已有桥接，下次注册公开命令时仍会自动发布。两个名称不表示为 App 建立或关闭浏览器连接。当前 WebMCP 适配器基于 document.modelContext 和注册 AbortSignal 撤销机制，后续 API 变化只需调整适配器。

## 通过界面操作

`await clickgo.command.showPalette(this)` 打开 ClickGo 原生命令面板，显示命令说明、输入规则、JSON 参数输入及结构化结果。也可传 `{ exposedOnly: true }`，仅显示公开命令，并按代理入口执行。

命令面板使用父 Form Loading 保护创建阶段，显示后交给原生模态管理。这种展示 JSON 规则、参数和结果的面板适合开发调试，也可作为界面操作型代理的可选入口；应用不必向普通用户提供它。需要该入口时，在使用说明中告诉代理如何选择命令和填写参数。能调用 JS 桥接或 WebMCP 的代理直接调用接口，不需要打开面板。

## Native MCP 接入边界

ClickGo Native 主进程可以在创建窗口后调用 `await native.startMcp()`，启用本地 Streamable HTTP 服务；普通 ClickGo 网页不会启动本地服务。Native 端提供三个 MCP 工具：

| 工具 | 用途 |
|---|---|
| `clickgo_list_apps` | 获取当前软件内部运行的 App 名称与 `id`；后续将 `id` 作为 `taskId` |
| `clickgo_list_commands` | 传入 taskId，读取该 App 的公开命令及其输入规则、说明与可用状态 |
| `clickgo_execute_command` | 传入 taskId、命令 name 和 args，调用目标 App 的公开命令 |

一个 Native 软件可以运行一个或多个 ClickGo App 实例；`taskId` 是框架对运行中 App 实例 ID 的称呼，与稳定软件 ID 不同，也不是 AI 的工作任务 ID。先调用 `clickgo_list_apps`，把目标结果项的 `id` 原样传给 `taskId`，再调用 `clickgo_list_commands`，按命令的 `inputSchema` 构造参数并执行 `enabled: true` 的命令。多个 App 时按用户目标选择，有歧义则询问；重启后重新发现 App ID。服务介绍、各工具描述和参数规则均向客户端提供这些说明。

业务接入顺序是：先按本文的“声明与执行”在 App 中注册 `exposed: true` 命令，让按钮、菜单等调用同一命令；再在 Native 主进程启用服务；最后让客户端连接并发现命令。业务应用无需自己实现 MCP 路由、HTTP 服务或框架内部客户端。Native 主进程的完整入口示例：

```typescript
import * as native from 'clickgo-native';

class Boot extends native.AbstractBoot {
    public async main(): Promise<void> {
        this.run(native.path(import.meta.url, './index.html'), { 'frame': false });
        const info = await native.startMcp({ 'id': 'com.example.app' });
        if (info === false) {
            // --- 在应用中显示合适的连接状态 ---
            return;
        }
        // --- 通过应用的连接设置提供 info.url 和 info.token ---
    }
}

native.launcher(new Boot());
```

请求经过 Native 主文档会话检查后，进入页面端 `dist/lib/command/native.ts`。适配器按 taskId 读取公开命令或直接调用 `executeAgent(taskId, name, args, options)`，无需为单次请求创建桥接；业务函数仍在对应 App 中执行。不同 App 可以有相同命令名，taskId 决定调用哪个实例，App 不需要另写协议文件或重复注册 MCP 工具。

`native.startMcp()` 默认使用系统分配的端口和随机访问令牌，`native.getMcpInfo()` 与 `native.stopMcp()` 分别读取设置和停止服务。ClickGo App 可通过 `await clickgo.native.getMcpInfo(this)` 读取 URL 和令牌，这一操作要求 root 权限；未启用返回 null，权限拒绝返回 false。只在用户主动查看连接设置时展示令牌，不写日志。

外部客户端使用 URL 与 `Authorization: Bearer <token>` 连接服务。Native Demo 展示连接设置与实际 taskId 的请求示例，外部客户端示例见 [ClickGo Native](https://github.com/maiyun/clickgo-native) 的 `dist/test/mcp-client.ts`。关闭 Native 窗口时停止服务；取消信号沿协议、主进程和代理执行入口传入原命令，命令仍需配合 signal 停止自己的业务操作。

当前 Native 同时支持 HTTP MCP、stdio MCP 和 CLI。三个入口共用相同的 MCP 工具定义和 App 命令执行层：

- HTTP：AI 客户端直接通过 URL 与认证头连接正在运行的软件。
- stdio：AI 客户端直接启动软件可执行文件，如 `./MySoftware --mcp`。接入进程面对 AI 是 stdio MCP 服务端，内部作为 HTTP MCP 客户端转发到已打开的软件。
- CLI：`./MySoftware --cli instances` 发现本软件实例，`./MySoftware --cli apps` 获取 App，`./MySoftware --cli commands --app '<taskId>'` 获取命令，`./MySoftware --cli execute --app '<taskId>' --name '<commandName>' --args '{"amount":2}'` 执行命令。CLI 通过同一个内部 HTTP MCP 客户端转发。

软件自身的入口默认连接同一安装的软件，不要求额外指定软件 ID，也不受业务自定义 `startMcp({ id })` 影响。如果同一软件同时开了多个实例，从 `instances` 返回结果中选择唯一运行实例 ID，通过 `--host '<instanceId>'` 指定。stdio/CLI 每次调用通过当前操作系统用户的私有临时运行记录获取最新服务地址和凭据，不依赖固定端口；默认需要提前打开 GUI；开启下面的按需启动选项后，首次命令请求可以自动拉起。GUI 的 Boot.main 仍须启用 MCP 及实例发现。`discovery: false` 会关闭这两种入口的自动发现。

Native `launcher()` 在 GUI 单实例锁和业务 `Boot.main()` 之前分流 `--cli` / `--mcp`，命令进程不执行业务初始化，始终连接 GUI 中的共享状态。用户无需安装 Node.js、全局安装 clickgo-native，或使用 `ELECTRON_RUN_AS_NODE`。初始化业务应放在 `Boot.main()` 中；stdio 的 stdout 专用于 MCP 协议，不能在模块顶层输出业务日志。设置界面与长期配置持久化由消费应用负责，框架只维护当前运行记录。

消费应用可开启按需启动：

```ts
native.launcher(new Boot(), { 'commandAutoStart': true });
```

默认 false。开启后，CLI 的 apps/commands/execute 或 stdio 的第一次命令工具调用在没有运行实例时启动同一软件，并最多等待 20 秒让 App 就绪。`--help`、instances、MCP 握手和 tools/list 不启动 GUI；并发请求共用启动过程。GUI 仍走原 Boot.main，须创建窗口并调用 startMcp()，不能关闭 discovery。取消或超时只结束本次等待，不关闭已拉起的 GUI；即使服务记录尚未发布，后续请求也等待同一 GUI，只有它退出后才允许重新启动。不重试业务修改。`getCommandEntry().startup` 对应为 auto 或 existing，生成说明也随之变化。

例如，使用 `mcpServers` 配置格式的 AI 客户端，在安装上述软件后，可配置：

```json
{
    "mcpServers": {
        "com.example.app": {
            "command": "<已安装软件可执行文件的绝对路径>",
            "args": ["--mcp"]
        }
    }
}
```

Windows 使用软件的 `.exe`，macOS 使用 `.app/Contents/MacOS/` 内的可执行文件，Linux 使用软件二进制文件或 AppImage。连接后先发现 App，再获取命令规则并执行；stdio 和 HTTP 使用相同的工具名称与参数。

开发调试同样使用软件自身的入口：在 ClickGo 仓库中运行 `npx tsc` 后，用 `npm run native` 启动 GUI，另一个进程通过 `./node_modules/.bin/electron dist/test/native --cli apps` 或同一入口的 `--mcp` 接入。使用 `native2`、`native3` 时，命令进程也使用对应的入口文件。不能用 `npm run` 启动 stdio，以免 npm 输出混入协议 stdout。自动回归入口为 `npm run test:native`，更详细的联动开发与测试说明见 `dist/test/native/README.md`。

完整的安装、HTTP 连接、stdio 客户端配置和 CLI 示例见 [ClickGo Native 简体中文文档](https://github.com/maiyun/clickgo-native/blob/master/doc/README.sc.md)。

Streamable HTTP 实现需遵循 [MCP transport 规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) 的 loopback 绑定、Origin 校验和连接授权要求。云端运行的 MCP 客户端不能直接访问用户电脑的 loopback，需要其支持的本地连接组件；这与当前页面内的 WebMCP 是不同接入方式。

内置示例位于 Demo → method → Library command，可验证按钮、菜单、快捷键、实例桥接及命令面板共用计数状态。
