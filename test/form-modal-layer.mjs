// Run after Sass compilation: node test/form-modal-layer.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import * as tool from '../dist/lib/tool.js';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
for (const name of ['window', 'document', 'Element', 'SVGElement', 'Node', 'HTMLElement']) {
    globalThis[name] = dom.window[name];
}
const { createApp, compile, nextTick } = await import('vue');
const template = await readFile(new URL('../dist/sources/control/form/layout.html', import.meta.url), 'utf8');
const formStyle = document.createElement('style');
formStyle.textContent = await readFile(new URL('../dist/sources/control/form/style.css', import.meta.url), 'utf8');
document.head.append(formStyle);
const dockStyle = document.createElement('style');
dockStyle.textContent = tool.stylePrepend(await readFile(
    new URL('../dist/sources/control/dock-group/style.css', import.meta.url), 'utf8',
), 'dock-group_').style;
document.head.append(dockStyle);

for (const border of ['normal', 'thin', 'plain', 'none']) {
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({
        render: compile(template),
        data: () => ({
            border, isNative: false, isNativeNoFrameFirst: false, flashTimer: undefined,
            stateMinData: false, stateMaxData: false, taskPosition: 'bottom',
            isShow: true, isInside: false, formFocus: true, widthData: 500,
            heightData: 400, leftData: 0, topData: 0, zIndex: 1,
            isMask: false, isResize: false, iconDataUrl: '', title: 'Dock',
            isMin: false, isMax: false, isClose: false, direction: 'v',
            isLoading: false, loading: false, loadingComp: false,
            background: '', padding: '', stepShowData: false, stepData: [],
            stepDown: () => {}, stepValue: '', stepValues: [],
        }),
    });
    app.component('cg-loading', { render: () => null });
    app.component('cg-step', { render: () => null });
    const form = app.mount(host);
    const wrap = host.querySelector('.wrap');
    const inner = wrap.querySelector(':scope > .inner');
    const content = inner.querySelector(':scope > .content');
    const dock = document.createElement('div');
    dock.className = 'dock-group_wrap dock-group_collapsed dock-group_floating';
    dock.innerHTML = '<div class="dock-group_content"><button>Images</button></div>';
    content.append(dock);
    const floating = dock.firstElementChild;
    const button = floating.firstElementChild;
    assert.equal(dom.window.getComputedStyle(floating).zIndex, '10');

    // --- 模态打开、嵌套模态仍遮罩、关闭后的恢复均不得重建 Dock 内容 ---
    for (const masked of [true, true, false, true, false]) {
        form.isMask = masked;
        await nextTick();
        const mask = wrap.querySelector(':scope > .mask');
        assert.equal(Boolean(mask), masked);
        assert.equal(dock.firstElementChild, floating);
        assert.equal(floating.firstElementChild, button);
        assert.equal(dom.window.getComputedStyle(floating).display, 'flex');
        if (mask) {
            assert.equal(mask.parentElement, inner.parentElement);
            assert.equal(dom.window.getComputedStyle(mask).zIndex, '10');
            // --- 子浮层不能参与遮罩所在层的排序，即使两者 z-index 相同且浮层 DOM 在后 ---
            assert.equal(dom.window.getComputedStyle(inner).isolation, 'isolate');
            assert.equal(inner.contains(floating), true);
            assert.equal(inner.contains(mask), false);
        }
    }
    app.unmount();
    host.remove();
}
dom.window.close();
console.log('Form modal layer checks passed: Dock floats stay inside the content stacking context for all borders; modal toggles preserve panel content.');
