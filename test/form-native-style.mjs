// Run: node test/form-native-style.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
for (const name of ['window', 'document', 'Element', 'SVGElement', 'Node', 'HTMLElement']) {
    globalThis[name] = dom.window[name];
}
const { createApp, compile, nextTick } = await import('vue');
const template = await readFile(new URL('../dist/sources/control/form/layout.html', import.meta.url), 'utf8');
const render = compile(template);
const theme = document.createElement('style');
theme.textContent = `
    .wrap { border: 3px solid black !important; border-radius: 24px !important; box-shadow: 0 0 8px black !important; }
    .wrap > .inner, .wrap > .inner > .header, .wrap > .inner > .content { border-radius: 24px !important; }
    .child-control { border: 1px solid blue; border-radius: 12px; }
`;
document.head.append(theme);

for (const nativeFirst of [true, false]) {
    for (const border of ['normal', 'thin', 'plain', 'none']) {
        const host = document.createElement('div');
        document.body.append(host);
        const app = createApp({
            render,
            data: () => ({
                border, isNativeNoFrameFirst: nativeFirst, flashTimer: undefined,
                stateMinData: false, stateMaxData: false, taskPosition: 'bottom',
                isShow: true, isInside: false, formFocus: false, widthData: 500,
                heightData: 400, leftData: 0, topData: 0, zIndex: 1,
                isMask: false, isResize: false, iconDataUrl: '', title: 'Notepad',
                isMin: true, isMax: true, isClose: true, direction: 'v',
                background: '', padding: '', stepShowData: false, stepData: [],
                stepValue: '', isLoading: false,
            }),
            methods: { moveMethod() {}, minMethod() {}, maxMethod() {}, closeMethod() {}, stepDown() {} },
        });
        app.component('cg-step', { render: () => null });
        app.component('cg-loading', { render: () => null });
        const form = app.mount(host);
        const wrap = host.querySelector('.wrap');
        const inner = host.querySelector('.inner');
        const content = host.querySelector('.content');
        const header = host.querySelector('.header');
        assert.equal(Boolean(header), border === 'normal' || border === 'thin');
        const child = document.createElement('div');
        child.className = 'child-control';
        content.append(child);
        for (const focused of [false, true]) {
            form.formFocus = focused;
            form.stateMaxData = focused;
            await nextTick();
            for (const el of [wrap, inner, content, header].filter(Boolean)) {
                assert.equal(el.style.getPropertyPriority('border-radius'), nativeFirst ? 'important' : '');
                assert.equal(dom.window.getComputedStyle(el).borderRadius, nativeFirst ? '0' : '24px');
            }
            for (const property of ['border', 'box-shadow']) {
                assert.equal(wrap.style.getPropertyPriority(property), nativeFirst ? 'important' : '');
            }
            assert.equal(dom.window.getComputedStyle(wrap).boxShadow, nativeFirst ? 'none' : '0 0 8px black');
            assert.equal(dom.window.getComputedStyle(wrap).borderTopWidth, nativeFirst ? '0px' : '3px');
            assert.equal(dom.window.getComputedStyle(child).borderRadius, '12px');
            assert.equal(dom.window.getComputedStyle(child).borderTopWidth, '1px');
        }
        app.unmount();
        host.remove();
    }
}
console.log('Native first-Form styling, theme overrides and ordinary Form isolation checks passed.');
