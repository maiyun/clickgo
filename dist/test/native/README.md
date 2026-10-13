# Native integration tests

English | [简体中文](README.sc.md)

This directory tests ClickGo with its Native host. Run all commands below from the ClickGo repository root.

## Start the Demo

```sh
npx tsc
npm run native
```

Use `npm run native2` or `npm run native3` for the other window modes. All three enable local MCP (`clickgo-demo`) and automatic GUI startup for command requests.

- **AI interface guide** registers the counter commands. Use **Generate AI access guide** for client setup or **Show access information** for diagnostics.
- **Library native** demonstrates persistent JSON (`native.storage`) and encrypted strings (`native.secret`). App storage needs no `root` permission, but requires a fixed `config.json` `id`; keep it unchanged across moves and upgrades. Without a valid ID, data operations return `false`.

## CLI and stdio MCP

Discover the App and its commands before executing:

```sh
./node_modules/.bin/electron dist/test/native --cli --help
./node_modules/.bin/electron dist/test/native --cli apps
./node_modules/.bin/electron dist/test/native --cli commands --app '<taskId>'
./node_modules/.bin/electron dist/test/native --cli execute --app '<taskId>' --name '<commandName>' --args '{"amount":2}'
```

Use returned IDs and arguments matching the command schema. Rediscover App IDs after restart; do not automatically retry mutations. If several hosts are running, use `--cli instances` and select one with `--host`.

For an AI client using `mcpServers`, configure the development entry as follows:

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

For `native2` or `native3`, replace `dist/test/native` with `dist/test/native/index2` or `dist/test/native/index3`. Use your platform's Electron executable path. Never launch stdio through `npm run` or write business logs to stdout: it carries only MCP messages.

Packaged software uses its own executable with `--cli` or `--mcp`; end users need no Node.js or global npm package. Local discovery allows processes of the same OS user to obtain temporary connection credentials. Exporting HTTP credentials from an App still requires `root` and an explicit request.

## Verification

- `npm run test:native`: automated version, persistence, window, MCP, CLI/stdio and startup regressions.
- `node dist/abox/test/native-cli.mjs`: CLI/stdio regressions only.
- For real Electron acceptance, verify that MCP updates the counter UI and reads changes made through the UI.

To verify persistence across restart and App relocation, run these two launches with the same initially empty test directory:

```sh
./node_modules/.bin/electron dist/abox/test/native-storage-electron.mjs write '<temporary-directory>'
./node_modules/.bin/electron dist/abox/test/native-storage-electron.mjs read '<temporary-directory>'
```

The test writes sample settings and secrets, then removes them after reading. For a packaged executable, run `node dist/abox/test/native-executable.mjs <absolute-path-to-packaged-binary> [electron-options]` to check CLI/stdio without system Node or a display. Automated checks supplement real GUI acceptance.

After validation, synchronize the Native sources with clickgo-native as required by [Native synchronization](../../abox/doc/native.md#源码同步). See the [command guide](../../../doc/sc/commands.md) (Simplified Chinese) and [ClickGo Native documentation](https://github.com/maiyun/clickgo-native#local-mcp) for application integration and protocol details.
