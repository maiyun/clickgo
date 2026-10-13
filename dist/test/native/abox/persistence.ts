import { constants } from 'node:fs';
import { lstat, mkdir, open, rename, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import type { TJson } from '../lib/persistence.js';

export function isJson(value: unknown, seen = new Set<object>(), depth = 0): value is TJson {
    if (depth > 32) {
        return false;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object' || seen.has(value) || Object.getOwnPropertySymbols(value).length) {
        return false;
    }
    const array = Array.isArray(value);
    const prototype: unknown = Object.getPrototypeOf(value);
    if (!array && prototype !== Object.prototype && prototype !== null) {
        return false;
    }
    seen.add(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (array && Object.keys(value).length !== value.length) {
        return false;
    }
    if (array) {
        for (let index = 0; index < value.length; ++index) {
            if (!Object.hasOwn(value, index)) {
                return false;
            }
        }
    }
    for (const key of Object.keys(descriptors)) {
        if (array && key === 'length') {
            continue;
        }
        const descriptor = descriptors[key];
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value') ||
            !isJson(descriptor.value, seen, depth + 1)) {
            return false;
        }
    }
    seen.delete(value);
    return true;
}

export async function prepare(directory: string): Promise<boolean> {
    await mkdir(directory, { 'recursive': true, 'mode': 0o700 });
    const stat = await lstat(directory);
    return stat.isDirectory() && !stat.isSymbolicLink() &&
        (process.platform === 'win32' || stat.uid === process.getuid?.() && (stat.mode & 0o077) === 0);
}

export async function read(file: string, maxBytes: number): Promise<Buffer | null | false> {
    let handle;
    try {
        const stat = await lstat(file);
        if (!stat.isFile() || stat.isSymbolicLink()) {
            return false;
        }
        handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    }
    catch (error) {
        return (error as NodeJS.ErrnoException).code === 'ENOENT' ? null : false;
    }
    try {
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > maxBytes ||
            process.platform !== 'win32' && (stat.uid !== process.getuid?.() || (stat.mode & 0o077) !== 0)) {
            return false;
        }
        const data = await handle.readFile();
        return data.length <= maxBytes ? data : false;
    }
    finally {
        await handle.close();
    }
}

export async function write(file: string, data: Buffer, maxBytes: number): Promise<boolean> {
    if (data.length > maxBytes) {
        return false;
    }
    const temporary = `${file}.${randomUUID()}.tmp`;
    try {
        const handle = await open(temporary, 'wx', 0o600);
        try {
            await handle.writeFile(data);
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        await rename(temporary, file);
        return true;
    }
    finally {
        await unlink(temporary).catch((): void => { });
    }
}

export async function remove(file: string): Promise<boolean> {
    try {
        await unlink(file);
        return true;
    }
    catch (error) {
        return (error as NodeJS.ErrnoException).code === 'ENOENT';
    }
}
