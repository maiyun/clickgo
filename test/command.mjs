import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>');
const tasks = {};
let permission = async () => [true];

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

const schema = await load('../dist/lib/command/schema.ts', {});
const command = await load('../dist/lib/command.ts', {
    './task': { getOrigin: id => tasks[id], checkPermission: (...args) => permission(...args),
        getList: () => Object.values(tasks).map(item => ({ id: item.id, name: item.app.config.name })) },
    './command/schema': schema,
});
const objectSchema = { type: 'object', additionalProperties: false };
const definition = (name, extra = {}) => ({ name, description: `Execute ${name}`, inputSchema: objectSchema,
    execute: () => command.success(null), ...extra });
const plain = value => JSON.parse(JSON.stringify(value));

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
    const current = { taskId: id, formId: 'main' };
    const main = { closed: false, vroot: current, vapp: { _container: container } };
    tasks[id] = { id, forms: { main, other: { closed: false } }, threads: {}, timers: {},
        app: { config: { name: `App ${id}` }, package: { clear() {} } } };
    return current;
}

const first = task('first');
const second = task('second');
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
assert.equal(schema.isJson(cycle), false);
assert.equal(schema.isJson({ n: Infinity }), false);
assert.equal(schema.isJson([,]), false);
const array = [1];
array.extra = 2;
assert.equal(schema.isJson(array), false);
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

// --- 网页入口覆盖所有 App；私有命令、跨任务同名命令与原有鉴权保持边界。 ---
const pageBridge = command.createPageBridge();
assert.equal(Object.isFrozen(pageBridge), true);
assert.deepEqual(plain(pageBridge.listTasks()), [{ id: 'first', name: 'App first' }, { id: 'second', name: 'App second' }]);
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
command.register(first, definition('page-protected', { exposed: true, permissions: ['native.form'] }));
permission = async () => [false];
assert.equal((await pageBridge.execute('first', 'page-protected')).error.code, 'permission-denied');
permission = async () => [true];
tasks.second.ending = true;
assert.equal(pageBridge.listTasks().some(info => info.id === 'second'), false);
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
const concurrent = [];
command.register(first, definition('parallel', { concurrent: true, execute: () =>
    new Promise(resolve => concurrent.push(resolve)) }));
const parallel = [command.execute(first, 'parallel'), command.execute(first, 'parallel')];
assert.equal(command.list(first).find(info => info.name === 'parallel').running, 2);
for (const resolve of concurrent) {
    resolve(command.success(null));
}
assert.equal((await Promise.all(parallel)).every(value => value.ok), true);

// --- WebMCP 能力检测、共享执行、注册变化和迟到发布。 ---
assert.equal(await command.connectWebMcp(first), false);
const published = new Map();
const controllers = new Map();
dom.window.document.modelContext = { registerTool: async (tool, options) => {
    published.set(tool.name, tool);
    controllers.set(tool.name, options.signal);
    options.signal.addEventListener('abort', () => published.delete(tool.name), { once: true });
} };
assert.equal(await command.connectWebMcp(first), true);
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
await command.connectWebMcp(second);
assert.equal(published.size, 2, 'same names from different instances do not collide');
const oldTool = [...published.values()].find(tool => tool.name.includes('first'));
command.disconnectWebMcp(first);
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
const connecting = command.connectWebMcp(first);
await Promise.resolve();
command.register(first, definition('later', { exposed: true }));
command.clear(first);
command.disconnectWebMcp(first);
releaseRegistration();
assert.equal(await connecting, false);
assert.equal(delayedSignal.aborted, true);
assert.equal(registrations, 1, 'disconnect prevents publishing the next tool after an awaited registration');
command.register(second, definition('retry', { exposed: true }));
let registrationFails = true;
dom.window.document.modelContext = { registerTool: () => registrationFails
    ? Promise.reject(new Error('registration unavailable')) : undefined };
assert.equal(await command.connectWebMcp(second), false);
registrationFails = false;
assert.equal(await command.connectWebMcp(second), true, 'failed registrations can be retried');
command.disconnectWebMcp(second);

// --- 运行实际 Form.remove、Panel.removePanel 和 task.end，检查生命周期集成。 ---
const formSource = await readFile(new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
const formTree = ts.createSourceFile('form.ts', formSource, ts.ScriptTarget.ES2022, true);
const extract = (tree, name) => tree.statements.find(node => ts.isFunctionDeclaration(node) &&
    node.name?.text === name).getText(tree);
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

const taskSource = await readFile(new URL('../dist/lib/task.ts', import.meta.url), 'utf8');
const taskTree = ts.createSourceFile('task.ts', taskSource, ts.ScriptTarget.ES2022, true);
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
command.clear(second);
dom.window.close();
console.log('Command isolation, JSON Schema, shared execution, permissions, cancellation, WebMCP and lifecycle passed.');
