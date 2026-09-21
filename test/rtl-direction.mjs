// Run: node --experimental-vm-modules test/rtl-direction.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
for (const name of ['window', 'document', 'navigator', 'Element', 'SVGElement', 'Node', 'HTMLElement', 'PointerEvent']) {
    Object.defineProperty(globalThis, name, {
        'configurable': true,
        'value': dom.window[name],
    });
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

/** --- 当前模拟任务的 locale 状态 --- */
const tasks = new Map([
    ['arabic', { 'locale': { 'lang': 'ar' } }],
    ['english', { 'locale': { 'lang': 'en' } }],
    ['inherit', { 'locale': { 'lang': '' } }],
]);
/** --- 系统 locale，可在测试中模拟运行时切换 --- */
const config = { 'locale': 'en' };

const toolSource = await readFile(new URL('../dist/lib/tool.ts', import.meta.url), 'utf8');
const toolModule = new SourceTextModule(ts.transpileModule(toolSource, {
    'compilerOptions': {
        'target': ts.ScriptTarget.ES2022,
        'module': ts.ModuleKind.ESNext,
    },
}).outputText);
await toolModule.link(() => {
    throw new Error('tool.ts must not import runtime modules');
});
await toolModule.evaluate();

const clickgo = new SyntheticModule(['modules'], function() {
    this.setExport('modules', {
        'pointer': {
            'move': () => {},
        },
        'vue': {
            'createApp': () => ({
                'mount': () => {},
            }),
        },
    });
});
const core = new SyntheticModule(['config'], function() {
    this.setExport('config', config);
});
const task = new SyntheticModule(['getOrigin'], function() {
    this.setExport('getOrigin', (taskId) => tasks.get(taskId) ?? null);
});
const tool = new SyntheticModule(['lang', 'logicalOr'], function() {
    this.setExport('lang', toolModule.namespace.lang);
    this.setExport('logicalOr', toolModule.namespace.logicalOr);
});
const empty = new SyntheticModule([], function() {});

const formSource = await readFile(new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
const formModule = new SourceTextModule(ts.transpileModule(formSource, {
    'compilerOptions': {
        'target': ts.ScriptTarget.ES2022,
        'module': ts.ModuleKind.ESNext,
    },
}).outputText);
await formModule.link((specifier) => {
    if (specifier === '../clickgo') {
        return clickgo;
    }
    if (specifier === './core') {
        return core;
    }
    if (specifier === './task') {
        return task;
    }
    if (specifier === './tool') {
        return tool;
    }
    return empty;
});
await formModule.evaluate();

const domSource = await readFile(new URL('../dist/lib/dom.ts', import.meta.url), 'utf8');
const domModule = new SourceTextModule(ts.transpileModule(domSource, {
    'compilerOptions': {
        'target': ts.ScriptTarget.ES2022,
        'module': ts.ModuleKind.ESNext,
    },
}).outputText);
await domModule.link((specifier) => {
    if (specifier === '../clickgo') {
        return clickgo;
    }
    if (specifier === './form') {
        return formModule;
    }
    if (specifier === './core') {
        return core;
    }
    if (specifier === './task') {
        return task;
    }
    return empty;
});
await domModule.evaluate();

const { isRtl } = domModule.namespace;
const rtlElement = document.createElement('div');
rtlElement.style.direction = 'rtl';
document.body.append(rtlElement);
assert.equal(isRtl(rtlElement), true, 'an RTL element must resolve to RTL');
assert.equal(isRtl(document.createComment('pending render')), false, 'a Vue placeholder node must safely resolve to LTR');
assert.equal(isRtl(null), false, 'a missing element must safely resolve to LTR');

const { elements, refreshLocaleDirection } = formModule.namespace;
elements.init();
assert.equal(document.querySelector('#cg-wrap'), elements.wrap, 'system root must initialize as #cg-wrap');
assert.equal(elements.wrap.lang, 'en', 'system root must receive the global language tag');
assert.equal(elements.wrap.dir, 'ltr', 'system root must receive the global direction');

/**
 * --- 创建同一任务的 Form 与 pop 容器 ---
 * @param taskId ClickGo task id
 * @param formId ClickGo form id
 * @returns 两个语言容器
 */
function appendTaskWrap(taskId, formId) {
    const formWrap = document.createElement('div');
    formWrap.className = 'cg-form-wrap';
    formWrap.dataset.taskId = taskId;
    formWrap.dataset.formId = formId;
    const popWrap = document.createElement('div');
    popWrap.dataset.taskId = taskId;
    popWrap.dataset.formId = formId;
    elements.list.append(formWrap);
    elements.popList.append(popWrap);
    return { formWrap, popWrap };
}

const arabic = appendTaskWrap('arabic', 'form-ar');
const english = appendTaskWrap('english', 'form-en');
const inherited = appendTaskWrap('inherit', 'form-inherit');
refreshLocaleDirection();
for (const wrap of [arabic.formWrap, arabic.popWrap]) {
    assert.equal(wrap.lang, 'ar', 'Arabic Form and pop wrappers must receive lang=ar');
    assert.equal(wrap.dir, 'rtl', 'Arabic Form and pop wrappers must receive RTL');
}
for (const wrap of [english.formWrap, english.popWrap, inherited.formWrap, inherited.popWrap]) {
    assert.equal(wrap.lang, 'en', 'English and inherited Form/pop wrappers must receive lang=en');
    assert.equal(wrap.dir, 'ltr', 'English and inherited Form/pop wrappers must receive LTR');
}

// A task-only refresh must update that task's Form and pop wrappers without disturbing a concurrent task.
tasks.get('arabic').locale.lang = 'en';
refreshLocaleDirection('arabic');
for (const wrap of [arabic.formWrap, arabic.popWrap]) {
    assert.equal(wrap.lang, 'en', 'task locale switch ar -> en must update both wrapper types');
    assert.equal(wrap.dir, 'ltr', 'task locale switch ar -> en must update both wrapper types');
}
assert.equal(english.formWrap.dir, 'ltr', 'task-only refresh must preserve another task direction');

tasks.get('arabic').locale.lang = 'ar';
refreshLocaleDirection('arabic');
assert.equal(arabic.formWrap.dir, 'rtl', 'task locale switch en -> ar must restore RTL');
assert.equal(arabic.popWrap.dir, 'rtl', 'task locale switch en -> ar must restore pop RTL');

// Global direction refresh changes the system root and inherited tasks, while explicit task locales remain isolated.
config.locale = 'ar';
refreshLocaleDirection();
assert.equal(elements.wrap.lang, 'ar', 'global locale switch must update #cg-wrap language');
assert.equal(elements.wrap.dir, 'rtl', 'global locale switch must update #cg-wrap direction');
assert.equal(inherited.formWrap.dir, 'rtl', 'task without an override must inherit global RTL');
assert.equal(inherited.popWrap.dir, 'rtl', 'inherited pop wrapper must inherit global RTL');
assert.equal(english.formWrap.dir, 'ltr', 'explicit English task must coexist with global Arabic RTL');
assert.equal(arabic.formWrap.dir, 'rtl', 'explicit Arabic task must coexist with global Arabic RTL');

config.locale = 'en';
refreshLocaleDirection();
assert.equal(elements.wrap.dir, 'ltr', 'global locale switch ar -> en must restore root LTR');
assert.equal(inherited.formWrap.dir, 'ltr', 'global locale switch ar -> en must restore inherited Form LTR');
assert.equal(inherited.popWrap.dir, 'ltr', 'global locale switch ar -> en must restore inherited pop LTR');
assert.equal(arabic.formWrap.dir, 'rtl', 'explicit Arabic task must remain RTL after global refresh');

dom.window.close();
console.log('RTL root, Form/pop isolation, task switching and global refresh checks passed from TypeScript source.');
