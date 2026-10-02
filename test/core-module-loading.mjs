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
const clickgo = { modules: {}, getCdn: () => 'https://cdn.example', getDirname: () => 'https://app.example/clickgo' };
const api = {};
function pending(urls) {
    let resolve;
    let reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    requests.push({ urls: Array.from(urls), resolve, reject });
    return promise;
}
vm.runInNewContext(ts.transpileModule(selected.map(node => node.getText(tree)).join('\n'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: false },
}).outputText, {
    exports: api, window: globals, clickgo,
    lTask: { checkPermission: async () => [true] },
    lTool: { loadAssets: pending, loadScript: url => pending([url]), loadStyle() {}, urlResolve: (base, path) => new URL(path, base).href },
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
const toastWaiter = api.getModule('@toast-ui/editor');
assert.equal(requests.length, 1, 'concurrent Toast UI callers share one batch of the local complete library and CDN styles');
assert.equal(requests[0].urls.length, 3);
assert.equal(requests[0].urls[0], 'https://app.example/clickgo/ext/toastui-editor-all.min.js', 'the complete library resolves relative to the framework, independently of its CDN');
assert.ok(requests[0].urls.slice(1).every(url => url.startsWith(clickgo.getCdn() + '/npm/@toast-ui/editor@3.2.2/')), 'Toast UI styles keep the configured CDN');
assert.equal(requests[0].urls.filter(url => url.includes('/i18n/')).length, 0, 'the shared module and pure viewer need no locale scripts');
assert.equal(requests[0].urls.filter(url => url.endsWith('.css')).length, 2);
const Editor = class {};
globals.toastui = { Editor };
assert.equal(clickgo.modules['@toast-ui/editor'], undefined, 'a script constructor is not published before the resource batch completes');
requests[0].resolve(true);
const toastModule = await toast;
assert.equal(await toastWaiter, toastModule);
assert.equal(toastModule.Editor, Editor, 'the wrapper exposes the local library constructor used by language scripts');
assert.equal(globals.toastui.loadLanguage, undefined, 'the shared helper is separate from the native namespace');
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

// Resource rejection releases all waiters even when a library global already exists.
delete clickgo.modules['@toast-ui/editor'];
requests.length = 0;
const resourceFailure = api.getModule('@toast-ui/editor');
const resourceFailureWaiter = api.getModule('@toast-ui/editor');
requests[0].reject(new Error('local library unavailable'));
assert.equal(await resourceFailure, null);
assert.equal(await resourceFailureWaiter, null);
assert.equal(clickgo.modules['@toast-ui/editor'], undefined);
requests.length = 0;
const resourceRetry = api.getModule('@toast-ui/editor');
requests[0].resolve(true);
assert.equal((await resourceRetry).Editor, Editor, 'failed initialization leaves the shared module available for retry');

delete clickgo.modules['@toast-ui/editor'];
requests.length = 0;
const missingConstructor = api.getModule('@toast-ui/editor');
delete globals.toastui.Editor;
requests[0].resolve(true);
assert.equal(await missingConstructor, null, 'a missing local constructor is not published');
requests.length = 0;
const failedCss = api.getModule('@toast-ui/editor');
globals.toastui.Editor = Editor;
requests[0].resolve(false);
assert.equal(await failedCss, null, 'a library constructor does not hide resource failure');

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
console.log('Local complete Toast UI library/CDN styles, locale-free loading, shared requests, failures and retries passed.');
