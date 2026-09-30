// Run after Sass compilation: node test/form-native-regions.mjs (requires an Electron display).
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import electron from 'electron';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

if (!process.versions.electron) {
    const child = spawn(electron, [fileURLToPath(import.meta.url), '--ozone-platform=x11'], {
        'env': { ...process.env, 'ELECTRON_DEBUG_DRAGGABLE_REGIONS': '1' },
        'stdio': ['ignore', 'ignore', 'pipe'],
    });
    let output = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', chunk => { output += chunk; });
    const timeout = setTimeout(() => child.kill(), 20000);
    const code = await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', resolve);
    });
    clearTimeout(timeout);
    assert.equal(code, 0, output);
    let region;
    const cases = new Map();
    for (const line of output.split('\n')) {
        const update = /hit-test region computed in .*?: (\d+) rect\(s\), bounds (\S+ \S+)/.exec(line);
        if (update) {
            region = { 'rects': Number(update[1]), 'bounds': update[2] };
        }
        const completed = /CASE-END (\S+)/.exec(line);
        if (completed) {
            assert.ok(region, 'Electron must report an actual native drag region');
            cases.set(completed[1], region);
        }
    }
    assert.equal(cases.size, 8, output);
    assert.ok(cases.get('baseline').rects > 0);
    for (const name of ['bottom', 'hidden', 'minimized', 'bottom-restored', 'nested', 'closed']) {
        assert.deepEqual(cases.get(name), cases.get('baseline'), `${name} must preserve the native title drag region`);
    }
    assert.equal(cases.get('foreground').rects, 0, `an overlapping foreground Form must still block native dragging\n${output}`);
    console.log('Electron native drag regions passed: bottomMost, hidden, minimized, nested, foreground and close.');
}
else {
    const { app, BrowserWindow } = electron;
    app.commandLine.appendSwitch('enable-logging');
    /** --- 等待 Chromium 将布局更新发送给 Native 命中区域计算器 --- */
    const settle = () => new Promise(resolve => setTimeout(resolve, 350));
    app.whenReady().then(async () => {
        const win = new BrowserWindow({
            'show': false, 'frame': false, 'width': 400, 'height': 300,
            'webPreferences': { 'backgroundThrottling': false },
        });
        try {
            const template = await readFile(new URL('../dist/sources/control/form/layout.html', import.meta.url), 'utf8');
            const style = await readFile(new URL('../dist/sources/control/form/style.css', import.meta.url), 'utf8');
            /**
             * --- 用实际 Form 模板生成 Native 主窗体与后创建的背景窗体 ---
             * @param nativeFirst 是否为 Native 主窗体
             * @returns 已渲染的 Form HTML
             */
            async function render(nativeFirst) {
                const form = createSSRApp({
                    template,
                    data: () => ({
                        'border': nativeFirst ? 'normal' : 'none',
                        'isNative': true, 'isNativeNoFrameFirst': nativeFirst,
                        'flashTimer': undefined, 'stateMinData': false, 'stateMaxData': false,
                        'taskPosition': 'bottom', 'isShow': true, 'isInside': false,
                        'formFocus': nativeFirst, 'widthData': 400, 'heightData': 300,
                        'leftData': 0, 'topData': 0, 'zIndex': nativeFirst ? 10 : 1,
                        'isMask': false, 'isResize': false, 'iconDataUrl': '', 'title': 'Native',
                        'isMin': true, 'isMax': true, 'isClose': true, 'direction': 'v',
                        'background': '', 'contentPadding': '', 'stepShowData': false,
                        'stepData': [], 'stepValue': '', 'isLoading': false,
                    }),
                });
                form.component('cg-step', { 'render': () => null });
                form.component('cg-loading', { 'render': () => null });
                return await renderToString(form);
            }
            const native = await render(true);
            const background = await render(false);
            await win.loadURL(`data:text/html,${encodeURIComponent(`<style>body{margin:0}${style}</style><div id="native">${native}</div><div id="background"></div>`)}`);
            await settle();
            console.error('CASE-END baseline');
            const scripts = [
                ['bottom', `document.querySelector('#background').innerHTML=${JSON.stringify(background)};const bg=document.querySelector('#background>.wrap');bg.dataset.cgBottomMost='';`],
                ['hidden', `const bg=document.querySelector('#background>.wrap');delete bg.dataset.cgBottomMost;bg.classList.remove('show');`],
                ['minimized', `const bg=document.querySelector('#background>.wrap');bg.classList.add('show');bg.dataset.cgMin='';`],
                ['foreground', `const bg=document.querySelector('#background>.wrap');delete bg.dataset.cgMin;bg.style.zIndex='20';`],
                ['bottom-restored', `const bg=document.querySelector('#background>.wrap');bg.style.zIndex='1';bg.dataset.cgBottomMost='';`],
                ['nested', `document.querySelector('#background .content').innerHTML=${JSON.stringify(background)};`],
                ['closed', `document.querySelector('#background').replaceChildren();`],
            ];
            for (const [name, script] of scripts) {
                await win.webContents.executeJavaScript(`{${script}}`);
                // --- 隐藏测试窗口也必须完成布局和绘制，不能读取上一帧的命中区域 ---
                await win.webContents.capturePage();
                await settle();
                console.error(`CASE-END ${name}`);
            }
        }
        catch (error) {
            console.error(error);
            app.exit(1);
        }
        finally {
            win.destroy();
            app.quit();
        }
    }).catch(error => { console.error(error); app.exit(1); });
}
