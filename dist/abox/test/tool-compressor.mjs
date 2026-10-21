import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { loadTool } from './source-loader.mjs';

function harness(settings = {}) {
    const dom = new JSDOM('<!doctype html><head></head>', { url: 'https://example.test/' });
    const state = { sizes: [300, 180, 90], calls: [], encodes: [], urls: [], type: 'image/jpeg', ...settings };
    const window = { clickgo: { config: { cdn: 'https://assets.example.test' } } };
    class Compressor {
        constructor(file, options) {
            state.calls.push({ file, options });
            if (state.constructorError) throw Error('constructor failed');
            const canvas = {
                toBlob(callback, type, quality) {
                    state.encodes.push({ canvas, quality, type });
                    if (state.encodeError) throw Error('encoding failed');
                    const blob = state.nullBlob ? null : new Blob([new Uint8Array(state.sizes[state.encodes.length])], { type: state.retryType ?? type });
                    queueMicrotask(() => callback(blob));
                }
            };
            queueMicrotask(() => {
                if (state.imageError) return options.error(Error('invalid image'));
                if (!state.noCanvas) options.drew({}, canvas);
                const type = state.type;
                const data = new Uint8Array(state.sizes[0]);
                options.success(state.fileResult ? new File([data], 'ready.jpg', { type }) : new Blob([data], { type }));
            });
        }
    }
    dom.window.document.head.appendChild = script => {
        state.urls.push(script.src);
        queueMicrotask(() => {
            if (!state.loadError && !state.missingGlobal) window.Compressor = Compressor;
            script.dispatchEvent(new dom.window.Event(state.loadError ? 'error' : 'load'));
        });
        return script;
    };
    return { api: loadTool({ document: dom.window.document, window, File, Blob }), state, close: () => dom.window.close() };
}

const original = new File(['source'], 'receipt.copy.PNG', { type: 'image/png', lastModified: 1234 });
const options = { mimeType: 'image/jpeg', maxWidth: 2000, maxHeight: 1500, quality: [0.9, 0.6, 0.5], maxSize: 200 };
const run = harness();
let result = await run.api.compressor(original, options);
assert.ok(result instanceof File);
assert.equal(result.name, 'receipt.copy.jpg');
assert.equal(result.type, 'image/jpeg');
assert.equal(result.size, 180);
assert.equal(result.lastModified, original.lastModified);
assert.equal(run.state.calls.length, 1, 'all qualities share one source decode and resize');
assert.equal(run.state.calls[0].file, original);
assert.equal(run.state.calls[0].options.quality, 0.9);
assert.equal(run.state.calls[0].options.maxWidth, 2000);
assert.equal(run.state.calls[0].options.maxHeight, 1500);
assert.equal(run.state.calls[0].options.mimeType, 'image/jpeg');
assert.deepEqual(run.state.encodes.map(item => item.quality), [0.6]);
assert.match(run.state.urls[0], /^https:\/\/assets\.example\.test\/npm\/compressorjs@/);
await run.api.compressor(original, { quality: 0.5 });
assert.equal(run.state.urls.length, 1, 'loaded compressor is reused');
assert.equal(run.state.calls[1].options.quality, 0.5, 'legacy numeric quality still performs one compression');
assert.equal(run.state.calls[1].options.mimeType, undefined, 'legacy calls keep automatic format selection');
await run.api.compressor(original);
assert.equal(run.state.calls[2].options.quality, 0.8, 'documented default quality is applied');
run.close();

for (const maxSize of [300, 301]) {
    const first = harness();
    assert.equal((await first.api.compressor(original, { ...options, maxSize })).size, 300);
    assert.equal(first.state.encodes.length, 0, 'inclusive size boundary stops on the first successful quality');
    first.close();
}
const last = harness();
assert.equal((await last.api.compressor(original, { ...options, maxSize: 90 })).size, 90);
assert.deepEqual(last.state.encodes.map(item => item.quality), [0.6, 0.5]);
assert.equal(last.state.encodes[0].canvas, last.state.encodes[1].canvas, 'fallback encoding never recompresses the previous JPEG');
last.close();

const oversized = harness();
assert.equal(await oversized.api.compressor(original, { ...options, maxSize: 89 }), false);
assert.deepEqual(oversized.state.encodes.map(item => item.quality), [0.6, 0.5], 'no unrequested quality or additional resize is attempted');
oversized.close();
const noTarget = harness();
assert.equal((await noTarget.api.compressor(original, { quality: [0.9, 0.6, 0.5] })).size, 300);
assert.equal(noTarget.state.encodes.length, 0, 'without a size target, only the first quality is used');
noTarget.close();

const blobInput = harness();
result = await blobInput.api.compressor(new Blob(['source'], { type: 'image/png' }), options);
assert.ok(result instanceof Blob && !(result instanceof File));
blobInput.close();
const webp = harness({ type: 'image/webp' });
result = await webp.api.compressor(original, { ...options, mimeType: 'image/webp' });
assert.equal(result.name, 'receipt.copy.webp');
assert.equal(result.type, 'image/webp');
assert.equal(result.size, 180);
webp.close();
const sameType = harness({ type: 'image/png' });
result = await sameType.api.compressor(original, { quality: 0.5 });
assert.equal(result.name, original.name, 'unchanged format preserves the filename');
assert.equal(result.type, original.type);
assert.equal(await sameType.api.compressor(original, { ...options, mimeType: 'image/png' }), false);
assert.equal(sameType.state.encodes.length, 0, 'PNG quality does not trigger redundant retries');
sameType.close();
const fileResult = harness({ fileResult: true });
assert.equal((await fileResult.api.compressor(original, { mimeType: 'image/jpeg' })).name, 'receipt.copy.jpg');
fileResult.close();

for (const bad of [
    { quality: [] }, { quality: [-0.1] }, { quality: [0.9, NaN] }, { quality: 1.1 },
    { maxSize: 0 }, { maxSize: -1 }, { maxSize: Infinity }, { maxSize: NaN }, { mimeType: 'image/gif' }
]) {
    const invalid = harness();
    assert.equal(await invalid.api.compressor(original, bad), false);
    assert.equal(invalid.state.urls.length, 0, 'invalid options fail before loading dependencies');
    invalid.close();
}
for (const settings of [
    { loadError: true }, { missingGlobal: true }, { constructorError: true }, { imageError: true },
    { nullBlob: true }, { encodeError: true }, { noCanvas: true }, { retryType: 'image/png' }, { type: 'image/png' }
]) {
    const failed = harness(settings);
    assert.equal(await failed.api.compressor(original, options), false, JSON.stringify(settings));
    failed.close();
}
const retry = harness({ loadError: true });
assert.equal(await retry.api.compressor(original, options), false);
retry.state.loadError = false;
assert.ok(await retry.api.compressor(original, options));
assert.equal(retry.state.urls.length, 2, 'a failed dependency load can be retried');
retry.close();
console.log('Compressor format, quality fallback, size limit, legacy calls, File/Blob contracts, single decode and failure checks passed.');
