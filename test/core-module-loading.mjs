import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../dist/lib/core.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('core.ts', source, ts.ScriptTarget.ES2022, true);
const names = new Set(['regModule', 'loadModule', 'getModule']);
const selected = tree.statements.filter(node =>
    (ts.isVariableStatement(node) && node.declarationList.declarations.some(item => item.name.getText(tree) === 'modules')) ||
    (ts.isFunctionDeclaration(node) && node.body && names.has(node.name?.text)));
const requests = [];
const globals = {};
const clickgo = { modules: {}, getCdn: () => 'https://cdn.example', getDirname: () => '/clickgo' };
const api = {};
function pending(urls) {
    let resolve;
    const promise = new Promise(yes => { resolve = yes; });
    requests.push({ urls: Array.from(urls), resolve });
    return promise;
}
vm.runInNewContext(ts.transpileModule(selected.map(node => node.getText(tree)).join('\n'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, {
    exports: api, window: globals, clickgo,
    lTask: { checkPermission: async () => [true] },
    lTool: { loadAssets: pending, loadScript: url => pending([url]), loadStyle() {}, urlResolve: (base, path) => base + path },
});

const xterm = api.getModule('xterm');
const duplicate = api.getModule('xterm');
assert.equal(requests.length, 1, 'concurrent callers share one unified resource batch');
assert.equal(requests[0].urls.length, 4);
assert.ok(requests[0].urls[0].endsWith('/xterm.js'));
assert.ok(requests[0].urls[3].endsWith('/xterm.min.css'));
assert.equal(clickgo.modules.xterm, undefined, 'modules are not published until their resources complete');
globals.Terminal = class {};
globals.FitAddon = { FitAddon: class {} };
globals.WebglAddon = { WebglAddon: class {} };
requests[0].resolve(true);
const first = await xterm;
assert.equal(await duplicate, first);
assert.equal(await api.getModule('xterm'), first);
assert.equal(requests.length, 1, 'ready modules do not reload resources');

requests.length = 0;
const toast = api.getModule('@toast-ui/editor');
assert.equal(requests.length, 1, 'Toast UI uses one unified batch without business-side parallel code');
assert.equal(requests[0].urls.length, 3);
assert.ok(requests[0].urls[0].endsWith('/toastui-editor-all.min.js'));
assert.equal(requests[0].urls.filter(url => url.includes('/i18n/')).length, 0, 'the shared module and pure viewer need no locale scripts');
assert.equal(requests[0].urls.filter(url => url.endsWith('.css')).length, 2);
globals.toastui = { Editor: class {} };
requests[0].resolve(true);
const toastModule = await toast;
assert.equal(toastModule.Editor, globals.toastui.Editor, 'the wrapper preserves the library constructor');
assert.equal(globals.toastui.loadLanguage, undefined, 'the native library namespace is not mutated');
assert.equal(await api.getModule('@toast-ui/editor'), toastModule, 'all callers receive the same wrapper');
requests.length = 0;
assert.equal(await toastModule.loadLanguage('en'), true);
assert.equal(await toastModule.loadLanguage('en-US'), true);
assert.equal(await toastModule.loadLanguage('../unknown'), false);
assert.equal(requests.length, 0, 'built-in English and unsupported names issue no requests');
const locale = toastModule.loadLanguage('zh-CN');
const localeWaiter = toastModule.loadLanguage('ZH-cn');
assert.equal(requests.length, 1, 'normalized language names share a pending script globally');
assert.ok(requests[0].urls[0].endsWith('/i18n/zh-cn.min.js'));
requests[0].resolve(true);
assert.equal(await locale, true);
assert.equal(await localeWaiter, true);
assert.equal(await toastModule.loadLanguage('zh-cn'), true);
assert.equal(requests.length, 1, 'ready languages are reused');
const badLocale = toastModule.loadLanguage('fr-FR');
const badLocaleWaiter = toastModule.loadLanguage('fr-fr');
requests.at(-1).resolve(false);
assert.equal(await badLocale, false);
assert.equal(await badLocaleWaiter, false);
const localeRetry = toastModule.loadLanguage('fr-FR');
assert.equal(requests.length, 3, 'failed languages can be retried');
requests.at(-1).resolve(true);
assert.equal(await localeRetry, true);

requests.length = 0;
const failed = api.getModule('jodit');
const alsoFailed = api.getModule('jodit');
assert.equal(requests.length, 1);
requests[0].resolve(true);
assert.equal(await failed, null, 'a missing script global is a module failure');
assert.equal(await alsoFailed, null, 'waiting callers also receive failure instead of hanging');
requests.length = 0;
const retried = api.getModule('jodit');
assert.equal(requests.length, 1, 'failure clears the in-flight state and allows retry');
globals.Jodit = { make() {} };
requests[0].resolve(true);
assert.equal(await retried, globals.Jodit);

requests.length = 0;
delete clickgo.modules.jodit;
const badAssets = api.getModule('jodit');
const badAssetsWaiter = api.getModule('jodit');
requests[0].resolve(false);
assert.equal(await badAssets, null, 'any failed resource prevents publishing the module');
assert.equal(await badAssetsWaiter, null);
assert.equal(clickgo.modules.jodit, undefined);
requests.length = 0;
const assetsRetry = api.getModule('jodit');
requests[0].resolve(true);
assert.equal(await assetsRetry, globals.Jodit);

let attempts = 0;
let finish;
assert.equal(await api.regModule('owner', 'retry-test', {
    func: () => { ++attempts; return new Promise(resolve => { finish = resolve; }); },
}), true);
const empty = api.loadModule('retry-test');
const emptyWaiter = api.loadModule('retry-test');
finish(null);
assert.equal(await empty, false);
assert.equal(await emptyWaiter, false);
const retry = api.loadModule('retry-test');
finish({ ready: true });
assert.equal(await retry, true);
assert.equal(attempts, 2);

let reject;
assert.equal(await api.regModule('owner', 'reject-test', {
    func: () => new Promise((resolve, no) => { reject = no; }),
}), true);
const rejected = api.loadModule('reject-test');
const rejectedWaiter = api.loadModule('reject-test');
reject(new Error('external loader failed'));
assert.equal(await rejected, false);
assert.equal(await rejectedWaiter, false, 'external rejections release every waiting caller');
const secondTry = api.loadModule('reject-test');
reject(new Error('external loader failed again'));
assert.equal(await secondTry, false);
console.log('Unified module loading, locale-free Toast UI, shared loading, failures and retries passed.');
