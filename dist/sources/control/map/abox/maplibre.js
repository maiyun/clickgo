let nextProtocol = 0;
export class MapLibreAdapter {
    map;
    options;
    markers = new Map();
    overlays = new Map();
    shapes = new Map();
    control;
    vectorTiles = [];
    vectorLoading = false;
    vectorLoaded = false;
    vectorLayers = [];
    vectorVisible = false;
    vectorLevel = -1;
    attribution;
    attributionHTML = '';
    vectorFailed = false;
    vectorAbort = new AbortController();
    sequence = 0;
    drag;
    cancelDrag = () => { this.endDrag(); };
    protocol = `clickgo-tile-${++nextProtocol}`;
    pending = {};
    waiting = new Set();
    disposed = false;
    constructor(options) {
        this.options = options;
        const lib = options.lib;
        const responseData = (data) => {
            const realm = options.container.ownerDocument.defaultView;
            const result = new realm.Object();
            result.data = data;
            return result;
        };
        lib.addProtocol(this.protocol, async (params, abort) => {
            const parts = params.url.match(/^[^:]+:\/\/(base|labels|vector)\/(\d+)\/(\d+)\/(\d+)(?:\/(\d+))?/);
            if (!parts)
                throw new Error('Invalid tile URL');
            const [, layer, zs, xs, ys] = parts;
            const z = Number(zs), x = Number(xs), y = Number(ys);
            if (layer === 'vector') {
                const level = Number(parts[5]);
                if (!Number.isInteger(level) || level < 11 || this.vectorTileIsChina(z, x, y, level))
                    return responseData(new ArrayBuffer(0));
                const template = this.vectorTiles[(x + y) % this.vectorTiles.length];
                const url = template.replace(/\{x\}/g, xs).replace(/\{y\}/g, ys).replace(/\{z\}/g, zs);
                const response = await fetch(url, { signal: abort.signal });
                if (!response.ok)
                    throw new Error(`Tile request failed: ${response.status}`);
                return responseData(await response.arrayBuffer());
            }
            const cn = this.rasterTileIsChina(z, x, y);
            if ((!cn) || (layer === 'labels' && options.urlCn))
                return responseData(Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg=='), c => c.charCodeAt(0)).buffer);
            const subdomain = String((x + y) % 8);
            const template = layer === 'labels'
                ? `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${encodeURIComponent(options.key)}`
                : options.urlCn ?? `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${encodeURIComponent(options.key)}`;
            const url = template.replace(/\{x\}/g, xs).replace(/\{y\}/g, ys).replace(/\{z\}/g, zs).replace(/\{s\}/g, subdomain);
            const response = await fetch(url, { signal: abort.signal });
            if (!response.ok)
                throw new Error(`Tile request failed: ${response.status}`);
            return responseData(await response.arrayBuffer());
        });
        try {
            this.map = new lib.Map({ container: options.container, center: [options.center.lng, options.center.lat], zoom: options.zoom - 1, minZoom: -1, maxZoom: 17, dragRotate: false, pitchWithRotate: false, attributionControl: false,
                style: this.inMapRealm({ version: 8, sources: {
                        base: { type: 'raster', tiles: [`${this.protocol}://base/{z}/{x}/{y}`], tileSize: 256 },
                        labels: { type: 'raster', tiles: [`${this.protocol}://labels/{z}/{x}/{y}`], tileSize: 256 }
                    }, layers: [{ id: 'base', type: 'raster', source: 'base' }, { id: 'labels', type: 'raster', source: 'labels' }] })
            });
        }
        catch (error) {
            lib.removeProtocol(this.protocol);
            throw error;
        }
        this.map.on('error', (event) => { if (!this.disposed)
            options.emit('error', event.error ?? event); });
        this.map.on('load', () => { this.updateProvider(); });
        this.setZoomControl(options.zoomControl);
        this.map.on('click', (e) => {
            if (this.map.queryRenderedFeatures(e.point, { layers: [...this.shapes.values()].flatMap(v => [v.id, `${v.id}-fill`].filter(id => this.map.getLayer(id))) }).length)
                return;
            options.emit('mapClick', { lat: e.lngLat.lat, lng: e.lngLat.lng });
        });
        this.map.on('move', () => {
            this.updateProvider();
            const center = this.map.getCenter();
            options.emit('center', { lat: center.lat, lng: center.lng });
        });
        this.map.on('zoom', () => { this.updateProvider(); options.emit('zoom', this.map.getZoom() + 1); });
        this.map.on('resize', () => { this.updateProvider(); });
        this.map.on('mousemove', (e) => { this.moveShape(e); });
        this.map.on('mouseup', () => { this.endDrag(); });
        this.map.on('touchmove', (e) => { this.moveShape(e); });
        this.map.on('touchend', () => { this.endDrag(); });
        const win = options.container.ownerDocument.defaultView;
        win?.addEventListener('blur', this.cancelDrag);
        win?.addEventListener('mouseup', this.cancelDrag);
        win?.addEventListener('touchend', this.cancelDrag);
        win?.addEventListener('touchcancel', this.cancelDrag);
    }
    rasterTileIsChina(z, x, y) {
        if (z < 11)
            return true;
        const n = 2 ** z;
        const point = (tx, ty) => ({ lng: tx / n * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * ty / n))) * 180 / Math.PI });
        return this.options.inChina(point(x, y)) || this.options.inChina(point(x + 1, y + 1));
    }
    vectorTileIsChina(z, x, y, level) {
        const scale = 2 ** (level - z);
        for (let row = y * scale; row < (y + 1) * scale; ++row) {
            for (let col = x * scale; col < (x + 1) * scale; ++col) {
                if (!this.rasterTileIsChina(level, col, row))
                    return false;
            }
        }
        return true;
    }
    viewportNeedsVector(level) {
        if (level < 11)
            return false;
        const bounds = this.map.getBounds();
        const n = 2 ** level;
        const west = bounds.getWest(), east = bounds.getEast();
        const longitude = east < west ? east + 360 : east;
        const left = Math.floor((west + 180) / 360 * n);
        const right = Math.min(left + n - 1, Math.floor((longitude + 180) / 360 * n));
        const tileY = (latitude) => {
            const lat = Math.max(-85.051129, Math.min(85.051129, latitude)) * Math.PI / 180;
            return Math.max(0, Math.min(n - 1, Math.floor((1 - Math.asinh(Math.tan(lat)) / Math.PI) / 2 * n)));
        };
        const top = tileY(bounds.getNorth()), bottom = tileY(bounds.getSouth());
        for (let y = top; y <= bottom; ++y) {
            for (let x = left; x <= right; ++x) {
                if (!this.rasterTileIsChina(level, (x % n + n) % n, y))
                    return true;
            }
        }
        return false;
    }
    updateProvider() {
        const zoom = this.map.getZoom();
        const z = Math.max(0, Math.round(zoom + 1));
        const n = 2 ** z;
        const center = this.map.getCenter();
        const x = Math.floor(((center.lng + 180) / 360 * n % n + n) % n);
        const lat = Math.max(-85.051129, Math.min(85.051129, center.lat)) * Math.PI / 180;
        const y = Math.max(0, Math.min(n - 1, Math.floor((1 - Math.asinh(Math.tan(lat)) / Math.PI) / 2 * n)));
        const cn = this.rasterTileIsChina(z, x, y);
        let html;
        if (cn) {
            html = '&copy; <a href="https://www.tianditu.gov.cn" target="_blank" rel="noopener">天地图</a> - GS (2026) 4921号 - 甲测资字11110974';
        }
        else {
            html = '<span style="white-space:nowrap">&copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors</span>';
        }
        if (html !== this.attributionHTML) {
            if (this.attribution)
                this.map.removeControl(this.attribution);
            this.attribution = new this.options.lib.AttributionControl({ compact: false, customAttribution: html });
            this.map.addControl(this.attribution, 'bottom-left');
            this.attributionHTML = html;
        }
        const needed = this.viewportNeedsVector(z);
        if (this.vectorLoaded) {
            const levelChanged = this.vectorLevel !== z && z >= 11;
            if ((levelChanged || !needed) && this.vectorVisible)
                this.setVectorVisibility(false);
            if (levelChanged) {
                this.map.getSource('cg-international').setTiles(this.inMapRealm([`${this.protocol}://vector/{z}/{x}/{y}/${z}`]));
                this.vectorLevel = z;
            }
            if (needed && !this.vectorVisible)
                this.setVectorVisibility(true);
        }
        else if (needed && !this.vectorLoading && !this.vectorFailed && this.map.getLayer('base')) {
            this.vectorLoading = true;
            void this.loadVector().catch(error => { if (!this.disposed) {
                this.vectorFailed = true;
                this.options.emit('error', error);
            } }).finally(() => { this.vectorLoading = false; if (!this.disposed && !this.vectorLoaded && !this.vectorFailed)
                this.updateProvider(); });
        }
    }
    setVectorVisibility(visible) {
        for (const id of this.vectorLayers)
            this.map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
        this.vectorVisible = visible;
    }
    internationalHost() {
        const value = this.options.hostIntl?.trim() || 'tiles.openfreemap.org';
        if (/[\s\\/@?#]/.test(value))
            throw new Error('Invalid overseas map host');
        const parsed = new URL(`https://${value}`);
        if (!parsed.hostname || parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password)
            throw new Error('Invalid overseas map host');
        return parsed.host;
    }
    internationalResource(value, base, host) {
        const placeholders = [];
        const template = value.replace(/\{[^{}]+\}/g, match => `__cg_placeholder_${placeholders.push(match) - 1}__`);
        const url = new URL(template, base);
        if (url.hostname === 'tiles.openfreemap.org') {
            url.protocol = 'https:';
            url.host = host;
        }
        return url.href.replace(/__cg_placeholder_(\d+)__/g, (_, index) => placeholders[Number(index)]);
    }
    async loadVector() {
        const host = this.internationalHost();
        const styleUrl = `https://${host}/styles/liberty`;
        const response = await fetch(styleUrl, { signal: this.vectorAbort.signal });
        if (!response.ok)
            throw new Error(`Vector style request failed: ${response.status}`);
        const style = await response.json();
        if (this.disposed || !this.viewportNeedsVector(Math.max(0, Math.round(this.map.getZoom() + 1))))
            return;
        const source = this.internationalResource(style.sources.openmaptiles.url, styleUrl, host);
        const tilejson = await fetch(source, { signal: this.vectorAbort.signal });
        if (!tilejson.ok)
            throw new Error(`Vector TileJSON request failed: ${tilejson.status}`);
        const data = await tilejson.json();
        const tiles = data.tiles.map((url) => this.internationalResource(url, source, host));
        const maxzoom = data.maxzoom ?? 14;
        if (this.disposed || !this.viewportNeedsVector(Math.max(0, Math.round(this.map.getZoom() + 1))))
            return;
        if (!tiles.length)
            throw new Error('Vector TileJSON has no tiles');
        this.vectorTiles = tiles;
        this.map.setGlyphs(this.internationalResource(style.glyphs, styleUrl, host));
        const sprite = Array.isArray(style.sprite)
            ? style.sprite.map((entry) => ({ ...entry, url: this.internationalResource(entry.url, styleUrl, host) }))
            : this.internationalResource(style.sprite, styleUrl, host);
        this.map.setSprite(this.inMapRealm(sprite));
        const installed = [];
        const level = Math.max(0, Math.round(this.map.getZoom() + 1));
        try {
            this.map.addSource('cg-international', this.inMapRealm({ type: 'vector', tiles: [`${this.protocol}://vector/{z}/{x}/{y}/${level}`], minzoom: 9, maxzoom }));
            for (const layer of style.layers) {
                if ((layer.source !== 'openmaptiles' && layer.type !== 'background') || (layer.maxzoom !== undefined && layer.maxzoom <= 9.5))
                    continue;
                layer.id = `cg-international-${layer.id}`;
                if (layer.source)
                    layer.source = 'cg-international';
                layer.minzoom = Math.max(9.5, layer.minzoom ?? 0);
                layer.layout = { ...layer.layout, visibility: 'none' };
                this.map.addLayer(this.inMapRealm(layer), 'base');
                installed.push(layer.id);
            }
        }
        catch (error) {
            for (const id of installed.reverse())
                if (this.map.getLayer(id))
                    this.map.removeLayer(id);
            if (this.map.getSource('cg-international'))
                this.map.removeSource('cg-international');
            throw error;
        }
        this.vectorLayers = installed;
        this.vectorLevel = level;
        this.vectorLoaded = true;
        this.updateProvider();
    }
    setZoomControl(show) {
        if (show && !this.control) {
            this.control = new this.options.lib.NavigationControl({ showCompass: false });
            this.map.addControl(this.control, 'bottom-right');
        }
        else if (!show && this.control) {
            this.map.removeControl(this.control);
            this.control = undefined;
        }
    }
    setMarkerImage(image) {
        this.options.markerImage = image;
        this.markers.forEach(entry => { const img = entry.element.querySelector('img'); if (img)
            img.src = image; });
    }
    syncMarkers(items) {
        for (const [key, entry] of this.markers) {
            if (!(key in items)) {
                entry.marker.remove();
                this.markers.delete(key);
            }
        }
        for (const key of Object.keys(items)) {
            const item = items[key];
            let entry = this.markers.get(key);
            if (!entry) {
                const doc = this.options.container.ownerDocument;
                const element = doc.createElement('div');
                const label = doc.createElement('div');
                const img = doc.createElement('img');
                Object.assign(element.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' });
                Object.assign(label.style, { whiteSpace: 'nowrap', color: '#222', textShadow: '0 0 3px white, 0 0 3px white' });
                Object.assign(img.style, { width: '36px', height: '36px' });
                img.src = this.options.markerImage;
                element.append(label, img);
                const marker = new this.options.lib.Marker({ element, anchor: 'bottom', draggable: !!item.drag }).setLngLat([item.lng, item.lat]).addTo(this.map);
                entry = { marker, element, snapshot: JSON.stringify(item) };
                this.markers.set(key, entry);
                element.addEventListener('click', e => { e.stopPropagation(); this.options.emit('markerClick', key); });
                marker.on('drag', () => {
                    const p = marker.getLngLat();
                    const current = this.markers.get(key);
                    if (!current)
                        return;
                    const previous = JSON.parse(current.snapshot);
                    previous.lat = Math.round(p.lat * 1e6) / 1e6;
                    previous.lng = Math.round(p.lng * 1e6) / 1e6;
                    current.snapshot = JSON.stringify(previous);
                    this.options.markerChange(key, { lat: previous.lat, lng: previous.lng });
                    this.options.emit('markerDrag', key);
                });
                marker.on('dragend', () => { this.options.emit('markerDragend', key); });
            }
            const previous = JSON.parse(entry.snapshot);
            const moved = previous.lat !== item.lat || previous.lng !== item.lng;
            if (moved)
                entry.marker.setLngLat([item.lng, item.lat]);
            entry.marker.setDraggable(!!item.drag);
            const label = entry.element.firstElementChild;
            if (label)
                label.textContent = item.title ?? '';
            entry.snapshot = JSON.stringify(item);
            if (moved)
                this.options.markerChange(key, { lat: item.lat, lng: item.lng });
        }
    }
    syncOverlays(items) {
        for (const [key, entry] of this.overlays) {
            if (!(key in items)) {
                entry.marker.remove();
                this.overlays.delete(key);
            }
        }
        for (const key of Object.keys(items)) {
            const item = items[key];
            let entry = this.overlays.get(key);
            if (!entry) {
                const element = this.options.container.ownerDocument.createElement('div');
                element.innerHTML = item.html;
                element.addEventListener('click', e => { e.stopPropagation(); this.options.emit('overlayClick', key); });
                const marker = new this.options.lib.Marker({ element, anchor: 'center' }).setLngLat([item.lng, item.lat]).addTo(this.map);
                entry = { marker, element, snapshot: JSON.stringify(item) };
                this.overlays.set(key, entry);
            }
            const previous = JSON.parse(entry.snapshot);
            if (previous.lat !== item.lat || previous.lng !== item.lng)
                entry.marker.setLngLat([item.lng, item.lat]);
            if (previous.html !== item.html)
                entry.element.innerHTML = item.html;
            entry.snapshot = JSON.stringify(item);
        }
    }
    syncShapes(kind, items) {
        if (!this.map.getLayer('base')) {
            this.pending[kind] = items;
            if (!this.waiting.has(kind)) {
                this.waiting.add(kind);
                this.map.once('load', () => { this.waiting.delete(kind); const latest = this.pending[kind]; delete this.pending[kind]; if (!this.disposed && latest)
                    this.syncShapes(kind, latest); });
            }
            return;
        }
        for (const [id] of this.shapes)
            if (id.startsWith(`${kind}:`) && !(id.slice(kind.length + 1) in items))
                this.removeShape(id);
        for (const key of Object.keys(items)) {
            const id = `${kind}:${key}`;
            const existing = this.shapes.get(id);
            if (existing) {
                const item = items[key];
                const previous = existing.shape;
                const snapshot = JSON.stringify(item);
                if (existing.snapshot === snapshot)
                    continue;
                const pathChanged = JSON.stringify(previous.path) !== JSON.stringify(item.path);
                const editChanged = !!previous.edit !== !!item.edit;
                existing.shape = JSON.parse(snapshot);
                existing.snapshot = snapshot;
                if (pathChanged)
                    this.refresh(kind, existing);
                if (editChanged || (pathChanged && previous.path.length !== item.path.length))
                    this.handles(kind, key, existing);
                else if (pathChanged)
                    this.positionHandles(kind, existing);
                if (previous.strokeColor !== item.strokeColor)
                    this.map.setPaintProperty(existing.id, 'line-color', item.strokeColor ?? '#3388ff');
                if (previous.strokeOpacity !== item.strokeOpacity)
                    this.map.setPaintProperty(existing.id, 'line-opacity', item.strokeOpacity ?? 1);
                if (previous.strokeWeight !== item.strokeWeight)
                    this.map.setPaintProperty(existing.id, 'line-width', item.strokeWeight ?? 3);
                if (kind === 'polygon' && previous.fillColor !== item.fillColor)
                    this.map.setPaintProperty(`${existing.id}-fill`, 'fill-color', item.fillColor ?? '#3388ff');
                if (kind === 'polygon' && previous.fillOpacity !== item.fillOpacity)
                    this.map.setPaintProperty(`${existing.id}-fill`, 'fill-opacity', item.fillOpacity ?? 0.3);
                continue;
            }
            const shape = JSON.parse(JSON.stringify(items[key]));
            const layer = `cg-shape-${++this.sequence}`;
            const entry = { id: layer, shape, snapshot: JSON.stringify(items[key]), handles: [], listeners: [] };
            this.shapes.set(id, entry);
            this.map.addSource(layer, this.inMapRealm({ type: 'geojson', data: this.geometry(kind, shape.path) }));
            if (kind === 'polygon')
                this.map.addLayer(this.inMapRealm({ id: `${layer}-fill`, type: 'fill', source: layer, paint: { 'fill-color': shape.fillColor ?? '#3388ff', 'fill-opacity': shape.fillOpacity ?? 0.3 } }));
            this.map.addLayer(this.inMapRealm({ id: layer, type: 'line', source: layer, paint: { 'line-color': shape.strokeColor ?? '#3388ff', 'line-opacity': shape.strokeOpacity ?? 1, 'line-width': shape.strokeWeight ?? 3 } }));
            const target = kind === 'polygon' ? `${layer}-fill` : layer;
            const on = (event, fn) => { this.map.on(event, target, fn); entry.listeners.push([event, target, fn]); };
            on('click', () => { this.options.emit(`${kind}Click`, key); });
            const start = (e) => {
                // DOM markers also bubble map events; only canvas hits may drag a whole shape.
                if (!entry.shape.drag || e.originalEvent.target !== this.map.getCanvas())
                    return;
                e.preventDefault();
                this.drag = { kind, key, start: { lat: e.lngLat.lat, lng: e.lngLat.lng }, path: JSON.parse(JSON.stringify(entry.shape.path)), moved: false, panEnabled: this.map.dragPan.isEnabled() };
                this.map.dragPan.disable();
            };
            on('mousedown', start);
            on('touchstart', start);
            this.handles(kind, key, entry);
        }
    }
    inMapRealm(value) {
        // MapLibre's worker serializer recognizes Object constructors from its own iframe.
        const realm = this.options.container.ownerDocument.defaultView;
        return realm.JSON.parse(JSON.stringify(value));
    }
    geometry(kind, path) {
        const coords = path.map(p => [p.lng, p.lat]);
        if (kind === 'polygon' && coords.length)
            coords.push(coords[0]);
        return { type: 'Feature', properties: {}, geometry: kind === 'line' ? { type: 'LineString', coordinates: coords } : { type: 'Polygon', coordinates: [coords] } };
    }
    refresh(kind, entry) { this.map.getSource(entry.id)?.setData(this.inMapRealm(this.geometry(kind, entry.shape.path))); }
    handles(kind, key, entry) {
        entry.handles.forEach(h => h.remove());
        entry.handles = [];
        if (!entry.shape.edit)
            return;
        const points = entry.shape.path;
        const add = (p, index, midpoint) => {
            const el = this.options.container.ownerDocument.createElement('div');
            Object.assign(el.style, { width: midpoint ? '9px' : '12px', height: midpoint ? '9px' : '12px', border: '2px solid #fff', borderRadius: '50%', background: midpoint ? '#8aaeea' : '#326fd1', cursor: 'pointer', boxShadow: '0 0 3px #333' });
            const marker = new this.options.lib.Marker({ element: el, draggable: true }).setLngLat([p.lng, p.lat]).addTo(this.map);
            entry.handles.push(marker);
            marker.on('dragstart', () => { if (midpoint) {
                entry.shape.path.splice(index, 0, { ...p });
                this.changed(kind, key, entry, 'insert', index);
            } });
            marker.on('drag', () => { const v = marker.getLngLat(); entry.shape.path[index] = { lat: v.lat, lng: v.lng }; this.refresh(kind, entry); if (!midpoint)
                this.positionHandles(kind, entry); this.changed(kind, key, entry, 'update', index); this.options.emit(`${kind}Drag`, key); });
            marker.on('dragend', () => { this.handles(kind, key, entry); this.options.emit(`${kind}Dragend`, key); });
            if (!midpoint)
                el.addEventListener('pointerdown', e => { this.options.nodeMenu(kind, key, index, e); });
        };
        points.forEach((p, i) => { add(p, i, false); if (i + 1 < points.length || (kind === 'polygon' && points.length > 2)) {
            const next = points[(i + 1) % points.length];
            add({ lat: (p.lat + next.lat) / 2, lng: (p.lng + next.lng) / 2 }, i + 1, true);
        } });
    }
    positionHandles(kind, entry) {
        const points = entry.shape.path;
        let handle = 0;
        points.forEach((point, index) => {
            entry.handles[handle++]?.setLngLat([point.lng, point.lat]);
            if (index + 1 < points.length || (kind === 'polygon' && points.length > 2)) {
                const next = points[(index + 1) % points.length];
                entry.handles[handle++]?.setLngLat([(point.lng + next.lng) / 2, (point.lat + next.lat) / 2]);
            }
        });
    }
    changed(kind, key, entry, action, index, old) {
        entry.snapshot = JSON.stringify(entry.shape);
        this.options.pathChange(kind, key, JSON.parse(JSON.stringify(entry.shape.path)), action, index, old);
    }
    removeNode(kind, key, index) {
        const entry = this.shapes.get(`${kind}:${key}`);
        if (!entry || !entry.shape.edit || index < 0 || index >= entry.shape.path.length || entry.shape.path.length <= (kind === 'line' ? 2 : 3))
            return;
        const [old] = entry.shape.path.splice(index, 1);
        this.refresh(kind, entry);
        this.changed(kind, key, entry, 'remove', index, old);
        this.handles(kind, key, entry);
    }
    moveShape(e) {
        const drag = this.drag;
        if (!drag)
            return;
        const entry = this.shapes.get(`${drag.kind}:${drag.key}`);
        if (!entry)
            return;
        drag.moved = true;
        const lat = e.lngLat.lat - drag.start.lat, lng = e.lngLat.lng - drag.start.lng;
        entry.shape.path = drag.path.map(p => ({ lat: p.lat + lat, lng: p.lng + lng }));
        this.refresh(drag.kind, entry);
        this.positionHandles(drag.kind, entry);
        this.changed(drag.kind, drag.key, entry, 'update');
        this.options.emit(`${drag.kind}Drag`, drag.key);
    }
    endDrag(cancel = false) { if (!this.drag)
        return; const { kind, key, moved, panEnabled } = this.drag; this.drag = undefined; if (panEnabled)
        this.map.dragPan.enable(); const entry = this.shapes.get(`${kind}:${key}`); if (!cancel && entry)
        this.handles(kind, key, entry); if (!cancel && moved)
        this.options.emit(`${kind}Dragend`, key); }
    removeShape(id) {
        const entry = this.shapes.get(id);
        if (!entry)
            return;
        if (this.drag && id === `${this.drag.kind}:${this.drag.key}`)
            this.endDrag(true);
        entry.handles.forEach(h => h.remove());
        entry.listeners.forEach(([e, layer, fn]) => this.map.off(e, layer, fn));
        if (this.map.getLayer(entry.id))
            this.map.removeLayer(entry.id);
        if (this.map.getLayer(`${entry.id}-fill`))
            this.map.removeLayer(`${entry.id}-fill`);
        if (this.map.getSource(entry.id))
            this.map.removeSource(entry.id);
        this.shapes.delete(id);
    }
    destroy() { this.disposed = true; this.endDrag(true); const win = this.options.container.ownerDocument.defaultView; win?.removeEventListener('blur', this.cancelDrag); win?.removeEventListener('mouseup', this.cancelDrag); win?.removeEventListener('touchend', this.cancelDrag); win?.removeEventListener('touchcancel', this.cancelDrag); this.markers.forEach(v => v.marker.remove()); this.overlays.forEach(v => v.marker.remove()); [...this.shapes.keys()].forEach(id => { this.removeShape(id); }); this.vectorAbort.abort(); this.map.remove(); this.options.lib.removeProtocol(this.protocol); }
}
