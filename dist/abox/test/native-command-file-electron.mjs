// Electron acceptance: electron dist/abox/test/native-command-file-electron.mjs
// CLICKGO_NATIVE_FILE_ENTRY may select the synchronized clickgo-native dist/index.js.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { app, BrowserWindow } from 'electron';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { application } from '../../compiler/compiler.js';

const repository = fileURLToPath(new URL('../../../', import.meta.url));
const entry = process.env.CLICKGO_NATIVE_FILE_ENTRY;
const native = await import(entry ? pathToFileURL(resolve(entry)).href :
    new URL('../../test/native/native.js', import.meta.url).href);
const directory = await mkdtemp(join(tmpdir(), 'clickgo-command-files-electron-'));
app.setPath('userData', directory);
const fixture = join(directory, 'app');
await mkdir(join(fixture, 'form'), { recursive: true });
// Use the real Demo Form and framework build; only its startup package is isolated.
for (const extension of ['js', 'xml']) {
    await copyFile(join(repository, `dist/app/demo/form/method/command/command.${extension}`),
        join(fixture, `form/command.${extension}`));
}
await writeFile(join(fixture, 'config.json'), JSON.stringify({
    id: 'net.example.command-file-test', name: 'File export acceptance', ver: 2, version: '1.0.0',
    controls: ['/clickgo/control/common', '/clickgo/control/form'],
}));
await writeFile(join(fixture, 'app.js'), `import * as clickgo from 'clickgo';
import Command from './form/command';
export default class extends clickgo.core.AbstractApp {
    async main() { await this.run(await clickgo.form.create(this, Command)); }
}`);
assert.equal(await application(fixture), true);
const host = join(directory, 'index.html');
await writeFile(host, `<!doctype html><html><head><meta charset="utf-8">
<script type="importmap">${JSON.stringify({ imports: { clickgo: pathToFileURL(join(repository, 'dist/index.js')).href } })}</script>
<script>window.clickgo={config:{cdn:'https://js.maiyun.net'}};</script>
</head><body><script type="module">
import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    async main() { await clickgo.task.run(this._sysId, ${JSON.stringify(pathToFileURL(fixture + '.cga').href)}, {notify:false}); }
}
await clickgo.launcher(new Boot());
</script></body></html>`);

let client;
class Boot extends native.AbstractBoot {
    async main() {
        this.run(host, { width: 760, height: 760 });
        const info = await native.startMcp({ discovery: false });
        assert.notEqual(info, false);
        void verify(info);
    }
}
async function verify(info) {
    try {
        client = new Client({ name: 'native-command-file-acceptance', version: '1.0.0' });
        await client.connect(new StreamableHTTPClientTransport(new URL(info.url), {
            requestInit: { headers: { Authorization: 'Bearer ' + info.token } },
        }));
        let selected;
        let commands;
        const deadline = Date.now() + 45000;
        while (Date.now() < deadline) {
            const listed = await client.callTool({ name: 'clickgo_list_apps', arguments: {} });
            selected = listed.structuredContent?.data?.find(item => item.name === 'File export acceptance');
            if (selected) {
                const result = await client.callTool({ name: 'clickgo_list_commands', arguments: { taskId: selected.id } });
                commands = result.structuredContent?.data;
                if (commands?.some(command => command.name.startsWith('counter.export.'))) break;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        assert.ok(commands?.length, 'real packed App registers commands through the Native page adapter');
        const command = commands.find(command => command.name.startsWith('counter.export.'));
        const result = await client.callTool({ name: 'clickgo_execute_command', arguments: {
            taskId: selected.id, name: command.name,
        } });
        assert.equal(result.isError, false);
        const link = result.content.find(item => item.type === 'resource_link');
        assert.ok(link, 'the actual command result is delivered as an MCP resource link');
        const resource = await client.readResource({ uri: link.uri });
        assert.equal(resource.contents[0].mimeType, 'text/plain');
        assert.equal(Buffer.from(resource.contents[0].blob, 'base64').toString(), 'Counter: 0\n');
        const second = await client.callTool({ name: 'clickgo_execute_command', arguments: {
            taskId: selected.id, name: command.name,
        } });
        const nextLink = second.content.find(item => item.type === 'resource_link');
        assert.notEqual(nextLink.uri, link.uri);
        assert.ok(await client.readResource({ uri: link.uri }).catch(error => error) instanceof Error,
            'the real Demo releases its previous file after preparing the next one');
        assert.equal(Buffer.from((await client.readResource({ uri: nextLink.uri })).contents[0].blob, 'base64').toString(),
            'Counter: 0\n');
        assert.ok((await client.callTool({ name: 'clickgo_list_commands', arguments: { taskId: selected.id } }))
            .structuredContent.data.some(command => command.name === 'clickgo.file.read'));
        console.log('Real Electron: packed Demo -> context.createFile -> Native IPC -> resource_link -> resources/read exact bytes passed.');
    }
    catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
    finally {
        await client?.close();
        for (const window of BrowserWindow.getAllWindows()) window.destroy();
        await rm(directory, { recursive: true, force: true });
        app.exit(process.exitCode ?? 0);
    }
}
native.launcher(new Boot(), { singleInstance: false });
