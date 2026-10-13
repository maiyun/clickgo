# Native 联动

仅改 Native 桥接、主进程或其宿主时读取；[参数及接入](../../test/native/README.md) 是现有参考。

## 源码同步

- 测试宿主 `dist/test/native/native.ts` 对应 clickgo-native 的 `dist/index.ts`，lib/{fs,tool,mcp,instance,client,cli,startup,version,persistence,storage,secret}.ts 对应对方 dist/lib，手写 pre.js 对应 dist/pre.js；对应源文件逐字一致，不能降级为桩。
- 先改 ClickGo 副本，生成 TS 产物并跑 check、test:native；真实 Electron 用 native，无边框/进程保留用 native2/native3。验收后同步对应源码到 clickgo-native，构建/回归并 cmp；JS/声明各自生成。
- 三个启动 Demo 显式 startMcp，稳定软件 ID 为 clickgo-demo，命令演示从 Demo 的 AI interface guide 进入。SDK 在此为 devDependency，在 Native 服务端为运行依赖；同步依赖变更。联动至少核实 MCP 更新 UI、UI 可由 MCP 读取及受影响的 App 隔离、取消、退出。

## 运行契约

- `dist/lib/command/native.ts` 是固定页面适配器，经 native.ts 发布；每次按 taskId 调用 executeAgent，保留公开命令及 agent 来源。createBridge 仅供绑定单 App 的调用方；协议服务在主进程，getMcpInfo(current) 要求 root。
- 持久配置/secret 在 userData。主进程默认软件空间；框架按 config.json.id 经当前文档会话隔离 App 空间，App 不需要 root。task.run 固定 ITask.appId；无合法 id 的旧 App 可运行，存储读写返回 false。
- persistence 逐键串行并临时文件替换；secret 使用异步 safeStorage，轮换密钥时更新密文，isAvailable 也异步；无安全服务返回 false，不落明文。自动回归 test:native；真实重启入口 dist/abox/test/native-storage-electron.mjs。
- launcher 同一可执行文件提供 --cli/--mcp，在 GUI 单实例锁、文件处理及 Boot.main 前分流；不要求系统 Node、npm bin 或 RunAsNode。业务初始化放 Boot.main，导入/Boot 构造不向 stdio stdout 写日志。before-quit 取消接入、排空输出，只退出当前命令进程。
- 调试用 electron <入口> --cli/--mcp，stdio 不混入 npm 输出。自动 test:native 与接收真实打包二进制的 dist/abox/test/native-executable.mjs 分开；后者核实无系统 Node/显示环境的 CLI、stdio、EOF 和取消，GUI 联动另验。
- instance 发布/发现同用户临时私有运行记录，client 转发到原 HTTP MCP；HTTP/stdio 共用 mcp 工具。每次读新记录，不重试修改；软件 ID、实例 ID、App taskId 分层，多实例明确选择，重启重新发现 taskId。
- 内部 applicationId 按安装可执行文件归属，开发按 App 路径，AppImage 按原镜像；CLI/stdio 只连接同一安装，不受业务 MCP ID 影响。MCP 默认允许同用户发现凭据，discovery:false 可关闭；退出撤销记录，崩溃遗留按 PID 排除。长期凭据/偏好由应用维护，网页读取仍要 root。
- 版本由 lib/version.ts 读取模块所属包 package.json，不复制常量或读取业务 app.getVersion；ClickGo 副本读 ClickGo 包，升级后重启。
- commandAutoStart 默认 false；启用后仅需 GUI 的命令按需拉起，帮助/instances/握手/tools/list 不拉起。私有锁合并并发、按安装隔离并限时等就绪；锁交给 GUI，取消/超时仅释放本次等待，不关 GUI、不回放修改；就绪清锁，异常退出可重启。回归 test:native 覆盖。
