import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../lib/form/dialog.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('dialog.ts', source, ts.ScriptTarget.ES2022, true);
const declaration = tree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'captcha');
assert.ok(declaration);
const code = ts.transpileModule(declaration.getText(tree), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
async function scenario({ mode, syncToken, result = '' }) {
    let callback, removed = 0, closeCount = 0, resolveDialog;
    const task = { locale: { lang: 'en' }, forms: { f: { closed: false } } };
    const provider = {
        render(_el, options) {
            callback = options.callback;
            if (syncToken !== undefined) callback(syncToken);
            return 'widget';
        },
        remove(id) { assert.equal(id, 'widget'); ++removed; },
    };
    let form;
    const context = {
        exports: {}, setTimeout, clearTimeout,
        clickgo: { core: { getModule: async () => provider } },
        lTask: { getOrigin: () => task }, lCore: { config: { locale: 'en' } },
        info: { locale: { en: { cancel: 'Cancel' } } },
        dialog: async (_current, options) => {
            if (mode === 'failure') return '';
            form = {
                formId: 'f', refs: { content: {} },
                close() {
                    ++closeCount;
                    task.forms.f.closed = true;
                    form.onBeforeUnmount();
                    resolveDialog('');
                },
            };
            const pending = new Promise(resolve => { resolveDialog = resolve; });
            options.onMounted.call(form);
            if (mode === 'cancel' || mode === 'closed' || mode === 'unmount') {
                task.forms.f.closed = true;
                form.onBeforeUnmount();
                if (mode !== 'unmount') resolveDialog(result);
                return pending;
            }
            setTimeout(() => { form.cgDialogCallback = () => {}; }, 1);
            if (mode === 'async') setTimeout(() => callback('async-token'), 2);
            return pending;
        },
    };
    vm.runInNewContext(code, context);
    const value = await context.exports.captcha('task', { factory: 'cf', akey: 'site' });
    if (callback) callback('late-token');
    await new Promise(resolve => setTimeout(resolve, 20));
    return { value: value && JSON.parse(JSON.stringify(value)), removed, closeCount };
}
assert.deepEqual(await scenario({ mode: 'failure' }), { value: false, removed: 0, closeCount: 0 });
assert.deepEqual(await scenario({ mode: 'cancel', result: 'Cancel' }), { value: false, removed: 1, closeCount: 0 });
assert.deepEqual(await scenario({ mode: 'closed' }), { value: false, removed: 1, closeCount: 0 });
assert.deepEqual(await scenario({ mode: 'unmount' }), { value: false, removed: 1, closeCount: 0 });
assert.deepEqual(await scenario({ mode: 'success', syncToken: 'sync-token' }), {
    value: { detail: { result: 1, token: 'sync-token' } }, removed: 1, closeCount: 1,
});
assert.deepEqual(await scenario({ mode: 'success', syncToken: '' }), { value: false, removed: 1, closeCount: 1 });
assert.deepEqual(await scenario({ mode: 'async' }), {
    value: { detail: { result: 1, token: 'async-token' } }, removed: 1, closeCount: 1,
});
console.log('Captcha create failure, cancel, close, unmount, synchronous and asynchronous callbacks passed.');
