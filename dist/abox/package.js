export function createPackage(blob, io) {
    return AppPackage.create(blob, io);
}
const cgaMagic = '-CGA-';
const cgaVersion = 1;
const cgaHeaderLength = 106;
const cgaKeyContext = new TextEncoder().encode('ClickGo/Application/Package');
class AppPackage {
    _blob;
    _dataOffset;
    _key;
    _packageId;
    _manifest;
    _io;
    _blockCache = new Map();
    constructor(_blob, _dataOffset, _key, _packageId, _manifest, _io) {
        this._blob = _blob;
        this._dataOffset = _dataOffset;
        this._key = _key;
        this._packageId = _packageId;
        this._manifest = _manifest;
        this._io = _io;
    }
    static async create(blob, io) {
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
            const manifest = JSON.parse(new TextDecoder().decode(manifestBuffer));
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
    async getContent(path) {
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
    stats(path) {
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
    readDir(path) {
        path = normalizeCgaPath(path);
        if (!path.endsWith('/')) {
            path += '/';
        }
        const entries = new Map();
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
    clear() {
        this._blockCache.clear();
    }
    _getBlock(id) {
        const cached = this._blockCache.get(id);
        if (cached) {
            return cached;
        }
        const preparing = (async () => {
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
function unmaskCgaSeed(masked, salt, packageId) {
    const seed = new Uint8Array(masked.length);
    const shift = packageId[0] % seed.length;
    for (let i = 0; i < seed.length; ++i) {
        seed[(i + shift) % seed.length] = masked[i] ^ salt[i]
            ^ packageId[i % packageId.length] ^ ((i * 29 + 17) & 0xff);
    }
    return seed;
}
async function deriveCgaKey(seed, salt, packageId) {
    const material = concatCgaBytes(seed, salt, packageId, cgaKeyContext);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', material);
    return globalThis.crypto.subtle.importKey('raw', digest, {
        'name': 'AES-GCM',
    }, false, ['decrypt']);
}
function decryptCga(data, key, nonce, aad) {
    return globalThis.crypto.subtle.decrypt({
        'name': 'AES-GCM',
        'iv': nonce,
        'additionalData': aad,
        'tagLength': 128,
    }, key, data);
}
function getCgaAad(packageId, name) {
    return concatCgaBytes(packageId, new TextEncoder().encode(name));
}
function concatCgaBytes(...items) {
    const length = items.reduce((total, item) => total + item.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const item of items) {
        result.set(item, offset);
        offset += item.length;
    }
    return result;
}
function base64ToBytes(value) {
    const text = atob(value);
    const result = new Uint8Array(text.length);
    for (let i = 0; i < text.length; ++i) {
        result[i] = text.charCodeAt(i);
    }
    return result;
}
function normalizeCgaPath(path) {
    return '/' + path.replace(/^\/+/, '');
}
