import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const toolSource = new URL('../../lib/tool.ts', import.meta.url);
function sourceUrl(specifier, parent) {
    if (!specifier.startsWith('.')) throw new Error(`Unexpected runtime dependency: ${specifier}`);
    return new URL(specifier.replace(/\.js$/, '.ts'), parent);
}

export function loadTool(scope = {}) {
    const context = vm.createContext(scope);
    const modules = new Map();
    function load(url) {
        if (modules.has(url.href)) return modules.get(url.href);
        const exports = {};
        modules.set(url.href, exports);
        const code = ts.transpileModule(readFileSync(url, 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText;
        const run = vm.runInContext(`(function(exports, require) {\n${code}\n})`, context);
        run(exports, specifier => load(sourceUrl(specifier, url)));
        return exports;
    }
    return load(toolSource);
}

export async function loadSourceModule(entry = toolSource) {
    const modules = new Map();
    function load(url) {
        if (modules.has(url.href)) return modules.get(url.href);
        const code = ts.transpileModule(readFileSync(url, 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText;
        const module = new vm.SourceTextModule(code, { identifier: url.href });
        modules.set(url.href, module);
        return module;
    }
    const module = load(entry);
    await module.link((specifier, referencing) => load(sourceUrl(specifier, referencing.identifier)));
    await module.evaluate();
    return module;
}
