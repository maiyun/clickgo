// npm publish --tag dev --access public

// --- 以下不会真正加载，最终会在底部进行赋值 ---
export let clickgo: typeof import('./clickgo');
export let control: typeof import('./lib/control');
export let core: typeof import('./lib/core');
export let dom: typeof import('./lib/dom');
export let form: typeof import('./lib/form');
export let fs: typeof import('./lib/fs');
export let native: typeof import('./lib/native');
export let task: typeof import('./lib/task');
export let theme: typeof import('./lib/theme');
export let tool: typeof import('./lib/tool');
export let zip: typeof import('./lib/zip');

export function getVersion(): string {
    return clickgo.getVersion();
}

export function getNative(): boolean {
    return clickgo.getNative();
}

export function setSafe(val: boolean): void {
    clickgo.setSafe(val);
}
export function getSafe(): boolean {
    return clickgo.getSafe();
}

export function setCdn(val: string): void {
    clickgo.setCdn(val);
}
export function getCdn(): string {
    return clickgo.getCdn();
}

export async function init(cdn: string = 'https://cdn.jsdelivr.net'): Promise<void> {
    // --- 通过标签加载库 ---
    const paths: string[] = [
        cdn + '/npm/vue@3.2.31/dist/vue.global.min.js'
    ];
    // --- 判断 ResizeObserver 是否存在 ---
    let ro = true;
    // ResizeObserver = undefined;
    if (!((window as any).ResizeObserver)) {
        ro = false;
        paths.push(cdn + '/npm/@juggle/resize-observer@3.3.1/lib/exports/resize-observer.umd.min.js');
    }
    // --- 加载 vue 以及必要库 ---
    await loader.loadScripts(paths);
    // --- 处理 ResizeObserver ---
    if (!ro) {
        (window as any).ResizeObserverEntry = (window as any).ResizeObserver.ResizeObserverEntry;
        (window as any).ResizeObserver = (window as any).ResizeObserver.ResizeObserver;
    }
    // --- map 加载库 ---
    const map: Record<string, string> = {
        'jszip': cdn + '/npm/jszip@3.10.0/dist/jszip.min'
    };
    // --- 加载 clickgo 主程序 ---
    const after = '?' + Math.random().toString();
    const files = await loader.sniffFiles('clickgo.js', {
        'dir': __dirname + '/',
        'after': after,
        'afterIgnore': new RegExp('^' + cdn.replace(/\./g, '\\.')),
        'map': map
    });
    const cg = loader.require('clickgo', files, {
        'dir': __dirname + '/',
        'map': map
    })[0] as typeof import('../dist/clickgo');
    cg.setCdn(cdn);
    // --- 加载 clickgo 的 global css ---
    try {
        const style = await (await fetch(__dirname + '/global.css' + (!__dirname.startsWith(cdn) ? after : ''))).text();
        document.getElementById('cg-global')?.insertAdjacentHTML('afterbegin', style);
    }
    catch {
        alert(`ClickGo: "${__dirname}/global.css'" failed.`);
    }
    // --- 设置一些项目 ---
    clickgo = cg;
    control = cg.control;
    core = cg.core;
    dom = cg.dom;
    form = cg.form;
    fs = cg.fs;
    native = cg.native;
    task = cg.task;
    theme = cg.theme;
    tool = cg.tool;
    zip = cg.zip;
}
