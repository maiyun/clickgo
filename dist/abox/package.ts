/**
 * Copyright 2007-2025 MAIYUN.NET

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { IAppPackage, IAppPackageEntry, IAppPackageStats } from '../lib/core.js';
import type * as lZip from '../lib/zip.js';
import type { IPackageIO } from '../lib/core/package.js';

export function createPackage(blob: Blob, io: IPackageIO): Promise<false | { icon: string; package: IAppPackage; }> {
    return AppPackage.create(blob, io);
}

const cgaMagic = '-CGA-';

const cgaVersion = 1;

const cgaHeaderLength = 106;

const cgaKeyContext = new TextEncoder().encode('ClickGo/Application/Package');

interface ICgaFile {
    'b': string;
    'e': string;
    's': number;
    't': 0 | 1;
}

interface ICgaBlock {
    'l': number;
    'n': string;
    'o': number;
}

interface ICgaManifest {
    'b': Record<string, ICgaBlock>;
    'f': Record<string, ICgaFile>;
}

class AppPackage implements IAppPackage {
    private readonly _blockCache = new Map<string, Promise<lZip.Zip | null>>();
    private constructor(private readonly _blob: Blob, private readonly _dataOffset: number, private readonly _key: CryptoKey, private readonly _packageId: Uint8Array<ArrayBuffer>, private readonly _manifest: ICgaManifest, private readonly _io: IPackageIO) { }
    public static async create(blob: Blob, io: IPackageIO): Promise<false | {
        'icon': string;
        'package': AppPackage;
    }> {
        if (blob.size < cgaHeaderLength) {
            return false;
        }
        try {
            const header = new Uint8Array(await blob.slice(0, cgaHeaderLength).arrayBuffer());
            if (new TextDecoder().decode(header.slice(0, 5)) !== cgaMagic) {
                return false;
            }
            const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
            if (view.getUint8(5) !== cgaVersion) {
                return false;
            }
            const iconLength = view.getUint32(6);
            const manifestLength = view.getUint32(10);
            const manifestOffset = cgaHeaderLength + iconLength;
            const dataOffset = manifestOffset + manifestLength;
            if ((manifestOffset > blob.size) || (dataOffset > blob.size)) {
                return false;
            }
            const packageId = header.slice(14, 30);
            const salt = header.slice(30, 62);
            const maskedSeed = header.slice(62, 94);
            const manifestNonce = header.slice(94, 106);
            const seed = unmaskCgaSeed(maskedSeed, salt, packageId);
            const key = await deriveCgaKey(seed, salt, packageId);
            const encryptedManifest = await blob.slice(manifestOffset, dataOffset).arrayBuffer();
            const manifestBuffer = await decryptCga(encryptedManifest, key, manifestNonce, getCgaAad(packageId, 'manifest'));
            const manifest = JSON.parse(new TextDecoder().decode(manifestBuffer)) as ICgaManifest;
            if (!manifest.b || !manifest.f) {
                return false;
            }
            const icon = iconLength ? await io.blob2DataUrl(blob.slice(cgaHeaderLength, cgaHeaderLength + iconLength)) : '';
            return {
                'icon': icon,
                'package': new AppPackage(blob, dataOffset, key, packageId, manifest, io),
            };
        }
        catch {
            return false;
        }
    }
    public async getContent(path: string): Promise<Blob | string | null> {
        path = normalizeCgaPath(path);
        const file = this._manifest.f[path];
        if (!file) {
            return null;
        }
        const block = await this._getBlock(file.b);
        if (!block) {
            return null;
        }
        if (file.t) {
            const content = await block.getContent(file.e, 'string');
            return content?.replace(/^\ufeff/, '') ?? null;
        }
        const content = await block.getContent(file.e, 'arraybuffer');
        if (!content) {
            return null;
        }
        return new Blob([content], {
            'type': this._io.getMimeByPath(path).mime,
        });
    }
    public stats(path: string): IAppPackageStats | null {
        path = normalizeCgaPath(path);
        const file = this._manifest.f[path];
        if (file) {
            return {
                'isDirectory': false,
                'isFile': true,
                'size': file.s,
            };
        }
        const dir = path.endsWith('/') ? path : `${path}/`;
        for (const filePath in this._manifest.f) {
            if (filePath.startsWith(dir)) {
                return {
                    'isDirectory': true,
                    'isFile': false,
                    'size': 0,
                };
            }
        }
        return null;
    }
    public readDir(path: string): IAppPackageEntry[] {
        path = normalizeCgaPath(path);
        if (!path.endsWith('/')) {
            path += '/';
        }
        const entries = new Map<string, IAppPackageEntry>();
        for (const filePath in this._manifest.f) {
            if (!filePath.startsWith(path)) {
                continue;
            }
            const relative = filePath.slice(path.length);
            const split = relative.indexOf('/');
            const name = split === -1 ? relative : relative.slice(0, split);
            if (!name || entries.has(name)) {
                continue;
            }
            entries.set(name, {
                'isDirectory': split !== -1,
                'isFile': split === -1,
                'name': name,
            });
        }
        return [...entries.values()].sort((a, b) => a.name.localeCompare(b.name));
    }
    public clear(): void {
        this._blockCache.clear();
    }
    private _getBlock(id: string): Promise<lZip.Zip | null> {
        const cached = this._blockCache.get(id);
        if (cached) {
            return cached;
        }
        const preparing = (async (): Promise<lZip.Zip | null> => {
            const block = this._manifest.b[id];
            if (!block || (block.o < 0) || (block.l <= 16)) {
                return null;
            }
            const start = this._dataOffset + block.o;
            const end = start + block.l;
            if ((start < this._dataOffset) || (end > this._blob.size)) {
                return null;
            }
            try {
                const data = await this._blob.slice(start, end).arrayBuffer();
                const decrypted = await decryptCga(data, this._key, base64ToBytes(block.n), getCgaAad(this._packageId, id));
                return await this._io.getZip(new Blob([decrypted]));
            }
            catch {
                return null;
            }
        })();
        this._blockCache.set(id, preparing);
        return preparing;
    }
}

function unmaskCgaSeed(masked: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>, packageId: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
    const seed: Uint8Array<ArrayBuffer> = new Uint8Array(masked.length);
    const shift = packageId[0] % seed.length;
    for (let i = 0; i < seed.length; ++i) {
        seed[(i + shift) % seed.length] = masked[i] ^ salt[i]
            ^ packageId[i % packageId.length] ^ ((i * 29 + 17) & 0xff);
    }
    return seed;
}

async function deriveCgaKey(seed: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>, packageId: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
    const material = concatCgaBytes(seed, salt, packageId, cgaKeyContext);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', material);
    return globalThis.crypto.subtle.importKey('raw', digest, {
        'name': 'AES-GCM',
    }, false, ['decrypt']);
}

function decryptCga(data: ArrayBuffer, key: CryptoKey, nonce: Uint8Array<ArrayBuffer>, aad: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer> {
    return globalThis.crypto.subtle.decrypt({
        'name': 'AES-GCM',
        'iv': nonce,
        'additionalData': aad,
        'tagLength': 128,
    }, key, data);
}

function getCgaAad(packageId: Uint8Array<ArrayBuffer>, name: string): Uint8Array<ArrayBuffer> {
    return concatCgaBytes(packageId, new TextEncoder().encode(name));
}

function concatCgaBytes(...items: Array<Uint8Array<ArrayBuffer>>): Uint8Array<ArrayBuffer> {
    const length = items.reduce((total, item) => total + item.length, 0);
    const result: Uint8Array<ArrayBuffer> = new Uint8Array(length);
    let offset = 0;
    for (const item of items) {
        result.set(item, offset);
        offset += item.length;
    }
    return result;
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
    const text = atob(value);
    const result: Uint8Array<ArrayBuffer> = new Uint8Array(text.length);
    for (let i = 0; i < text.length; ++i) {
        result[i] = text.charCodeAt(i);
    }
    return result;
}

function normalizeCgaPath(path: string): string {
    return '/' + path.replace(/^\/+/, '');
}
