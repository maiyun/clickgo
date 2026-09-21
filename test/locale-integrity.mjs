// Run: node --experimental-vm-modules test/locale-integrity.mjs
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { SourceTextModule } from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

/** --- ClickGo 的固定内置语言顺序 --- */
const codes = [
    'sc', 'tc', 'ja', 'ko', 'th', 'vi', 'ar', 'id',
    'en', 'es', 'de', 'fr', 'pt', 'ru', 'it', 'tr',
];

/** --- 仍使用问号占位符、会在运行时被替换的语言键 --- */
const placeholderKeys = new Set([
    'dist/lib/fs.ts:apply-unmount',
    'dist/lib/storage.ts:sure-clear',
    'dist/sources/control/page/code.ts:total-of',
]);

/**
 * --- 获取对象字面量的静态属性名 ---
 * @param property TypeScript 属性节点
 * @returns 属性名；动态属性返回空字符串
 */
function getPropertyName(property) {
    if (!ts.isPropertyAssignment(property) || !property.name) {
        return '';
    }
    if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) || ts.isNumericLiteral(property.name)) {
        return property.name.text;
    }
    return '';
}

/**
 * --- 从对象字面量取静态属性 ---
 * @param object 对象字面量
 * @param key 属性名
 * @returns 属性初始化节点
 */
function getProperty(object, key) {
    return object.properties.find((property) => getPropertyName(property) === key)?.initializer;
}

/**
 * --- 断言翻译值是非空静态字符串 ---
 * @param value 翻译的 AST 节点
 * @param message 失败信息
 */
function assertText(value, message) {
    const isText = ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value);
    assert.equal(isText, true, `${message} must be a static string literal`);
    assert.notEqual(value.text.trim(), '', `${message} must not be empty`);
}

/**
 * --- 从 TypeScript 源码收集含英文条目的语言表 ---
 * @param path TypeScript 文件路径
 * @returns 语言表及其行号
 */
async function collectLocaleTables(path) {
    const source = ts.createSourceFile(path, await readFile(path, 'utf8'), ts.ScriptTarget.Latest, true);
    const tables = [];
    const visit = (node) => {
        if (ts.isObjectLiteralExpression(node) && getProperty(node, 'en')) {
            const keys = node.properties.map(getPropertyName);
            if (codes.every((code) => keys.includes(code))) {
                tables.push({
                    'node': node,
                    'line': source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
                });
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return tables;
}

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
for (const name of ['window', 'document', 'navigator']) {
    Object.defineProperty(globalThis, name, {
        'configurable': true,
        'value': dom.window[name],
    });
}

// The language registry is executed from TypeScript source, not generated JavaScript.
const toolSource = await readFile(new URL('../dist/lib/tool.ts', import.meta.url), 'utf8');
const toolModule = new SourceTextModule(ts.transpileModule(toolSource, {
    'compilerOptions': {
        'target': ts.ScriptTarget.ES2022,
        'module': ts.ModuleKind.ESNext,
    },
}).outputText);
await toolModule.link(() => {
    throw new Error('tool.ts must not import runtime modules');
});
await toolModule.evaluate();

const { lang } = toolModule.namespace;
assert.deepEqual(lang.codes, codes, 'language codes must retain all 16 supported locales');
assert.equal(lang.names.length, codes.length, 'every locale must have a display name');
assert.equal(new Set(lang.names).size, codes.length, 'language display names must be unique');
assert.deepEqual(Object.keys(lang.tags).sort(), [...codes].sort(), 'every locale must have an HTML lang tag');
for (const code of codes) {
    assert.notEqual(lang.names[lang.codes.indexOf(code)].trim(), '', `${code} must have a non-empty display name`);
    assert.notEqual(lang.getTag(code).trim(), '', `${code} must resolve to a non-empty HTML lang tag`);
    assert.equal(lang.getDirection(code), code === 'ar' ? 'rtl' : 'ltr', `${code} must resolve to its writing direction`);
}
assert.equal(lang.getDirection('ar-EG'), 'rtl', 'Arabic HTML tags must resolve to RTL');
assert.equal(lang.getDirection('en-US'), 'ltr', 'non-Arabic HTML tags must resolve to LTR');

const controlRoot = new URL('../dist/sources/control/', import.meta.url);
const controlNames = (await readdir(controlRoot, { 'withFileTypes': true }))
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
const controlSources = [];
for (const name of controlNames) {
    const path = `dist/sources/control/${name}/code.ts`;
    try {
        await access(path);
        controlSources.push(path);
    }
    catch {}
}
const localeSources = [
    'dist/lib/form.ts',
    'dist/lib/fs.ts',
    'dist/lib/storage.ts',
    'dist/lib/task.ts',
    ...controlSources,
];

const tables = [];
for (const path of localeSources) {
    for (const table of await collectLocaleTables(path)) {
        tables.push({ ...table, path });
    }
}
assert.equal(tables.length, 24, 'all 24 built-in TypeScript locale tables must be present');
for (const { node, path, line } of tables) {
    const tableCodes = node.properties.map(getPropertyName);
    assert.deepEqual([...tableCodes].sort(), [...codes].sort(), `${path}:${line} must contain exactly 16 locale entries`);
    const english = getProperty(node, 'en');
    assert.equal(ts.isObjectLiteralExpression(english), true, `${path}:${line} English locale must be an object`);
    const keys = english.properties.map(getPropertyName);
    assert.equal(new Set(keys).size, keys.length, `${path}:${line} English locale must not repeat keys`);
    for (const code of codes) {
        const localized = getProperty(node, code);
        assert.equal(ts.isObjectLiteralExpression(localized), true, `${path}:${line} ${code} locale must be an object`);
        const localizedKeys = localized.properties.map(getPropertyName);
        assert.deepEqual([...localizedKeys].sort(), [...keys].sort(), `${path}:${line} ${code} locale keys must match English`);
        for (const key of keys) {
            const localizedText = getProperty(localized, key);
            assertText(localizedText, `${path}:${line} ${code}.${key}`);
            if (placeholderKeys.has(`${path}:${key}`)) {
                assert.equal(localizedText.text.includes('?'), true, `${path}:${line} ${code}.${key} must retain its ? placeholder`);
            }
        }
    }
}

const taskConfig = JSON.parse(await readFile(new URL('../dist/app/task/config.json', import.meta.url), 'utf8'));
assert.deepEqual(Object.values(taskConfig.locales), codes, 'task app config must load all 16 locales in registry order');
for (const code of codes) {
    assert.equal(taskConfig.locales[`/package/locale/${code}`], code, `task app must map /package/locale/${code}`);
}
const englishTaskLocale = JSON.parse(await readFile(new URL('../dist/app/task/locale/en.json', import.meta.url), 'utf8'));
const taskKeys = Object.keys(englishTaskLocale).sort();
for (const code of codes) {
    const locale = JSON.parse(await readFile(new URL(`../dist/app/task/locale/${code}.json`, import.meta.url), 'utf8'));
    assert.deepEqual(Object.keys(locale).sort(), taskKeys, `task app ${code}.json keys must match en.json`);
    for (const [key, value] of Object.entries(locale)) {
        assert.equal(typeof value, 'string', `task app ${code}.json ${key} must be a string`);
        assert.notEqual(value.trim(), '', `task app ${code}.json ${key} must not be empty`);
    }
}

const demoTaskLayout = await readFile(new URL('../dist/app/demo/form/method/task/task.xml', import.meta.url), 'utf8');
const demoLocaleData = demoTaskLayout.match(/<label>Change global locale lang:<\/label>\s*<layout[^>]*>\s*<select[^>]*:data="\[([^"]+)\]"/)?.[1];
assert.ok(demoLocaleData, 'demo Library task form must retain the global locale selector');
const demoLocaleCodes = [...demoLocaleData.matchAll(/'([^']+)'/g)].map((match) => match[1]);
assert.deepEqual(demoLocaleCodes, codes, 'demo global locale selector must expose all 16 locales in registry order');

dom.window.close();
console.log('Locale registry, 24 TypeScript tables, 16 task app locale JSON files and the Demo selector are complete.');
