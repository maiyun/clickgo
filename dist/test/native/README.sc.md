# Native 联动测试

[English](README.md) | 简体中文

本目录用于测试 ClickGo 与 Native 宿主的联动。以下命令均在 ClickGo 仓库根目录执行。

## 启动 Demo

```sh
npx tsc
npm run native
```

其他窗口模式使用 `npm run native2` 或 `npm run native3`。三个入口均启用本地 MCP（`clickgo-demo`），并允许命令请求自动启动 GUI。

- **AI interface guide** 注册计数器命令。通过 **Generate AI access guide** 获取客户端配置说明，或用 **Show access information** 查看诊断信息。
- **Library native** 演示持久 JSON（`native.storage`）和加密字符串（`native.secret`）。App 存储无需 `root` 权限，但需要固定的 `config.json` `id`，移动或升级时保持不变；没有有效 ID 时，数据操作返回 `false`。

## CLI 与 stdio MCP

先获取 App 和命令，再执行：

```sh
./node_modules/.bin/electron dist/test/native --cli --help
./node_modules/.bin/electron dist/test/native --cli apps
./node_modules/.bin/electron dist/test/native --cli commands --app '<taskId>'
./node_modules/.bin/electron dist/test/native --cli execute --app '<taskId>' --name '<commandName>' --args '{"amount":2}'
```

使用接口返回的 ID，参数遵循命令的 schema。重启后重新获取 App ID，不要自动重试修改操作。多个宿主同时运行时，用 `--cli instances` 获取列表，再通过 `--host` 选择。

使用 `mcpServers` 配置的 AI 客户端可接入开发入口：

```json
{
    "mcpServers": {
        "clickgo-demo": {
            "command": "<absolute-path-to-clickgo>/node_modules/.bin/electron",
            "args": ["<absolute-path-to-clickgo>/dist/test/native", "--mcp"]
        }
    }
}
```

测试 `native2` 或 `native3` 时，将 `dist/test/native` 替换为 `dist/test/native/index2` 或 `dist/test/native/index3`。Electron 可执行文件路径按当前平台填写。stdio 不要通过 `npm run` 启动，也不能向 stdout 写业务日志：该通道仅用于 MCP 消息。

打包后的软件直接通过自身可执行文件使用 `--cli` 或 `--mcp`，最终用户无需安装 Node.js 或全局 npm 包。本地发现允许同一操作系统用户的进程获取临时连接凭据；App 导出 HTTP 凭据仍需 `root` 权限并显式请求。

## 验证

- `npm run test:native`：版本、持久存储、窗口、MCP、CLI/stdio 和自动启动的回归测试。
- `node dist/abox/test/native-cli.mjs`：仅运行 CLI/stdio 回归。
- 真实 Electron 验收：确认 MCP 操作能更新计数器界面，且能读取界面操作后的结果。

验证重启和 App 移动后的持久数据时，使用同一个初始为空的测试目录，分别启动两次：

```sh
./node_modules/.bin/electron dist/abox/test/native-storage-electron.mjs write '<temporary-directory>'
./node_modules/.bin/electron dist/abox/test/native-storage-electron.mjs read '<temporary-directory>'
```

测试写入示例配置和密文，读取验证后删除。打包后执行 `node dist/abox/test/native-executable.mjs <absolute-path-to-packaged-binary> [electron-options]`，检查无系统 Node.js、无显示环境下的 CLI/stdio。自动测试仍需配合真实 GUI 验收。

验证完成后，按 [Native 联动](../../abox/doc/native.md#源码同步) 将 Native 源码同步到 clickgo-native。业务接入和协议细节见 [命令指南](../../../doc/sc/commands.md) 与 [ClickGo Native 文档](https://github.com/maiyun/clickgo-native/blob/master/doc/README.sc.md)。
