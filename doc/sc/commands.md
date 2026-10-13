# 通用命令

通过 `clickgo.command` 注册业务动作，按钮、菜单、快捷键、浏览器代理和 Native MCP 共用同一执行函数。

## 声明与执行

Form/Panel 在 `onMounted` 中注册；应用级命令用 AbstractApp 或 taskId 注册。名称在同一 App 内唯一，多文档命令用名称或参数明确目标。Form 关闭、Panel 卸载或 App 退出时自动移除所属命令，并取消在途调用。

```ts
import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public count = 0;

    /** --- 注册业务命令 --- */
    public onMounted(): void {
        const registered = clickgo.command.register<{ 'amount': number; }>(this, {
            'name': 'counter.add',
            'title': 'Add to counter',
            'description': 'Increase the counter by amount and return its updated value.',
            'inputSchema': {
                'type': 'object',
                'properties': { 'amount': { 'type': 'integer', 'minimum': 1, 'maximum': 10 } },
                'required': ['amount'],
                'additionalProperties': false,
            },
            'exposed': true,
            'execute': (args) => {
                this.count += args['amount'];
                return clickgo.command.success({ 'count': this.count });
            },
        });
        if (!registered) {
            // --- 名称重复、实例已销毁或 schema 不受支持时注册失败 ---
            return;
        }
    }

    /** --- 按钮、菜单及快捷键共用此入口 --- */
    public add(): Promise<clickgo.command.TResult> {
        return clickgo.command.execute(this, 'counter.add', { 'amount': 1 });
    }

}
```

按钮绑定 `@click="add"`，菜单绑定同一方法；快捷键沿用 `menulist-item.alt`。命令标题和说明遵循应用语言机制。名称为 1–128 个 ASCII 字母、数字、下划线、点或连字符，description 不可为空；`register()` 返回是否成功。

| 声明项 | 行为 |
|---|---|
| `exposed` | 默认 false；true 允许代理发现和执行，业务鉴权仍由执行函数负责 |
| `enabled` | 每次执行检查；回调返回 true、false 或不可用原因。窗口隐藏或模态状态不会自动禁用命令 |
| `permissions` | 检查已取得的 ClickGo 权限，不弹授权窗口 |
| `concurrent` | 默认拒绝同一命令并发；设 true 才允许，不同命令的共享资源互斥由业务负责 |
| `outputSchema` | 可选，校验成功返回的数据 |
| `annotations` | 描述只读、破坏性、幂等等行为；仅供客户端参考，不代替确认或授权 |

`list(this)` 返回命令元数据及 enabled、disabledReason、running 快照；需要时重新读取。临时命令可用 `unregister(this, name)` 或 `clear(this)` 移除。全部声明项见 [IDefinition](api/lib/command/interfaces/IDefinition.md)。

## 参数与结果

- `inputSchema` 根类型必须为 object；空参数用 `{ 'type': 'object', 'additionalProperties': false }`。`outputSchema` 可指定受支持的 JSON 类型。
- 支持 JSON Schema 2020-12 的子集，字段见 [ISchema](api/lib/command/interfaces/ISchema.md)。不支持 format、远程引用、数组形式的 type 等未列出的规则；用 anyOf 表达多种类型。`$ref` 仅支持当前 schema 内的 JSON Pointer，递归必须推进到子数据。
- 不转换类型、不补默认值、不删除额外字段。输入、输出和 schema 必须为普通 JSON 数据，拒绝 undefined、非有限数字、稀疏数组、类实例、getter 和循环数据；嵌套深度最多 64。字符串长度按 Unicode 码点计算，pattern 使用 Unicode 模式。
- 执行回调返回 `success(data)` 或 `failure(code, message)`，无数据时传 null。结果为 `{ ok: true, data }` 或 `{ ok: false, error: { code, message } }`。
- 框架错误码：not-found、invalid-input、invalid-output、unavailable、permission-denied、cancelled、execution-failed。业务错误码保留；异常不会向代理公开堆栈或内部路径。

`execute(this, name, args, { 'signal': signal })` 支持取消；执行回调通过第二个参数 `context.signal` 配合停止。取消不回滚已发生的修改，忽略 signal 的业务仍可继续，执行占用在回调实际结束后释放。context 包含 taskId、formId、panelId 和 source；source 的 user/agent 仅用于记录，不能作为授权凭据。

## 浏览器代理与 WebMCP

框架自动发布 `window['clickgo']['command']`，不需要业务另建桥接文件，也不依赖 WebMCP。代理按以下顺序调用：

```js
const api = window['clickgo']['command'];
const apps = api.listTasks();
// --- 按用户目标选择 App，多项匹配时先澄清 ---
const matches = apps.filter(item => item.name === 'Your app');
if (matches.length === 1) {
    const app = matches[0];
    const commands = api.list(app.id);
    const command = commands.find(item => item.name === 'counter.add');
    if (command?.enabled) {
        const result = await api.execute(app.id, command.name, { 'amount': 2 });
        // --- 按 result.ok 处理成功或失败 ---
    }
}
```

`listTasks()` 返回 App 的 id、name；`list(taskId)` 仅返回公开命令，含 description、inputSchema 和当前状态。taskId 是运行中的 App 实例 ID，重启后重新获取；不同 App 可有同名命令。参数按 inputSchema 构造，禁用时查看 disabledReason，不自动重试修改操作。网页 execute 使用代理入口，不能执行未公开命令。

框架内的适配器用 `executeAgent(taskId, name, args)`；普通界面用 `execute(this, name, args)`，可调用内部命令。只有模块需要长期绑定一个 App 时才使用 `createBridge(this)`，获得该 App 的公开 list()/execute() 接口。

WebMCP 可用时框架自动发布公开命令，无需连接按钮。通过 `await getAgentInfo(this)` 取得快照，检查 null/false 后读取 webMcp：

| 字段或事件 | 含义 |
|---|---|
| `status` | 页面级 unsupported/ready，与 App 数量及工具注册是否成功无关 |
| `registrationStatus` | 工具发布诊断：idle/registering/ready/failed；浏览器不支持时为 null |
| `publishedTaskIds` | 已完成工具发布的 App ID |
| `onWebMcpStatusChanged(status)` | Boot、App、Form 接收同一页面级状态，无 taskId、无需 root |

界面先读一次快照，再通过事件更新，无需轮询。事件不回放历史，App 命令变化或发布失败不触发该事件。`connectWebMcp(this)` 仅用于显式重试工具发布，失败返回 false；`disconnectWebMcp(this)` 撤销当前 App 工具，不改变页面状态，之后注册公开命令仍会自动发布。WebMCP 不支持或发布失败时，网页 JS 入口仍可使用。

## 自动生成 AI 接入说明

在帮助或“AI 接口”入口展示框架生成的英文 Markdown，供用户复制给 AI：

```ts
const guide = await clickgo.command.getAgentGuide(this);
if (guide === null || guide === false) {
    return;
}
this.agentGuide = guide;
```

说明包含当前可用入口；Native 环境还提供 stdio 配置、CLI 帮助入口及启动要求，不写死临时 ID 或命令清单。`getAgentInfo(this)` 返回结构化快照；目标 App 退出返回 null，无权限导出凭据返回 false。这两个方法不启用 MCP、不启动 GUI、不执行业务命令；软件迁移或重装后重新生成说明。

网页入口也提供 `await api.getAgentGuide()` 和 `await api.getAgentInfo()`。默认及网页公开入口都不导出 HTTP 凭据；App 显式传 `{ 'includeMcpCredentials': true }` 才可导出，且必须有 root 权限。带凭据的说明只供用户授权的连接使用，不写日志或公开发布，重启后重新生成。

页面上的说明只是发现提示；直接调用 JS 仍要求代理具备页面 JavaScript 执行能力。只支持点击和输入的代理使用正常界面。可选调试入口 `await clickgo.command.showPalette(this)` 展示命令、JSON 参数和结果；传 `{ 'exposedOnly': true }` 时仅展示公开命令并按代理执行。

## Native MCP 接入边界

Native 主进程创建窗口后调用 `await native.startMcp()`，App 注册公开命令即可，无需实现 MCP 路由。HTTP、stdio 和 CLI 共用同一命令执行层：

| 入口 | 接入方式 |
|---|---|
| HTTP MCP | 使用运行时返回的 URL 和 `Authorization: Bearer <token>` |
| stdio MCP | AI 客户端启动软件自身可执行文件，args 为 `["--mcp"]` |
| CLI | 软件自身可执行文件加 `--cli --help`，按帮助发现和执行命令 |

MCP 调用顺序为 `clickgo_list_apps` → `clickgo_list_commands` → `clickgo_execute_command`。把所选 App 的 id 原样作为 taskId，读取命令 schema 和 enabled 状态后再执行。多个 App 时明确目标，有歧义先询问；重启后重新发现 ID。

stdio/CLI 自动发现同一安装的软件及其当前端口和凭据，最终用户无需 Node.js 或全局 npm 包。默认需已打开 GUI；`native.launcher(new Boot(), { 'commandAutoStart': true })` 可让首次命令请求拉起 GUI，Boot.main 仍须创建窗口并启用 MCP。帮助和 MCP 握手不启动 GUI；取消等待不关闭 GUI，不自动重试修改操作。stdio 的 stdout 仅用于协议，模块导入和业务初始化不能向其写日志。

启用本地发现允许同一操作系统用户的进程获取临时凭据，`discovery: false` 会关闭 stdio/CLI 的发现。App 读取 HTTP 设置用 `await clickgo.native.getMcpInfo(this)`，需 root 权限；未启用为 null，权限拒绝为 false。云端 AI 不能直接访问用户电脑的本地服务，需要客户端支持本地接入。

完整宿主与客户端配置见 [ClickGo Native 文档](https://github.com/maiyun/clickgo-native/blob/master/doc/README.sc.md)。Demo → method → Library command 展示共享命令；开发验收见 [Native 联动测试](../../dist/test/native/README.sc.md)。
