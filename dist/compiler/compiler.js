import * as rollup from 'rollup';
import * as cleancss from 'clean-css';
import * as fs from 'fs';
import * as terser from 'terser';
import zip from 'jszip';
import * as lTool from '../lib/tool.js';
const cs = new cleancss.default();
/** --- 以 / 结尾的当前路径 --- */
const runPath = process.cwd().replace(/\\/g, '/') + '/';
// -----------
// --- 插件 ---
// -----------
/** --- 匹配 extends 后面的类名，为其增加新的方法 --- */
const reg = /extends.+?(AbstractForm|AbstractPanel|AbstractControl|AbstractThread)\s*{/g;
/** --- 增加些必备数据，如 filename --- */
function preTransformPlugin(base) {
    return {
        'name': 'pre-transform',
        transform: function (code, id) {
            id = id.replace(/\\/g, '/');
            if (!reg.test(code)) {
                return null;
            }
            return {
                'code': code.replace(reg, m => {
                    return `${m}get filename(){return '${id.slice(base.length)}';}`;
                }),
                'map': null,
            };
        }
    };
}
/** --- 压缩 --- */
function terserPlugin(es) {
    return {
        'name': 'pre-terser',
        generateBundle: async function (options, bundle) {
            for (const [, chunkOrAsset] of Object.entries(bundle)) {
                if (chunkOrAsset.type !== 'chunk') {
                    continue;
                }
                const result = await terser.minify(chunkOrAsset.code, es ? {
                    'module': true,
                    'ecma': es,
                } : undefined);
                chunkOrAsset.code = result.code ?? '';
            }
        }
    };
}
/**
 * --- 编译网页上的运行 boot ---
 * @param path 要编译的 js 入口文件，不以 .js 结尾
 * @param clickgo clickgo 的加载路径，相对路径或网址，完整路径（比如要包含 .js）
 * @param save 保存编译后的 js 文件路径，不要带扩展名的文件路径 或 以 / 结尾的存储路径
 */
export async function boot(path, clickgo, save) {
    if (path.endsWith('.js')) {
        path = path.slice(0, -3);
    }
    const lio = path.lastIndexOf('/');
    /** --- 保存的文件名 --- */
    const name = lio === -1 ? path : path.slice(lio + 1);
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name + '.pack';
        }
    }
    else {
        const lio = path.lastIndexOf('/');
        if (lio === -1) {
            save = name + '.pack';
        }
        else {
            save = path.slice(0, lio + 1) + name + '.pack';
        }
    }
    // --- 打包 js ---
    try {
        const bundle = await rollup.rollup({
            'input': `${path}.js`,
            'external': ['clickgo'],
            'plugins': [
                terserPlugin(2020),
            ],
        });
        await bundle.write({
            'file': `${save}.js`,
            'format': 'es',
            'paths': {
                'clickgo': clickgo,
            },
        });
        await bundle.close();
        return true;
    }
    catch (e) {
        console.error('[BOOT]', e);
        return false;
    }
}
/**
 * --- 编译控件源码为 cgc 文件 ---
 * @param paths 控件源码路径列表，后缀无所谓是否 / 结尾，以不以 / 结尾优先
 * @param save 保存文件路径，不要带扩展名的文件路径 或 以 / 结尾的存储路径
 */
export async function control(paths, save) {
    const zipo = new zip();
    /** --- 保存的文件名（若 save 未指定，则使用第一个控件的名称） --- */
    let name = '';
    /** --- 控件的个数 --- */
    let num = 0;
    for (let path of paths) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        /** --- 控件的配置文件 --- */
        let config = {};
        try {
            const buf = await fs.promises.readFile(path + '/config.json');
            config = JSON.parse(buf.toString());
        }
        catch {
            return 0;
        }
        // --- 先打包 js ---
        try {
            if (config.code) {
                const lstat = await fs.promises.stat(`${path}/${config.code}.js`);
                if (lstat.isFile()) {
                    const nowBase = lTool.urlResolve(runPath, path);
                    const external = ['clickgo'];
                    const globals = {
                        'clickgo': 'clickgo.modules.clickgo',
                    };
                    if (config.modules) {
                        for (const mod of config.modules) {
                            external.push(mod);
                            globals[mod] = `clickgo.modules['${mod}']`;
                        }
                    }
                    const bundle = await rollup.rollup({
                        'input': `${path}/${config.code}.js`,
                        'external': external,
                        'plugins': [
                            preTransformPlugin(nowBase),
                            terserPlugin(),
                        ],
                    });
                    await bundle.write({
                        'file': `${path}/${config.code}.pack.js`,
                        'name': 'emodule',
                        'format': 'iife',
                        'globals': globals,
                    });
                    await bundle.close();
                }
            }
        }
        catch {
            continue;
        }
        /** --- 控件初代子目录（子控件） --- */
        const cname = config.name;
        if (!name) {
            name = cname;
        }
        await addFile(zipo, path, cname);
        ++num;
    }
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name;
        }
    }
    else {
        let path = paths[0];
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        const lio = path.lastIndexOf('/');
        if (lio === -1) {
            save = name;
        }
        else {
            save = path.slice(0, lio + 1) + name;
        }
    }
    // -- 筹备 zip 包 ---
    const buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9,
        },
    });
    await fs.promises.writeFile(save + '.cgc', buf);
    return num;
}
/**
 * --- 编译主题源码为 cgt 文件 ---
 * @param paths 主题源码路径列表，后缀无所谓是否 / 结尾，以不以 / 结尾优先
 * @param save 保存文件路径，不要带扩展名的文件路径 或 以 / 结尾的存储路径
 */
export async function theme(path, save) {
    const zipo = new zip();
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    /** --- 控件的配置文件 --- */
    let config = {};
    try {
        const buf = await fs.promises.readFile(path + '/config.json');
        config = JSON.parse(buf.toString());
    }
    catch {
        return false;
    }
    /** --- 保存的文件名（若 save 未指定，则使用主题的名称） --- */
    const name = config.name;
    await addFile(zipo, path);
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name;
        }
    }
    else {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        const lio = path.lastIndexOf('/');
        if (lio === -1) {
            save = name;
        }
        else {
            save = path.slice(0, lio + 1) + name;
        }
    }
    // -- 筹备 zip 包 ---
    const buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9,
        },
    });
    await fs.promises.writeFile(save + '.cgt', buf);
    return true;
}
/**
 * --- 编译应用源码为 cga 文件 ---
 * @param path 应用源码路径，后缀无所谓是否 / 结尾，以不以 / 结尾优先
 * @param icon 应用图标文件图片完整路径
 * @param save 保存文件路径，不要带扩展名的文件路径 或 以 / 结尾的存储路径
 */
export async function application(path, icon, save) {
    const zipo = new zip();
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    const lio = path.lastIndexOf('/');
    /** --- 保存的文件名 --- */
    const name = lio === -1 ? path : path.slice(lio + 1);
    /** --- 应用的配置文件 --- */
    let config = {};
    try {
        const buf = await fs.promises.readFile(path + '/config.json');
        config = JSON.parse(buf.toString());
        // --- 和 control 不同，app 必须有入口 js ---
        const lstat = await fs.promises.stat(`${path}/app.js`);
        if (!lstat.isFile()) {
            return false;
        }
    }
    catch {
        return false;
    }
    // --- 先打包 js ---
    const nowBase = lTool.urlResolve(runPath, path);
    const external = ['clickgo'];
    const globals = {
        'clickgo': 'clickgo.modules.clickgo',
    };
    if (config.modules) {
        for (const mod of config.modules) {
            external.push(mod);
            globals[mod] = `clickgo.modules['${mod}']`;
        }
    }
    const bundle = await rollup.rollup({
        'input': `${path}/app.js`,
        'external': external,
        'plugins': [
            preTransformPlugin(nowBase),
            terserPlugin(),
        ],
    });
    await bundle.write({
        'file': `${path}/app.pack.js`,
        'name': 'emodule',
        'format': 'iife',
        'globals': globals,
    });
    await bundle.close();
    await addFile(zipo, path, '');
    // --- 处理 icon ---
    let iconBuf;
    if (icon) {
        const iconFile = await fs.promises.readFile(icon);
        if (iconFile) {
            const length = iconFile.length.toString().padStart(7, '0');
            iconBuf = Buffer.concat([Buffer.from(length), iconFile]);
        }
        else {
            iconBuf = Buffer.from('0000000');
        }
    }
    else {
        iconBuf = Buffer.from('0000000');
    }
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name;
        }
    }
    else {
        const lio = path.lastIndexOf('/');
        if (lio === -1) {
            save = name;
        }
        else {
            save = path.slice(0, lio + 1) + name;
        }
    }
    // -- 筹备 zip 包 ---
    let buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9,
        },
    });
    buf = Buffer.concat([Buffer.from('-CGA-'), buf.subarray(0, 16), iconBuf, buf.subarray(16)]);
    await fs.promises.writeFile(save + '.cga', buf);
    return true;
}
// --- 工具 ---
/**
 * --- 添加包含 config.json 的包文件到 zip ---
 * @param zipo zip 对象
 * @param base 包含 config 的路径，不以 / 结尾
 * @param path zip 中的路径基，不以 / 结尾
 */
async function addFile(zipo, base = '', path = '') {
    const list = await fs.promises.readdir(base);
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.scss')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                // --- 为了去除 html 中的空白和注释 ---
                zipo.file(path + (path ? '/' : '') + item, lTool.purify(buf.toString()));
            }
            else if (item.endsWith('.js') || item.endsWith('.js.map')) {
                if (!item.endsWith('.pack.js')) {
                    continue;
                }
                let code = buf.toString();
                zipo.file(path + (path ? '/' : '') + item.slice(0, -7) + 'js', code);
            }
            else if (item.endsWith('.css')) {
                // --- 压缩 css ---
                const rtn = cs.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.styles ?? '');
            }
            else {
                zipo.file(path + (path ? '/' : '') + item, buf);
            }
        }
        catch {
            continue;
        }
    }
}
