import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { decodeText, encodeText } from '../../lib/tool/encoding.js';
const iconv = createRequire(import.meta.url)('iconv-lite');

const utf8 = new TextEncoder().encode('中文 😀\r\n');
assert.deepEqual(decodeText(utf8), { text: '中文 😀\r\n', encoding: 'utf-8', bom: false });
for (const encoding of ['utf-8', 'utf-16le', 'utf-16be']) {
    for (const bom of [false, true]) {
        for (const text of ['', 'ASCII\r\n', '中文 😀', '\ufeffbody']) {
            const bytes = encodeText(text, { encoding, bom });
            assert.ok(bytes instanceof Uint8Array);
            assert.deepEqual(decodeText(bytes, encoding), { text: !bom && text.startsWith('\ufeff') ? text.slice(1) : text, encoding, bom: bom || text.startsWith('\ufeff') });
            assert.equal(iconv.decode(Buffer.from(bytes), encoding, { stripBOM: false }), (bom ? '\ufeff' : '') + text);
            if (bom) assert.equal(decodeText(bytes).encoding, encoding);
        }
    }
}
for (const bytes of [[0xc0, 0xaf], [0xe4, 0xb8], [0xed, 0xa0, 0x80], [0xff]]) {
    assert.equal(decodeText(new Uint8Array(bytes)), false);
}
assert.equal(decodeText(new Uint8Array([0x00, 0xd8]), 'utf-16le'), false);
assert.equal(decodeText(new Uint8Array([0x61]), 'utf-16le'), false);
assert.equal(decodeText(new Uint8Array([0xff, 0xfe, 0, 0])), false);
assert.equal(decodeText(new Uint8Array([0, 0, 0xfe, 0xff])), false);
assert.equal(decodeText(new Uint8Array([0xff, 0xfe, 0x61, 0]), 'utf-8'), false);
assert.equal(decodeText(utf8, 'unknown'), false);
assert.equal(encodeText('text', { encoding: 'gb18030', bom: true }), false);
for (const encoding of ['utf-8', 'utf-16le', 'utf-16be', 'gb18030']) {
    for (const text of ['\ud800', '\udc00', 'a\ud800z']) assert.equal(encodeText(text, { encoding, bom: false }), false);
}
const padded = new Uint8Array([0xff, 0x61, 0x62, 0xff]);
assert.equal(decodeText(padded.subarray(1, 3)).text, 'ab');

assert.equal(decodeText(new Uint8Array([0xd6, 0xd0, 0xce, 0xc4])), false);
assert.deepEqual(decodeText(new Uint8Array([0xd6, 0xd0, 0xce, 0xc4]), 'gb18030'), { text: '中文', encoding: 'gb18030', bom: false });
assert.equal(decodeText(new Uint8Array([0x81]), 'gb18030'), false);
const started = performance.now();
for (const text of ['中文', 'Euro € · 😀', '\u0080\ue7c7\uffff', 'hello'.repeat(20000)]) {
    const bytes = encodeText(text, { encoding: 'gb18030', bom: false });
    assert.ok(bytes instanceof Uint8Array, text.slice(0, 30));
    assert.equal(decodeText(bytes, 'gb18030').text, text);
    assert.equal(iconv.decode(Buffer.from(bytes), 'gb18030'), text);
}
assert.deepEqual([...encodeText('中文', { encoding: 'gb18030', bom: false })], [0xd6, 0xd0, 0xce, 0xc4]);
// All valid BMP scalars and supplementary boundary/code-point samples must round-trip.
const nonRoundtrip = new Set([0xe5e5, 0xe78d, 0xe78e, 0xe78f, 0xe790, 0xe791, 0xe792, 0xe793, 0xe794, 0xe795, 0xe796, 0xe81e, 0xe826, 0xe82b, 0xe82c, 0xe832, 0xe843, 0xe854, 0xe864]);
for (const code of nonRoundtrip) assert.equal(encodeText(String.fromCodePoint(code), { encoding: 'gb18030', bom: false }), false, 'legacy private-use mappings must never silently change characters');
const scalars = [];
for (let code = 0; code <= 0xffff; ++code) {
    if ((code < 0xd800 || code > 0xdfff) && !nonRoundtrip.has(code)) scalars.push(String.fromCodePoint(code));
}
for (const code of [0x10000, 0x1f600, 0x20000, 0x10ffff]) scalars.push(String.fromCodePoint(code));
const all = scalars.join('');
const encoded = encodeText(all, { encoding: 'gb18030', bom: false });
assert.ok(encoded instanceof Uint8Array, 'GB18030 round-trips all BMP scalars except asymmetric legacy private-use mappings');
assert.equal(decodeText(encoded, 'gb18030').text, all);
console.log(`Text encoding checks passed; GB18030 first-use and scalar sweep ${Math.round(performance.now() - started)} ms.`);
