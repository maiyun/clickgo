// Run after compilation: node --experimental-vm-modules test/native-persistence.mjs [Native lib directory]
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as nodeFs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { SourceTextModule, SyntheticModule } from 'node:vm';

const directory = await fs.mkdtemp(path.join(tmpdir(), 'clickgo-persistence-'));
const libraries = process.argv[2] ? path.resolve(process.argv[2]) :
    fileURLToPath(new URL('../dist/test/native/lib/', import.meta.url));
let userData = directory;
let ready = true;
let available = true;
let backend = 'gnome_libsecret';
let reEncrypt = false;
let encryptionFails = false;
const encryptionKey = crypto.randomBytes(32);
const safeStorage = {
    isAsyncEncryptionAvailable: async () => available,
    getSelectedStorageBackend: () => backend,
    async encryptStringAsync(value) {
        if (encryptionFails) { return await Promise.reject(new Error('unavailable key')); }
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
        const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        return Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
    },
    async decryptStringAsync(value) {
        const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, value.subarray(0, 12));
        decipher.setAuthTag(value.subarray(12, 28));
        return { result: Buffer.concat([decipher.update(value.subarray(28)), decipher.final()]).toString('utf8'), shouldReEncrypt: reEncrypt };
    },
};
const synthetic = exports => new SyntheticModule(Object.keys(exports), function() {
    for (const [key, value] of Object.entries(exports)) {
        this.setExport(key, value);
    }
});
const load = async () => {
    const cache = new Map();
    const externals = {
        'node:fs': synthetic(nodeFs),
        'node:fs/promises': synthetic(fs),
        'node:path': synthetic(path),
        'node:crypto': synthetic(crypto),
        'electron': synthetic({ app: { getPath: () => userData, isReady: () => ready }, safeStorage }),
    };
    const module = async file => {
        if (!cache.has(file)) {
            cache.set(file, new SourceTextModule(await fs.readFile(file, 'utf8'), { identifier: file }));
        }
        return cache.get(file);
    };
    const linker = (name, current) => externals[name] ?? module(path.resolve(path.dirname(current.identifier), name));
    const storage = await module(path.join(libraries, 'storage.js'));
    await storage.link(linker);
    await storage.evaluate();
    const secret = await module(path.join(libraries, 'secret.js'));
    await secret.link(linker);
    await secret.evaluate();
    return { storage: storage.namespace, secret: secret.namespace };
};
const fileFor = (area, key) => path.join(userData, 'clickgo-native', area,
    `${crypto.createHash('sha256').update(key).digest('hex')}.dat`);
try {
    let api = await load();
    // 固定 App ID 决定持久空间，同名键与宿主及其他 App 隔离。
    const firstApp = 'net.example.first';
    const secondApp = 'net.example.second';
    assert.equal(await api.storage.set('shared-key', 'host'), true);
    assert.equal(await api.storage.set('shared-key', 'first', firstApp), true);
    assert.equal(await api.storage.set('shared-key', 'second', secondApp), true);
    assert.equal((await api.storage.get('shared-key')).value, 'host');
    assert.equal((await api.storage.get('shared-key', firstApp)).value, 'first');
    assert.equal((await api.storage.get('shared-key', secondApp)).value, 'second');
    api = await load();
    assert.equal((await api.storage.get('shared-key', firstApp)).value, 'first');
    assert.equal(await api.storage.remove('shared-key', firstApp), true);
    assert.equal(await api.storage.get('shared-key', firstApp), null);
    assert.equal((await api.storage.get('shared-key', secondApp)).value, 'second');
    for (const id of ['', '/apps/old-path.cga', '.invalid', 'has space', 'x'.repeat(129)]) {
        assert.equal(await api.storage.set('invalid-scope', true, id), false);
        assert.equal(await api.secret.get('shared-key', id), false);
    }
    assert.equal(await api.secret.set('shared-key', 'host-secret'), true);
    assert.equal(await api.secret.set('shared-key', 'first-secret', firstApp), true);
    assert.equal(await api.secret.get('shared-key', secondApp), null);
    const scopedFile = (appId) => path.join(directory, 'clickgo-native', 'apps',
        crypto.createHash('sha256').update(appId).digest('hex'), 'secret',
        `${crypto.createHash('sha256').update('shared-key').digest('hex')}.dat`);
    assert.equal(await api.secret.set('shared-key', 'second-secret', secondApp), true);
    await fs.copyFile(scopedFile(firstApp), scopedFile(secondApp));
    assert.equal(await api.secret.get('shared-key', secondApp), false, 'ciphertext is bound to its App');
    api = await load();
    assert.equal(await api.secret.get('shared-key', firstApp), 'first-secret');
    assert.equal(await api.secret.remove('shared-key', firstApp), true);
    assert.equal(await api.secret.get('shared-key'), 'host-secret');
    assert.equal(await api.storage.get('missing'), null);
    for (const value of [false, null, 0, '', { enabled: false, port: 0, nested: ['文字', null] }]) {
        assert.equal(await api.storage.set('configuration', value), true);
        const stored = await api.storage.get('configuration');
        assert.deepEqual(stored.value, value);
        api = await load();
        assert.deepEqual((await api.storage.get('configuration')).value, value, 'new module reads the saved disk value');
    }
    const source = { nested: ['before'] };
    const writing = api.storage.set('snapshot', source);
    source.nested[0] = 'after';
    assert.equal(await writing, true);
    assert.equal((await api.storage.get('snapshot')).value.nested[0], 'before');
    assert.deepEqual(await Promise.all(Array.from({ length: 20 }, (_, index) => api.storage.set('ordered', index))), Array(20).fill(true));
    assert.equal((await api.storage.get('ordered')).value, 19);
    const setting = api.storage.set('ordered', 20);
    const reading = api.storage.get('ordered');
    assert.equal(await setting, true);
    assert.equal((await reading).value, 20, 'same-key reads follow writes within the process');
    assert.equal(await api.storage.remove('ordered'), true);
    assert.equal(await api.storage.remove('ordered'), true);
    assert.equal(await api.storage.get('ordered'), null);
    for (const key of ['', 'x'.repeat(129), '\uD800']) {
        assert.equal(await api.storage.set(key, 'bad'), false);
    }
    for (const key of ['../outside', 'settings/connection', 'mcp:port', '偏好.🌍']) {
        assert.equal(await api.storage.set(key, 'opaque key'), true);
        assert.equal((await api.storage.get(key)).value, 'opaque key');
        assert.equal(await api.secret.set(key, 'opaque secret'), true);
        assert.equal(await api.secret.get(key), 'opaque secret');
    }
    assert.equal(await fs.stat(path.join(directory, 'outside')).then(() => true, () => false), false,
        'path-like keys cannot escape the hashed storage directory');
    const cycle = {};
    cycle.self = cycle;
    let getters = 0;
    const accessor = { get value() { ++getters; return 'unsafe'; } };
    const sparse = Array(2);
    sparse[1] = 2;
    sparse.extra = 3;
    for (const value of [undefined, NaN, Infinity, 3n, new Date(), cycle, accessor, sparse]) {
        assert.equal(await api.storage.set('invalid', value), false);
    }
    assert.equal(getters, 0);
    assert.equal(await api.storage.set('too-large', 'x'.repeat(1024 * 1024)), false);
    assert.equal(await api.storage.get('invalid'), null);
    await fs.writeFile(fileFor('storage', 'configuration'), 'broken JSON');
    assert.equal(await api.storage.get('configuration'), false, 'corruption is an error, not an empty configuration');
    const target = fileFor('storage', 'write-failure');
    await fs.mkdir(target);
    assert.equal(await api.storage.set('write-failure', 'value'), false);
    assert.equal((await fs.readdir(path.dirname(target))).some(name => name.endsWith('.tmp')), false);
    if (process.platform !== 'win32') {
        const outside = path.join(directory, 'outside');
        await fs.writeFile(outside, '{"value":"outside"}', { mode: 0o600 });
        await fs.symlink(outside, fileFor('storage', 'symlink'));
        assert.equal(await api.storage.get('symlink'), false);
        const stat = await fs.stat(fileFor('storage', 'snapshot'));
        assert.equal(stat.mode & 0o777, 0o600);
    }
    assert.equal(await api.secret.isAvailable(), true);
    assert.equal(await api.secret.get('missing'), null);
    assert.equal(await api.secret.set('credential', 'test-only-secret'), true);
    const ciphertext = await fs.readFile(fileFor('secret', 'credential'));
    assert.equal(ciphertext.includes(Buffer.from('test-only-secret')), false);
    api = await load();
    assert.equal(await api.secret.get('credential'), 'test-only-secret');
    reEncrypt = true;
    encryptionFails = true;
    assert.equal(await api.secret.get('credential'), false, 'failed key rotation must keep the old ciphertext');
    assert.deepEqual(await fs.readFile(fileFor('secret', 'credential')), ciphertext);
    encryptionFails = false;
    assert.equal(await api.secret.get('credential'), 'test-only-secret');
    const rotated = await fs.readFile(fileFor('secret', 'credential'));
    assert.notDeepEqual(rotated, ciphertext, 'key rotation updates ciphertext without changing the value');
    reEncrypt = false;
    if (process.platform === 'linux') {
        backend = 'basic_text';
        assert.equal(await api.secret.isAvailable(), false);
        assert.equal(await api.secret.set('credential', 'must-not-replace'), false);
        assert.equal(await api.secret.get('credential'), false);
        assert.deepEqual(await fs.readFile(fileFor('secret', 'credential')), rotated);
        backend = 'gnome_libsecret';
    }
    available = false;
    assert.equal(await api.secret.set('unavailable', 'must-not-write'), false);
    assert.equal(await api.secret.get('unavailable'), null);
    assert.equal(await api.secret.remove('credential'), true, 'deletion does not require encryption');
    available = true;
    ready = false;
    assert.equal(await api.secret.isAvailable(), false);
    ready = true;
    assert.equal(await api.secret.set('credential', ''), true);
    assert.equal(await api.secret.get('credential'), '');
    await fs.copyFile(fileFor('secret', 'credential'), fileFor('secret', 'other-key'));
    assert.equal(await api.secret.get('other-key'), false, 'encrypted values are bound to their key');
    await fs.writeFile(fileFor('secret', 'credential'), Buffer.from('corrupt cipher'));
    assert.equal(await api.secret.get('credential'), false);
    userData = path.join(directory, 'another-software');
    assert.equal(await api.storage.get('snapshot'), null, 'software data directories are isolated');
    console.log('Persistent JSON, restarts, ordering, failure cleanup, encryption and unavailable-key-service checks passed.');
}
finally {
    await fs.rm(directory, { recursive: true, force: true });
}
