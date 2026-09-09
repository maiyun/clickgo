import * as rollup from 'rollup';
import * as cleancss from 'clean-css';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as terser from 'terser';
import JavaScriptObfuscator from 'javascript-obfuscator';
import zip from 'jszip';
import * as lTool from '../lib/tool.js';

const cs = new cleancss.default();
/** --- 以 / 结尾的当前路径 --- */
const runPath = process.cwd().replace(/\\/g, '/') + '/';

/** --- CGA 文件头标识 --- */
const cgaMagic = Buffer.from('-CGA-');
/** --- CGA 内部格式版本 --- */
const cgaVersion = 1;
/** --- CGA 固定文件头长度 --- */
const cgaHeaderLength = 106;
/** --- CGA 小文件数据块的目标上限 --- */
const cgaBlockSize = 256 * 1_024;
/** --- 解包后按文本返回的文件类型 --- */
const cgaTextExts = new Set(['css', 'html', 'js', 'json', 'txt', 'xml']);
/** --- CGA 密钥派生上下文 --- */
const cgaKeyContext = Buffer.from('ClickGo/Application/Package');

// -----------
// --- 插件 ---
// -----------

/** --- 匹配直接继承 ClickGo 抽象视图类的类声明开头花括号 --- */
const regExtends = /(?:extends.+?(?:AbstractForm|AbstractPanel|AbstractComponent|AbstractControl|AbstractThread))\s*{/g;

/** --- 增加些必备数据，如 filename --- */
function preTransformPlugin(base: string): rollup.InputPluginOption {
    return {
        'name': 'pre-transform',
        transform: function(code, id) {
            id = id.replace(/\\/g, '/');
            if (!regExtends.test(code)) {
                return null;
            }
            const filename = id.slice(base.length);
            const newCode = code.replace(regExtends, m => `${m}get filename(){return '${filename}';}`);
            return {
                'code': newCode,
                'map': null,
            };
        }
    };
}

/**
 * --- 混淆应用代码 ---
 * @param code 压缩后的应用代码
 * @returns 混淆后的应用代码
 */
function obfuscate(code: string): string {
    /** --- javascript-obfuscator 仅通过 CI 环境标记关闭交互终端推广 --- */
    const ci = process.env.CI;
    process.env.CI = '1';
    try {
        return JavaScriptObfuscator.obfuscate(code, {
            'compact': true,
            'controlFlowFlattening': false,
            'deadCodeInjection': false,
            'debugProtection': false,
            'disableConsoleOutput': false,
            'identifierNamesGenerator': 'mangled-shuffled',
            'renameGlobals': false,
            'renameProperties': false,
            'seed': crypto.randomInt(1, 2_147_483_647),
            'selfDefending': false,
            'simplify': true,
            'sourceMap': false,
            'splitStrings': false,
            'stringArray': true,
            'stringArrayCallsTransform': false,
            'stringArrayEncoding': ['base64'],
            'stringArrayRotate': true,
            'stringArrayShuffle': true,
            'stringArrayThreshold': 0.35,
            'target': 'browser-no-eval',
            'transformObjectKeys': false,
        }).getObfuscatedCode();
    }
    finally {
        if (ci === undefined) {
            delete process.env.CI;
        }
        else {
            process.env.CI = ci;
        }
    }
}

/** --- 压缩 --- */
function terserPlugin(es?: terser.ECMA, protect: boolean = false): rollup.InputPluginOption {
    return {
        'name': 'pre-terser',
        generateBundle: async function(options, bundle) {
            for (const [, chunkOrAsset] of Object.entries(bundle)) {
                if (chunkOrAsset.type !== 'chunk') {
                    continue;
                }
                const result = await terser.minify(chunkOrAsset.code, protect ? {
                    'compress': {
                        'passes': 2,
                    },
                    'format': {
                        'comments': false,
                    },
                    'mangle': true,
                    'module': es ? true : undefined,
                    'ecma': es,
                } : (es ? {
                    'module': true,
                    'ecma': es,
                } : undefined));
                const code = result.code ?? '';
                if (!protect) {
                    chunkOrAsset.code = code;
                    continue;
                }
                chunkOrAsset.code = obfuscate(code);
            }
        }
    };
}

/**
 * --- 编译控件源码为 cgc 文件 ---
 * @param paths 控件源码路径列表，后缀无所谓是否 / 结尾，以不以 / 结尾优先
 * @param save 保存文件路径，不要带扩展名的文件路径 或 以 / 结尾的存储路径
 */
export async function control(paths: string[], save?: string): Promise<number> {
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
        let config: any = {};
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
                    const globals: Record<string, string> = {
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
export async function theme(path: string, save?: string): Promise<boolean> {
    const zipo = new zip();
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    /** --- 控件的配置文件 --- */
    let config: any = {};
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
export async function application(path: string, icon?: string, save?: string): Promise<boolean> {
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    const lio = path.lastIndexOf('/');
    /** --- 保存的文件名 --- */
    const name = lio === -1 ? path : path.slice(lio + 1);
    /** --- 应用的配置文件 --- */
    let config: any = {};
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
    const globals: Record<string, string> = {
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
            terserPlugin(undefined, true),
        ],
    });
    await bundle.write({
        'file': `${path}/app.pack.js`,
        'name': 'emodule',
        'format': 'iife',
        'globals': globals,
    });
    await bundle.close();

    /** --- 要写入加密包的应用文件 --- */
    const files: IAppFile[] = [];
    await collectAppFiles(files, path);
    // --- 处理 icon ---
    let iconBuf = Buffer.alloc(0);
    if (icon) {
        const iconFile = await fs.promises.readFile(icon);
        if (iconFile) {
            iconBuf = iconFile;
        }
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
    // --- 生成新 CGA 加密容器 ---
    const buf = await buildCga(files, config, iconBuf);
    await fs.promises.writeFile(save + '.cga', buf);
    return true;
}

// --- 工具 ---

interface IAppFile {
    'path': string;
    'data': Buffer;
    'text': boolean;
}

interface ICgaFile {
    'b': string;
    'e': string;
    's': number;
    't': 0 | 1;
}

interface ICgaBlock {
    'l': number;
    'n': string;
    'o': number;
}

interface ICgaManifest {
    'b': Record<string, ICgaBlock>;
    'f': Record<string, ICgaFile>;
}

interface ICgaEncryptedBlock {
    'data': Buffer;
    'id': string;
    'nonce': Buffer;
}

/**
 * --- 收集应用包文件并完成文本预处理 ---
 * @param files 文件列表
 * @param base 当前磁盘目录
 * @param path 当前包内目录
 */
async function collectAppFiles(files: IAppFile[], base: string, path: string = ''): Promise<void> {
    const list = await fs.promises.readdir(base);
    list.sort();
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(`${base}/${item}`);
            if (stat.isDirectory()) {
                await collectAppFiles(files, `${base}/${item}`, `${path}/${item}`);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.scss') || (item === 'info.md')) {
                continue;
            }
            let name = item;
            let data = await fs.promises.readFile(`${base}/${item}`);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                data = Buffer.from(lTool.purify(data.toString()));
            }
            else if (item.endsWith('.js') || item.endsWith('.js.map')) {
                if (!item.endsWith('.pack.js')) {
                    continue;
                }
                name = item.slice(0, -7) + 'js';
            }
            else if (item.endsWith('.css')) {
                const result = cs.minify(data.toString());
                data = Buffer.from(result.styles ?? '');
            }
            const filePath = `${path}/${name}`;
            files.push({
                'path': filePath,
                'data': data,
                'text': cgaTextExts.has(getExt(name)),
            });
        }
        catch {
            continue;
        }
    }
}

/**
 * --- 生成应用加密包 ---
 * @param files 应用文件列表
 * @param config 应用配置
 * @param icon 应用图标
 */
async function buildCga(files: IAppFile[], config: Record<string, any>, icon: Buffer): Promise<Buffer> {
    const packageId = crypto.randomBytes(16);
    const salt = crypto.randomBytes(32);
    const seed = crypto.randomBytes(32);
    const maskedSeed = maskCgaSeed(seed, salt, packageId);
    const key = deriveCgaKey(seed, salt, packageId);
    const groups = createCgaGroups(files, config);
    shuffle(groups);

    const manifest: ICgaManifest = {
        'b': {},
        'f': {},
    };
    const blocks: ICgaEncryptedBlock[] = [];
    for (const group of groups) {
        const blockId = crypto.randomBytes(12).toString('hex');
        const blockZip = new zip();
        for (const file of group) {
            const entryId = crypto.randomBytes(12).toString('hex');
            blockZip.file(entryId, file.data, {
                'date': new Date(0),
            });
            manifest.f[file.path] = {
                'b': blockId,
                'e': entryId,
                's': file.data.length,
                't': file.text ? 1 : 0,
            };
        }
        const blockData = await blockZip.generateAsync({
            'type': 'nodebuffer',
            'compression': 'DEFLATE',
            'compressionOptions': {
                'level': 9,
            },
        });
        const nonce = crypto.randomBytes(12);
        blocks.push({
            'data': encryptCga(blockData, key, nonce, getCgaAad(packageId, blockId)),
            'id': blockId,
            'nonce': nonce,
        });
    }

    let offset = 0;
    for (const block of blocks) {
        manifest.b[block.id] = {
            'l': block.data.length,
            'n': block.nonce.toString('base64'),
            'o': offset,
        };
        offset += block.data.length;
    }
    const manifestNonce = crypto.randomBytes(12);
    const manifestData = encryptCga(
        Buffer.from(JSON.stringify(manifest)), key, manifestNonce, getCgaAad(packageId, 'manifest')
    );
    const header = Buffer.alloc(cgaHeaderLength);
    cgaMagic.copy(header, 0);
    header.writeUInt8(cgaVersion, 5);
    header.writeUInt32BE(icon.length, 6);
    header.writeUInt32BE(manifestData.length, 10);
    packageId.copy(header, 14);
    salt.copy(header, 30);
    maskedSeed.copy(header, 62);
    manifestNonce.copy(header, 94);
    return Buffer.concat([header, icon, manifestData, ...blocks.map((item) => item.data)]);
}

/**
 * --- 按启动资源和目标大小划分应用文件块 ---
 * @param files 应用文件列表
 * @param config 应用配置
 */
function createCgaGroups(files: IAppFile[], config: Record<string, any>): IAppFile[][] {
    const startupPaths = new Set(['/app.js', '/config.json']);
    if (typeof config.style === 'string') {
        startupPaths.add(normalizeCgaPath(`${config.style}.css`));
    }
    if ((config.locales !== null) && (typeof config.locales === 'object')) {
        for (let path of Object.keys(config.locales)) {
            if (!path.endsWith('.json')) {
                path += '.json';
            }
            startupPaths.add(normalizeCgaPath(path));
        }
    }
    const startup: IAppFile[] = [];
    const rest: IAppFile[] = [];
    for (const file of files) {
        (startupPaths.has(file.path) ? startup : rest).push(file);
    }
    rest.sort((a, b) => a.path.localeCompare(b.path));
    const groups: IAppFile[][] = startup.length ? [startup] : [];
    let group: IAppFile[] = [];
    let size = 0;
    for (const file of rest) {
        if ((file.data.length >= cgaBlockSize) || (size + file.data.length > cgaBlockSize)) {
            if (group.length) {
                groups.push(group);
                group = [];
                size = 0;
            }
            if (file.data.length >= cgaBlockSize) {
                groups.push([file]);
                continue;
            }
        }
        group.push(file);
        size += file.data.length;
    }
    if (group.length) {
        groups.push(group);
    }
    return groups;
}

/**
 * --- 对应用密钥种子做包级打散 ---
 * @param seed 原始种子
 * @param salt 随机盐
 * @param packageId 包 ID
 */
function maskCgaSeed(seed: Buffer, salt: Buffer, packageId: Buffer): Buffer {
    const masked = Buffer.alloc(seed.length);
    const shift = packageId[0] % seed.length;
    for (let i = 0; i < seed.length; ++i) {
        masked[i] = seed[(i + shift) % seed.length] ^ salt[i]
            ^ packageId[i % packageId.length] ^ ((i * 29 + 17) & 0xff);
    }
    return masked;
}

/**
 * --- 派生应用内容加密密钥 ---
 * @param seed 包级随机种子
 * @param salt 随机盐
 * @param packageId 包 ID
 */
function deriveCgaKey(seed: Buffer, salt: Buffer, packageId: Buffer): Buffer {
    return crypto.createHash('sha256').update(Buffer.concat([seed, salt, packageId, cgaKeyContext])).digest();
}

/**
 * --- AES-256-GCM 加密并将认证标签附加到密文末尾 ---
 * @param data 明文
 * @param key 密钥
 * @param nonce 随机数
 * @param aad 附加认证数据
 */
function encryptCga(data: Buffer, key: Buffer, nonce: Buffer, aad: Buffer): Buffer {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
    cipher.setAAD(aad);
    return Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()]);
}

/**
 * --- 获取 CGA 加密块的附加认证数据 ---
 * @param packageId 包 ID
 * @param name 数据块名
 */
function getCgaAad(packageId: Buffer, name: string): Buffer {
    return Buffer.concat([packageId, Buffer.from(name)]);
}

/**
 * --- 获取文件扩展名 ---
 * @param path 文件路径
 */
function getExt(path: string): string {
    const index = path.lastIndexOf('.');
    return index === -1 ? '' : path.slice(index + 1).toLowerCase();
}

/**
 * --- 将应用资源路径标准化为以 / 开头 ---
 * @param path 应用资源路径
 */
function normalizeCgaPath(path: string): string {
    return '/' + path.replace(/^\/+/, '');
}

/**
 * --- 使用安全随机数打乱数组 ---
 * @param list 数组
 */
function shuffle<T>(list: T[]): void {
    for (let i = list.length - 1; i > 0; --i) {
        const index = crypto.randomInt(i + 1);
        [list[i], list[index]] = [list[index], list[i]];
    }
}

/**
 * --- 添加包含 config.json 的包文件到 zip ---
 * @param zipo zip 对象
 * @param base 包含 config 的路径，不以 / 结尾
 * @param path zip 中的路径基，不以 / 结尾
 */
async function addFile(zipo: zip, base: string = '', path: string = ''): Promise<void> {
    if (path) {
        zipo.file(path, null, {
            'dir': true,
            'date': new Date(0),
        });
    }
    const list = await fs.promises.readdir(base);
    list.sort();
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.scss') || (item === 'info.md')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                // --- 为了去除 html 中的空白和注释 ---
                zipo.file(path + (path ? '/' : '') + item, lTool.purify(buf.toString()), {
                    'date': new Date(0),
                });
            }
            else if (item.endsWith('.js') || item.endsWith('.js.map')) {
                if (!item.endsWith('.pack.js')) {
                    continue;
                }
                let code = buf.toString();
                zipo.file(path + (path ? '/' : '') + item.slice(0, -7) + 'js', code, {
                    'date': new Date(0),
                });
            }
            else if (item.endsWith('.css')) {
                // --- 压缩 css ---
                const rtn = cs.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.styles ?? '', {
                    'date': new Date(0),
                });
            }
            else {
                zipo.file(path + (path ? '/' : '') + item, buf, {
                    'date': new Date(0),
                });
            }
        }
        catch {
            continue;
        }
    }
}
