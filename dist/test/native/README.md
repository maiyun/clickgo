# Native command integration

Run `npx tsc` before using the Native test entrypoints. `npm run native`, `npm run native2` and `npm run native3` enable local MCP with the stable software ID `clickgo-demo`. Open **AI interface guide** in the Demo to register its counter commands.

## Software entrypoints

Packaged software uses its own executable for CLI and stdio. Users do not install Node.js or a global npm package. The Native `launcher()` handles `--cli` and `--mcp` before starting the GUI; commands reuse the running GUI. The three Demo launchers enable `commandAutoStart: true`, so the first command can also open a closed GUI.

## Automatic startup

```ts
native.launcher(new Boot(), { 'commandAutoStart': true });
```

Default: false. With this option, CLI command requests and stdio command tools start the same GUI when no instance is running, then wait up to 20 seconds for an App. Boot.main must create the window and enable MCP with local discovery. Help, instances, MCP initialization and tools/list do not launch the GUI. Concurrent callers share startup. Cancellation or timeout ends only that request's wait; later requests wait for the same GUI, including before its service record is published. If that GUI exits, the next request can start it again. Business mutations are never retried.

## Generated AI access guide

An App can display or export `await clickgo.command.getAgentGuide(this)` directly. It generates English Markdown from the current environment, with a few sentences about browser access, one Native stdio process configuration, CLI help and HTTP connection settings. It embeds no transient App IDs or command catalog; agents discover them through the interfaces. `getAgentInfo(this)` provides the same structured snapshot. Check `null` (App exited) and `false` (credential export denied) before using the result.

The default guide contains no HTTP credentials. An App that already has `root` permission may explicitly request `getAgentGuide(this, { includeMcpCredentials: true })` from its connection-settings UI. The public page API's `getAgentGuide(taskId)` and `getAgentInfo(taskId)` never export credentials, even for an App with root permission. The generator does not enable MCP or launch the GUI; the launcher option controls startup: `existing` by default, `auto` with `commandAutoStart: true`.

Open **AI interface guide**, then use **Generate AI access guide** or **Show access information** to inspect the actual environment. Native `getCommandEntry()` and `await clickgo.native.getCommandEntry()` return executable metadata without credentials. In development, the generated arguments preserve the running `native`, `native2` or `native3` entry instead of guessing an entry file. A sandbox switch explicitly used by the running host is preserved in the generated arguments; ordinary launches do not add it. See [the command guide](../../../doc/sc/commands.md) for application examples.

## CLI

```sh
./MySoftware --cli --help
./MySoftware --cli instances
./MySoftware --cli apps
./MySoftware --cli commands --app '<taskId>'
./MySoftware --cli execute --app '<taskId>' --name '<commandName>' --args '{"amount":2}'
```

To test the same entry in this repository during development:

```sh
./node_modules/.bin/electron dist/test/native --cli --help
./node_modules/.bin/electron dist/test/native --cli instances
./node_modules/.bin/electron dist/test/native --cli apps
./node_modules/.bin/electron dist/test/native --cli commands --app '<taskId>'
./node_modules/.bin/electron dist/test/native --cli execute --app '<taskId>' --name '<commandName>' --args '{"amount":2}'
```

Use the returned App ID and command name. Results are JSON; errors set a nonzero exit status. `--args-file <path>` reads JSON from a file, and `--args-file -` reads stdin. SIGINT/SIGTERM cancels an in-flight call. Mutation failures are never retried automatically.

The executable defaults to its own installation, independent of `startMcp({ id })`. `instances` lists its running instances without credentials. If more than one matches, choose a unique instance ID with `--host`; App `taskId`s change after restart and must be discovered again. `native2` and `native3` use their corresponding entry files for both GUI and command launches.

The MCP server instructions, tool descriptions and parameter schemas explain that this software can contain several App instances. Call `clickgo_list_apps`, pass the selected item’s `id` as `taskId` to `clickgo_list_commands`, then execute an enabled command using its declared argument schema. Rediscover IDs after restart and clarify ambiguous App targets.

## stdio MCP

Configure the AI client's MCP process entry with the installed software's absolute executable path. For clients using the `mcpServers` configuration shape:

```json
{
    "mcpServers": {
        "clickgo-demo": {
            "command": "<absolute-path-to-installed-software>",
            "args": ["--mcp"]
        }
    }
}
```

For repository development, use the absolute Electron executable as `command` and `["<absolute-path-to-clickgo>/dist/test/native", "--mcp"]` as `args`. Do not use `npm run` for stdio because npm output would enter the protocol stream. The software's command process exposes the same three tools as HTTP MCP, forwards to the running GUI, and discovers its current endpoint and token for every call. It stays alive until stdin closes or it receives a shutdown signal; the first command tool opens the GUI when `commandAutoStart` is enabled. Handshake and tools/list do not open it.

## Discovery and ownership

`startMcp()` publishes a temporary record under the current user's `.clickgo-native/run` directory. POSIX directories are private and files use mode `0600`; Windows inherits the user-profile access control. Records are removed when the service stops; crashed-process records are ignored. Symbolic links, permissive POSIX records and non-loopback endpoint URLs are rejected. `CLICKGO_NATIVE_RUNTIME_DIR` can select a separate private runtime directory for tests or host integration.

The native host can set `startMcp({ id: 'com.example.app' })`; without an explicit ID, the Native entry derives one from Electron's user-data directory. `discovery: false` disables local CLI/stdio discovery while retaining authenticated HTTP MCP. Enabling discovery authorizes other processes of the same operating-system user to obtain the temporary connection credentials. It does not grant sandboxed ClickGo Apps permission to read credentials: `clickgo.native.getMcpInfo(current)` still requires `root`.

Settings screens, remembered ports, long-term credentials and startup preferences belong to the consuming application. The framework stores only current runtime connection information and contains no settings UI.

## Repository tests

Run these commands from the ClickGo repository root after `npx tsc`:

- `npm run test:native`: automated version, window integration, HTTP MCP, CLI, stdio and automatic-startup regressions. `test/native-cli.mjs` uses temporary test processes to call the internal adapter; it does not require or publish a standalone Node command.
- `node test/native-cli.mjs`: run only the CLI and stdio regressions.
- `npm run native`: open the regular Native Demo for real GUI integration. `npm run native2` and `npm run native3` open the other window modes. Open **AI interface guide** to register the counter commands, then use the matching Electron entry with `--cli` or `--mcp` as shown above.

Automated protocol and window regressions do not replace real GUI acceptance. Keep the Native source and supporting modules identical to clickgo-native after ClickGo's regressions and real Electron integration pass; see the repository AGENTS.

After packaging a test software that uses Native `launcher()`, run `node test/native-executable.mjs <absolute-path-to-packaged-binary> [electron-options]` to test its real CLI/stdio modes without system Node or a display. The fixture must not write business logs to stdout during module import. This protocol check supplements real GUI integration; it does not replace it.
