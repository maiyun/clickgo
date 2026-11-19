// Simulates MapLibre APIs; this does not exercise rendering or network tile services.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { inflateSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import JSZip from 'jszip';
import { reactive } from 'vue';

const source = await readFile(new URL('../../sources/control/map/abox/maplibre.ts', import.meta.url), 'utf8');
const exports = {};
const requests = [];
const styleFixture = { glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf', sprite: 'https://tiles.openfreemap.org/sprites/ofm', sources: { openmaptiles: { url: 'https://tiles.openfreemap.org/planet' } }, layers: [{ id: 'background', type: 'background' }, { id: 'country', type: 'symbol', source: 'openmaptiles', maxzoom: 9 }, { id: 'road', type: 'line', source: 'openmaptiles' }] };
const tileFixture = { tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'], maxzoom: 14 };
const context = { exports, structuredClone, URL, AbortController, atob, fetch: async url => { requests.push(url); return { ok: true, json: async () => String(url).includes('styles/liberty') ? structuredClone(styleFixture) : structuredClone(tileFixture), arrayBuffer: async () => new ArrayBuffer(1) }; } };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const { MapLibreAdapter } = exports;
const dom = new JSDOM('<!doctype html><div id="map"></div>');

class Evented {
    constructor() { this.events = []; }
    on(name, layer, fn) { if (typeof layer === 'function') { fn = layer; layer = undefined; } this.events.push({ name, layer, fn }); return this; }
    off(name, layer, fn) { this.events = this.events.filter(e => e.name !== name || e.layer !== layer || e.fn !== fn); return this; }
    once(name, fn) { const callback = (...args) => { this.off(name, undefined, callback); fn(...args); }; return this.on(name, callback); }
    fire(name, event = {}, layer) { for (const e of [...this.events]) if (e.name === name && e.layer === layer) e.fn(event); }
}
class FakeMap extends Evented {
    constructor(options) { super(); this.options = options; this.layers = new Map([['base', { id: 'base' }]]); this.sources = new Map(); this.controls = []; this.loaded = true; this.center = { lng: options.center[0], lat: options.center[1] }; this.dragPan = { isEnabled: () => !this.disabled, disable: () => { this.disabled = true; }, enable: () => { this.disabled = false; } }; }
    setGlyphs(value) { this.glyphs = value; }
    setSprite(value) { this.sprite = value; }
    setLayoutProperty(id, name, value) { (this.layers.get(id).layout ??= {})[name] = value; }
    setPaintProperty(id, name, value) { this.layers.get(id).paint[name] = value; }
    getCanvas() { return this.canvas ??= dom.window.document.createElement('canvas'); }
    isStyleLoaded() { return this.loaded; }
    addSource(id, source) { this.sources.set(id, { ...source, setData(data) { this.data = data; }, setTiles(tiles) { this.tiles = tiles; this.tileChanges = (this.tileChanges ?? 0) + 1; } }); }
    getSource(id) { return this.sources.get(id); }
    removeSource(id) { this.sources.delete(id); }
    addLayer(layer) { this.layers.set(layer.id, layer); }
    getLayer(id) { return this.layers.get(id); }
    removeLayer(id) { this.layers.delete(id); }
    addControl(control) { this.controls.push(control); }
    removeControl(control) { this.controls = this.controls.filter(c => c !== control); }
    queryRenderedFeatures() { return []; }
    getCenter() { return this.center; }
    getBounds() { const { lat, lng } = this.center; const bounds = this.bounds ?? { west: lng - 0.01, east: lng + 0.01, north: lat + 0.01, south: lat - 0.01 }; return { getWest: () => bounds.west, getEast: () => bounds.east, getNorth: () => bounds.north, getSouth: () => bounds.south }; }
    getZoom() { return this.options.zoom; }
    remove() { this.removed = true; }
}
class FakeMarker extends Evented {
    static instances = [];
    constructor(options) { super(); this.options = options; FakeMarker.instances.push(this); }
    setLngLat([lng, lat]) { this.position = { lng, lat }; return this; }
    getLngLat() { return this.position; }
    setDraggable(value) { this.draggable = value; return this; }
    addTo(map) { this.map = map; return this; }
    remove() { this.removed = true; }
}
const protocols = new Map();
const lib = { Map: FakeMap, Marker: FakeMarker, NavigationControl: class {}, AttributionControl: class { constructor(options) { this.options = options; } }, addProtocol: (name, fn) => protocols.set(name, fn), removeProtocol: name => protocols.delete(name) };
function create(overrides = {}) {
    FakeMarker.instances = [];
    const events = [], paths = [], markers = [], menus = [];
    const adapter = new MapLibreAdapter({ lib, container: dom.window.document.querySelector('#map'), key: 'test key', center: { lat: 31, lng: 121 }, zoom: 10, zoomControl: false, markerImage: 'marker.svg', inChina: p => p.lng > 70 && p.lng < 140 && p.lat > 10 && p.lat < 60, emit: (...args) => events.push(args), pathChange: (...args) => paths.push(args), markerChange: (...args) => markers.push(args), nodeMenu: (...args) => menus.push(args), ...overrides });
    return { adapter, map: adapter.map, events, paths, markers, menus };
}
const plain = value => JSON.parse(JSON.stringify(value));
const point = (lat, lng) => ({ lat, lng });
const cases = [];
function test(name, fn) { cases.push([name, fn]); }

test('control dispatches updates to each engine and removes only its matching Google objects', async () => {
    const controlSource = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const controlExports = {};
    vm.runInNewContext(ts.transpileModule(controlSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports: controlExports,
        require: name => name === 'clickgo' ? { control: { AbstractControl: class {} } } : { MapLibreAdapter }
    });
    const control = new controlExports.default();
    const methods = [['updateOverlays', 'overlays'], ['updateLines', 'lines'], ['updatePolygons', 'polygons']];
    for (const [method, collection] of methods) {
        let removed = 0;
        control.access[collection] = { stale: { obj: { setMap(map) { assert.equal(map, null); ++removed; } } } };
        control[method]();
        assert.equal(removed, 1, `${method} must remove its own stale objects`);
        assert.deepEqual(Object.keys(control.access[collection]), []);
    }
    control.access.markers = { unrelated: { obj: { map: {} }, listeners: [] } };
    control.updateOverlays();
    assert.ok(control.access.markers.unrelated);
    control.props.factory = 'tianditu';
    const calls = [];
    control.access.mapLibre = {
        syncMarkers: items => calls.push(['markers', items]),
        syncOverlays: items => calls.push(['overlays', items]),
        syncShapes: (kind, items) => calls.push([kind, items])
    };
    control.updateMarkers();
    for (const [method] of methods) control[method]();
    assert.deepEqual(calls.map(call => call[0]), ['markers', 'overlays', 'line', 'polygon']);
    assert.equal(calls[0][1], control.props.markers);
    for (let i = 0; i < methods.length; ++i) assert.equal(calls[i + 1][1], control.props[methods[i][1]]);
    control.access.mapLibre = undefined;
    control.removeNode();
});

test('Google AdvancedMarker syncs positions and events and detaches on removal and teardown', async () => {
    const controlSource = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const controlExports = {};
    vm.runInNewContext(ts.transpileModule(controlSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports: controlExports, require: name => name === 'clickgo' ? { control: { AbstractControl: class {} } } : { MapLibreAdapter }
    });
    class AdvancedMarker extends dom.window.EventTarget {
        constructor(options) { super(); Object.assign(this, options); }
    }
    const control = new controlExports.default(), emitted = [];
    control.emit = (...args) => emitted.push(args);
    control.access.markerLib = { AdvancedMarkerElement: AdvancedMarker };
    control.access.map = {};
    control.props.markers = { a: { lat: 1, lng: 2, title: 'A', drag: true } };
    control.updateMarkers();
    const obj = control.access.markers.a.obj;
    assert.equal(obj.gmpClickable, true); assert.equal(obj.gmpDraggable, true); assert.equal(obj.title, 'A');
    obj.dispatchEvent(new dom.window.Event('gmp-click'));
    obj.position = { lat: 3, lng: 4 }; obj.dispatchEvent(new dom.window.Event('gmp-drag'));
    assert.deepEqual(plain(control.props.markers.a), { lat: 3, lng: 4, title: 'A', drag: true });
    obj.position = { lat: () => 5, lng: () => 6 }; obj.dispatchEvent(new dom.window.Event('gmp-dragend'));
    assert.deepEqual(emitted.map(e => e[0]), ['markerClick', 'update:markers', 'markerUpdate', 'markerDrag', 'update:markers', 'markerUpdate', 'markerDragend']);
    assert.equal(control.props.markers.a.lat, 5);
    control.props.markers.a = { lat: 8, lng: 9, title: 'B', drag: false };
    control.updateMarkers();
    assert.deepEqual(plain(obj.position), point(8, 9)); assert.equal(obj.title, 'B'); assert.equal(obj.gmpDraggable, false);
    assert.deepEqual(emitted.slice(-2).map(e => e[0]), ['update:markers', 'markerUpdate']);
    const afterUpdate = emitted.length; control.updateMarkers(); assert.equal(emitted.length, afterUpdate);
    const stale = control.access.markers.a.listeners[0].callback;
    control.props.markers = {}; control.updateMarkers();
    assert.equal(obj.map, null); const before = emitted.length;
    stale(new dom.window.Event('gmp-click')); obj.dispatchEvent(new dom.window.Event('gmp-click'));
    assert.equal(emitted.length, before);
    control.props.markers = { b: { lat: 1, lng: 1 } }; control.access.map = {}; control.updateMarkers();
    const reloadMarker = control.access.markers.b.obj;
    control.load(); assert.equal(reloadMarker.map, null);
    control.access.markerLib = { AdvancedMarkerElement: AdvancedMarker }; control.access.map = {}; control.updateMarkers();
    const disposedMarker = control.access.markers.b.obj;
    control.onUnmounted(); assert.equal(disposedMarker.map, null);
});

test('Google loads both libraries and passes the Map ID', async () => {
    const controlSource = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const controlExports = {};
    class AbstractControl { propNumber(key) { return Number(this.props[key]); } propBoolean(key) { return !!this.props[key]; } emit() {} }
    vm.runInNewContext(ts.transpileModule(controlSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports: controlExports, require: name => name === 'clickgo' ? { control: { AbstractControl } } : { MapLibreAdapter }
    });
    for (const [mapId, expected] of [['', 'DEMO_MAP_ID'], ['production-map-id', 'production-map-id']]) {
        const frame = new JSDOM('<!doctype html><html><head></head><body></body></html>');
        const calls = [], maps = [];
        class GoogleMap { constructor(el, options) { maps.push(options); } addListener() {} }
        frame.window.google = { maps: { importLibrary: async name => { calls.push(name); return name === 'marker' ? { AdvancedMarkerElement: class {} } : {}; }, Map: GoogleMap, OverlayView: class {} } };
        const control = new controlExports.default(); control.props.mapId = mapId;
        control.iframeLoad({ currentTarget: { contentWindow: frame.window } });
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(calls, ['maps', 'marker']); assert.equal(maps[0].mapId, expected);
        frame.window.close();
    }
});

test('Google map ID changes reload only Google maps', async () => {
    const source = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const exports = {}, watchers = new Map();
    class AbstractControl { watch(name, fn) { watchers.set(name, fn); } }
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports, require: name => name === 'clickgo' ? { control: { AbstractControl }, tool: { blob2DataUrl: async () => 'image' } } : { MapLibreAdapter }
    });
    const control = new exports.default(); control.packageFiles = { '/res/marker.svg': new Blob() };
    let reloads = 0; control.load = () => { ++reloads; };
    await control.onMounted();
    watchers.get('mapId')(); assert.equal(reloads, 2);
    control.props.factory = 'tianditu'; watchers.get('mapId')(); assert.equal(reloads, 2);
});

test('zoom binding echoes leave animated zoom alone and external zoom still applies', async () => {
    const source = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const exports = {}, watchers = new Map();
    class AbstractControl { watch(name, fn) { watchers.set(name, fn); } propNumber(key) { return Number(this.props[key]); } }
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports, require: name => name === 'clickgo' ? { control: { AbstractControl }, tool: { blob2DataUrl: async () => 'image' } } : { MapLibreAdapter }
    });
    const control = new exports.default(); control.packageFiles = { '/res/marker.svg': new Blob() };
    await control.onMounted();
    for (const factory of ['tianditu', 'google']) {
        const commands = [];
        control.props.factory = factory;
        control.access.map = { setZoom: value => commands.push(value) };
        for (const frame of [10.02, 10.6, 11, 10.8, 10]) {
            control.zoomData = frame;
            control.props.zoom = frame;
            watchers.get('zoom')();
        }
        assert.deepEqual(commands, []);
        control.props.zoom = 12.5; watchers.get('zoom')();
        assert.deepEqual(commands, [factory === 'tianditu' ? 11.5 : 12.5]);
    }
});

test('obsolete Google iframe cannot initialize after library imports resolve', async () => {
    const source = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const exports = {}, pending = [];
    class AbstractControl { propNumber(key) { return Number(this.props[key]); } propBoolean(key) { return !!this.props[key]; } emit() {} }
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports, require: name => name === 'clickgo' ? { control: { AbstractControl } } : { MapLibreAdapter }
    });
    const frame = new JSDOM('<!doctype html><html><head></head><body></body></html>');
    let created = 0;
    frame.window.google = { maps: { importLibrary: () => new Promise(resolve => pending.push(resolve)), Map: class { constructor() { ++created; } }, OverlayView: class {} } };
    const control = new exports.default(); control.iframeLoad({ currentTarget: { contentWindow: frame.window } });
    control.access.iwindow = undefined; pending.forEach(resolve => resolve({}));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(created, 0); frame.window.close();
});

test('reload and unmount release maps, SDK references and all Google objects', async () => {
    const source = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports, require: name => name === 'clickgo' ? { control: { AbstractControl: class {} } } : { MapLibreAdapter }
    });
    for (const action of ['load', 'onUnmounted']) {
        const control = new exports.default(), removed = [];
        const iframe = { contentWindow: {} };
        const path = { addListener() { return { remove() { removed.push('path'); } }; }, getArray() { return []; } };
        const marker = { map: {}, removeEventListener() { removed.push('marker listener'); } };
        control.access.iframe = iframe; control.access.iwindow = iframe.contentWindow;
        control.access.markerImg = 'image'; control.access.lib = {}; control.access.markerLib = {};
        control.access.map = {}; control.access.overlay = {};
        control.access.mapLibre = { destroy() { removed.push('adapter'); } };
        control.access.markers.a = { obj: marker, listeners: [{ type: 'gmp-click', callback() {} }] };
        control.access.lines.a = { obj: { getPath: () => path, setMap(value) { assert.equal(value, null); removed.push('line'); } } };
        control.access.polygons.a = { obj: { getPath: () => path, setMap(value) { assert.equal(value, null); removed.push('polygon'); } } };
        control.access.overlays.a = { obj: { setMap(value) { assert.equal(value, null); removed.push('overlay'); } } };
        control.addLinePathEvent(path, 'a');
        control[action]();
        assert.equal(marker.map, null);
        assert.deepEqual(removed.sort(), ['adapter', 'line', 'marker listener', 'overlay', 'path', 'path', 'path', 'polygon'].sort());
        control[action]();
        assert.equal(removed.length, 8, 'repeated cleanup must not remove objects again');
        for (const field of ['mapLibre', 'markerLib', 'lib', 'map', 'overlay', 'iwindow']) assert.equal(control.access[field], undefined);
        for (const field of ['markers', 'lines', 'polygons', 'overlays']) assert.equal(Object.keys(control.access[field]).length, 0);
        assert.equal(control.access.iframe, iframe); assert.equal(control.access.markerImg, 'image');
    }
});

test('Google polygon updates emit polygon events and detach replaced paths', async () => {
    const controlSource = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const controlExports = {};
    vm.runInNewContext(ts.transpileModule(controlSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports: controlExports, require: name => name === 'clickgo' ? { control: { AbstractControl: class {} } } : { MapLibreAdapter }
    });
    const control = new controlExports.default();
    const emitted = []; control.emit = (...args) => emitted.push(args);
    const callbacks = new Map();
    const path = { getArray: () => [point(1, 2), point(3, 4), point(5, 6)], addListener(name, callback) { callbacks.set(name, callback); return { remove() { callbacks.delete(name); } }; } };
    control.props.polygons.a = { path: [] };
    control.access.polygons.a = { path: [], obj: { getPath: () => path, setPath() {}, setMap() {} } };
    control.addPolygonPathEvent(path, 'a');
    callbacks.get('set_at')(1);
    assert.deepEqual(emitted.map(event => event[0]), ['update:polygons', 'polygonUpdate']);
    control.props.polygons = {};
    control.updatePolygons();
    assert.equal(callbacks.size, 0);
});

test('iframe imports the v6 ESM entry and initializes from its module namespace', async () => {
    const controlSource = await readFile(new URL('../../sources/control/map/code.ts', import.meta.url), 'utf8');
    const controlExports = {};
    const initialized = [];
    class Adapter {
        constructor(options) { initialized.push(options); this.map = {}; }
        syncMarkers() {} syncOverlays() {} syncShapes() {}
    }
    class AbstractControl {
        propNumber(key) { return Number(this.props[key]); }
        propBoolean(key) { return !!this.props[key]; }
        emit() {}
    }
    vm.runInNewContext(ts.transpileModule(controlSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
        exports: controlExports,
        require: name => name === 'clickgo' ? { control: { AbstractControl }, getCdn: () => 'https://cdn.jsdelivr.net' } : { MapLibreAdapter: Adapter }
    });
    const control = new controlExports.default();
    control.props.factory = 'tianditu';
    const frame = new JSDOM('<!doctype html><html><head></head><body></body></html>');
    control.iframeLoad({ currentTarget: { contentWindow: frame.window } });
    const script = frame.window.document.querySelector('script');
    assert.equal(script.type, 'module');
    assert.equal(script.hasAttribute('src'), false);
    assert.match(script.textContent, /import \* as maplibregl from "https:\/\/cdn\.jsdelivr\.net\/npm\/maplibre-gl@6\.18\.0\/dist\/maplibre-gl\.mjs"/);
    assert.match(script.textContent, /window\.initMapLibre\(maplibregl\)/);
    const module = { Map: class {} };
    frame.window.initMapLibre(module);
    assert.equal(initialized[0].lib, module);
    assert.equal(control.access.lib, module);
    control.access.iwindow = undefined;
    frame.window.initMapLibre(module);
    assert.equal(initialized.length, 1, 'obsolete iframe must not initialize a map');
    frame.window.close();
});

test('worker-bound style and GeoJSON objects belong to the SDK iframe realm', () => {
    const frame = new JSDOM('<!doctype html><div id="map"></div>', { runScripts: 'outside-only' });
    const m = create({ container: frame.window.document.querySelector('#map') });
    const assertRealm = value => {
        if (!value || typeof value !== 'object') return;
        if (!Array.isArray(value)) assert.equal(Object.getPrototypeOf(value), frame.window.Object.prototype);
        for (const child of Object.values(value)) assertRealm(child);
    };
    assert.notEqual(frame.window.Object, Object);
    assertRealm(m.map.options.style);
    for (const kind of ['line', 'polygon']) {
        m.adapter.syncShapes(kind, { a: { path: [point(1, 2), point(3, 4), point(5, 6)], edit: true } });
        const entry = m.adapter.shapes.get(`${kind}:a`);
        assertRealm(m.map.getSource(entry.id).data);
        assertRealm(m.map.getLayer(entry.id));
        if (kind === 'polygon') assertRealm(m.map.getLayer(`${entry.id}-fill`));
        m.adapter.removeNode(kind, 'a', 1);
        assertRealm(m.map.getSource(entry.id).data);
    }
    m.adapter.destroy(); frame.window.close();
});

test('tile templates use XYZ coordinates, region and zoom threshold', async () => {
    const m = create({ urlCn: 'https://cn/{z}/{x}/{y}/{s}' });
    const protocol = [...protocols.values()].at(-1);
    requests.length = 0;
    await protocol({ url: 'clickgo-tile://base/10/1/1' }, new AbortController());
    await protocol({ url: 'clickgo-tile://base/12/3413/1551' }, new AbortController());
    await protocol({ url: 'clickgo-tile://base/12/100/100' }, new AbortController());
    assert.deepEqual(requests, ['https://cn/10/1/1/2', 'https://cn/12/3413/1551/4']);
    const transparent = await protocol({ url: 'clickgo-tile://labels/12/100/100' }, new AbortController());
    assert.equal(requests.length, 2);
    const png = Buffer.from(transparent.data);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const chunks = [];
    for (let offset = 8; offset < png.length;) {
        const length = png.readUInt32BE(offset);
        const type = png.toString('ascii', offset + 4, offset + 8);
        const data = png.subarray(offset + 8, offset + 8 + length);
        if (type === 'IHDR') {
            assert.equal(data.readUInt32BE(0), 1); assert.equal(data.readUInt32BE(4), 1);
            assert.equal(data[8], 8); assert.equal(data[9], 6);
        }
        if (type === 'IDAT') chunks.push(data);
        offset += length + 12;
    }
    assert.ok(chunks.length);
    const pixel = inflateSync(Buffer.concat(chunks));
    assert.deepEqual([...pixel], [0, 0, 0, 0, 0], 'RGBA pixel must be fully transparent');
    m.adapter.destroy();
});

test('protocol responses use the iframe object realm', async () => {
    const frame = new JSDOM('<!doctype html><div id="map"></div>', { runScripts: 'outside-only' });
    const m = create({ container: frame.window.document.querySelector('#map'), urlCn: 'https://cn/{z}/{x}/{y}' });
    const protocol = [...protocols.values()].at(-1);
    const response = await protocol({ url: 'clickgo-tile://base/10/1/1' }, new AbortController());
    assert.equal(Object.getPrototypeOf(response), frame.window.Object.prototype);
    m.adapter.vectorTiles = ['https://intl/{z}/{x}/{y}.pbf'];
    const vector = await protocol({ url: 'clickgo-tile://vector/10/1/1/11' }, new AbortController());
    assert.equal(Object.getPrototypeOf(vector), frame.window.Object.prototype);
    m.adapter.destroy(); frame.window.close();
});

test('public zoom is converted to MapLibre zoom and back', async () => {
    const m = create({ zoom: 10 });
    assert.equal(m.map.options.zoom, 9);
    assert.equal(m.map.options.minZoom, -1);
    assert.equal(m.map.options.maxZoom, 17);
    m.map.options.zoom = 14; m.map.fire('zoom');
    assert.deepEqual(plain(m.events.at(-1)), ['zoom', 15]);
    m.adapter.destroy();
});

test('markers and overlays synchronize, emit events and release replaced entries', () => {
    const m = create();
    m.adapter.syncMarkers({ a: { lat: 1, lng: 2, title: 'A', drag: true } });
    m.adapter.syncOverlays({ b: { lat: 3, lng: 4, html: '<b>hello</b>' } });
    const [marker, overlay] = FakeMarker.instances;
    assert.deepEqual(plain(marker.position), { lng: 2, lat: 1 });
    assert.equal(marker.options.element.textContent, 'A');
    assert.equal(overlay.options.element.textContent, 'hello');
    marker.options.element.click(); overlay.options.element.click();
    marker.setLngLat([9, 8]); marker.fire('drag'); marker.fire('dragend');
    assert.deepEqual(plain(m.markers), [['a', { lat: 8, lng: 9 }]]);
    assert.deepEqual(plain(m.events), [['markerClick', 'a'], ['overlayClick', 'b'], ['markerDrag', 'a'], ['markerDragend', 'a']]);
    m.adapter.syncMarkers({ a: { lat: 5, lng: 6 } });
    m.adapter.syncMarkers({ a: { lat: 5, lng: 6 } });
    assert.deepEqual(plain(m.markers), [['a', { lat: 8, lng: 9 }], ['a', { lat: 5, lng: 6 }]]);
    m.adapter.syncOverlays({});
    assert.equal(marker.removed, undefined); assert.equal(overlay.removed, true);
    assert.deepEqual(plain(marker.position), { lng: 6, lat: 5 }); m.adapter.destroy();
    assert.equal(marker.removed, true); assert.equal(m.map.removed, true);
});

test('Vue reactive shape data is accepted', () => {
    const m = create();
    const shapes = reactive({ a: { path: [point(1, 2), point(3, 4)], edit: true } });
    m.adapter.syncShapes('line', shapes);
    assert.equal(m.map.sources.size, 1);
    m.adapter.destroy();
});

test('marker drag synchronizes continuously without replacing the dragged marker', () => {
    const m = create();
    const items = { a: { lat: 1, lng: 2, drag: true } };
    m.adapter.syncMarkers(items);
    const marker = FakeMarker.instances[0];
    marker.fire('dragstart'); marker.setLngLat([4, 3]); marker.fire('drag');
    assert.deepEqual(plain(m.markers.at(-1)), ['a', point(3, 4)]);
    items.a.lat = 3; items.a.lng = 4; m.adapter.syncMarkers(items);
    assert.equal(marker.removed, undefined);
    marker.fire('dragend'); m.adapter.destroy();
});

test('edited node survives model synchronization during its drag', () => {
    let m;
    const shapes = reactive({ a: { path: [point(1, 2), point(3, 4)], edit: true } });
    m = create({ pathChange: (_kind, key, path) => { shapes[key].path = path; m.adapter.syncShapes('line', shapes); } });
    m.adapter.syncShapes('line', shapes);
    const vertex = FakeMarker.instances[0];
    vertex.fire('dragstart'); vertex.setLngLat([4, 3]); vertex.fire('drag');
    assert.equal(vertex.removed, undefined);
    vertex.setLngLat([6, 5]); vertex.fire('drag'); vertex.fire('dragend');
    assert.deepEqual(plain(shapes.a.path[0]), point(5, 6));
    m.adapter.destroy();
});

for (const kind of ['line', 'polygon']) test(`${kind} editing and dragging updates geometry and events`, () => {
    const m = create();
    const path = [point(1, 2), point(3, 4), point(5, 6)];
    m.adapter.syncShapes(kind, { a: { path, edit: true, drag: true } });
    const layer = [...m.map.layers.keys()].find(id => id !== 'base' && !id.endsWith('-fill'));
    const target = kind === 'polygon' ? `${layer}-fill` : layer;
    const geometry = m.map.getSource(layer).data.geometry;
    assert.deepEqual(plain(kind === 'line' ? geometry.coordinates : geometry.coordinates[0].slice(0, -1)), [[2, 1], [4, 3], [6, 5]]);
    const vertex = FakeMarker.instances[0], midpoint = FakeMarker.instances[1];
    vertex.options.element.dispatchEvent(new dom.window.Event('pointerdown'));
    assert.equal(m.menus[0][2], 0);
    midpoint.fire('dragstart'); midpoint.setLngLat([3.5, 2.5]); midpoint.fire('drag'); midpoint.fire('dragend');
    assert.equal(m.paths[0][3], 'insert'); assert.equal(m.paths[0][4], 1);
    assert.equal(m.paths[1][3], 'update'); assert.deepEqual(plain(m.paths[1][2][1]), point(2.5, 3.5));
    m.adapter.removeNode(kind, 'a', 1);
    assert.equal(m.paths.at(-1)[3], 'remove'); assert.deepEqual(plain(m.paths.at(-1)[5]), point(2.5, 3.5));
    m.map.fire('click', {}, target);
    m.map.fire('mousedown', { originalEvent: { target: m.map.getCanvas() }, lngLat: { lat: 1, lng: 2 }, preventDefault() {} }, target);
    m.map.fire('mousemove', { lngLat: { lat: 2, lng: 4 } }); m.map.fire('mouseup');
    assert.deepEqual(plain(m.paths.at(-1)[2][0]), point(2, 4));
    assert.deepEqual(plain(m.events), [[`${kind}Drag`, 'a'], [`${kind}Dragend`, 'a'], [`${kind}Click`, 'a'], [`${kind}Drag`, 'a'], [`${kind}Dragend`, 'a']]);
    assert.equal(m.map.disabled, false);
    m.adapter.syncShapes(kind, {}); assert.equal(m.map.sources.size, 0); assert.equal(m.map.layers.size, 1);
    assert.ok(FakeMarker.instances.every(marker => marker.removed));
    m.adapter.destroy();
});

for (const kind of ['line', 'polygon']) for (const event of ['mousedown', 'touchstart']) {
    test(`${kind} ${event} gives vertices and midpoints priority over the shape`, () => {
        const m = create();
        const original = [point(1, 2), point(3, 4), point(5, 6)];
        m.adapter.syncShapes(kind, { a: { path: original, edit: true, drag: true } });
        const entry = m.adapter.shapes.get(`${kind}:a`);
        const layer = kind === 'polygon' ? `${entry.id}-fill` : entry.id;
        for (const handle of entry.handles.slice(0, 2)) {
            m.map.fire(event, {
                originalEvent: { target: handle.options.element },
                lngLat: { lat: 1, lng: 2 },
                preventDefault() { assert.fail('shape must not claim a control-point gesture'); }
            }, layer);
            m.map.fire('mousemove', { lngLat: { lat: 9, lng: 10 } });
            m.map.fire('mouseup');
            assert.equal(m.paths.length, 0);
            assert.deepEqual(plain(entry.shape.path), original);
            assert.equal(handle.removed, undefined);
        }
        const vertex = entry.handles[0];
        vertex.fire('dragstart'); vertex.setLngLat([7, 8]); vertex.fire('drag'); vertex.fire('dragend');
        assert.deepEqual(plain(entry.shape.path), [point(8, 7), original[1], original[2]]);
        m.map.fire(event, { originalEvent: { target: m.map.getCanvas() }, lngLat: { lat: 1, lng: 2 }, preventDefault() {} }, layer);
        m.map.fire('mousemove', { lngLat: { lat: 2, lng: 4 } }); m.map.fire('mouseup');
        assert.deepEqual(plain(entry.shape.path), [point(9, 9), point(4, 6), point(6, 8)]);
        m.adapter.destroy();
    });
}

test('pending style load does not create shapes after destruction', () => {
    const m = create(); m.map.loaded = false; m.map.layers.delete('base');
    m.adapter.syncShapes('line', { a: { path: [point(1, 2), point(3, 4)] } });
    m.adapter.destroy(); m.map.loaded = true; m.map.fire('load');
    assert.equal(m.map.sources.size, 0);
});

test('only the latest shape collection applies after deferred style load', () => {
    const m = create(); m.map.loaded = false; m.map.layers.delete('base');
    m.adapter.syncShapes('line', { stale: { path: [point(1, 2), point(3, 4)] } });
    m.adapter.syncShapes('line', {});
    m.map.loaded = true; m.map.layers.set('base', { id: 'base' }); m.map.fire('load');
    assert.equal(m.map.sources.size, 0);
    m.adapter.destroy();
});

test('destroying one map leaves another map tile protocol usable', async () => {
    const first = create({ urlCn: 'https://first/{z}/{x}/{y}' });
    const second = create({ urlCn: 'https://second/{z}/{x}/{y}' });
    const tile = second.map.options.style.sources.base.tiles[0];
    const scheme = tile.slice(0, tile.indexOf('://'));
    first.adapter.destroy();
    const protocol = protocols.get(scheme);
    assert.equal(typeof protocol, 'function');
    requests.length = 0;
    await protocol({ url: tile.replace('{z}', '10').replace('{x}', '1').replace('{y}', '1') }, new AbortController());
    assert.deepEqual(requests, ['https://second/10/1/1']);
    second.adapter.destroy();
});

test('vector TileJSON and attribution follow actual tile routing', async () => {
    const m = create({ center: point(40, -74), zoom: 10.49 });
    m.map.fire('load');
    assert.match(m.map.controls[0].options.customAttribution, /天地图/);
    const domesticLink = JSDOM.fragment(m.map.controls[0].options.customAttribution).querySelector('a');
    assert.equal(requests.includes('https://tiles.openfreemap.org/planet'), false);
    m.map.options.zoom = 9.5;
    m.map.fire('zoom');
    await new Promise(resolve => setTimeout(resolve, 0));
    const attribution = m.map.controls[0].options.customAttribution;
    const credit = JSDOM.fragment(attribution).firstElementChild;
    assert.equal(credit.textContent, '© OpenMapTiles © OpenStreetMap contributors');
    assert.equal(credit.style.whiteSpace, 'nowrap');
    assert.equal(credit.querySelectorAll('a')[1].textContent, 'OpenStreetMap');
    assert.deepEqual([...credit.querySelectorAll('a')].map(a => a.href), ['https://openmaptiles.org/', 'https://www.openstreetmap.org/copyright']);
    assert.ok(requests.includes('https://tiles.openfreemap.org/planet'));
    assert.equal(m.map.getLayer('cg-international-country'), undefined);
    assert.ok(m.map.getLayer('cg-international-road'), JSON.stringify([m.events.map(e => [e[0], String(e[1])]), [...m.map.layers.keys()], requests]));
    const protocol = [...protocols.values()].at(-1);
    requests.length = 0;
    await protocol({ url: 'clickgo-tile://vector/10/100/100/11' }, new AbortController());
    assert.deepEqual(requests, ['https://tiles.openfreemap.org/planet/10/100/100.pbf']);
    assert.equal(m.map.glyphs, 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf');
    assert.equal(m.map.sprite, 'https://tiles.openfreemap.org/sprites/ofm');
    for (const link of [domesticLink, ...credit.querySelectorAll('a')]) {
        assert.equal(link.target, '_blank');
        assert.ok(link.relList.contains('noopener'));
    }
    m.adapter.destroy();
    const custom = create({ center: point(40, -74), zoom: 11, hostIntl: 'custom.example' });
    custom.map.fire('load');
    assert.equal(custom.map.controls[0].options.customAttribution, attribution);
    custom.adapter.destroy();
});

test('mirror host resolves default, relative and external resources without adding credentials', async () => {
    const oldStyle = structuredClone(styleFixture), oldTiles = structuredClone(tileFixture);
    try {
        styleFixture.glyphs = '../fonts/{fontstack}/{range}.pbf?literal=%7Bvalue%7D';
        styleFixture.sprite = [{ id: 'default', url: 'https://tiles.openfreemap.org/sprites/ofm' }, { id: 'external', url: 'https://sprites.example/external' }];
        styleFixture.sources.openmaptiles.url = 'https://tiles.openfreemap.org/planet';
        tileFixture.tiles = ['/data/{z}/{x}/{y}.pbf?literal=%7Bvalue%7D'];
        requests.length = 0;
        const m = create({ center: point(40, -74), zoom: 12, hostIntl: '  mirror.example:8443  ' });
        m.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(requests.slice(0, 2), ['https://mirror.example:8443/styles/liberty', 'https://mirror.example:8443/planet']);
        assert.equal(m.map.glyphs, 'https://mirror.example:8443/fonts/{fontstack}/{range}.pbf?literal=%7Bvalue%7D');
        assert.deepEqual(plain(m.map.sprite), [{ id: 'default', url: 'https://mirror.example:8443/sprites/ofm' }, { id: 'external', url: 'https://sprites.example/external' }]);
        assert.match(m.map.controls[0].options.customAttribution, /OpenStreetMap/);
        const protocol = [...protocols.values()].at(-1); requests.length = 0;
        await protocol({ url: 'clickgo-tile://vector/10/100/100/12' }, new AbortController());
        assert.deepEqual(requests, ['https://mirror.example:8443/data/10/100/100.pbf?literal=%7Bvalue%7D']);
        m.adapter.destroy();
        styleFixture.sources.openmaptiles.url = '../tiles/metadata.json';
        tileFixture.tiles = ['./{z}/{x}/{y}.pbf'];
        const relative = create({ center: point(40, -74), zoom: 12, hostIntl: 'mirror.example' });
        requests.length = 0; relative.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(requests.slice(0, 2), ['https://mirror.example/styles/liberty', 'https://mirror.example/tiles/metadata.json']);
        assert.equal(relative.adapter.vectorTiles[0], 'https://mirror.example/tiles/{z}/{x}/{y}.pbf');
        relative.adapter.destroy();
        styleFixture.sources.openmaptiles.url = 'https://tiles.external.example/tilejson';
        tileFixture.tiles = ['./{z}/{x}/{y}.pbf'];
        const external = create({ center: point(40, -74), zoom: 12, hostIntl: 'mirror.example' });
        requests.length = 0; external.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(requests.slice(0, 2), ['https://mirror.example/styles/liberty', 'https://tiles.external.example/tilejson']);
        assert.equal(external.adapter.vectorTiles[0], 'https://tiles.external.example/{z}/{x}/{y}.pbf');
        external.adapter.destroy();
    }
    finally { Object.assign(styleFixture, oldStyle); Object.assign(tileFixture, oldTiles); }
});

test('invalid overseas host is rejected only when overseas data is needed', async () => {
    for (const hostIntl of ['https://mirror.example', 'mirror.example/path', 'mirror.example?key=x', 'user@mirror.example', 'mirror.example' + String.fromCharCode(92), 'mirror.example:99999']) {
        requests.length = 0;
        const m = create({ center: point(31, 121), zoom: 12, hostIntl });
        m.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(requests, []); assert.equal(m.events.some(event => event[0] === 'error'), false);
        m.map.center = point(40, -74); m.map.fire('move'); await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(requests, []); assert.equal(m.events.some(event => event[0] === 'error'), true);
        m.adapter.destroy();
    }
});

test('vector requests respect raster region, zoom and transitions without stale empty tiles', async () => {
    const tile = (lat, lng, z) => {
        const n = 2 ** z, radians = lat * Math.PI / 180;
        return [Math.floor((lng + 180) / 360 * n), Math.floor((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2 * n)];
    };
    const domestic = create({ center: point(31.2, 121.4), zoom: 10 });
    requests.length = 0;
    for (const publicZoom of [8, 10, 10.75, 11, 18]) {
        domestic.map.options.zoom = publicZoom - 1; domestic.map.fire('zoom');
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(requests.filter(url => String(url).includes('styles/liberty') || String(url).includes('/planet')).length, 0, `unexpected overseas setup at ${publicZoom}`);
    }
    domestic.map.center = point(40, -74); domestic.map.options.zoom = 11; domestic.map.fire('move');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.ok(domestic.adapter.vectorLoaded);
    assert.equal(domestic.map.getLayer('cg-international-road').layout.visibility, 'visible');
    const source = domestic.map.getSource('cg-international');
    const protocol = [...protocols.values()].at(-1);
    const [dx, dy] = tile(31.2, 121.4, 10), [fx, fy] = tile(40, -74, 10);
    requests.length = 0;
    const empty = await protocol({ url: `clickgo-tile://vector/10/${dx}/${dy}/12` }, new AbortController());
    assert.equal(empty.data.byteLength, 0); assert.equal(requests.length, 0);
    await protocol({ url: `clickgo-tile://vector/10/${fx}/${fy}/12` }, new AbortController());
    assert.deepEqual(requests, [`https://tiles.openfreemap.org/planet/10/${fx}/${fy}.pbf`]);
    domestic.map.center = point(31.2, 121.4); domestic.map.fire('move');
    assert.equal(domestic.map.getLayer('cg-international-road').layout.visibility, 'none');
    domestic.map.center = point(40, -74); domestic.map.options.zoom = 7; domestic.map.fire('zoom');
    assert.equal(domestic.map.getLayer('cg-international-road').layout.visibility, 'none');
    requests.length = 0;
    await protocol({ url: `clickgo-tile://vector/10/${fx}/${fy}/10` }, new AbortController());
    assert.equal(requests.length, 0);
    domestic.map.options.zoom = 17; domestic.map.fire('zoom');
    assert.match(source.tiles[0], /\/18$/); assert.equal(source.tileChanges, 1);
    assert.equal(domestic.map.getLayer('cg-international-road').layout.visibility, 'visible');
    const [dx14, dy14] = tile(31.2, 121.4, 14);
    requests.length = 0;
    await protocol({ url: `clickgo-tile://vector/14/${dx14}/${dy14}/18` }, new AbortController());
    assert.equal(requests.length, 0);
    domestic.adapter.destroy();
});

test('mixed vector footprints remain downloadable and mixed viewport enables the source', async () => {
    const mixed = create({ center: point(20, 0.05), zoom: 12, inChina: p => p.lng > 0.3 });
    mixed.map.bounds = { west: -0.1, east: 0.2, north: 20.1, south: 19.9 };
    mixed.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(mixed.map.getLayer('cg-international-road').layout.visibility, 'visible');
    const protocol = [...protocols.values()].at(-1), y = Math.floor((1 - Math.asinh(Math.tan(20 * Math.PI / 180)) / Math.PI) / 2 * 2 ** 9);
    requests.length = 0;
    await protocol({ url: `clickgo-tile://vector/9/256/${y}/11` }, new AbortController());
    assert.deepEqual(requests, [`https://tiles.openfreemap.org/planet/9/256/${y}.pbf`]);
    mixed.map.bounds = { west: 1, east: 1.1, north: 20.1, south: 19.9 }; mixed.map.fire('resize');
    assert.equal(mixed.map.getLayer('cg-international-road').layout.visibility, 'none');
    mixed.map.bounds = { west: -0.1, east: 0.2, north: 20.1, south: 19.9 }; mixed.map.fire('resize');
    assert.equal(mixed.map.getLayer('cg-international-road').layout.visibility, 'visible');
    mixed.adapter.destroy();
});

test('same vector tile is reclassified per raster level', async () => {
    const m = create({ center: point(20, -1), zoom: 11, inChina: p => p.lng > 0.1 });
    m.map.fire('load'); await new Promise(resolve => setTimeout(resolve, 0));
    const protocol = [...protocols.values()].at(-1), y = Math.floor((1 - Math.asinh(Math.tan(20 * Math.PI / 180)) / Math.PI) / 2 * 2 ** 9);
    requests.length = 0;
    const coarse = await protocol({ url: `clickgo-tile://vector/9/256/${y}/11` }, new AbortController());
    assert.equal(coarse.data.byteLength, 0); assert.deepEqual(requests, []);
    await protocol({ url: `clickgo-tile://vector/9/256/${y}/12` }, new AbortController());
    assert.deepEqual(requests, [`https://tiles.openfreemap.org/planet/9/256/${y}.pbf`]);
    m.adapter.destroy();
});

test('shape styling preserves nodes and layer, and cancellation preserves dragPan state', () => {
    const m = create();
    const shape = { path: [point(1, 2), point(3, 4)], edit: true, drag: true };
    m.adapter.syncShapes('line', { a: shape });
    const entry = m.adapter.shapes.get('line:a'), handles = [...entry.handles];
    m.adapter.syncShapes('line', { a: { ...shape, strokeColor: '#f00' } });
    assert.equal(m.adapter.shapes.get('line:a'), entry);
    assert.equal(entry.handles[0], handles[0]);
    assert.equal(m.map.getLayer(entry.id).paint['line-color'], '#f00');
    m.adapter.removeNode('line', 'a', 0);
    assert.equal(entry.shape.path.length, 2);
    m.map.disabled = true;
    m.map.fire('mousedown', { originalEvent: { target: m.map.getCanvas() }, lngLat: point(1, 2), preventDefault() {} }, entry.id);
    dom.window.dispatchEvent(new dom.window.Event('blur'));
    assert.equal(m.map.disabled, true);
    m.adapter.destroy();
});

if (process.env.CLICKGO_MAP_TEST_ARCHIVE === '1') test('map archive contains current packaged control and resources', async () => {
    const zip = await JSZip.loadAsync(await readFile(new URL('../../control/map.cgc', import.meta.url)));
    for (const path of ['map/config.json', 'map/code.js', 'map/layout.html', 'map/style.css', 'map/res/marker.svg']) assert.ok(zip.file(path), `missing ${path}`);
    const archived = await zip.file('map/code.js').async('string');
    const packed = await readFile(new URL('../../sources/control/map/code.pack.js', import.meta.url), 'utf8');
    assert.equal(archived, packed, 'map archive must contain current packaged code');
    assert.ok(archived.includes('maplibre-gl'), 'map archive must contain MapLibre integration');
    const layout = await zip.file('map/layout.html').async('string');
    assert.match(layout, /<cg-menulist-item alt="Ctrl\+R" alt-popup @click="removeNode">/);
});

let failures = 0;
for (const [name, fn] of cases) {
    try { await fn(); console.log(`PASS ${name}`); }
    catch (error) { failures++; console.error(`FAIL ${name}\n${error.stack}`); }
}
console.log(`${cases.length - failures}/${cases.length} MapLibre simulated cases passed.`);
if (failures) process.exitCode = 1;
