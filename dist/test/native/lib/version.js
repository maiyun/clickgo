import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * --- 按当前模块的位置读取所属框架包的版本，不使用业务软件的版本或启动目录 ---
 * @returns 包版本；缺少清单或清单无法读取时为 false
 */
function readVersion() {
    let directory = dirname(fileURLToPath(import.meta.url));
    // --- Native 与 ClickGo 测试副本目录深度不同，向上找到各自包清单 ---
    try {
        while (!existsSync(join(directory, 'package.json'))) {
            const parent = dirname(directory);
            if (parent === directory) {
                return false;
            }
            directory = parent;
        }
        const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
        return typeof manifest.version === 'string' && manifest.version ? manifest.version : false;
    }
    catch {
        return false;
    }
}
/** --- 每个进程只读取一次包版本，后续握手共用 --- */
const packageVersion = readVersion();
/** --- 缺少清单时明确标记未知版本，不沿用一个可能过期的版本号 --- */
export const version = packageVersion === false ? 'unknown' : packageVersion;
