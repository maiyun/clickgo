import { open } from 'node:fs/promises';
export async function readArguments(text, path) {
    try {
        if (path === '-') {
            const chunks = [];
            let size = 0;
            for await (const chunk of process.stdin) {
                const buffer = Buffer.from(chunk);
                size += buffer.length;
                if (size > 1024 * 1024) {
                    return false;
                }
                chunks.push(buffer);
            }
            text = Buffer.concat(chunks).toString('utf8');
        }
        else if (path) {
            const file = await open(path, 'r');
            try {
                const stat = await file.stat();
                if (!stat.isFile() || stat.size > 1024 * 1024) {
                    return false;
                }
                text = await file.readFile('utf8');
            }
            finally {
                await file.close();
            }
        }
        if (text && Buffer.byteLength(text) > 1024 * 1024) {
            return false;
        }
        const value = JSON.parse(text ?? '{}');
        return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : false;
    }
    catch {
        return false;
    }
}
