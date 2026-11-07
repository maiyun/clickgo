import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
const source = await readFile(process.argv[2] ?? new URL('../form/system.ts', import.meta.url), 'utf8');
const dom = new JSDOM('<body></body>');
const options = [];
const scope = { exports: {}, document: dom.window.document, window: dom.window };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, scope);
const config = { locale: 'en', 'launcher.list': [] };
const runtime = scope.exports.createSystemRuntime({
 clickgo: { modules: { vue: { createApp(value) { options.push(value); return { mount() {} }; } } } },
 lCore: { config }, lTool: { lang: { getTag: v => v, getDirection: () => 'ltr' } }, info: {}, state: {},
});
runtime.init();
const search = options.find(value => value.computed?.list).computed.list;
for (const size of [10, 1000, 10000]) {
 const items = Array.from({ length: size }, (_, i) => ({ name: i % 2 ? 'App ' + i : 'Other ' + i }));
 config['launcher.list'] = [{ name: 'Folder', list: items.slice(0, size / 2) }, ...items.slice(size / 2)];
 let normalizations = 0;
 const result = search.call({ name: { toLowerCase() { ++normalizations; return 'app'; } } });
 assert.deepEqual(Array.from(result), items.filter(item => item.name.toLowerCase().includes('app')));
 if (!process.argv[2]) assert.equal(normalizations, 1);
 console.log(`${size} entries: query normalization calls=${normalizations}; results=${result.length}`);
 assert.equal(search.call({ name: '' }), config['launcher.list']);
 items[0].name = 'APP changed';
 assert.ok(search.call({ name: 'App' }).includes(items[0]), 'renamed items must be searchable immediately');
}
dom.window.close();
