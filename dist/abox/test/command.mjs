import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>');
const tasks = {};
let permission = async () => [true];
const notices = [];
const eventErrors = [];
const rootTasks = new Set();
const extract = (tree, name) => tree.statements.find(node => ts.isFunctionDeclaration(node) &&
    node.name?.text === name).getText(tree);
const coreSource = await readFile(new URL('../../lib/core.ts', import.meta.url), 'utf8');
const coreTree = ts.createSourceFile('core.ts', coreSource, ts.ScriptTarget.ES2022, true);
const coreScope = {
    exports: {}, sysId: 'system',
    lTask: { getOriginList: async () => tasks,
        getRuntime: (_current, id) => ({ permissions: rootTasks.has(id) ? ['root'] : [] }) },
    boot: { onWebMcpStatusChanged: (...args) => notices.push({ receiver: 'boot', status: args[0], argumentCount: args.length }),
        onError: (taskId, _formId, error) => eventErrors.push({ taskId, error }) },
};
vm.runInNewContext(ts.transpileModule(extract(coreTree, 'trigger'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, coreScope);

/**
 * --- 运行实际源码，隔离测试中的任务和协议适配器 ---
 * @param path 源码路径
 * @param modules 模块替身
 * @param extra 运行环境
 * @returns 公开 API
 */
async function load(path, modules, extra = {}) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const scope = { exports: {}, require: name => modules[name], AbortController,
        document: dom.window.document, ...extra };
    vm.runInNewContext(ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, scope);
    return scope.exports;
}

const toolBox = await load('../tool.ts', {});
const tool = await load('../../lib/tool.ts', { '../abox/tool.js': toolBox });
const jsonBox = await load('../command/json.ts', {});
const webBox = await load('../command/webmcp.ts', { './json.js': jsonBox });
const commandBox = await load('../command.ts', {
    './tool.js': toolBox, './command/json.js': jsonBox, './command/webmcp.js': webBox,
});
const schema = await load('../../lib/command/schema.ts', {
    '../../abox/command.js': commandBox, '../../abox/tool.js': toolBox,
});
assert.equal(schema.isJson({ value: [1, null] }), true);
assert.equal(schema.isJson(1, undefined, 65), false);
const known = {};
assert.equal(schema.isJson(known, new Set([known])), false);
const guide = await load('../../lib/command/guide.ts', { '../../abox/command.js': commandBox });
const data = await load('../../lib/command/data.ts', { '../../abox/command.js': commandBox });
const webMcp = await load('../../lib/command/webmcp.ts', { '../../abox/command.js': commandBox });
let native;
const command = await load('../../lib/command.ts', {
    './core': coreScope.exports,
    './tool': tool,
    './task': { getOrigin: id => tasks[id], checkPermission: (...args) => permission(...args),
        getList: () => Object.values(tasks).map(item => ({ id: item.id, name: item.app.config.name })) },
    './command/schema': schema,
    './command/guide': guide,
    './command/data': data,
    './command/webmcp': webMcp,
    './native': { getCommandEntry: () => native.getCommandEntry(), getMcpInfo: current => native.getMcpInfo(current) },
});
const objectSchema = { type: 'object', additionalProperties: false };
const definition = (name, extra = {}) => ({ name, description: `Execute ${name}`, inputSchema: objectSchema,
    execute: () => command.success(null), ...extra });
const plain = value => JSON.parse(JSON.stringify(value));

const selectedCommands = new Map();
const publisher = webMcp.create({
    getCommands: id => [...selectedCommands.get(id)?.values() ?? []],
    isCurrent: (id, entry) => selectedCommands.get(id)?.get(entry.metadata.name) === entry,
    execute: async (_id, entry) => ({ ok: true, data: entry.id }),
});
const protocolEntry = id => ({ id, metadata: { name: 'same', description: 'Command', inputSchema: objectSchema } });
const originalEntry = protocolEntry(1);
selectedCommands.set('protocol', new Map([['same', originalEntry]]));
let oldRegistration;
let oldRegistrationSignal;
let completeOldRegistration;
const originalPublication = publisher.publish('protocol', { registerTool: (item, options) => {
    oldRegistration = item;
    oldRegistrationSignal = options.signal;
    return new Promise(resolve => { completeOldRegistration = resolve; });
} });
await Promise.resolve();
let replacementTool;
const newContext = { registerTool: item => { replacementTool = item; } };
const replacementPublication = publisher.publish('protocol', newContext);
assert.equal(oldRegistrationSignal.aborted, true);
assert.equal(await replacementPublication.pending, true);
completeOldRegistration();
assert.equal(await originalPublication.pending, false);
assert.equal(JSON.parse(await oldRegistration.execute({})).error.code, 'not-found');
assert.deepEqual(JSON.parse(await replacementTool.execute({})), { ok: true, data: 1 });
const staleTool = replacementTool;
selectedCommands.get('protocol').set('same', protocolEntry(2));
publisher.refresh('protocol');
assert.equal(await replacementPublication.pending, true);
assert.equal(JSON.parse(await staleTool.execute({})).error.code, 'not-found');
assert.deepEqual(JSON.parse(await replacementTool.execute({})), { ok: true, data: 2 });
selectedCommands.set('failed-protocol', new Map([['same', protocolEntry(3)]]));
const failedPublication = publisher.publish('failed-protocol', { registerTool: () => Promise.reject(new Error('No registration')) });
assert.equal(await failedPublication.pending, false);
selectedCommands.set('pending-protocol', new Map([['same', protocolEntry(4)]]));
let completePendingRegistration;
const pendingPublication = publisher.publish('pending-protocol', { registerTool: () =>
    new Promise(resolve => { completePendingRegistration = resolve; }) });
await Promise.resolve();
assert.deepEqual(plain(publisher.describe(['pending-protocol', 'protocol', 'failed-protocol'])), {
    registrationStatus: 'failed', publishedTaskIds: ['protocol'],
});
assert.deepEqual(plain(publisher.describe(['failed-protocol', 'pending-protocol', 'protocol'])), {
    registrationStatus: 'failed', publishedTaskIds: ['protocol'],
});
publisher.disconnect('pending-protocol');
completePendingRegistration();
assert.equal(await pendingPublication.pending, false);
publisher.disconnect('protocol');
publisher.disconnect('failed-protocol');

// --- 页面初始化不依赖 App 或公开命令；通知只有一个状态参数。 ---
command.init();
await new Promise(setImmediate);
assert.deepEqual(notices, [{ receiver: 'boot', status: 'unsupported', argumentCount: 1 }]);
command.init();
await new Promise(setImmediate);
assert.equal(notices.length, 1, 'initializing the same page state does not emit another event');

/**
 * --- 提供真实 Panel DOM 和多个 Form，便于核实销毁边界 ---
 * @param id 任务 ID
 * @returns 主 Form 对象
 */
function task(id) {
    const container = dom.window.document.createElement('div');
    container.dataset.taskId = id;
    container.dataset.formId = 'main';
    container.className = 'cg-form-wrap';
    container.innerHTML = '<div data-panel-id="panel"></div>';
    dom.window.document.body.append(container);
    const observer = receiver => ({
        onWebMcpStatusChanged: (...args) => notices.push({ receiver: `${id}:${receiver}`, status: args[0], argumentCount: args.length }),
        onError() {},
    });
    const current = { taskId: id, formId: 'main', ...observer('main') };
    const main = { closed: false, vroot: current, vapp: { _container: container } };
    tasks[id] = { id, appId: `net.example.${id}`, path: `/apps/${id}.cga`, class: observer('app'),
        forms: { main, other: { closed: false, vroot: observer('other') } }, threads: {}, timers: {},
        app: { config: { name: `App ${id}` }, package: { clear() {} } } };
    return current;
}

const first = task('first');
const second = task('second');
const nativeCommand = await load('../../lib/command/native.ts', {
    '../command': command, '../task': { getOrigin: id => tasks[id] },
});
// --- 连接设置只通过 Native 与 root 检查，并兼容尚未提供 MCP 的旧宿主。 ---
let nativeEnvironment = false;
let nativePermission = false;
let connection;
let entry;
let nativeQueries = 0;
let persistenceResult;
let persistenceArgs;
const persistentStorage = await load('../../lib/native/storage.ts', {
    '../native': { callPersistence: (...args) => native.callPersistence(...args) },
});
const persistentSecret = await load('../../lib/native/secret.ts', {
    '../native': { callPersistence: (...args) => native.callPersistence(...args) },
});
native = await load('../../lib/native.ts', {
    '../clickgo': { isNative: () => nativeEnvironment },
    './core': {}, './tool': { random: () => 'test-session', 'RANDOM_LUNS': '' },
    './native/storage': persistentStorage, './native/secret': persistentSecret,
    './task': { getOrigin: id => tasks[id], checkPermission: async (_current, name) => {
        assert.equal(name, 'root');
        return [nativePermission];
    } },
    './command/native': nativeCommand,
}, { 'window': { 'clickgoNative': { invoke: async (name, token, ...args) => {
    ++nativeQueries;
    assert.equal(token, 'test-session');
    if (name === 'cg-app-persistence') { persistenceArgs = args; return persistenceResult; }
    if (name === 'cg-command-entry') { return entry; }
    assert.equal(name, 'cg-mcp-info');
    return connection;
} } } });
assert.equal(await native.getMcpInfo(first), null);
nativeEnvironment = true;
assert.equal(await native.getMcpInfo(first), false);
assert.equal(nativeQueries, 0);
nativePermission = true;
assert.equal(await native.getMcpInfo(first), null);
connection = null;
assert.equal(await native.getMcpInfo(first), null);
connection = { 'transport': 'streamable-http', 'url': 'http://localhost/mcp', 'token': 'test' };
assert.deepEqual(await native.getMcpInfo(first), connection);

// --- 统一说明按实际环境生成；默认不查询凭据，网页入口不能绕过 root 导出。 ---
nativeEnvironment = false;
dom.reconfigure({ url: 'https://user:password@example.test/demo?session=private-query#private-hash' });
const browserInfo = await command.getAgentInfo(first);
assert.equal(browserInfo.browser.url, 'https://example.test/demo');
assert.equal(browserInfo.native, null);
assert.equal(browserInfo.http, null);
assert.equal(browserInfo.webMcp.status, 'unsupported');
assert.deepEqual(plain(browserInfo.apps), [{ id: 'first', name: 'App first' }]);
assert.equal(await command.getAgentInfo('missing'), null);
const browserGuide = await command.getAgentGuide(first);
assert.ok(browserGuide.includes("window['clickgo']['command']"));
assert.ok(browserGuide.includes('inputSchema'));
assert.ok(browserGuide.includes('WebMCP is not supported by this browser.'));
assert.equal(browserGuide.includes('Local MCP (stdio)'), false);
assert.ok(browserGuide.length < 450);
for (const secret of ['password', 'private-query', 'private-hash', 'App first', '"first"']) {
    assert.equal(browserGuide.includes(secret), false);
}
nativeEnvironment = true;
assert.equal(await native.getCommandEntry(), null, 'older Native hosts have no process entry');
entry = { name: 'Business software', platform: 'linux', command: '/software path/app', args: ['/source/index2.js'],
    startup: 'existing', mcp: { enabled: true, discovery: true } };
assert.deepEqual(await native.getCommandEntry(), entry);
const queriesBeforeGuide = nativeQueries;
const nativeGuide = await command.getAgentGuide(first);
assert.equal(nativeQueries, queriesBeforeGuide + 1, 'default export reads entry metadata, not HTTP credentials');
const configurations = [...nativeGuide.matchAll(/```json\n([\s\S]*?)\n```/g)].map(match => JSON.parse(match[1]));
assert.deepEqual(configurations.find(config => config.command && config.args.includes('--mcp')),
    { command: entry.command, args: [...entry.args, '--mcp'] });
assert.equal(configurations.length, 1, 'one process entry is enough; CLI discovers syntax with --help');
assert.ok(nativeGuide.includes('`--cli --help`'));
assert.ok(nativeGuide.length < 1000);
assert.equal(nativeGuide.includes('Bearer'), false);
assert.equal(nativeGuide.includes('"first"'), false);
assert.equal(nativeGuide.includes('App first'), false);
assert.equal(await command.getAgentGuide(second), nativeGuide, 'shareable guidance must not contain per-App IDs');
entry.startup = 'auto';
assert.ok((await command.getAgentGuide(first)).includes('automatically open'));
entry.startup = 'existing';
nativePermission = false;
assert.equal(await command.getAgentGuide(first, { includeMcpCredentials: true }), false);
assert.equal(await command.getAgentInfo(undefined, { includeMcpCredentials: true }), false);
nativePermission = true;
connection.token = 'explicit-test-credential';
assert.ok((await command.getAgentGuide(first, { includeMcpCredentials: true })).includes('Bearer explicit-test-credential'));
const publicBridge = command.createPageBridge();
assert.equal((await publicBridge.getAgentInfo('first', { includeMcpCredentials: true })).http, null);
assert.equal((await publicBridge.getAgentGuide('first', { includeMcpCredentials: true })).includes(connection.token), false);
entry = undefined;
const legacyGuide = await command.getAgentGuide(first, { includeMcpCredentials: true });
assert.ok(legacyGuide.includes('HTTP MCP'));
assert.equal(legacyGuide.includes('Local MCP (stdio)'), false);
let releaseEntry;
entry = new Promise(resolve => { releaseEntry = resolve; });
const staleGuide = command.getAgentGuide(second);
tasks.second.ending = true;
releaseEntry(null);
assert.equal(await staleGuide, null, 'an App exiting during Native IPC must not be exported');
tasks.second.ending = false;
entry = undefined;
nativeEnvironment = false;
const panel = { ...first, panelId: 'panel' };
assert.equal(command.register(first, definition('shared', { execute: () => command.success('first') })), true);
assert.equal(command.register(second, definition('shared', { execute: () => command.success('second') })), true);
assert.equal((await command.execute(first, 'shared')).data, 'first');
assert.equal((await command.execute(second, 'shared')).data, 'second');
assert.equal(command.register(first, definition('shared')), false);
assert.equal(command.register('missing', definition('absent')), false);
assert.equal(command.register(first, definition('invalid name')), false);
assert.equal(command.register(first, definition('bad-title', { title: 1 })), false);
assert.equal(command.register(first, definition('bad-hint', { annotations: { readOnlyHint: 'true' } })), false);
assert.equal(command.register(first, definition('bad-permission', { permissions: 'root' })), false);
assert.equal(command.register(first, definition('bad-enabled', { enabled: true })), false);
assert.equal(command.register(first, definition('bad-output-schema', { outputSchema: false })), false);

// --- Schema 不支持的约束不能静默跳过；不补默认值、不转换参数类型。 ---
for (const inputSchema of [
    { type: 'object', format: 'email' }, { type: 'object', $schema: 1 },
    { type: 'object', properties: { value: 42 } }, { type: 'object', required: ['value', 'value'] },
    { type: 'object', enum: [{ a: 1, b: 2 }, { b: 2, a: 1 }] },
    { type: 'object', $ref: 'https://example.invalid/schema' },
    { type: 'object', properties: { value: { pattern: '[' } } },
    { type: 'object', properties: { value: { type: ['string', 'null'] } } },
    { type: 'object', not: { $ref: '#' } },
]) {
    assert.equal(command.register(first, definition('bad-schema', { inputSchema })), false);
}
const params = {
    type: 'object', properties: {
        amount: { type: 'integer', minimum: 1, maximum: 10, default: 2 },
        label: { type: 'string', minLength: 1, maxLength: 1, pattern: '^.$' },
    }, required: ['amount', 'label'], additionalProperties: false,
};
let received;
assert.equal(command.register(first, definition('validated', {
    inputSchema: params, exposed: true,
    execute: args => { received = args; return command.success(args); },
})), true);
params.properties.amount.minimum = 99;
for (const args of [{}, { amount: '2', label: 'a' }, { amount: 0, label: 'a' }, { amount: 2, label: '' },
    { amount: 2, label: 'ab' }, { amount: 2, label: 'a', extra: true }, [], null,
    { amount: NaN, label: 'a' }, { amount: 2, label: undefined }, new Date(),
    { amount: 2, label: 'a', nested: new Array(1) }]) {
    assert.equal((await command.execute(first, 'validated', args)).error.code, 'invalid-input');
}
const getter = { label: 'a', get amount() { assert.fail('Input getters must not be executed'); } };
assert.equal((await command.execute(first, 'validated', getter)).error.code, 'invalid-input');
const cycle = {};
cycle.self = cycle;
assert.equal(tool.isJson(cycle), false);
assert.equal(tool.isJson({ n: Infinity }), false);
assert.equal(tool.isJson([,]), false);
const array = [1];
array.extra = 2;
assert.equal(tool.isJson(array), false);
const args = { amount: 2, label: '🧵' };
const result = await command.execute(first, 'validated', args);
assert.deepEqual(plain(result), { ok: true, data: args });
received.amount = 3;
assert.equal(args.amount, 2);
assert.equal(result.data.amount, 2);
const infos = command.list(first);
infos.find(info => info.name === 'validated').inputSchema.properties.amount.minimum = 100;
assert.equal((await command.execute(first, 'validated', args)).ok, true);

// --- 标准组合、本地引用、布尔子 schema 和对象相等语义。 ---
const nested = { type: 'object', $defs: { item: { type: 'string', enum: ['x', 'y'] } },
    properties: {
        values: { type: 'array', items: { $ref: '#/$defs/item' }, minItems: 1, maxItems: 2, uniqueItems: true },
        choice: { oneOf: [{ const: 1 }, { const: 2 }] },
        limit: { allOf: [{ type: 'number', exclusiveMinimum: 0 }, { exclusiveMaximum: 3 }] },
        optional: { anyOf: [{ type: 'null' }, { type: 'boolean' }], not: { const: false } },
        impossible: false,
    }, required: ['values'], additionalProperties: false };
assert.equal(schema.check(nested), null);
assert.equal(schema.validate({ values: ['x', 'y'], choice: 2, limit: 1, optional: null }, nested), null);
for (const input of [{ values: ['x', 'x'] }, { values: [] }, { values: ['z'] }, { values: ['x'], choice: 3 },
    { values: ['x'], limit: 0 }, { values: ['x'], limit: 3 }, { values: ['x'], optional: false },
    { values: ['x'], impossible: null }]) {
    assert.notEqual(schema.validate(input, nested), null);
}
assert.equal(schema.validate({ b: 2, a: 1 }, { enum: [{ a: 1, b: 2 }] }), null);
assert.notEqual(schema.validate([{ a: 1, b: 2 }, { b: 2, a: 1 }], { uniqueItems: true }), null);
assert.notEqual(schema.validate({}, { required: ['toString'] }), null);
assert.notEqual(schema.validate(JSON.parse('{"__proto__": 1}'), objectSchema), null);
const recursive = { anyOf: [{ type: 'null' }, { type: 'object', properties: { next: { $ref: '#' } },
    required: ['next'], additionalProperties: false }] };
assert.equal(schema.check(recursive), null);
assert.equal(schema.validate({ next: { next: null } }, recursive), null);
assert.notEqual(schema.validate({}, { anyOf: [{ $ref: '#' }, { $ref: '#' }] }), null);
assert.notEqual(schema.check({ anyOf: [{ $ref: '#' }, { $ref: '#' }] }), null);
const pointers = { $defs: { 'a/b ~': { type: 'number' } }, $ref: '#/$defs/a~1b%20~0' };
assert.equal(schema.check(pointers), null);
assert.equal(schema.validate(2, pointers), null);
assert.notEqual(schema.check({ $ref: '#/$defs/~2', $defs: { '~2': {} } }), null);

// --- 桥接只公开明确允许的命令，绑定实例且不可被调用方改写。 ---
const bridge = command.createBridge(first);
assert.equal(Object.isFrozen(bridge), true);
assert.deepEqual(plain(bridge.list().map(info => info.name)), ['validated']);
assert.equal((await bridge.execute('shared')).error.code, 'not-found');
assert.equal((await bridge.execute('validated', args)).ok, true);
let context;
command.register(first, definition('source', { exposed: true, execute: (input, ctx) => {
    context = ctx;
    return command.success(ctx.source);
} }));
assert.equal((await command.execute(first, 'source')).data, 'user');
assert.equal((await bridge.execute('source')).data, 'agent');
assert.equal(context.taskId, 'first');

// --- 直接代理入口保留来源、公开范围及输入校验，与可复用桥接共享执行器。 ---
assert.equal((await command.executeAgent('first', 'source')).data, 'agent');
assert.equal((await command.executeAgent('first', 'shared')).error.code, 'not-found');
assert.equal((await command.executeAgent('first', 'validated', {})).error.code, 'invalid-input');
const cancelledAgent = new AbortController();
cancelledAgent.abort();
assert.equal((await command.executeAgent('first', 'source', {}, { 'signal': cancelledAgent.signal })).error.code,
    'cancelled');

// --- Native 按 taskId 直接读取与执行公开命令，不为单次请求创建桥接。 ---
const nativeApps = await nativeCommand.invoke({ method: 'listTasks', id: 'apps' });
assert.equal(nativeApps.data.length, 2);
assert.equal((await nativeCommand.invoke({ method: 'list', id: 'list', taskId: 'first' })).data.length, 2);
assert.equal((await nativeCommand.invoke({ method: 'execute', id: 'source', taskId: 'first', name: 'source' })).data, 'agent');
assert.equal((await nativeCommand.invoke({ method: 'execute', id: 'private', taskId: 'first', name: 'shared' })).error.code,
    'not-found');
assert.equal((await nativeCommand.invoke({ method: 'execute', id: 'missing', taskId: 'gone', name: 'source' })).error.code,
    'unavailable');

// --- 网页入口覆盖所有 App；私有命令、跨任务同名命令与原有鉴权保持边界。 ---
const pageBridge = command.createPageBridge();
assert.equal(Object.isFrozen(pageBridge), true);
assert.deepEqual(plain(pageBridge.listTasks()), [{ id: 'first', name: 'App first' }, { id: 'second', name: 'App second' }]);
assert.deepEqual(plain(command.listTasks()), plain(pageBridge.listTasks()));
assert.deepEqual(plain(pageBridge.list('first').map(info => info.name)), ['validated', 'source']);
assert.deepEqual(plain(pageBridge.list('missing')), []);
assert.equal((await pageBridge.execute('first', 'shared')).error.code, 'not-found');
assert.equal((await pageBridge.execute('missing', 'source')).error.code, 'not-found');
assert.equal((await pageBridge.execute('first', 'source')).data, 'agent');
assert.equal((await pageBridge.execute('first', 'validated', {})).error.code, 'invalid-input');
for (const current of [first, second]) {
    command.register(current, definition('page-shared', { exposed: true,
        execute: (input, ctx) => command.success(ctx.taskId) }));
}
assert.equal((await pageBridge.execute('first', 'page-shared')).data, 'first');
assert.equal((await pageBridge.execute('second', 'page-shared')).data, 'second');
assert.equal((await command.executeAgent('first', 'page-shared')).data, 'first');
assert.equal((await command.executeAgent('second', 'page-shared')).data, 'second');
command.register(first, definition('page-protected', { exposed: true, permissions: ['native.form'] }));
permission = async () => [false];
assert.equal((await pageBridge.execute('first', 'page-protected')).error.code, 'permission-denied');
assert.equal((await command.executeAgent('first', 'page-protected')).error.code, 'permission-denied');
permission = async () => [true];
tasks.second.ending = true;
assert.equal(pageBridge.listTasks().some(info => info.id === 'second'), false);
assert.equal(command.listTasks().some(info => info.id === 'second'), false);
assert.deepEqual(plain(pageBridge.list('second')), []);
assert.equal((await pageBridge.execute('second', 'page-shared')).error.code, 'unavailable');
tasks.second.ending = false;
command.unregister(first, 'page-shared');
command.unregister(second, 'page-shared');
command.unregister(first, 'page-protected');

// --- 权限检查期间就占用命令；权限返回后重新确认业务状态。 ---
let allow;
let enabled = true;
permission = () => new Promise(resolve => { allow = resolve; });
command.register(first, definition('protected', { permissions: ['native.form'], enabled: () => enabled }));
const pending = command.execute(first, 'protected');
assert.equal(command.list(first).find(info => info.name === 'protected').running, 1);
assert.equal((await command.execute(first, 'protected')).error.code, 'unavailable');
enabled = false;
allow([true]);
assert.equal((await pending).error.code, 'unavailable');
assert.equal(command.list(first).find(info => info.name === 'protected').running, 0);
enabled = true;
permission = async () => [false];
assert.equal((await command.execute(first, 'protected')).error.code, 'permission-denied');
permission = async () => [true];
assert.equal((await command.execute(first, 'protected')).ok, true);
command.register(first, definition('disabled', { enabled: () => 'Select a document' }));
assert.equal((await command.execute(first, 'disabled')).error.message, 'Select a document');

// --- 可恢复的插件异常、错误结果、输出约束和取消不会遗留占用。 ---
command.register(first, definition('reject', { execute: () => Promise.reject(new Error('private path')) }));
assert.deepEqual(plain(await command.execute(first, 'reject')),
    { ok: false, error: { code: 'execution-failed', message: 'Command execution failed' } });
assert.equal(command.list(first).find(info => info.name === 'reject').running, 0);
command.register(first, definition('business-error', { execute: () => command.failure('document-missing', 'Open a document') }));
assert.equal((await command.execute(first, 'business-error')).error.code, 'document-missing');
for (const output of [undefined, { ok: true }, { ok: false, error: { code: '' } }, { ok: 1, data: null },
    { ok: true, data: new Date() }]) {
    command.register(first, definition('bad-output', { execute: () => output }));
    assert.equal((await command.execute(first, 'bad-output')).error.code, 'invalid-output');
    command.unregister(first, 'bad-output');
}
command.register(first, definition('output-schema', { outputSchema: { type: 'object', required: ['value'] },
    execute: () => command.success({}) }));
assert.equal((await command.execute(first, 'output-schema')).error.code, 'invalid-output');
let finish;
let runningSignal;
command.register(first, definition('slow', { execute: (input, ctx) => {
    runningSignal = ctx.signal;
    return new Promise(resolve => { finish = resolve; });
} }));
const cancel = new AbortController();
cancel.abort();
assert.equal((await command.execute(first, 'slow', {}, { signal: cancel.signal })).error.code, 'cancelled');
const activeCancel = new AbortController();
const slow = command.execute(first, 'slow', {}, { signal: activeCancel.signal });
activeCancel.abort();
assert.equal(runningSignal.aborted, true);
finish(command.success(null));
assert.equal((await slow).error.code, 'cancelled');
assert.equal(command.list(first).find(info => info.name === 'slow').running, 0);

// --- Native 跨进程取消只影响指定请求，执行结束后释放请求与命令占用。 ---
command.register(first, definition('native-slow', { exposed: true, execute: (input, ctx) => {
    runningSignal = ctx.signal;
    return new Promise(resolve => { finish = resolve; });
} }));
const nativeSlow = nativeCommand.invoke({ method: 'execute', id: 'slow-id', taskId: 'first', name: 'native-slow' });
await Promise.resolve();
assert.equal((await nativeCommand.invoke({ method: 'execute', id: 'slow-id', taskId: 'first', name: 'native-slow' })).error.code,
    'invalid-input');
await nativeCommand.invoke({ method: 'cancel', id: 'other-id' });
assert.equal(runningSignal.aborted, false);
await nativeCommand.invoke({ method: 'cancel', id: 'slow-id' });
assert.equal(runningSignal.aborted, true);
finish(command.success(null));
assert.equal((await nativeSlow).error.code, 'cancelled');
assert.equal(command.list(first).find(info => info.name === 'native-slow').running, 0);
command.unregister(first, 'native-slow');
const concurrent = [];
command.register(first, definition('parallel', { concurrent: true, execute: () =>
    new Promise(resolve => concurrent.push(resolve)) }));
const parallel = [command.execute(first, 'parallel'), command.execute(first, 'parallel')];
assert.equal(command.list(first).find(info => info.name === 'parallel').running, 2);
for (const resolve of concurrent) {
    resolve(command.success(null));
}
assert.equal((await Promise.all(parallel)).every(value => value.ok), true);

// --- WebMCP 自动接入、能力检测、共享执行、注册变化和迟到发布。 ---
assert.equal(await command.connectWebMcp(first), false);
const published = new Map();
const controllers = new Map();
dom.window.document.modelContext = { registerTool: async (tool, options) => {
    published.set(tool.name, tool);
    controllers.set(tool.name, options.signal);
    options.signal.addEventListener('abort', () => published.delete(tool.name), { once: true });
} };
task('root-observer');
rootTasks.add('root-observer');
task('other-observer');
const automatic = task('automatic');
command.init();
await new Promise(setImmediate);
for (const receiver of ['boot', 'automatic:app', 'automatic:main', 'automatic:other', 'root-observer:app',
    'other-observer:app', 'other-observer:main', 'other-observer:other']) {
    assert.deepEqual(notices.filter(notice => notice.receiver === receiver && notice.status === 'ready'),
        [{ receiver, status: 'ready', argumentCount: 1 }],
        'the page interface becomes ready before any tools, for ordinary Apps and root Apps alike');
}
const pageReadyNotices = notices.length;
command.register(automatic, definition('private'));
assert.equal((await command.getAgentInfo(automatic)).webMcp.status, 'ready');
assert.equal((await command.getAgentInfo(automatic)).webMcp.registrationStatus, 'idle');
assert.equal(published.size, 0, 'private commands do not create WebMCP tools');
let automaticValue = 0;
command.register(automatic, definition('automatic.add', { exposed: true,
    execute: () => command.success(++automaticValue) }));
command.register(automatic, definition('automatic.read', { exposed: true,
    execute: () => command.success(automaticValue) }));
await new Promise(setImmediate);
const automaticInfo = await command.getAgentInfo(automatic);
assert.equal(automaticInfo.webMcp.status, 'ready');
assert.equal(automaticInfo.webMcp.registrationStatus, 'ready');
assert.deepEqual(plain(automaticInfo.webMcp.publishedTaskIds), ['automatic']);
assert.equal(published.size, 2, 'public commands register without any business connection call');
assert.equal(notices.length, pageReadyNotices, 'publishing App tools does not change page integration status');
const privateChanges = notices.length;
command.register(automatic, definition('private-next'));
command.unregister(automatic, 'private-next');
await new Promise(setImmediate);
assert.equal(notices.length, privateChanges, 'private commands do not restart WebMCP registration');
const automaticTool = [...published.values()].find(tool => tool.name.endsWith('_automatic.add'));
assert.equal(JSON.parse(await automaticTool.execute({})).data, 1);
assert.equal((await command.execute(automatic, 'automatic.read')).data, 1,
    'automatically published tools use the same executor as UI commands');
command.unregister(automatic, 'automatic.add');
await new Promise(setImmediate);
assert.equal(published.size, 1, 'unregister automatically revokes a tool');
command.unregister(automatic, 'automatic.read');
await new Promise(setImmediate);
assert.equal((await command.getAgentInfo(automatic)).webMcp.status, 'ready');
assert.equal((await command.getAgentInfo(automatic)).webMcp.registrationStatus, 'idle');
assert.equal(notices.length, pageReadyNotices, 'removing the last tool does not disconnect the page');
command.clear(automatic);
await new Promise(setImmediate);
assert.equal(published.size, 0, 'App cleanup revokes its tools without business teardown');
assert.equal(JSON.parse(await automaticTool.execute({})).error.code, 'not-found');

// --- 原接入方法仍可显式重同步，但默认发布不依赖它。 ---
assert.equal(await command.connectWebMcp(first), true);
const webInfo = await command.getAgentInfo(first);
assert.equal(webInfo.webMcp.supported, true);
assert.equal(webInfo.webMcp.status, 'ready');
assert.deepEqual(plain(webInfo.webMcp.publishedTaskIds), ['first']);
assert.equal(published.size, 2);
const sourceTool = [...published.values()].find(tool => tool.name.endsWith('_source'));
assert.equal(JSON.parse(await sourceTool.execute({})).data, 'agent');
const toolCancel = new AbortController();
toolCancel.abort();
assert.equal(JSON.parse(await sourceTool.execute({}, { signal: toolCancel.signal })).error.code, 'cancelled');
command.unregister(first, 'source');
await command.connectWebMcp(first);
assert.equal(published.size, 1);
assert.equal(JSON.parse(await sourceTool.execute({})).error.code, 'not-found');
command.register(second, definition('validated', { exposed: true }));
await new Promise(setImmediate);
assert.equal(published.size, 2, 'same names from different instances do not collide');
const oldTool = [...published.values()].find(tool => tool.name.includes('first'));
command.disconnectWebMcp(first);
assert.deepEqual(plain((await command.getAgentInfo(first)).webMcp.publishedTaskIds), []);
assert.equal((await command.getAgentInfo(first)).webMcp.status, 'ready');
assert.equal(published.size, 1);
assert.equal(JSON.parse(await oldTool.execute(args)).error.code, 'not-found');
assert.equal((await bridge.execute('validated', args)).ok, true);
command.disconnectWebMcp(second);

let releaseRegistration;
let registrations = 0;
let delayedSignal;
dom.window.document.modelContext = { registerTool: (tool, options) => {
    ++registrations;
    delayedSignal = options.signal;
    return new Promise(resolve => { releaseRegistration = resolve; });
} };
const delayed = task('delayed');
command.register(delayed, definition('first', { exposed: true }));
await Promise.resolve();
const pendingInfo = await command.getAgentInfo(delayed);
assert.equal(pendingInfo.webMcp.status, 'ready');
assert.equal(pendingInfo.webMcp.registrationStatus, 'registering');
assert.deepEqual(plain(pendingInfo.webMcp.publishedTaskIds), [], 'pending tools are not reported as published');
command.register(delayed, definition('later', { exposed: true }));
command.clear(delayed);
releaseRegistration();
await new Promise(setImmediate);
assert.equal(delayedSignal.aborted, true);
assert.equal(registrations, 1, 'disconnect prevents publishing the next tool after an awaited registration');
assert.equal((await command.getAgentInfo(delayed)).webMcp.status, 'ready');
assert.equal((await command.getAgentInfo(delayed)).webMcp.registrationStatus, 'idle');
assert.equal(notices.length, pageReadyNotices, 'late registration and cancellation do not emit page state changes');
let registrationFails = true;
dom.window.document.modelContext = { registerTool: () => registrationFails
    ? Promise.reject(new Error('registration unavailable')) : undefined };
command.register(second, definition('retry', { exposed: true }));
await new Promise(setImmediate);
assert.equal((await command.getAgentInfo(second)).webMcp.registrationStatus, 'failed');
assert.ok((await command.getAgentGuide(second)).includes('WebMCP tool registration failed'));
assert.equal((await command.getAgentInfo()).webMcp.registrationStatus, 'failed', 'diagnostics retain App registration failures');
for (const current of [undefined, first, second, automatic]) {
    assert.equal((await command.getAgentInfo(current)).webMcp.status, 'ready',
        'page readiness is shared across App selection, including an App with failed tools');
}
assert.equal(notices.length, pageReadyNotices, 'a tool failure is not a browser disconnection');
registrationFails = false;
command.register(second, definition('next', { exposed: true }));
await new Promise(setImmediate);
assert.equal((await command.getAgentInfo(second)).webMcp.registrationStatus, 'ready', 'new public commands automatically retry failed registration');
assert.equal(await command.connectWebMcp(second), true, 'explicit resynchronization remains compatible');
tasks.second.ending = true;
assert.equal(await command.connectWebMcp(second), false, 'an exiting App cannot publish tools');
tasks.second.ending = false;
command.disconnectWebMcp(second);
assert.equal(notices.length, pageReadyNotices, 'retry and App tool withdrawal do not emit page state changes');

// --- 实际全局分发：关闭/退出隔离、异步回调互不等待、同步和异步异常均隔离。 ---
const eventOwner = task('event-owner');
tasks['event-owner'].forms.other.closed = true;
tasks['root-observer'].ending = true;
const beforeEvent = notices.length;
let finishObserver;
tasks['event-owner'].class.onWebMcpStatusChanged = () => new Promise(resolve => { finishObserver = resolve; });
await coreScope.exports.trigger('webMcpStatusChanged', 'unsupported');
assert.ok(notices.slice(beforeEvent).some(notice => notice.receiver === 'event-owner:main'),
    'an asynchronous App callback must not delay Form delivery');
assert.equal(notices.slice(beforeEvent).some(notice => notice.receiver === 'event-owner:other' ||
    notice.receiver.startsWith('root-observer:')), false, 'closed Forms and exiting Apps are skipped');
finishObserver();
tasks['root-observer'].ending = false;
tasks['event-owner'].class.onWebMcpStatusChanged = () => Promise.reject(new Error('Observer rejected'));
tasks['event-owner'].forms.other.closed = false;
tasks['event-owner'].forms.other.vroot.onWebMcpStatusChanged = () => JSON.parse('invalid observer result');
await coreScope.exports.trigger('webMcpStatusChanged', 'ready');
await new Promise(setImmediate);
assert.equal(eventErrors.length, 2, 'observer errors are forwarded without interrupting other delivery');
assert.ok(eventErrors.every(error => error.taskId === 'event-owner'));
const beforeInvalidEvent = notices.length;
await coreScope.exports.trigger('webMcpStatusChanged', 'invalid-status');
await coreScope.exports.trigger('webMcpStatusChanged', 'registering');
await coreScope.exports.trigger('webMcpStatusChanged', 'failed');
await coreScope.exports.trigger('webMcpStatusChanged', eventOwner.taskId, 'ready');
assert.equal(notices.length, beforeInvalidEvent, 'invalid state cannot enter the global event pipeline');
delete tasks['event-owner'];

const previousContext = dom.window.document.modelContext;
delete dom.window.document.modelContext;
command.disconnectWebMcp(delayed);
assert.equal((await command.getAgentInfo(delayed)).webMcp.status, 'unsupported');
assert.equal((await command.getAgentInfo(delayed)).webMcp.registrationStatus, null);
dom.window.document.modelContext = previousContext;

const unsupportedOwner = task('unsupported-owner');
command.register(unsupportedOwner, definition('published', { exposed: true }));
await new Promise(setImmediate);
delete dom.window.document.modelContext;
command.init();
command.disconnectWebMcp(unsupportedOwner);
await new Promise(setImmediate);
assert.equal(notices.filter(notice => notice.receiver === 'unsupported-owner:main')
    .at(-1).status, 'unsupported',
    'only an actual page capability change reports unsupported');
dom.window.document.modelContext = previousContext;
command.clear(unsupportedOwner);
delete tasks['unsupported-owner'];

// --- 运行实际 Form.remove、Panel.removePanel 和 task.end，检查生命周期集成。 ---
const formSource = await readFile(new URL('../../lib/form.ts', import.meta.url), 'utf8');
const formTree = ts.createSourceFile('form.ts', formSource, ts.ScriptTarget.ES2022, true);
const callbacks = [];
const lifecycleScope = {
    exports: {}, sysId: 'system', list: tasks, runtime: {}, frameMaps: {}, trays: {},
    lTask: { getOrigin: id => tasks[id], getRuntime: () => ({ dialogFormIds: [] }) },
    lCommand: command, lCore: { trigger: async () => {} },
    lDom: { is: { transition: true }, findParentByClass: element => element.closest('.cg-form-wrap'),
        removeStyle() {}, clearWatchStyle() {}, clearWatchProperty() {}, clearWatchPosition() {},
        removeFromStyleList() {}, clearWatchSize() {}, clearWatch() {} },
    lNative: { clear() {} }, lControl: { clearComponents() {} },
    clickgo: { isNative: () => false }, clearSystem: async () => {},
    getTaskId: id => id === 'main' ? 'first' : '', setTimeout: callback => callbacks.push(callback),
    clearTimeout() {}, cancelAnimationFrame() {}, activePanels: {},
    lForm: { getMaxZIndexID: async () => null, changeFocus: async () => {},
        elements: { list: { querySelectorAll: () => [] } }, activePanels: {} },
};
vm.runInNewContext(ts.transpileModule(extract(formTree, 'remove') + '\n' + extract(formTree, 'removePanel'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, lifecycleScope);
command.register(panel, definition('panel-command'));
command.register(first, definition('form-command'));
const panelContainer = tasks.first.forms.main.vapp._container.querySelector('[data-panel-id]');
const panelApp = { _container: panelContainer, unmount() { command.clearOwner('first', 'main', 'panel'); } };
assert.equal(lifecycleScope.exports.removePanel('panel', panelApp, tasks.first.forms.main.vapp._container), true);
assert.equal(command.list(first).some(info => info.name === 'panel-command'), false);
assert.equal(command.list(first).some(info => info.name === 'form-command'), true);
assert.equal(command.register(panel, definition('stale-panel')), false);
tasks.first.forms.main.vroot.$refs = { form: { title: 'Main', iconDataUrl: '', $data: {} } };
assert.equal(lifecycleScope.exports.remove('main'), true);
assert.equal(command.list(first).length, 0, 'commands revoked before closing animation finishes');
assert.equal(pageBridge.list('first').length, 0);
assert.equal(callbacks.length, 1);
assert.equal(command.register(first, definition('stale-form')), false);

// --- Panel 的真正 Vue 卸载回调负责清理，不依赖使用者手工解除注册。 ---
const panelHooks = [];
const visit = node => {
    if (ts.isPropertyAssignment(node) && ['beforeUnmount', 'unmounted'].includes(node.name.text) &&
        node.initializer.getText(formTree).includes('clearOwner(t.id, formId, panelId)')) {
        panelHooks.push(node.initializer.getText(formTree));
    }
    ts.forEachChild(node, visit);
};
visit(formTree);
assert.equal(panelHooks.length, 2);
const hookScope = { ...lifecycleScope, t: tasks.second, formId: 'main', panelId: 'panel' };
command.register({ ...second, panelId: 'panel' }, definition('owned-panel'));
for (const hook of panelHooks) {
    const callback = vm.runInNewContext(ts.transpileModule(`const hook = ${hook};`, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText + '\nhook;', { ...hookScope });
    await callback.call({ onBeforeUnmount() {}, onUnmounted() {}, $nextTick: async () => {} });
}
assert.equal(command.list(second).some(info => info.name === 'owned-panel'), false);

const taskSource = await readFile(new URL('../../lib/task.ts', import.meta.url), 'utf8');
const taskTree = ts.createSourceFile('task.ts', taskSource, ts.ScriptTarget.ES2022, true);

// --- 实际 Demo 消费页面级事件；工具发布、失败和重试不改变浏览器接入显示。 ---
const CommandForm = (await load('../../app/demo/form/method/command/command.ts', {
    clickgo: { command, task: { createTimer: () => assert.fail('Demo must not poll registration') },
        form: { AbstractForm: class {},
        get: formId => Object.values(tasks).some(item => item.forms[formId]) ? {} : null } },
})).default;

/**
 * --- 等待注册 Promise 与事件回调推进，不手动刷新 Demo ---
 * @param predicate 预期显示或生命周期状态
 * @returns 达到预期后完成
 */
async function waitForDemo(predicate) {
    for (let i = 0; i < 40; ++i) {
        if (predicate()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.fail('Demo did not update automatically');
}

/**
 * --- 在真实命令注册入口前控制浏览器的异步确认 ---
 * @param id 示例 App ID
 * @returns 已挂载的 Form 与注册完成入口
 */
async function mountDemo(id) {
    let finish;
    let fail;
    let pending = true;
    let failure = false;
    const registration = new Promise((resolve, reject) => {
        finish = () => { pending = false; resolve(); };
        fail = () => { pending = false; failure = true; reject(new Error('Browser registration failed')); };
    });
    dom.window.document.modelContext = { registerTool: () => {
        if (failure) {
            return Promise.reject(new Error('Browser registration failed'));
        }
        return pending ? registration : undefined;
    } };
    const current = task(id);
    const demo = new CommandForm();
    Object.assign(demo, { taskId: current.taskId, formId: `${id}-form` });
    tasks[id].forms = { [demo.formId]: { closed: false, vroot: demo } };
    await demo.onMounted();
    assert.ok(demo.webMcpStatus.includes('Browser interface ready'));
    assert.equal((await command.getAgentInfo(id)).webMcp.registrationStatus, 'registering');
    return { demo, finish, fail, retry: () => { failure = false; } };
}

const readyDemo = await mountDemo('demo-ready');
readyDemo.finish();
await new Promise(setImmediate);
assert.equal((await command.getAgentInfo('demo-ready')).webMcp.registrationStatus, 'ready');
const beforeAdditional = notices.length;
const ownGuideRequest = readyDemo.demo.access.guideRequest;
command.register(readyDemo.demo, definition('additional', { exposed: true }));
await new Promise(setImmediate);
assert.equal(notices.length, beforeAdditional, 'App command changes do not trigger browser integration events');
assert.equal(readyDemo.demo.access.guideRequest, ownGuideRequest, 'tool synchronization does not refresh the global state UI');

const failedDemo = await mountDemo('demo-failed');
failedDemo.fail();
await new Promise(setImmediate);
assert.equal((await command.getAgentInfo('demo-failed')).webMcp.registrationStatus, 'failed');
assert.equal(failedDemo.demo.webMcpStatus, readyDemo.demo.webMcpStatus, 'all Apps display the same browser state despite a tool failure');
assert.equal(notices.length, beforeAdditional, 'tool rejection does not emit global disconnection');
await failedDemo.demo.generateGuide();
await waitForDemo(() => failedDemo.demo.agentGuide.includes('WebMCP tool registration failed'));
assert.equal(Object.keys(tasks['demo-failed'].timers).length, 0);
failedDemo.retry();
assert.equal(await command.connectWebMcp('demo-failed'), true);
await failedDemo.demo.generateGuide();
await waitForDemo(() => !failedDemo.demo.agentGuide.includes('WebMCP tool registration failed'));

// --- 页面能力变化不携带 App ID，两个 Demo 均自动更新，无需手动刷新。 ---
const demoContext = dom.window.document.modelContext;
delete dom.window.document.modelContext;
command.init();
await waitForDemo(() => readyDemo.demo.webMcpStatus.includes('Not supported') &&
    failedDemo.demo.webMcpStatus.includes('Not supported') &&
    readyDemo.demo.agentGuide.includes('WebMCP is not supported') &&
    failedDemo.demo.agentGuide.includes('WebMCP is not supported'));
dom.window.document.modelContext = demoContext;
command.init();
await waitForDemo(() => readyDemo.demo.webMcpStatus.includes('Browser interface ready') &&
    failedDemo.demo.webMcpStatus.includes('Browser interface ready') &&
    !readyDemo.demo.agentGuide.includes('WebMCP is not supported') &&
    !failedDemo.demo.agentGuide.includes('WebMCP is not supported'));
command.clear('demo-ready');
delete tasks['demo-ready'];

// --- 后返回的旧 Native 说明不能覆盖新请求已经显示的网页说明。 ---
let finishOldInfo;
nativeEnvironment = true;
entry = new Promise(resolve => { finishOldInfo = resolve; });
const oldGuideRequest = failedDemo.demo.generateGuide();
nativeEnvironment = false;
await failedDemo.demo.generateGuide();
const latestGuide = failedDemo.demo.agentGuide;
finishOldInfo({ name: 'Stale software', platform: 'linux', command: '/stale/software', args: [],
    startup: 'existing', mcp: { enabled: true, discovery: true } });
await oldGuideRequest;
assert.equal(failedDemo.demo.agentGuide, latestGuide, 'a stale guide request is discarded');
entry = undefined;
command.clear('demo-failed');
delete tasks['demo-failed'];

const closingDemo = await mountDemo('demo-closing');
const beforePendingQuery = nativeQueries;
let finishInfo;
nativeEnvironment = true;
entry = new Promise(resolve => { finishInfo = resolve; });
closingDemo.finish();
const closingGuide = closingDemo.demo.generateGuide();
await waitForDemo(() => nativeQueries > beforePendingQuery);
const statusBeforeClose = closingDemo.demo.webMcpStatus;
const guideBeforeClose = closingDemo.demo.agentGuide;
tasks['demo-closing'].forms[closingDemo.demo.formId].closed = true;
command.clearOwner('demo-closing', closingDemo.demo.formId);
delete tasks['demo-closing'].forms[closingDemo.demo.formId];
finishInfo(null);
await closingGuide;
nativeEnvironment = false;
entry = undefined;
await new Promise(setImmediate);
assert.equal(closingDemo.demo.webMcpStatus, statusBeforeClose, 'late access information must not update an unmounted Form');
assert.equal(closingDemo.demo.agentGuide, guideBeforeClose);
assert.equal(Object.keys(tasks['demo-closing'].timers).length, 0);
command.clear('demo-closing');
delete tasks['demo-closing'];

task('closing');
tasks.closing.forms = {};
command.register('closing', definition('exit-command', { exposed: true, execute: (input, ctx) => {
    runningSignal = ctx.signal;
    return new Promise(resolve => { finish = resolve; });
} }));
const exitingCommand = command.execute('closing', 'exit-command');
let finishThread;
tasks.closing.threads.worker = { end: () => new Promise(resolve => { finishThread = resolve; }) };
vm.runInNewContext(ts.transpileModule(extract(taskTree, 'end'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, lifecycleScope);
const ending = lifecycleScope.exports.end('closing');
assert.equal(pageBridge.listTasks().some(info => info.id === 'closing'), false);
assert.equal(pageBridge.list('closing').length, 0);
assert.equal((await pageBridge.execute('closing', 'exit-command')).error.code, 'not-found');
assert.equal(runningSignal.aborted, true);
assert.equal(command.list('closing').length, 0);
assert.equal(command.register('closing', definition('during-exit')), false);
finish(command.success(null));
assert.equal((await exitingCommand).error.code, 'cancelled');
finishThread();
assert.equal(await ending, true);
assert.equal(tasks.closing, undefined);
assert.equal(pageBridge.listTasks().some(info => info.id === 'closing'), false);
// --- App 存储无需 root，框架选定固定 App ID；退出及旧宿主不能访问存储。 ---
const persistenceOwner = task('persistent-owner');
nativeEnvironment = true;
nativePermission = false;
let beforePersistence = nativeQueries;
persistenceResult = { value: 'without-root' };
assert.deepEqual(plain(await persistentStorage.get(persistenceOwner, 'preferences')), { value: 'without-root' });
assert.deepEqual(persistenceArgs, ['net.example.persistent-owner', 'storage', 'get', 'preferences', undefined]);
persistenceResult = true;
assert.equal(await persistentSecret.isAvailable(persistenceOwner), true);
assert.equal(nativeQueries, beforePersistence + 2);
const anotherPersistenceOwner = task('another-persistent-owner');
assert.equal(await persistentSecret.set(anotherPersistenceOwner, 'credential', 'value'), true);
assert.equal(persistenceArgs[0], 'net.example.another-persistent-owner');
tasks['another-persistent-owner'].appId = tasks['persistent-owner'].appId;
assert.equal(await persistentStorage.set(anotherPersistenceOwner, 'preferences', true), true);
assert.equal(persistenceArgs[0], 'net.example.persistent-owner', 'same App ID shares storage across task IDs and paths');
command.clear(anotherPersistenceOwner);
delete tasks['another-persistent-owner'];
const unconfiguredOwner = task('unconfigured-owner');
delete tasks['unconfigured-owner'].appId;
beforePersistence = nativeQueries;
assert.equal(await persistentStorage.get(unconfiguredOwner, 'preferences'), false);
assert.equal(await persistentSecret.set(unconfiguredOwner, 'credential', 'value'), false);
assert.equal(nativeQueries, beforePersistence, 'missing App ID cannot fall back to a loading path');
assert.equal(await persistentSecret.isAvailable(unconfiguredOwner), true, 'capability checks need no storage identity');
command.clear(unconfiguredOwner);
delete tasks['unconfigured-owner'];
tasks['persistent-owner'].path = '/relocated/app.cga';
persistenceResult = null;
assert.equal(await persistentStorage.get(persistenceOwner, 'missing'), null);
assert.equal(persistenceArgs[0], 'net.example.persistent-owner');
persistenceResult = { value: false };
assert.deepEqual(plain(await persistentStorage.get(persistenceOwner, 'disabled')), { value: false });
persistenceResult = true;
assert.equal(await persistentStorage.set(persistenceOwner, 'preferences', false), true);
assert.equal(await persistentStorage.remove(persistenceOwner, 'preferences'), true);
assert.equal(await persistentSecret.isAvailable(persistenceOwner), true);
persistenceResult = 'secret-value';
assert.equal(await persistentSecret.get(persistenceOwner, 'credential'), 'secret-value');
persistenceResult = undefined;
assert.equal(await persistentStorage.get(persistenceOwner, 'unsupported'), false);
assert.equal(await persistentSecret.get(persistenceOwner, 'unsupported'), false);
beforePersistence = nativeQueries;
tasks['persistent-owner'].ending = true;
assert.equal(await persistentStorage.set(persistenceOwner, 'preferences', false), false);
assert.equal(nativeQueries, beforePersistence);
nativeEnvironment = false;
assert.equal(await persistentStorage.get(persistenceOwner, 'preferences'), false);
command.clear(persistenceOwner);
delete tasks['persistent-owner'];
command.clear(second);
dom.window.close();
console.log('Command isolation, JSON Schema, shared execution, permissions, cancellation, WebMCP and lifecycle passed.');
