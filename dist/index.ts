// npm publish --tag dev --access public
import * as types from '../types/index';

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
export let vue: import('../types/index').IVueObject;

export function getVersion(): string {
    return clickgo.getVersion();
}

export function isNative(): boolean {
    return clickgo.isNative();
}

export function getPlatform(): NodeJS.Platform | 'web' {
    return clickgo.getPlatform();
}

export function isImmersion(): boolean {
    return clickgo.isImmersion();
}

export function hasFrame(): boolean {
    return clickgo.hasFrame();
}

/** --- 全局类 --- */
export abstract class AbstractBoot {

    /** --- 入口方法 --- */
    public abstract main(): void | Promise<void>;

    /** --- 全局错误事件 --- */
    public onError(taskId: number, formId: number, error: Error, info: string): void | Promise<void>;
    public onError(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends types.IConfig, TK extends keyof T>(n: TK, v: T[TK]): void | Promise<void>;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(
        taskId: number, formId: number, title: string, icon: string, showInSystemTask: boolean
    ): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 */
    public onFormRemoved(taskId: number, formId: number, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 */
    public onFormTitleChanged(taskId: number, formId: number, title: string): void | Promise<void>;
    public onFormTitleChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: number, formId: number, icon: string): void | Promise<void>;
    public onFormIconChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: number, formId: number): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: number, formId: number): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: number, formId: number): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 窗体是否显示在任务栏属性改变事件 --- */
    public onFormShowInSystemTaskChange(taskId: number, formId: number, value: boolean): void | Promise<void>;
    public onFormShowInSystemTaskChange(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: number): void | Promise<void>;
    public onTaskStarted(): void | Promise<void> {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: number): void | Promise<void>;
    public onTaskEnded(): void | Promise<void> {
        return;
    }

    /** --- launcher 文件夹名称修改事件 --- */
    public onLauncherFolderNameChanged(id: string, name: string): void | Promise<void>;
    public onLauncherFolderNameChanged(): void {
        return;
    }

    /** --- location hash 改变事件 --- */
    public onHashChanged(hash: string): void | Promise<void>;
    public onHashChanged(): void {
        return;
    }

    /** --- 环境文件准备加载时的事件 --- */
    public onRuntimeFileLoad(url: string): void | Promise<void>;
    public onRuntimeFileLoad(): void {
        return;
    }

    /** --- 环境文件加载完成的事件 --- */
    public onRuntimeFileLoaded(url: string, state: number): void | Promise<void>;
    public onRuntimeFileLoaded(): void {
        return;
    }

}

export function launcher(boot: AbstractBoot): void {
    (async function() {
        // --- 通过标签加载库 ---
        const paths: string[] = [
            loader.cdn + '/npm/vue@3.3.4/dist/vue.global.prod.min.js'
        ];
        // --- 判断 ResizeObserver 是否存在 ---
        let ro = true;
        // ResizeObserver = undefined;
        if (!((window as any).ResizeObserver)) {
            ro = false;
            paths.push(loader.cdn + '/npm/@juggle/resize-observer@3.4.0/lib/exports/resize-observer.umd.min.js');
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
            'jszip': loader.cdn + '/npm/jszip@3.10.1/dist/jszip.min'
        };
        // --- 加载 clickgo 主程序 ---
        const after = '?' + Math.random().toString();
        const files = await loader.sniffFiles('clickgo.js', {
            'dir': __dirname + '/',
            'after': after,
            'map': map,
            'load': (url) => {
                boot.onRuntimeFileLoad(url) as any;
            },
            'loaded': (url, state) => {
                boot.onRuntimeFileLoaded(url, state) as any;
            }
        });
        const cg = loader.require('clickgo', files, {
            'dir': __dirname + '/',
            'map': map
        })[0] as typeof import('../dist/clickgo');
        // --- 加载 clickgo 的 global css ---
        try {
            const style = await (await fetch(__dirname + '/global.css' + (__dirname.startsWith(loader.cdn) ? '' : '?' + Math.random().toString()))).text();
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
        core.boot = boot;
        // --- 执行回调 ---
        await boot.main();
    })().catch(function(e) {
        console.log('launcher', e);
    });
}
