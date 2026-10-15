import type { IDecodedText, ITextEncoding, TTextEncoding } from '../lib/tool/encoding.js';

// GB18030 ranges: https://encoding.spec.whatwg.org/index-gb18030-ranges.txt (2024-09-18).
const gbRanges = new Uint32Array([
    0, 128, 36, 165, 38, 169, 45, 178, 50, 184, 81, 216,
    89, 226, 95, 235, 96, 238, 100, 244, 103, 248, 104, 251,
    105, 253, 109, 258, 126, 276, 133, 284, 148, 300, 172, 325,
    175, 329, 179, 334, 208, 364, 306, 463, 307, 465, 308, 467,
    309, 469, 310, 471, 311, 473, 312, 475, 313, 477, 341, 506,
    428, 594, 443, 610, 544, 712, 545, 716, 558, 730, 741, 930,
    742, 938, 749, 962, 750, 970, 805, 1026, 819, 1104, 820, 1106,
    7922, 8209, 7924, 8215, 7925, 8218, 7927, 8222, 7934, 8231, 7943, 8241,
    7944, 8244, 7945, 8246, 7950, 8252, 8062, 8365, 8148, 8452, 8149, 8454,
    8152, 8458, 8164, 8471, 8174, 8482, 8236, 8556, 8240, 8570, 8262, 8596,
    8264, 8602, 8374, 8713, 8380, 8720, 8381, 8722, 8384, 8726, 8388, 8731,
    8390, 8737, 8392, 8740, 8393, 8742, 8394, 8748, 8396, 8751, 8401, 8760,
    8406, 8766, 8416, 8777, 8419, 8781, 8424, 8787, 8437, 8802, 8439, 8808,
    8445, 8816, 8482, 8854, 8485, 8858, 8496, 8870, 8521, 8896, 8603, 8979,
    8936, 9322, 8946, 9372, 9046, 9548, 9050, 9588, 9063, 9616, 9066, 9622,
    9076, 9634, 9092, 9652, 9100, 9662, 9108, 9672, 9111, 9676, 9113, 9680,
    9131, 9702, 9162, 9735, 9164, 9738, 9218, 9793, 9219, 9795, 11329, 11906,
    11331, 11909, 11334, 11913, 11336, 11917, 11346, 11928, 11361, 11944, 11363, 11947,
    11366, 11951, 11370, 11956, 11372, 11960, 11375, 11964, 11389, 11979, 11682, 12284,
    11686, 12292, 11687, 12312, 11692, 12319, 11694, 12330, 11714, 12351, 11716, 12436,
    11723, 12447, 11725, 12535, 11730, 12543, 11736, 12586, 11982, 12842, 11989, 12850,
    12102, 12964, 12336, 13200, 12348, 13215, 12350, 13218, 12384, 13253, 12393, 13263,
    12395, 13267, 12397, 13270, 12510, 13384, 12553, 13428, 12851, 13727, 12962, 13839,
    12973, 13851, 13738, 14617, 13823, 14703, 13919, 14801, 13933, 14816, 14080, 14964,
    14298, 15183, 14585, 15471, 14698, 15585, 15583, 16471, 15847, 16736, 16318, 17208,
    16434, 17325, 16438, 17330, 16481, 17374, 16729, 17623, 17102, 17997, 17122, 18018,
    17315, 18212, 17320, 18218, 17402, 18301, 17418, 18318, 17859, 18760, 17909, 18811,
    17911, 18814, 17915, 18820, 17916, 18823, 17936, 18844, 17939, 18848, 17961, 18872,
    18664, 19576, 18703, 19620, 18814, 19738, 18962, 19887, 19043, 40870, 33469, 59244,
    33470, 59336, 33471, 59367, 33484, 59413, 33485, 59417, 33490, 59423, 33497, 59431,
    33501, 59437, 33505, 59443, 33513, 59452, 33520, 59460, 33536, 59478, 33550, 59493,
    37845, 63789, 37921, 63866, 37948, 63894, 38029, 63976, 38038, 63986, 38064, 64016,
    38065, 64018, 38066, 64021, 38069, 64025, 38075, 64034, 38076, 64037, 38078, 64042,
    39108, 65074, 39109, 65093, 39113, 65107, 39114, 65112, 39115, 65127, 39116, 65132,
    39265, 65375, 39394, 65510, 189000, 65536,
]);
let gbPairs: Map<number, number> | null = null;

function validEncoding(encoding: string): encoding is TTextEncoding {
    return encoding === 'utf-8' || encoding === 'utf-16le' || encoding === 'utf-16be' || encoding === 'gb18030';
}

export function decodeText(data: ArrayBuffer | Uint8Array, encoding?: TTextEncoding): IDecodedText | false {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (bytes.length >= 4 && ((bytes[0] === 0xff && bytes[1] === 0xfe && bytes[2] === 0 && bytes[3] === 0) ||
        (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 0xfe && bytes[3] === 0xff))) {
        return false;
    }
    let detected: TTextEncoding | undefined;
    let offset = 0;
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        detected = 'utf-8';
        offset = 3;
    }
    else if (bytes[0] === 0xff && bytes[1] === 0xfe) {
        detected = 'utf-16le';
        offset = 2;
    }
    else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
        detected = 'utf-16be';
        offset = 2;
    }
    if (encoding && (!validEncoding(encoding) || (detected && encoding !== detected))) {
        return false;
    }
    encoding ??= detected ?? 'utf-8';
    try {
        return {
            'text': new TextDecoder(encoding, { 'fatal': true, 'ignoreBOM': true }).decode(bytes.subarray(offset)),
            'encoding': encoding,
            'bom': offset !== 0,
        };
    }
    catch {
        return false;
    }
}

function gbPointer(code: number): number {
    if (code === 0xe7c7) {
        return 7457;
    }
    let low = 0;
    let high = gbRanges.length / 2;
    while (low < high) {
        const middle = (low + high) >>> 1;
        if (gbRanges[middle * 2 + 1] <= code) {
            low = middle + 1;
        }
        else {
            high = middle;
        }
    }
    const index = (low - 1) * 2;
    return gbRanges[index] + code - gbRanges[index + 1];
}

function encodeGb(text: string): Uint8Array<ArrayBuffer> | false {
    const decoder = new TextDecoder('gb18030', { 'fatal': true });
    if (!gbPairs) {
        const pairs = new Map<number, number>();
        const bytes = new Uint8Array(2);
        for (let first = 0x81; first <= 0xfe; ++first) {
            bytes[0] = first;
            for (let second = 0x40; second <= 0xfe; ++second) {
                if (second === 0x7f) {
                    continue;
                }
                bytes[1] = second;
                try {
                    const value = decoder.decode(bytes);
                    const code = value.codePointAt(0);
                    if (code !== undefined && value.length === (code > 0xffff ? 2 : 1) && !pairs.has(code)) {
                        pairs.set(code, first << 8 | second);
                    }
                }
                catch {}
            }
        }
        gbPairs = pairs;
    }
    const bytes = new Uint8Array(text.length * 4);
    let offset = 0;
    for (const character of text) {
        const code = character.codePointAt(0)!;
        if (code < 0x80) {
            bytes[offset++] = code;
            continue;
        }
        const pair = gbPairs.get(code);
        if (pair !== undefined) {
            bytes[offset++] = pair >>> 8;
            bytes[offset++] = pair & 0xff;
            continue;
        }
        let pointer = gbPointer(code);
        bytes[offset + 3] = pointer % 10 + 0x30;
        pointer = Math.floor(pointer / 10);
        bytes[offset + 2] = pointer % 126 + 0x81;
        pointer = Math.floor(pointer / 126);
        bytes[offset + 1] = pointer % 10 + 0x30;
        bytes[offset] = Math.floor(pointer / 10) + 0x81;
        offset += 4;
    }
    const result = bytes.slice(0, offset);
    return decoder.decode(result) === text ? result : false;
}

export function encodeText(text: string, options: ITextEncoding): Uint8Array<ArrayBuffer> | false {
    if (!validEncoding(options.encoding) || typeof options.bom !== 'boolean' || (options.encoding === 'gb18030' && options.bom)) {
        return false;
    }
    for (let index = 0; index < text.length; ++index) {
        const code = text.charCodeAt(index);
        if (code >= 0xd800 && code <= 0xdbff) {
            const next = text.charCodeAt(++index);
            if (!(next >= 0xdc00 && next <= 0xdfff)) {
                return false;
            }
        }
        else if (code >= 0xdc00 && code <= 0xdfff) {
            return false;
        }
    }
    try {
        if (options.encoding === 'gb18030') {
            return encodeGb(text);
        }
        if (options.encoding === 'utf-8') {
            const body = new TextEncoder().encode(text);
            if (!options.bom) {
                return body;
            }
            const bytes = new Uint8Array(body.length + 3);
            bytes.set([0xef, 0xbb, 0xbf]);
            bytes.set(body, 3);
            return bytes;
        }
        const bytes = new Uint8Array(text.length * 2 + (options.bom ? 2 : 0));
        const view = new DataView(bytes.buffer);
        const little = options.encoding === 'utf-16le';
        let offset = 0;
        if (options.bom) {
            view.setUint16(0, 0xfeff, little);
            offset = 2;
        }
        for (let index = 0; index < text.length; ++index) {
            view.setUint16(offset + index * 2, text.charCodeAt(index), little);
        }
        return bytes;
    }
    catch {
        return false;
    }
}
