# Native command integration

Run `npx tsc` before using the Native test entrypoints. `npm run native`, `npm run native2` and `npm run native3` enable local MCP with the stable software ID `clickgo-demo`. Open **AI interface guide** in the Demo to register its counter commands.

## CLI

The CLI runs in Node.js, without launching another Electron window:

```sh
node dist/test/native/cli.js --help
node dist/test/native/cli.js instances
node dist/test/native/cli.js apps --host clickgo-demo
node dist/test/native/cli.js commands --host clickgo-demo --app '<taskId>'
node dist/test/native/cli.js execute --host clickgo-demo --app '<taskId>' --name '<commandName>' --args '{"amount":2}'
```

Use the returned App ID and command name. Results are JSON; errors set a nonzero exit status. `--args-file <path>` reads JSON from a file, and `--args-file -` reads stdin. SIGINT/SIGTERM cancels an in-flight call. Mutation failures are never retried automatically.

`instances` returns software IDs and unique running-instance IDs without credentials. A stable software ID works across restarts; if multiple instances have the same ID, select a unique instance ID. App `taskId`s change after restarting and must be discovered again.

The MCP server instructions, tool descriptions and parameter schemas explain that this software can contain several App instances. Call `clickgo_list_apps`, pass the selected item’s `id` as `taskId` to `clickgo_list_commands`, then execute an enabled command using its declared argument schema. Rediscover IDs after restart and clarify ambiguous App targets.

## stdio MCP

Configure the AI client's MCP process entry with an absolute Node executable and absolute CLI file path. For clients using the `mcpServers` configuration shape:

```json
{
    "mcpServers": {
        "clickgo-demo": {
            "command": "node",
            "args": ["<absolute-path-to-clickgo>/dist/test/native/cli.js", "mcp", "--host", "clickgo-demo"]
        }
    }
}
```

Invoke Node directly for stdio; `npm run` writes extra output that is unsuitable for the MCP protocol stream. The adapter exposes the same three tools as HTTP MCP and forwards to the running software. It discovers the current endpoint and token for each call, so the same adapter can reconnect after the software restarts. It does not start the software itself.

## Discovery and ownership

`startMcp()` publishes a temporary record under the current user's `.clickgo-native/run` directory. POSIX directories are private and files use mode `0600`; Windows inherits the user-profile access control. Records are removed when the service stops; crashed-process records are ignored. Symbolic links, permissive POSIX records and non-loopback endpoint URLs are rejected. `CLICKGO_NATIVE_RUNTIME_DIR` can select a separate private runtime directory for tests or host integration.

The native host can set `startMcp({ id: 'com.example.app' })`; without an explicit ID, the Native entry derives one from Electron's user-data directory. `discovery: false` disables local CLI/stdio discovery while retaining authenticated HTTP MCP. Enabling discovery authorizes other processes of the same operating-system user to obtain the temporary connection credentials. It does not grant sandboxed ClickGo Apps permission to read credentials: `clickgo.native.getMcpInfo(current)` still requires `root`.

Settings screens, remembered ports, long-term credentials and startup preferences belong to the consuming application. The framework stores only current runtime connection information and contains no settings UI.

`npm run test:native` covers the window, HTTP protocol, CLI and stdio adapters. Keep the Native source and supporting modules identical to clickgo-native after ClickGo's regressions and real Electron integration pass; see the repository AGENTS.
