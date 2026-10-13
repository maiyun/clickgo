import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const entry = process.argv[2] ? pathToFileURL(resolve(process.argv[2])) : new URL('../../lib/fs.js', import.meta.url);
const api = await import(entry);
const tool = await import(new URL('./tool.js', entry));
const root = await mkdtemp(join(tmpdir(), 'clickgo-native-fs-'));
const virtual = path => tool.parsePath(path);
try {
    const first = virtual(join(root, 'first'));
    const copy = virtual(join(root, 'copy'));
    const moved = virtual(join(root, 'moved'));
    assert.equal(tool.formatPath(virtual(root)), root);
    assert.equal(await api.putContent(first, 'abcdef', { encoding: 'utf8' }), true);
    assert.equal(await api.getContent(first, { encoding: 'utf8' }), 'abcdef');
    assert.deepEqual(await api.getContent(first, {}), Buffer.from('abcdef'));
    assert.deepEqual(await api.getContent(first, { start: 1, end: 3 }), Buffer.from('bcd'));
    assert.equal(await api.getContent(virtual(join(root, 'missing')), {}), null);
    assert.equal((await api.stats(first)).isFile, true);
    assert.equal(await api.stats(virtual(join(root, 'missing'))), null);
    assert.equal(await api.copyFile(first, copy), true);
    assert.equal(await api.rename(copy, moved), true);
    assert.equal(await api.getContent(moved, { encoding: 'utf8' }), 'abcdef');
    assert.deepEqual((await api.readDir(virtual(root))).map(item => item.name).sort(), ['first', 'moved']);
    assert.equal(await api.chmod(first, 0o600), true);
    if (process.platform !== 'win32') {
        const link = virtual(join(root, 'link'));
        assert.equal(await api.symlink(first, link, 'file'), true);
        assert.equal((await api.stats(link)).isSymbolicLink, true);
        assert.equal(await api.readLink(link), tool.formatPath(first));
        assert.equal(await api.unlink(link), true);
    }
    const empty = join(root, 'empty');
    await mkdir(empty);
    assert.equal(await api.mkdir(virtual(empty), 0o700), true);
    assert.equal(await api.rmdir(virtual(empty)), true);
    assert.equal(await api.unlink(first), true);
    assert.equal(await api.unlink(moved), true);
    await api.refreshDrives();
    await tool.sleep(0);
    console.log('Native public file/path adapters, ranged reads, metadata, links, directory and write operations passed.');
}
finally {
    await rm(root, { recursive: true, force: true });
}
