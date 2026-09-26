// Run after TypeScript/Sass compilation and `node dist/pack.js`: node test/rtl-archive.mjs
import assert from 'node:assert/strict';
import { createDecipheriv, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import CleanCSS from 'clean-css';
import JSZip from 'jszip';
import ts from 'typescript';

/** --- ClickGo 的固定内置语言顺序 --- */
const codes = [
    'sc', 'tc', 'ja', 'ko', 'th', 'vi', 'ar', 'id',
    'en', 'es', 'de', 'fr', 'pt', 'ru', 'it', 'tr',
];
/** --- 包含 localeData 的全部内置控件 --- */
const localeControls = [
    'arteditor', 'calendar', 'captcha', 'date', 'datepanel', 'daterange', 'empty', 'jodit', 'label',
    'levelselect', 'map', 'monaco', 'number', 'page', 'palette', 'property', 'select', 'text', 'tuieditor',
];
/** --- 合并到 common.cgc 的多语言控件 --- */
const commonControls = new Set([
    'calendar', 'date', 'datepanel', 'daterange', 'empty', 'label', 'levelselect', 'number', 'palette',
    'select', 'text',
]);
/** --- 全部内置主题 --- */
const themes = ['admin', 'cyber', 'dark', 'light', 'modern', 'modern-light', 'compact-dark'];
/** --- CGA 格式常量，与编译器的公开包格式保持一致 --- */
const cgaHeaderLength = 106;
const cgaKeyContext = Buffer.from('ClickGo/Application/Package');
/** --- 已解压的 ZIP 归档缓存 --- */
const zipCache = new Map();

/**
 * --- 生成归档不存在或过期时的统一错误信息 ---
 * @param archive 归档路径
 * @param detail 失败原因
 * @returns 可操作的错误信息
 */
function archiveError(archive, detail) {
    return `${archive} is missing or stale: ${detail}. Build TypeScript and Sass, run node dist/pack.js, then rerun this test.`;
}

/**
 * --- 读取项目文件 ---
 * @param path 相对项目根目录的路径
 * @returns 文件内容
 */
async function readProjectFile(path) {
    return await readFile(new URL(`../${path}`, import.meta.url));
}

/**
 * --- 读取必要归档，并把不存在转换为清晰诊断 ---
 * @param path 归档路径
 * @returns 归档内容
 */
async function readArchive(path) {
    try {
        return await readProjectFile(path);
    }
    catch (error) {
        if (error?.code === 'ENOENT') {
            throw new Error(archiveError(path, 'the archive file does not exist'));
        }
        throw error;
    }
}

/**
 * --- 加载 cgc/cgt ZIP 归档 ---
 * @param path 归档路径
 * @returns JSZip 实例
 */
async function loadZipArchive(path) {
    if (zipCache.has(path)) {
        return zipCache.get(path);
    }
    let zip;
    try {
        zip = await JSZip.loadAsync(await readArchive(path));
    }
    catch (error) {
        throw new Error(archiveError(path, `the archive cannot be decoded (${error.message})`));
    }
    zipCache.set(path, zip);
    return zip;
}

/**
 * --- 读取 cgc/cgt 内文件 ---
 * @param archive 归档路径
 * @param entry 包内路径
 * @returns 文件内容
 */
async function readZipText(archive, entry) {
    const zip = await loadZipArchive(archive);
    const file = zip.file(entry);
    assert.ok(file, archiveError(archive, `required entry ${entry} is absent`));
    return await file.async('string');
}

/**
 * --- 恢复 CGA 文件头中打散的密钥种子 ---
 * @param maskedSeed 打散后的种子
 * @param salt 随机盐
 * @param packageId 包 ID
 * @returns 原始密钥种子
 */
function unmaskCgaSeed(maskedSeed, salt, packageId) {
    const seed = Buffer.alloc(maskedSeed.length);
    const shift = packageId[0] % seed.length;
    for (let i = 0; i < seed.length; ++i) {
        const sourceIndex = (i + shift) % seed.length;
        seed[sourceIndex] = maskedSeed[i] ^ salt[i]
            ^ packageId[i % packageId.length] ^ ((i * 29 + 17) & 0xff);
    }
    return seed;
}

/**
 * --- 解密带认证标签的 CGA AES-GCM 数据块 ---
 * @param data 密文和末尾认证标签
 * @param key 解密密钥
 * @param nonce 随机数
 * @param aad 附加认证数据
 * @returns 明文
 */
function decryptCga(data, key, nonce, aad) {
    assert.ok(data.length >= 16, 'encrypted CGA data must include an authentication tag');
    const decipher = createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAAD(aad);
    decipher.setAuthTag(data.subarray(-16));
    return Buffer.concat([decipher.update(data.subarray(0, -16)), decipher.final()]);
}

/**
 * --- 加载 CGA 清单并提供按路径读取能力 ---
 * @param path CGA 归档路径
 * @returns CGA 读取器
 */
async function loadCgaArchive(path) {
    const data = await readArchive(path);
    try {
        assert.ok(data.length >= cgaHeaderLength, 'file is shorter than the CGA header');
        assert.equal(data.subarray(0, 5).toString(), '-CGA-', 'CGA magic is invalid');
        assert.equal(data.readUInt8(5), 1, 'CGA version is unsupported');

        const iconLength = data.readUInt32BE(6);
        const manifestLength = data.readUInt32BE(10);
        const packageId = data.subarray(14, 30);
        const salt = data.subarray(30, 62);
        const maskedSeed = data.subarray(62, 94);
        const manifestNonce = data.subarray(94, cgaHeaderLength);
        const manifestOffset = cgaHeaderLength + iconLength;
        const blockOffset = manifestOffset + manifestLength;
        assert.ok(blockOffset <= data.length, 'CGA manifest exceeds the archive size');

        const seed = unmaskCgaSeed(maskedSeed, salt, packageId);
        const key = createHash('sha256').update(Buffer.concat([
            seed, salt, packageId, cgaKeyContext,
        ])).digest();
        const manifestData = decryptCga(
            data.subarray(manifestOffset, blockOffset),
            key,
            manifestNonce,
            Buffer.concat([packageId, Buffer.from('manifest')]),
        );
        const manifest = JSON.parse(manifestData.toString());
        const blocks = new Map();

        return {
            /**
             * --- 从加密应用包读取单个文件 ---
             * @param entryPath 包内绝对路径
             * @returns 解密后的文件内容
             */
            async read(entryPath) {
                const entry = manifest.f?.[entryPath];
                assert.ok(entry, archiveError(path, `required entry ${entryPath} is absent`));
                let blockZip = blocks.get(entry.b);
                if (!blockZip) {
                    const block = manifest.b?.[entry.b];
                    assert.ok(block, `manifest block ${entry.b} is absent`);
                    const start = blockOffset + block.o;
                    const end = start + block.l;
                    assert.ok((start >= blockOffset) && (end <= data.length), `manifest block ${entry.b} exceeds the archive size`);
                    const blockData = decryptCga(
                        data.subarray(start, end),
                        key,
                        Buffer.from(block.n, 'base64'),
                        Buffer.concat([packageId, Buffer.from(entry.b)]),
                    );
                    blockZip = await JSZip.loadAsync(blockData);
                    blocks.set(entry.b, blockZip);
                }
                const file = blockZip.file(entry.e);
                assert.ok(file, `manifest entry ${entryPath} points to a missing file`);
                return await file.async('nodebuffer');
            },
        };
    }
    catch (error) {
        if (error.message.includes('is missing or stale')) {
            throw error;
        }
        throw new Error(archiveError(path, `the encrypted package cannot be decoded (${error.message})`));
    }
}

/**
 * --- 取得 AST 静态属性名 ---
 * @param name 属性名节点
 * @returns 静态名称；动态属性返回空字符串
 */
function getPropertyName(name) {
    if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
        return name.text;
    }
    return '';
}

/**
 * --- 将只含静态字符串的对象字面量转换为普通对象 ---
 * @param node 对象字面量节点
 * @param label 诊断标签
 * @returns 普通对象
 */
function readStaticObject(node, label) {
    const result = {};
    for (const property of node.properties) {
        assert.equal(ts.isPropertyAssignment(property), true, `${label} must contain only static properties`);
        const name = getPropertyName(property.name);
        assert.notEqual(name, '', `${label} contains a dynamic property name`);
        assert.equal(Object.hasOwn(result, name), false, `${label} repeats property ${name}`);
        const value = property.initializer;
        if (ts.isObjectLiteralExpression(value)) {
            result[name] = readStaticObject(value, `${label}.${name}`);
            continue;
        }
        const isText = ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value);
        assert.equal(isText, true, `${label}.${name} must be a static string`);
        result[name] = value.text;
    }
    return result;
}

/**
 * --- 从控件源码或打包 JS 中读取 localeData ---
 * @param code TypeScript 或 JavaScript 源码
 * @param label 诊断标签
 * @param scriptKind 脚本类型
 * @returns localeData 普通对象
 */
function readLocaleData(code, label, scriptKind) {
    const source = ts.createSourceFile(label, code, ts.ScriptTarget.Latest, true, scriptKind);
    const candidates = [];
    const visit = (node) => {
        if (
            ts.isPropertyDeclaration(node)
            && (getPropertyName(node.name) === 'localeData')
            && ts.isObjectLiteralExpression(node.initializer)
        ) {
            candidates.push(node.initializer);
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    assert.equal(candidates.length, 1, `${label} must contain exactly one static localeData table`);
    return readStaticObject(candidates[0], `${label} localeData`);
}

/**
 * --- 断言归档代码与本地 pack 产物完全一致 ---
 * @param archive cgc 路径
 * @param control 控件名
 * @returns 归档代码
 */
async function assertControlCodeCurrent(archive, control) {
    const archived = await readZipText(archive, `${control}/code.js`);
    let generated;
    try {
        generated = (await readProjectFile(`dist/sources/control/${control}/code.pack.js`)).toString();
    }
    catch (error) {
        if (error?.code === 'ENOENT') {
            throw new Error(archiveError(archive, `generated prerequisite ${control}/code.pack.js is absent`));
        }
        throw error;
    }
    assert.equal(archived, generated, archiveError(archive, `${control}/code.js differs from code.pack.js`));
    return archived;
}

/**
 * --- 断言归档 CSS 与本地编译 CSS 完全一致 ---
 * @param archive cgc/cgt 路径
 * @param entry 归档内 CSS 路径
 * @param sourcePath 本地生成 CSS 路径
 * @returns 归档 CSS
 */
async function assertCssCurrent(archive, entry, sourcePath) {
    const archived = await readZipText(archive, entry);
    const source = (await readProjectFile(sourcePath)).toString();
    const result = new CleanCSS().minify(source);
    assert.deepEqual(result.errors, [], `${sourcePath} must be valid CSS`);
    assert.equal(archived, result.styles, archiveError(archive, `${entry} differs from ${sourcePath}`));
    return archived;
}

// --- task.cga 必须包含与源码一致的 16 个语言包 ---
const taskArchivePath = 'dist/app/task.cga';
const taskArchive = await loadCgaArchive(taskArchivePath);
const archivedTaskConfigText = (await taskArchive.read('/config.json')).toString();
const sourceTaskConfigText = (await readProjectFile('dist/app/task/config.json')).toString();
const archivedTaskConfig = JSON.parse(archivedTaskConfigText);
const sourceTaskConfig = JSON.parse(sourceTaskConfigText);
assert.deepEqual(archivedTaskConfig, sourceTaskConfig, archiveError(taskArchivePath, '/config.json differs from its source'));
assert.deepEqual(Object.values(archivedTaskConfig.locales), codes, archiveError(taskArchivePath, 'its locale registry is not the agreed 16 locales'));

const archivedTaskApp = (await taskArchive.read('/app.js')).toString();
const generatedTaskApp = (await readProjectFile('dist/app/task/app.pack.js')).toString();
assert.equal(archivedTaskApp, generatedTaskApp, archiveError(taskArchivePath, '/app.js differs from app.pack.js'));

let taskLocaleKeys;
for (const code of codes) {
    const entry = `/locale/${code}.json`;
    const archivedText = (await taskArchive.read(entry)).toString();
    const sourceText = (await readProjectFile(`dist/app/task/locale/${code}.json`)).toString();
    const archived = JSON.parse(archivedText);
    const source = JSON.parse(sourceText);
    assert.deepEqual(archived, source, archiveError(taskArchivePath, `${entry} differs from its source`));
    taskLocaleKeys ??= Object.keys(archived).sort();
    assert.deepEqual(Object.keys(archived).sort(), taskLocaleKeys, archiveError(taskArchivePath, `${entry} has incomplete translation keys`));
    if (code === 'ar') {
        assert.match(JSON.stringify(archived), /[\u0600-\u06ff]/, archiveError(taskArchivePath, `${entry} has no Arabic text`));
    }
}

// --- 19 个控件的归档语言表必须与 TypeScript 源码一致 ---
const archivedControlCode = new Map();
for (const control of localeControls) {
    const packageName = commonControls.has(control) ? 'common' : control;
    const archive = `dist/control/${packageName}.cgc`;
    const archivedCode = await assertControlCodeCurrent(archive, control);
    archivedControlCode.set(control, archivedCode);
    const sourceCode = (await readProjectFile(`dist/sources/control/${control}/code.ts`)).toString();
    const archivedLocale = readLocaleData(archivedCode, `${archive}:${control}/code.js`, ts.ScriptKind.JS);
    const sourceLocale = readLocaleData(sourceCode, `dist/sources/control/${control}/code.ts`, ts.ScriptKind.TS);
    assert.deepEqual(
        Object.keys(archivedLocale).sort(),
        [...codes].sort(),
        archiveError(archive, `${control}/code.js does not contain exactly 16 locales`),
    );
    assert.deepEqual(archivedLocale, sourceLocale, archiveError(archive, `${control}/code.js localeData differs from TypeScript source`));
}

// --- 关键滚动与编辑器方向边界必须进入 cgc ---
const rtlCodeChecks = [
    ['dist/control/common.cgc', 'flow', ['getScrollInlineOffset', 'setScrollInlineOffset']],
    ['dist/control/common.cgc', 'vflow', ['isRtl']],
    ['dist/control/common.cgc', 'scroll', ['isRtl', 'logicalOffsetPx']],
    ['dist/control/common.cgc', 'text', ['getScrollInlineOffset', 'setScrollInlineOffset']],
    ['dist/control/common.cgc', 'select', ['getScrollLeft', 'setScrollLeft']],
    ['dist/control/common.cgc', 'tab', ['getScrollInlineOffset', 'setScrollInlineOffset']],
    ['dist/control/common.cgc', 'toolbar', ['getScrollInlineOffset', 'setScrollLeft']],
    ['dist/control/common.cgc', 'date', ['autoPosition', 'autoScroll']],
    ['dist/control/common.cgc', 'daterange', ['autoPosition', 'autoScroll']],
    ['dist/control/common.cgc', 'dock-group', ['isRtl', 'floatMaxWidth']],
    ['dist/control/table.cgc', 'table', ['localeDirection', 'getScrollLeft', 'setScrollInlineOffset']],
    ['dist/control/desc.cgc', 'desc', ['getScrollInlineOffset', 'setScrollInlineOffset']],
    ['dist/control/iconview.cgc', 'iconview', ['isRtl']],
    ['dist/control/swiper.cgc', 'swiper', ['isRtl', 'directionVersion']],
    ['dist/control/jodit.cgc', 'jodit', ['_refreshDirection', 'direction', 'rtl']],
    ['dist/control/tuieditor.cgc', 'tuieditor', ['_refreshDirection', 'ProseMirror', 'rtl']],
    ['dist/control/monaco.cgc', 'monaco', ['documentElement.dir', 'ltr']],
];
for (const [archive, control, tokens] of rtlCodeChecks) {
    const archivedCode = archivedControlCode.get(control) ?? await assertControlCodeCurrent(archive, control);
    for (const token of tokens) {
        assert.ok(archivedCode.includes(token), archiveError(archive, `${control}/code.js lacks RTL marker ${token}`));
    }
}

// --- 控件 RTL 样式必须进入 cgc，并与 Sass 生成 CSS 一致 ---
const rtlStyleChecks = [
    ['dist/control/common.cgc', 'button/style.css', 'dist/sources/control/button/style.css', [':dir(rtl)', 'border-inline-end']],
    ['dist/control/common.cgc', 'list/style.css', 'dist/sources/control/list/style.css', [':dir(rtl)', 'margin-inline-end']],
    ['dist/control/common.cgc', 'tab/style.css', 'dist/sources/control/tab/style.css', ['border-inline-start-width', 'border-inline-end-width']],
    ['dist/control/common.cgc', 'timeline/style.css', 'dist/sources/control/timeline/style.css', ['border-inline-start']],
    ['dist/control/common.cgc', 'dock/style.css', 'dist/sources/control/dock/style.css', [':dir(rtl)', 'border-inline-end']],
    ['dist/control/common.cgc', 'dock-group/style.css', 'dist/sources/control/dock-group/style.css', ['inset-inline-start', 'max-width:calc(100vw - 40px)']],
    ['dist/control/table.cgc', 'table/style.css', 'dist/sources/control/table/style.css', ['border-inline-end', 'inset-inline-end']],
    ['dist/control/xterm.cgc', 'xterm/style.css', 'dist/sources/control/xterm/style.css', ['direction:ltr']],
];
for (const [archive, entry, sourcePath, tokens] of rtlStyleChecks) {
    const archivedCss = await assertCssCurrent(archive, entry, sourcePath);
    for (const token of tokens) {
        assert.ok(archivedCss.includes(token), archiveError(archive, `${entry} lacks RTL/LTR boundary marker ${token}`));
    }
}

// --- 全部主题必须全部包含最新的逻辑方向样式 ---
for (const theme of themes) {
    const archive = `dist/theme/${theme}.cgt`;
    const archivedConfig = JSON.parse(await readZipText(archive, 'config.json'));
    const sourceConfig = JSON.parse((await readProjectFile(`dist/sources/theme/${theme}/config.json`)).toString());
    assert.deepEqual(archivedConfig, sourceConfig, archiveError(archive, 'config.json differs from its source'));
    const archivedCss = await assertCssCurrent(
        archive,
        'style.css',
        `dist/sources/theme/${theme}/style.css`,
    );
    assert.match(
        archivedCss,
        /(?:border|inset|margin|padding)-inline/,
        archiveError(archive, 'style.css has no logical inline-direction properties'),
    );
}

console.log(`Archive check passed: task.cga has 16 locales, 19 control locale tables are current, and RTL output is present in all ${themes.length} themes.`);
