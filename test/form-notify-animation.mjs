// Requires a display; run with npm run test:notify-animation.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import electron from 'electron';
import ts from 'typescript';

if (!process.versions.electron) {
    const child = spawn(electron, [fileURLToPath(import.meta.url), '--ozone-platform=x11'], {
        'stdio': ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    const timeout = setTimeout(() => child.kill(), 20000);
    const code = await new Promise(resolve => {
        child.on('error', error => { output += error.message; resolve(1); });
        child.on('exit', resolve);
    });
    clearTimeout(timeout);
    assert.equal(code, 0, output);
    console.log('Notify animation passed: consecutive LTR/RTL entries keep their stacked height and slide horizontally.');
}
else {
    const { app, BrowserWindow } = electron;
    app.whenReady().then(async () => {
        const win = new BrowserWindow({
            'show': false, 'width': 800, 'height': 600,
            'webPreferences': { 'backgroundThrottling': false, 'offscreen': true },
        });
        let exitCode = 0;
        try {
            const source = await readFile(new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
            const start = source.indexOf('let notifyId:');
            const end = source.indexOf('export function appendToPop', start);
            const script = ts.transpileModule(source.slice(start, end), {
                'compilerOptions': { 'module': ts.ModuleKind.CommonJS, 'target': ts.ScriptTarget.ES2022 },
            }).outputText;
            const style = await readFile(new URL('../dist/global.css', import.meta.url), 'utf8');
            await win.loadURL(`data:text/html,${encodeURIComponent(`<style>${style}</style><div id="cg-wrap"><div id="cg-notify"></div></div>`)}`);
            await win.webContents.executeJavaScript(`
                window.notifyCore = {
                    config: { locale: 'en' },
                    getAvailArea: () => ({ left: 0, top: 0, width: innerWidth, height: innerHeight - 48 }),
                };
                window.notifyApi = {};
                new Function('exports', 'elements', 'lCore', 'lTool', ${JSON.stringify(script)})(
                    window.notifyApi, { notify: document.getElementById('cg-notify') }, window.notifyCore,
                    { lang: { getDirection: locale => locale === 'ar' ? 'rtl' : 'ltr' }, escapeHTML: value => value },
                );
            `);
            const traces = await win.webContents.executeJavaScript(`(${recordEntries.toString()})()`);
            for (const trace of traces) {
                const label = `${trace.direction} notification ${trace.index + 1}`;
                assert.ok(trace.samples.every(point => Math.abs(point.y - trace.targetY) < 0.5),
                    `${label} must enter at its stacked height: ${JSON.stringify(trace)}`);
                const movement = trace.samples.at(-1).x - trace.samples[0].x;
                assert.ok(trace.direction === 'ltr' ? movement < -20 : movement > 20,
                    `${label} must slide in from the outer edge`);
            }
        }
        catch (error) {
            console.error(error);
            exitCode = 1;
        }
        finally {
            win.destroy();
            app.exit(exitCode);
        }
    });
}

/**
 * --- 在实际渲染帧中记录连续通知的轨迹，避免最终坐标测试漏掉错误的入场方向 ---
 * @returns LTR/RTL 通知入场的逐帧坐标与目标高度
 */
async function recordEntries() {
    const traces = [];
    for (const direction of ['ltr', 'rtl']) {
        document.getElementById('cg-wrap').dir = direction;
        window.notifyCore.config.locale = direction === 'rtl' ? 'ar' : 'en';
        for (let index = 0; index < 3; ++index) {
            const id = window.notifyApi.notify({ 'title': 'Notify', 'content': `Notification ${index}`, 'timeout': 0 });
            const el = document.querySelector(`[data-notifyid="${id}"]`);
            const samples = [];
            for (let frame = 0; frame < 7; ++frame) {
                await new Promise(resolve => requestAnimationFrame(resolve));
                const rect = el.getBoundingClientRect();
                samples.push({ 'x': rect.x, 'y': rect.y });
            }
            const target = new DOMMatrix(el.style.transform);
            traces.push({ direction, index, samples, 'targetY': innerHeight - el.offsetHeight + target.m42 });
            await Promise.all(el.getAnimations().map(animation => animation.finished));
        }
        for (const el of document.querySelectorAll('[data-notifyid]')) {
            window.notifyApi.hideNotify(Number(el.dataset.notifyid));
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    return traces;
}
