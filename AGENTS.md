# ClickGo 框架工作区

本仓库是 `clickgo` 框架及其内置控件、主题和示例应用。

- 开发先读取 kebab-site 的 `core`；框架/内置控件维护用 `clickgo-source`，应用或 Demo 接入按需用 `clickgo-app`。三箱与 abox 用 `development-flow`，白/灰箱写法另用 `code-rule`。
- 实际 TypeScript 源码位于 `dist/`。同目录的 `.js`、`.d.ts`、`.css`、`.pack.js` 和 `.cgc`/`.cga` 是生成物，使用编译或打包生成。
- 新增独立控件时，`dist/pack.ts` 自动扫描控件目录；同时检查 `dist/lib/fs.ts` 的资源清单、消费应用 `config.json` 和控件 `info.md`，三者不会自动同步。
- `dist/sources/control/desktop/lib/layout.ts` 是无 DOM 的有限区域布局逻辑；Desktop 的 `positions` 保存用户布局，`layout.positions` 是窗口约束后的临时显示布局，缩放不能覆盖持久化位置。应用负责文件操作、壁纸和持久化。
- Desktop 与 Iconview 共用 `modules.pointer.drag()`；Pointer.js 管理可取消会话、指示器和最上层落点，通过既有 move hooks 同步 iframe 遮罩。保持 pointer 的 fs 载荷及 data-drop 协议兼容，销毁、禁用或取消时不投递 drop。
- 桌面控件的参数 demo 在 `dist/app/demo/form/control/desktop/`；置底实战 Form 在 `dist/app/demo/form/solution/desktop/`。添加 demo 时同步主 Form 的入口和应用控件配置。
- Form 的 `viewport` 和 `padding="safe"` 由控件管理布局边界与内容安全区；首次最大化与 `form.refreshMaxPosition()` 统一委托控件刷新，桌面 demo 不手工维护全屏尺寸。
- 通用命令以 `dist/lib/command.ts` 为执行入口；Form/Panel 的卸载及 task.end 必须清理对应命令，退出等待期间拒绝新注册。跨入口、协议注册与取消回归使用 `npm run test:command`，应用接入方式见 `doc/sc/commands.md`。
- Demo 应用沿用英文展示，包括 Form 标题、菜单、按钮、提示及命令标题/说明；注释可以使用中文。框架内置界面沿用当前 locale 和英文回退，语言表覆盖 `tool.lang.codes` 全部语种；`npm run test:locale` 检查内置语言表与键完整性。
- 框架初始化时自动发布 `window['clickgo']['command']`，通过 `listTasks()`、`list(taskId)` 和 `execute(taskId, name, args)` 访问各 App 的公开命令。WebMCP 接入属于整个页面，由框架在 Boot.main 前自动初始化，业务及 Demo 不要求手动连接；onWebMcpStatusChanged(status) 向 Boot 和全部 App、Form 广播页面级 unsupported/ready 状态，无 taskId、无需 root 权限。每个 App 的工具发布、同步、失败、撤销及退出都是内部管理，不改变页面级状态或触发接入事件；getAgentInfo 的 registrationStatus/publishedTaskIds 仅用于发布诊断。界面首次读取快照，后续使用事件，不轮询，关闭/退出后停止投递。宿主不单独发布或清理。Library command Form 展示统一入口，desktop/webpage/cache 和 Native 网页宿主共用该能力。
- Native 的固定页面命令适配器位于 `dist/lib/command/native.ts`，由 `dist/lib/native.ts` 发布给 Native 主进程；每次请求直接按 taskId 调用 `command.executeAgent()`，保留公开命令限制和 agent 来源。网页及 WebMCP 同样使用此入口；`createBridge()` 仅为需要绑定单个 App 的调用方提供可复用接口。协议服务在 Native 主进程及本仓库的 Native 测试副本中，页面端不监听网络；`native.getMcpInfo(current)` 沿用 root 权限读取连接设置。
- Native 持久配置和加密字符串保存在软件 userData；主进程默认使用软件级空间，App 无需 root，`dist/lib/native/{storage,secret}.ts` 由框架按 config.json 的固定 id 隔离空间并经当前文档会话访问。task.run 将合法 id 保存为 ITask.appId；不随路径、名称、版本或临时 taskId 改变，无有效 id 的旧 App 仍可运行但存储读写返回 false。磁盘操作由 Native 的 `lib/persistence.ts` 负责，逐键串行、临时文件替换；secret 使用 Electron 异步 safeStorage，必要时更新轮换密钥的密文；主进程 isAvailable 同样异步，无安全密钥服务时返回 false，不写明文。Library native 展示用法；存储回归包含在 test:native，真实重启入口为 test/native-storage-electron.mjs。
- AI 接入说明由 `command.getAgentInfo()` 收集实际环境，再由 `dist/lib/command/guide.ts` 格式化；Demo 展示生成结果，不能维护第二份接入文案。Native 的 `cg-command-entry` 只提供进程入口与能力状态，默认及网页桥接均不导出凭据；应用显式导出 HTTP 凭据仍经 `native.getMcpInfo(current)` 的 root 检查。默认说明保持简短，不嵌入临时 App/实例 ID 或命令清单；详细运行快照留在 getAgentInfo。启动模式由 commandAutoStart 对应 existing/auto。
- 验证使用 `npm run check`；位置、指针取消和双向绑定回归使用 `npm run test:desktop`。先用 `npx tsc` 更新生成的运行时代码，再运行依赖该代码的测试。
- Select 的值同步、搜索、交互和消费控件回归使用 `npm run test:select`；打包后用 `CLICKGO_SELECT_TEST_ARCHIVE=1 npm run test:select` 验证实际控件包。本地列表按完整数据校验，远程结果缺项时保留已选值并补齐标签。
- 控件 SCSS 使用已有全局 Sass 命令编译，随后运行 `node dist/pack.js`。打包器部分错误会被捕获，必须确认对应控件数量和应用结果，并检查归档内容；需要时执行 `npm run test:archive`。
- 浏览器入口为 `dist/test/desktop/`；安全上下文和可加载的运行时依赖是有效验收的前提。区分类型、单元回归、浏览器与 Native 桌面验证。

## Native 联动开发与同步

- `dist/test/native/native.ts` 与 clickgo-native 仓库的 `dist/index.ts` 必须逐字一致；它是完整的 Native 主进程实现，不能只保留旧版测试桩。`dist/test/native/lib/{fs,tool,mcp,instance,client,cli,startup,version,persistence,storage,secret}.ts` 和手写的 `dist/test/native/pre.js` 同样对应对方的 `dist/lib/` 与 `dist/pre.js`。
- Native 改动先落在本仓库测试副本，运行 `npx tsc`、`npm run check`、`npm run test:native`，再用 `npm run native` 做真实 Electron 联动验收；涉及无边框或进程保留模式时分别使用 `npm run native2`、`npm run native3`。通过后才将对应源文件同步到 clickgo-native，运行对方构建及相关回归，并用 `cmp` 核对源文件完全一致。生成的 JS/类型声明由各自编译更新。
- 三个 Native 启动 Demo 均显式调用 `startMcp()`；命令演示从 ClickGo Demo 的 AI interface guide 进入。SDK 在本仓库属于测试用 devDependencies，在 clickgo-native 的服务端属于运行依赖；变更模块时同步两边依赖声明。联动测试至少验证 MCP 调用更新 UI、UI 操作可由 MCP 读取，以及受影响的 App 隔离、取消和窗口退出行为。

- 软件交付的 CLI/stdio 入口由 Native `launcher()` 自动提供：软件可执行文件使用 `--cli <command>` 或 `--mcp`，不要求用户安装 Node.js、全局 npm 包或启用 RunAsNode。入口在 GUI 单实例锁、文件处理和 `Boot.main()` 之前分流；Electron 的 `before-quit` 先取消接入操作，排空输出后只退出当前命令进程。业务初始化放在 `Boot.main()`，模块导入与 Boot 构造期间不能向 stdio stdout 写日志。
- 不提供全局 npm bin 或独立 Node 命令入口。开发调试直接运行 `electron <Native入口> --cli ...` / `--mcp`，与 GUI 使用同一个入口文件；stdio 不能让 npm 的输出混入协议。`npm run test:native` 运行自动回归，`test/native-cli.mjs` 只在临时目录创建测试进程调用内部适配器。三个 Native Demo 使用稳定软件 ID `clickgo-demo`。
- `lib/instance.ts` 发布/发现同一操作系统用户的临时私有运行记录，CLI 与 stdio 经 `lib/client.ts` 转发到原 HTTP MCP；`lib/mcp.ts` 的工具定义由 HTTP 和 stdio 共用。每次调用读取新记录，不重试修改操作；软件 ID、运行实例 ID 和 App taskId 是三个层次，多个匹配实例必须明确选择，重启后重新发现 taskId。
- 运行记录的内部 `applicationId` 根据安装的可执行文件（开发时为 App 路径、AppImage 为原镜像路径）生成，CLI/stdio 必须提供此归属并只连接同一安装的实例，不受业务自定义 MCP ID 影响。`test/native-executable.mjs` 接收真实打包二进制文件，验证无系统 Node/显示环境的 CLI、stdio、EOF 和中断取消；真实 GUI 联动仍单独验证。
- 启用 MCP 默认允许本机同用户发现当前连接凭据，`discovery: false` 可关闭。退出撤销运行记录，崩溃遗留记录按 PID 排除；这不是业务配置持久化。业务设置页、长期凭据与启动偏好由消费应用维护，网页读取凭据仍要求 root。接入与参数说明见 `dist/test/native/README.md`。

- MCP 客户端及 HTTP/stdio 服务端的框架版本共用 `lib/version.ts`，从模块所属包的 `package.json` 读取，不复制版本常量，也不使用消费软件的 `app.getVersion()`；ClickGo 测试副本读取 ClickGo 包版本。升级包版本后重启即可生效。

- Native launcher 的 commandAutoStart 默认 false；启用时只有需要 GUI 的命令请求才按需启动，帮助、instances、MCP 握手及 tools/list 不启动。启动前保持安装归属，私有启动锁合并并发请求，等待 App 就绪有上限；拉起后启动锁交给 GUI，取消或超时只释放本次等待。后续请求继续等待同一 GUI，就绪后清理启动锁，GUI 异常退出后可重新启动；不关闭 GUI，也不回放修改。自动启动回归见 test/native-startup.mjs。
