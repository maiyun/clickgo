import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    globalThis[name] = dom.window[name];
}
const vue = await import('vue');

const files = new Map();

class AbstractControl {
    path = '/form/main';
    rootControl = { packageFiles: {} };
    watchers = [];
    watch(prop, fn, options) {
        this.watchers.push({ prop, fn });
        if (options?.immediate) {
            fn();
        }
    }
    async triggerWatch(prop) {
        for (const item of this.watchers) {
            if (item.prop === prop) {
                await item.fn();
            }
        }
    }
}

async function loadSvgControl() {
    const source = await readFile(new URL('../../sources/control/svg/code.ts', import.meta.url), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', code)(
        () => ({
            control: { AbstractControl },
            tool: {
                urlResolve: (_base, src) => src,
                blob2Text: async (blob) => blob.text(),
            },
            fs: {
                getContent: async (_ctx, path) => {
                    const content = files.get(path);
                    return content === undefined ? null : new Blob([content], { type: 'image/svg+xml' });
                },
            },
        }),
        module,
        module.exports,
    );
    return module.exports.default;
}

const SvgControl = await loadSvgControl();
const template = await readFile(new URL('../../sources/control/svg/layout.html', import.meta.url), 'utf8');

async function renderSvg(props = {}) {
    const control = new SvgControl();
    Object.assign(control.props, props);
    let reactiveState;
    const Component = {
        setup() {
            reactiveState = vue.reactive(control);
            const exposed = {};
            for (const key of Object.keys(control)) {
                Object.defineProperty(exposed, key, {
                    enumerable: true,
                    get: () => reactiveState[key],
                    set: (value) => { reactiveState[key] = value; },
                });
            }
            for (const key of Object.keys(control.props)) {
                Object.defineProperty(exposed, key, {
                    enumerable: true,
                    get: () => reactiveState.props[key],
                });
            }
            return exposed;
        },
        render: vue.compile(template),
    };
    const host = document.createElement('div');
    document.body.append(host);
    const app = vue.createApp({ render: () => vue.h(Component) });
    app.mount(host);
    await reactiveState.onMounted();
    await new Promise((resolve) => setTimeout(resolve, 10));
    await vue.nextTick();
    return {
        host,
        control: reactiveState,
        async setSrc(src) {
            reactiveState.props.src = src;
            await reactiveState.triggerWatch('src');
            await new Promise((resolve) => setTimeout(resolve, 10));
            await vue.nextTick();
        },
        close() {
            app.unmount();
            host.remove();
        },
    };
}

// 1. Root stroke-width / stroke-linecap / stroke-linejoin and attribute order before fill/stroke
files.set('/package/res/root-attrs.svg', `<svg xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path d="M4 12H20"/></svg>`);
{
    const mounted = await renderSvg({ src: '/package/res/root-attrs.svg' });
    const svg = mounted.host.querySelector('svg');
    assert.equal(svg.getAttribute('viewBox'), '0 0 24 24');
    assert.equal(svg.getAttribute('fill'), 'none');
    assert.equal(svg.getAttribute('stroke'), 'currentColor');
    assert.equal(svg.getAttribute('stroke-width'), '1.5');
    assert.equal(svg.getAttribute('stroke-linecap'), 'round');
    assert.equal(svg.getAttribute('stroke-linejoin'), 'round');
    assert.equal(svg.getAttribute('preserveAspectRatio'), 'xMidYMid meet');
    assert.equal(svg.querySelector('path')?.getAttribute('d'), 'M4 12H20');
    mounted.close();
}

// 2. Child fill/stroke must not leak to root; unsafe or sizing attrs must be ignored; single quotes supported
files.set('/package/res/child-isolation.svg', `<?xml version="1.0" encoding="utf-8"?><svg width="800px" height="800px" class="legacy" style="color:red" onload="alert(1)" viewBox='0 0 32 32' stroke-width='2'><path d="M2 2H30" fill="red" stroke="blue"/></svg>`);
{
    const mounted = await renderSvg({ src: '/package/res/child-isolation.svg' });
    const svg = mounted.host.querySelector('svg');
    assert.equal(svg.getAttribute('viewBox'), '0 0 32 32');
    assert.equal(svg.getAttribute('stroke-width'), '2');
    assert.equal(svg.getAttribute('fill'), null);
    assert.equal(svg.getAttribute('stroke'), null);
    assert.equal(svg.getAttribute('width'), null);
    assert.equal(svg.getAttribute('height'), null);
    assert.equal(svg.getAttribute('class'), null);
    assert.equal(svg.getAttribute('style'), null);
    assert.equal(svg.getAttribute('onload'), null);
    mounted.close();
}

// 3. Explicit props override file attrs; layout prop suppresses fileAttrs; empty src resets state
{
    const mounted = await renderSvg({ src: '/package/res/root-attrs.svg', fill: '#111', stroke: '#222' });
    const svg = mounted.host.querySelector('svg');
    assert.equal(svg.getAttribute('fill'), '#111');
    assert.equal(svg.getAttribute('stroke'), '#222');
    assert.equal(svg.getAttribute('stroke-width'), '1.5');

    await mounted.setSrc('');
    assert.equal(svg.getAttribute('stroke-width'), null);
    assert.equal(svg.innerHTML, '');
    mounted.close();
}

{
    const mounted = await renderSvg({
        src: '/package/res/root-attrs.svg',
        layout: '<circle cx="12" cy="12" r="5"/>',
        viewBox: '0 0 16 16',
    });
    const svg = mounted.host.querySelector('svg');
    assert.equal(svg.getAttribute('viewBox'), '0 0 16 16');
    assert.equal(svg.getAttribute('stroke-width'), null);
    assert.equal(svg.querySelector('circle')?.getAttribute('r'), '5');
    mounted.close();
}

console.log('svg tests passed');
