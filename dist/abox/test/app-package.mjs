import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import JSZip from 'jszip';
import ts from 'typescript';
import { createPackage } from '../package.js';
import { getMimeByPath } from '../../lib/tool.js';

let opened = 0;
const io = {
    getZip: async blob => {
        ++opened;
        const zip = await JSZip.loadAsync(await blob.arrayBuffer());
        return { getContent: async (path, type) => zip.file(path.replace(/^\//, ''))?.async(type) ?? null };
    },
    blob2DataUrl: async blob => `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`,
    getMimeByPath,
};
const source = await readFile(new URL('../../lib/core.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('core.ts', source, ts.ScriptTarget.Latest, true);
const readAppSource = tree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'readApp');
const boundary = {};
const boundarySource = await readFile(new URL('../../lib/core/package.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(boundarySource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: boundary, require: name => ({
    '../zip.js': { get: io.getZip },
    '../tool.js': { blob2DataUrl: io.blob2DataUrl, getMimeByPath },
    '../../abox/package.js': { createPackage },
})[name] });
const api = {};
vm.runInNewContext(ts.transpileModule(readAppSource.getText(tree), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: api, JSON, createPackage: boundary.createPackage });

for (const name of ['demo', 'task']) {
    const bytes = await readFile(new URL(`../../app/${name}.cga`, import.meta.url));
    const expected = JSON.parse(await readFile(new URL(`../../app/${name}/config.json`, import.meta.url), 'utf8'));
    const app = await api.readApp(new Blob([bytes]));
    assert.notEqual(app, false);
    assert.equal(app.type, 'app');
    assert.equal(app.config.name, expected.name);
    assert.equal(app.config.id, expected.id);
    const archive = app.package;
    assert.equal(archive.stats('/').isDirectory, true);
    assert.equal(archive.stats('/config.json').isFile, true);
    assert.ok(archive.readDir('/').some(entry => entry.name === 'config.json' && entry.isFile));
    assert.equal(await archive.getContent('/missing-file'), null);
    assert.equal(archive.stats('/missing-file'), null);
    assert.deepEqual(archive.readDir('/missing-directory'), []);
    const config = await archive.getContent('/config.json');
    assert.deepEqual(JSON.parse(config), app.config);
    assert.equal(await archive.getContent('config.json'), config);
    archive.clear();
    const previous = opened;
    const results = await Promise.all(Array.from({ length: 4 }, () => archive.getContent('/config.json')));
    assert.ok(results.every(value => value === config));
    assert.equal(opened - previous, 1, 'concurrent reads share one decoded block after cache invalidation');

    for (const corrupt of [
        new Uint8Array(),
        new Uint8Array(bytes.subarray(0, 100)),
        Uint8Array.from(bytes, (value, index) => index === 0 || index === 5 ? 0xff : value),
        Uint8Array.from(bytes, (value, index) => index >= 10 && index < 14 ? 0xff : value),
    ]) {
        assert.equal(await api.readApp(new Blob([corrupt])), false);
    }
    const tampered = Uint8Array.from(bytes);
    const header = new DataView(tampered.buffer);
    tampered[106 + header.getUint32(6)] ^= 0xff;
    assert.equal(await api.readApp(new Blob([tampered])), false, 'invalid authenticated manifest is rejected');
    const failed = await createPackage(new Blob([bytes]), { ...io, getZip: async () => null });
    assert.notEqual(failed, false);
    assert.equal(await failed.package.getContent('/config.json'), null);
}
console.log('Public App loading, CGA integrity, file/directory contracts, lazy blocks, concurrent reads and cache invalidation passed.');
