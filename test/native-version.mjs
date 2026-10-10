import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { version } from '../dist/test/native/lib/version.js';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(version, manifest.version);
const root = await mkdtemp(join(tmpdir(), 'clickgo-native-version-'));
try {
    // --- 模拟业务软件安装框架，启动目录和外层软件版本都不能改变框架版本 ---
    const framework = join(root, 'node_modules', 'clickgo-native');
    const library = join(framework, 'dist', 'lib');
    await mkdir(library, { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }));
    await copyFile(new URL('../dist/test/native/lib/version.js', import.meta.url), join(library, 'version.js'));
    const load = () => execFileSync(process.execPath, ['--input-type=module', '-e',
        `import { version } from ${JSON.stringify(pathToFileURL(join(library, 'version.js')).href)}; process.stdout.write(version);`,
    ], { cwd: root, encoding: 'utf8' });
    for (const current of ['9.8.7', '9.8.8']) {
        await writeFile(join(framework, 'package.json'), JSON.stringify({ type: 'module', version: current }));
        assert.equal(load(), current);
    }
    await writeFile(join(framework, 'package.json'), JSON.stringify({ type: 'module' }));
    assert.equal(load(), 'unknown');
    console.log('Framework metadata follows its package version across upgrades and business working directories.');
}
finally {
    await rm(root, { recursive: true, force: true });
}
