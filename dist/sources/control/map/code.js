"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'factory': 'google',
            'akey': '',
            'css': '',
            'lat': 31.223704,
            'lng': 121.366077,
            'zoom': 10,
            'zoomControl': false,
            'markers': {},
            'lines': {},
            'polygons': {},
            'overlays': {}
        };
        this.access = {
            'lib': undefined,
            'map': undefined,
            'overlay': undefined,
            'markerImg': '',
            'zoom': undefined,
            'vectorLayer': undefined,
            'iframe': undefined,
            'iwindow': undefined,
            'markers': {},
            'lines': {},
            'polygons': {},
            'overlays': {}
        };
        this.notInit = true;
        this.isLoading = false;
        this.selectedObject = {
            'type': 'line',
            'key': '',
            'index': 0
        };
        this.localeData = {
            'en': {
                'remove node': 'Remove node'
            },
            'sc': {
                'remove node': '移除节点'
            },
            'tc': {
                'remove node': '移除節點'
            },
            'ja': {
                'remove node': 'ノードを削除'
            },
            'ko': {
                'remove node': '노드 제거'
            },
            'th': {
                'remove node': 'ลบโหนด'
            },
            'es': {
                'remove node': 'Eliminar nodo'
            },
            'de': {
                'remove node': 'Knoten entfernen'
            },
            'fr': {
                'remove node': 'Supprimer le nœud'
            },
            'pt': {
                'remove node': 'Remover nó'
            },
            'ru': {
                'remove node': 'Удалить узел'
            },
            'vi': {
                'remove node': 'Xóa nút'
            }
        };
    }
    get showMask() {
        return this.isLoading ? true : clickgo.dom.is.move;
    }
    iframeLoad(e) {
        this.access.iframe = e.currentTarget;
        if (!this.access.iframe.contentWindow) {
            return;
        }
        this.access.iwindow = this.access.iframe.contentWindow;
        const idoc = this.access.iwindow.document;
        idoc.body.style.margin = '0';
        idoc.body.style.overflow = 'hidden';
        const styleEl = idoc.createElement('style');
        styleEl.textContent = 'body,html{font-size:12px;line-height:1;font-family:"Lucida Sans Unicode","Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif;}' + this.props.css;
        idoc.head.append(styleEl);
        const mapEl = idoc.createElement('div');
        mapEl.id = 'map';
        mapEl.style.height = '100%';
        const down = (e) => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.changeFocus(this.formId);
            clickgo.form.hidePop();
        };
        mapEl.addEventListener('mousedown', down);
        mapEl.addEventListener('touchstart', down, {
            'passive': true
        });
        idoc.body.append(mapEl);
        switch (this.props.factory) {
            case 'google': {
                const scriptEl = idoc.createElement('script');
                scriptEl.textContent = `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                    key: "${this.props.akey}",
                    v: "weekly"
                });`;
                idoc.head.append(scriptEl);
                this.access.iwindow.initMap = () => __awaiter(this, void 0, void 0, function* () {
                    yield this.access.iwindow.google.maps.importLibrary('maps');
                    this.access.lib = this.access.iwindow.google.maps;
                    const props = this.props;
                    const access = this.access;
                    class Overlay extends this.access.lib.OverlayView {
                        constructor(opt) {
                            super();
                            this._key = opt.key;
                            this._position =
                                new access.lib.LatLng(props.overlays[opt.key].lat, props.overlays[opt.key].lng);
                            this.setMap(opt.map);
                        }
                        onAdd() {
                            const panes = this.getPanes();
                            const tel = idoc.createElement('div');
                            tel.innerHTML = props.overlays[this._key].html;
                            this._el = tel.firstChild;
                            panes.overlayLayer.appendChild(this._el);
                        }
                        draw() {
                            if (!this._el) {
                                return;
                            }
                            const pixel = this.getProjection().fromLatLngToDivPixel(this._position);
                            this._el.style.left = pixel.x + 'px';
                            this._el.style.top = pixel.y + 'px';
                        }
                        onRemove() {
                            if (!this._el) {
                                return;
                            }
                            this._el.parentNode.removeChild(this._el);
                            delete this._el;
                        }
                        setPosition() {
                            if (!this._el) {
                                return;
                            }
                            this._position =
                                new access.lib.LatLng(props.overlays[this._key].lat, props.overlays[this._key].lng);
                            const pixel = this.getProjection().fromLatLngToDivPixel(this._position);
                            this._el.style.left = pixel.x + 'px';
                            this._el.style.top = pixel.y + 'px';
                        }
                        refreshHTML() {
                            if (!this._el) {
                                return;
                            }
                            this._el.parentNode.removeChild(this._el);
                            const panes = this.getPanes();
                            const tel = idoc.createElement('div');
                            tel.innerHTML = props.overlays[this._key].html;
                            this._el = tel.firstChild;
                            panes.overlayLayer.appendChild(this._el);
                        }
                    }
                    this.access.overlay = Overlay;
                    this.access.map = new this.access.lib.Map(idoc.getElementById('map'), {
                        'center': {
                            'lat': this.propNumber('lat'),
                            'lng': this.propNumber('lng')
                        },
                        'zoom': this.propNumber('zoom'),
                        'zoomControl': this.propBoolean('zoomControl'),
                        'mapTypeControl': false,
                        'streetViewControl': false,
                        'fullscreenControl': false,
                        'gestureHandling': 'greedy'
                    });
                    this.access.map.addListener('click', (e) => {
                        this.emit('mapClick', {
                            'lat': e.latLng.lat(),
                            'lng': e.latLng.lng()
                        });
                    });
                    this.access.map.addListener('zoom_changed', () => {
                        this.emit('update:zoom', this.access.map.getZoom());
                    });
                    this.access.map.addListener('center_changed', () => {
                        const center = this.access.map.getCenter();
                        const lat = center.lat();
                        const lng = center.lng();
                        if (lat !== this.propNumber('lat')) {
                            this.emit('update:lat', lat);
                        }
                        if (lng !== this.propNumber('lng')) {
                            this.emit('update:lng', lng);
                        }
                    });
                    this.updateMarkers();
                    this.updateLines();
                    this.updatePolygons();
                    this.updateOverlays();
                    this.isLoading = false;
                    this.emit('init', {
                        'lib': this.access.lib,
                        'map': this.access.map
                    });
                });
                this.access.iwindow.initMap();
                break;
            }
            case 'tianditu': {
                const scriptEl = idoc.createElement('script');
                scriptEl.src = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.23/dist/maptalks.min.js';
                scriptEl.addEventListener('load', () => {
                    this.access.lib = this.access.iwindow.maptalks;
                    this.access.map = new this.access.lib.Map('map', {
                        'center': [this.propNumber('lng'), this.propNumber('lat')],
                        'zoom': this.propNumber('zoom'),
                        'zoomControl': this.propBoolean('zoomControl'),
                        'maxZoom': 18,
                        'panAnimation': false,
                        'seamlessZoom': false,
                        'spatialReference': {
                            'projection': 'EPSG:3857'
                        },
                        'baseLayer': new this.access.lib.TileLayer('base', {
                            'urlTemplate': 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + this.props.akey,
                            'subdomains': ['0', '1', '2', '3', '4', '5', '6', '7'],
                            'attribution': '&copy;<a target="_blank" href="https://www.tianditu.gov.cn/">天地图</a> - GS(2023)336号 - 甲测资字1100471'
                        }),
                        'layers': [
                            new this.access.lib.TileLayer('boudaries', {
                                'urlTemplate': 'https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + this.props.akey,
                                'subdomains': ['0', '1', '2', '3', '4', '5', '6', '7']
                            })
                        ]
                    });
                    if (this.propBoolean('zoomControl')) {
                        this.access.zoom = new this.access.lib.control.Zoom({
                            'position': 'bottom-right',
                            'zoomLevel': false
                        });
                        this.access.map.addControl(this.access.zoom);
                    }
                    this.access.vectorLayer = new this.access.lib.VectorLayer('vector');
                    this.access.vectorLayer.addTo(this.access.map);
                    this.access.map.on('click', (e) => {
                        this.access.map.identify({
                            'coordinate': e.coordinate,
                            'layers': [this.access.vectorLayer],
                            'includeInternals': true,
                            'includeInvisible': true
                        }, (geos) => {
                            if (geos.length > 0) {
                                return;
                            }
                            this.emit('mapClick', {
                                'lat': e.coordinate.y,
                                'lng': e.coordinate.x
                            });
                        });
                    });
                    this.access.map.on('zooming', (e) => {
                        this.emit('update:zoom', e.to);
                    });
                    this.access.map.on('moving', () => {
                        const center = this.access.map.getCenter();
                        if (center.y !== this.propNumber('lat')) {
                            this.emit('update:lat', center.y);
                        }
                        if (center.x !== this.propNumber('lng')) {
                            this.emit('update:lng', center.x);
                        }
                    });
                    this.updateMarkers();
                    this.updateLines();
                    this.updatePolygons();
                    this.updateOverlays();
                    this.isLoading = false;
                    this.emit('init', {
                        'lib': this.access.lib,
                        'map': this.access.map
                    });
                });
                idoc.head.append(scriptEl);
                const linkEl = idoc.createElement('link');
                linkEl.rel = 'stylesheet';
                linkEl.href = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.23/dist/maptalks.min.css';
                idoc.head.append(linkEl);
                break;
            }
        }
    }
    load() {
        var _a;
        if (this.access.map) {
            this.access.map = undefined;
        }
        this.access.overlay = undefined;
        this.access.zoom = undefined;
        this.access.vectorLayer = undefined;
        this.access.iwindow = undefined;
        this.access.markers = {};
        this.access.lines = {};
        this.access.polygons = {};
        this.access.overlays = {};
        if (this.props.akey === '') {
            if (!this.notInit) {
                this.notInit = true;
            }
            if (this.isLoading) {
                this.isLoading = false;
            }
            return;
        }
        if (this.notInit) {
            this.notInit = false;
        }
        else {
            if (!((_a = this.access.iframe) === null || _a === void 0 ? void 0 : _a.contentWindow)) {
                return;
            }
            this.access.iframe.contentWindow.location.reload();
        }
        this.isLoading = true;
    }
    updateMarkers() {
        var _a, _b, _c, _d, _e, _f;
        switch (this.props.factory) {
            case 'google': {
                for (const key in this.props.markers) {
                    const marker = this.props.markers[key];
                    if (!this.access.markers[key]) {
                        const obj = new this.access.lib.Marker({
                            'position': new this.access.lib.LatLng(marker.lat, marker.lng),
                            'title': marker.title,
                            'draggable': (_a = marker.drag) !== null && _a !== void 0 ? _a : false,
                            'map': this.access.map
                        });
                        obj.addListener('click', () => {
                            this.emit('markerClick', key);
                        });
                        obj.addListener('drag', () => {
                            this.emit('markerDrag', key);
                        });
                        obj.addListener('dragend', () => {
                            this.emit('markerDragend', key);
                        });
                        obj.addListener('position_changed', () => {
                            const pos = obj.getPosition();
                            const lat = pos.lat();
                            const lng = pos.lng();
                            this.access.markers[key].lat = lat;
                            this.access.markers[key].lng = lng;
                            this.props.markers[key].lat = lat;
                            this.props.markers[key].lng = lng;
                            this.emit('update:markers', this.props.markers);
                            this.emit('markerUpdate', key);
                        });
                        this.access.markers[key] = {
                            'lat': marker.lat,
                            'lng': marker.lng,
                            'title': marker.title,
                            'drag': (_b = marker.drag) !== null && _b !== void 0 ? _b : false,
                            'obj': obj
                        };
                        continue;
                    }
                    if (this.access.markers[key].lat !== marker.lat || this.access.markers[key].lng !== marker.lng) {
                        this.access.markers[key].lat = marker.lat;
                        this.access.markers[key].lng = marker.lng;
                        this.access.markers[key].obj.setPosition(new this.access.lib.LatLng(marker.lat, marker.lng));
                    }
                    const title = marker.title;
                    if (this.access.markers[key].title !== title) {
                        this.access.markers[key].title = title;
                        this.access.markers[key].obj.setTitle(title);
                    }
                    const drag = (_c = marker.drag) !== null && _c !== void 0 ? _c : false;
                    if (this.access.markers[key].drag !== drag) {
                        this.access.markers[key].drag = drag;
                        this.access.markers[key].obj.setDraggable(drag);
                    }
                }
                break;
            }
            case 'tianditu': {
                for (const key in this.props.markers) {
                    const marker = this.props.markers[key];
                    if (!this.access.markers[key]) {
                        const obj = new this.access.lib.Marker([marker.lng, marker.lat], {
                            'draggable': (_d = marker.drag) !== null && _d !== void 0 ? _d : false,
                            'symbol': {
                                'markerFile': this.access.markerImg,
                                'markerWidth': 36,
                                'markerHeight': 36,
                                'textName': marker.title,
                                'textHaloRadius': 1,
                                'textDy': -46
                            }
                        });
                        this.access.vectorLayer.addGeometry(obj);
                        obj.on('click', () => {
                            this.emit('markerClick', key);
                        });
                        obj.on('dragging', () => {
                            this.emit('markerDrag', key);
                        });
                        obj.on('dragend', () => {
                            this.emit('markerDragend', key);
                        });
                        obj.on('positionchange', () => {
                            const pos = obj.getCoordinates();
                            const lat = Math.round(pos.y * 1000000) / 1000000;
                            const lng = Math.round(pos.x * 1000000) / 1000000;
                            this.access.markers[key].lat = lat;
                            this.access.markers[key].lng = lng;
                            this.props.markers[key].lat = lat;
                            this.props.markers[key].lng = lng;
                            this.emit('update:markers', this.props.markers);
                            this.emit('markerUpdate', key);
                        });
                        this.access.markers[key] = {
                            'lat': marker.lat,
                            'lng': marker.lng,
                            'title': marker.title,
                            'drag': (_e = marker.drag) !== null && _e !== void 0 ? _e : false,
                            'obj': obj
                        };
                        continue;
                    }
                    if (this.access.markers[key].lat !== marker.lat || this.access.markers[key].lng !== marker.lng) {
                        this.access.markers[key].lat = marker.lat;
                        this.access.markers[key].lng = marker.lng;
                        this.access.markers[key].obj.setCoordinates([marker.lng, marker.lat]);
                    }
                    const title = marker.title;
                    if (this.access.markers[key].title !== title) {
                        this.access.markers[key].title = title;
                        this.access.markers[key].obj.updateSymbol({
                            'textName': marker.title
                        });
                    }
                    const drag = (_f = marker.drag) !== null && _f !== void 0 ? _f : false;
                    if (this.access.markers[key].drag !== drag) {
                        this.access.markers[key].drag = drag;
                        this.access.markers[key].obj.config('draggable', drag);
                    }
                }
                break;
            }
        }
        this.removeNoex(this.props.markers, this.access.markers);
    }
    updateOverlays() {
        switch (this.props.factory) {
            case 'google': {
                for (const key in this.props.overlays) {
                    const overlay = this.props.overlays[key];
                    if (!this.access.overlays[key]) {
                        const obj = new this.access.overlay({
                            'map': this.access.map,
                            'key': key
                        });
                        obj.addListener('click', () => {
                            this.emit('overlayClick', key);
                        });
                        this.access.overlays[key] = {
                            'lat': overlay.lat,
                            'lng': overlay.lng,
                            'html': overlay.html,
                            'obj': obj
                        };
                        continue;
                    }
                    if (this.access.overlays[key].lat !== overlay.lat
                        || this.access.overlays[key].lng !== overlay.lng) {
                        this.access.overlays[key].lat = overlay.lat;
                        this.access.overlays[key].lng = overlay.lng;
                        this.access.overlays[key].obj.setPosition(new this.access.lib.LatLng(overlay.lat, overlay.lng));
                    }
                    if (this.access.overlays[key].html !== overlay.html) {
                        this.access.overlays[key].html = overlay.html;
                        this.access.overlays[key].obj.refreshHTML();
                    }
                }
                break;
            }
            case 'tianditu': {
                for (const key in this.props.overlays) {
                    const overlay = this.props.overlays[key];
                    if (!this.access.overlays[key]) {
                        const obj = new this.access.lib.ui.UIMarker([overlay.lng, overlay.lat], {
                            'content': overlay.html
                        });
                        obj.addTo(this.access.map);
                        obj.on('click', () => {
                            this.emit('overlayClick', key);
                        });
                        this.access.overlays[key] = {
                            'lat': overlay.lat,
                            'lng': overlay.lng,
                            'html': overlay.html,
                            'obj': obj
                        };
                        continue;
                    }
                    if (this.access.overlays[key].lat !== overlay.lat
                        || this.access.overlays[key].lng !== overlay.lng) {
                        this.access.overlays[key].lat = overlay.lat;
                        this.access.overlays[key].lng = overlay.lng;
                        this.access.overlays[key].obj.setCoordinates(new this.access.lib.Coordinate(overlay.lng, overlay.lat));
                    }
                    if (this.access.overlays[key].html !== overlay.html) {
                        this.access.overlays[key].html = overlay.html;
                        this.access.overlays[key].obj.setContent(overlay.html);
                    }
                }
                break;
            }
        }
        this.removeNoex(this.props.markers, this.access.markers);
    }
    updateLines() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        switch (this.props.factory) {
            case 'google': {
                for (const key in this.props.lines) {
                    const line = this.props.lines[key];
                    if (!this.access.lines[key]) {
                        const obj = new this.access.lib.Polyline({
                            'path': line.path,
                            'strokeColor': line.strokeColor,
                            'strokeOpacity': line.strokeOpacity,
                            'strokeWeight': line.strokeWeight,
                            'draggable': (_a = line.drag) !== null && _a !== void 0 ? _a : false,
                            'editable': (_b = line.edit) !== null && _b !== void 0 ? _b : false,
                            'map': this.access.map
                        });
                        const path = obj.getPath();
                        this.addLinePathEvent(path, key);
                        obj.addListener('click', () => {
                            this.emit('lineClick', key);
                        });
                        obj.addListener('drag', () => {
                            this.emit('lineDrag', key);
                        });
                        obj.addListener('dragend', () => {
                            this.emit('lineDragend', key);
                        });
                        obj.addListener('contextmenu', (e) => {
                            if (e.vertex === undefined) {
                                return;
                            }
                            e.domEvent.preventDefault();
                            if (clickgo.dom.hasTouchButMouse(e.domEvent)) {
                                return;
                            }
                            this.selectedObject.type = 'line';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            const rect = this.element.getBoundingClientRect();
                            clickgo.form.showPop(this.element, this.refs.pop, {
                                'x': rect.left + e.domEvent.clientX,
                                'y': rect.top + e.domEvent.clientY
                            });
                        });
                        obj.addListener('mousedown', (e) => {
                            if (e.domEvent.type !== 'touchstart') {
                                return;
                            }
                            if (e.vertex === undefined) {
                                return;
                            }
                            this.selectedObject.type = 'line';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            clickgo.dom.bindLong(e.domEvent, () => {
                                const rect = this.element.getBoundingClientRect();
                                clickgo.form.showPop(this.element, this.refs.pop, {
                                    'x': rect.left + e.domEvent.touches[0].clientX,
                                    'y': rect.top + e.domEvent.touches[0].clientY
                                });
                            });
                        });
                        this.access.lines[key] = {
                            'path': JSON.parse(JSON.stringify(line.path)),
                            'strokeColor': line.strokeColor,
                            'strokeOpacity': line.strokeOpacity,
                            'strokeWeight': line.strokeWeight,
                            'drag': (_c = line.drag) !== null && _c !== void 0 ? _c : false,
                            'edit': (_d = line.edit) !== null && _d !== void 0 ? _d : false,
                            'obj': obj
                        };
                        continue;
                    }
                    const accessPath = JSON.stringify(this.access.lines[key].path);
                    const path = JSON.stringify(line.path);
                    if (accessPath !== path) {
                        this.access.lines[key].path = JSON.parse(path);
                        this.access.lines[key].obj.setPath(line.path);
                        this.addLinePathEvent(this.access.lines[key].obj.getPath(), key);
                    }
                    if (this.access.lines[key].strokeColor !== line.strokeColor) {
                        this.access.lines[key].strokeColor = line.strokeColor;
                        this.access.lines[key].obj.setOptions({
                            'strokeColor': line.strokeColor
                        });
                    }
                    if (this.access.lines[key].strokeOpacity !== line.strokeOpacity) {
                        this.access.lines[key].strokeOpacity = line.strokeOpacity;
                        this.access.lines[key].obj.setOptions({
                            'strokeOpacity': line.strokeOpacity
                        });
                    }
                    if (this.access.lines[key].strokeWeight !== line.strokeWeight) {
                        this.access.lines[key].strokeWeight = line.strokeWeight;
                        this.access.lines[key].obj.setOptions({
                            'strokeWeight': line.strokeWeight
                        });
                    }
                    const drag = (_e = line.drag) !== null && _e !== void 0 ? _e : false;
                    if (this.access.lines[key].drag !== drag) {
                        this.access.lines[key].drag = drag;
                        this.access.lines[key].obj.setDraggable(drag);
                    }
                    const edit = (_f = line.edit) !== null && _f !== void 0 ? _f : false;
                    if (this.access.lines[key].edit !== edit) {
                        this.access.lines[key].edit = edit;
                        this.access.lines[key].obj.setEditable(edit);
                    }
                }
                break;
            }
            case 'tianditu': {
                for (const key in this.props.lines) {
                    const line = this.props.lines[key];
                    if (!this.access.lines[key]) {
                        const paths = [];
                        for (const item of line.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        const obj = new this.access.lib.LineString(paths, {
                            'symbol': {
                                'lineColor': line.strokeColor,
                                'lineOpacity': line.strokeOpacity,
                                'lineWidth': line.strokeWeight
                            },
                            'draggable': (_g = line.drag) !== null && _g !== void 0 ? _g : false,
                            'editable': (_h = line.edit) !== null && _h !== void 0 ? _h : false
                        });
                        this.access.vectorLayer.addGeometry(obj);
                        if (line.edit) {
                            obj.startEdit();
                        }
                        obj.on('click', () => {
                            this.emit('lineClick', key);
                        });
                        obj.on('handledragging', () => {
                            this.emit('lineDrag', key);
                        });
                        obj.on('dragging', () => {
                            this.emit('lineDrag', key);
                        });
                        obj.on('handledragend', () => {
                            this.emit('lineDragend', key);
                        });
                        obj.on('dragend', () => {
                            this.emit('lineDragend', key);
                        });
                        obj.on('positionchange', () => {
                            const coor = obj.getCoordinates();
                            const paths = [];
                            for (const item of coor) {
                                paths.push({
                                    'lat': Math.round(item.y * 1000000) / 1000000,
                                    'lng': Math.round(item.x * 1000000) / 1000000
                                });
                            }
                            this.access.lines[key].path = paths;
                            this.props.lines[key].path = JSON.parse(JSON.stringify(paths));
                            this.emit('update:lines', this.props.lines);
                            this.emit('lineUpdate', key);
                        });
                        obj.on('shapechange', () => {
                            const paths = [];
                            const coords = obj.getCoordinates();
                            for (const coord of coords) {
                                paths.push({
                                    'lat': Math.round(coord.y * 1000000) / 1000000,
                                    'lng': Math.round(coord.x * 1000000) / 1000000
                                });
                            }
                            const newstr = JSON.stringify(paths);
                            const oldstr = JSON.stringify(this.access.lines[key].path);
                            if (newstr === oldstr) {
                                return;
                            }
                            this.props.lines[key].path = paths;
                            this.emit('update:lines', this.props.lines);
                            if (paths.length === this.access.lines[key].path.length) {
                                this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('lineUpdate', key);
                            }
                            else {
                                for (let i = 0; i < paths.length; ++i) {
                                    const old = this.access.lines[key].path[i];
                                    if (old.lat === paths[i].lat && old.lng === paths[i].lng) {
                                        continue;
                                    }
                                    if (paths.length > this.access.lines[key].path.length) {
                                        this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('lineInsert', key, i);
                                    }
                                    else {
                                        this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('lineRemove', key, i, {
                                            'lat': old.lat,
                                            'lng': old.lng
                                        });
                                    }
                                    return;
                                }
                                const i = this.access.lines[key].path.length - 1;
                                const old = this.access.lines[key].path[i];
                                this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('lineRemove', key, i, {
                                    'lat': old.lat,
                                    'lng': old.lng
                                });
                            }
                        });
                        this.access.lines[key] = {
                            'path': JSON.parse(JSON.stringify(line.path)),
                            'strokeColor': line.strokeColor,
                            'strokeOpacity': line.strokeOpacity,
                            'strokeWeight': line.strokeWeight,
                            'drag': (_j = line.drag) !== null && _j !== void 0 ? _j : false,
                            'edit': (_k = line.edit) !== null && _k !== void 0 ? _k : false,
                            'obj': obj
                        };
                        continue;
                    }
                    const accessPath = JSON.stringify(this.access.lines[key].path);
                    const path = JSON.stringify(line.path);
                    if (accessPath !== path) {
                        this.access.lines[key].path = JSON.parse(path);
                        const paths = [];
                        for (const item of line.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        this.access.lines[key].obj.setCoordinates(paths);
                    }
                    if (this.access.lines[key].strokeColor !== line.strokeColor) {
                        this.access.lines[key].strokeColor = line.strokeColor;
                        this.access.lines[key].obj.updateSymbol({
                            'lineColor': line.strokeColor
                        });
                    }
                    if (this.access.lines[key].strokeOpacity !== line.strokeOpacity) {
                        this.access.lines[key].strokeOpacity = line.strokeOpacity;
                        this.access.lines[key].obj.updateSymbol({
                            'lineOpacity': line.strokeOpacity
                        });
                    }
                    if (this.access.lines[key].strokeWeight !== line.strokeWeight) {
                        this.access.lines[key].strokeWeight = line.strokeWeight;
                        this.access.lines[key].obj.updateSymbol({
                            'lineWeight': line.strokeWeight
                        });
                    }
                    const drag = (_l = line.drag) !== null && _l !== void 0 ? _l : false;
                    if (this.access.lines[key].drag !== drag) {
                        this.access.lines[key].drag = drag;
                        this.access.lines[key].obj.config('draggable', drag);
                    }
                    const edit = (_m = line.edit) !== null && _m !== void 0 ? _m : false;
                    if (this.access.lines[key].edit !== edit) {
                        this.access.lines[key].edit = edit;
                        if (edit) {
                            this.access.lines[key].obj.startEdit();
                        }
                        else {
                            this.access.lines[key].obj.endEdit();
                        }
                        this.access.lines[key].obj.config('editable', edit);
                    }
                }
                break;
            }
        }
        this.removeNoex(this.props.lines, this.access.lines);
    }
    addLinePathEvent(path, key) {
        path.addListener('insert_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineInsert', key, index);
        });
        path.addListener('remove_at', (index, removed) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        });
        path.addListener('set_at', () => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineUpdate', key);
        });
    }
    updatePolygons() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        switch (this.props.factory) {
            case 'google': {
                for (const key in this.props.polygons) {
                    const polygon = this.props.polygons[key];
                    if (!this.access.polygons[key]) {
                        const obj = new this.access.lib.Polygon({
                            'path': polygon.path,
                            'strokeColor': polygon.strokeColor,
                            'strokeOpacity': polygon.strokeOpacity,
                            'strokeWeight': polygon.strokeWeight,
                            'fillColor': polygon.fillColor,
                            'fillOpacity': polygon.fillOpacity,
                            'draggable': (_a = polygon.drag) !== null && _a !== void 0 ? _a : false,
                            'editable': (_b = polygon.edit) !== null && _b !== void 0 ? _b : false,
                            'map': this.access.map
                        });
                        const path = obj.getPath();
                        this.addPolygonPathEvent(path, key);
                        obj.addListener('click', () => {
                            this.emit('polygonClick', key);
                        });
                        obj.addListener('drag', () => {
                            this.emit('polygonDrag', key);
                        });
                        obj.addListener('dragend', () => {
                            this.emit('polygonDragend', key);
                        });
                        obj.addListener('contextmenu', (e) => {
                            if (e.vertex === undefined) {
                                return;
                            }
                            e.domEvent.preventDefault();
                            if (clickgo.dom.hasTouchButMouse(e.domEvent)) {
                                return;
                            }
                            this.selectedObject.type = 'polygon';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            const rect = this.element.getBoundingClientRect();
                            clickgo.form.showPop(this.element, this.refs.pop, {
                                'x': rect.left + e.domEvent.clientX,
                                'y': rect.top + e.domEvent.clientY
                            });
                        });
                        obj.addListener('mousedown', (e) => {
                            if (e.domEvent.type !== 'touchstart') {
                                return;
                            }
                            if (e.vertex === undefined) {
                                return;
                            }
                            this.selectedObject.type = 'polygon';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            clickgo.dom.bindLong(e.domEvent, () => {
                                const rect = this.element.getBoundingClientRect();
                                clickgo.form.showPop(this.element, this.refs.pop, {
                                    'x': rect.left + e.domEvent.touches[0].clientX,
                                    'y': rect.top + e.domEvent.touches[0].clientY
                                });
                            });
                        });
                        this.access.polygons[key] = {
                            'path': JSON.parse(JSON.stringify(polygon.path)),
                            'strokeColor': polygon.strokeColor,
                            'strokeOpacity': polygon.strokeOpacity,
                            'strokeWeight': polygon.strokeWeight,
                            'fillColor': polygon.fillColor,
                            'fillOpacity': polygon.fillOpacity,
                            'drag': (_c = polygon.drag) !== null && _c !== void 0 ? _c : false,
                            'edit': (_d = polygon.edit) !== null && _d !== void 0 ? _d : false,
                            'obj': obj
                        };
                        continue;
                    }
                    const accessPath = JSON.stringify(this.access.polygons[key].path);
                    const path = JSON.stringify(polygon.path);
                    if (accessPath !== path) {
                        this.access.polygons[key].path = JSON.parse(path);
                        this.access.polygons[key].obj.setPath(polygon.path);
                        this.addPolygonPathEvent(this.access.polygons[key].obj.getPath(), key);
                    }
                    if (this.access.polygons[key].strokeColor !== polygon.strokeColor) {
                        this.access.polygons[key].strokeColor = polygon.strokeColor;
                        this.access.polygons[key].obj.setOptions({
                            'strokeColor': polygon.strokeColor
                        });
                    }
                    if (this.access.polygons[key].strokeOpacity !== polygon.strokeOpacity) {
                        this.access.polygons[key].strokeOpacity = polygon.strokeOpacity;
                        this.access.polygons[key].obj.setOptions({
                            'strokeOpacity': polygon.strokeOpacity
                        });
                    }
                    if (this.access.polygons[key].strokeWeight !== polygon.strokeWeight) {
                        this.access.polygons[key].strokeWeight = polygon.strokeWeight;
                        this.access.polygons[key].obj.setOptions({
                            'strokeWeight': polygon.strokeWeight
                        });
                    }
                    if (this.access.polygons[key].fillColor !== polygon.fillColor) {
                        this.access.polygons[key].fillColor = polygon.fillColor;
                        this.access.polygons[key].obj.setOptions({
                            'fillColor': polygon.fillColor
                        });
                    }
                    if (this.access.polygons[key].fillOpacity !== polygon.fillOpacity) {
                        this.access.polygons[key].fillOpacity = polygon.fillOpacity;
                        this.access.polygons[key].obj.setOptions({
                            'fillOpacity': polygon.fillOpacity
                        });
                    }
                    const drag = (_e = polygon.drag) !== null && _e !== void 0 ? _e : false;
                    if (this.access.polygons[key].drag !== drag) {
                        this.access.polygons[key].drag = drag;
                        this.access.polygons[key].obj.setDraggable(drag);
                    }
                    const edit = (_f = polygon.edit) !== null && _f !== void 0 ? _f : false;
                    if (this.access.polygons[key].edit !== edit) {
                        this.access.polygons[key].edit = edit;
                        this.access.polygons[key].obj.setEditable(edit);
                    }
                }
                break;
            }
            case 'tianditu': {
                for (const key in this.props.polygons) {
                    const polygon = this.props.polygons[key];
                    if (!this.access.polygons[key]) {
                        const paths = [];
                        for (const item of polygon.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        const obj = new this.access.lib.Polygon(paths, {
                            'symbol': {
                                'lineColor': polygon.strokeColor,
                                'lineOpacity': polygon.strokeOpacity,
                                'lineWidth': polygon.strokeWeight,
                                'polygonFill': polygon.fillColor,
                                'polygonOpacity': (_g = polygon.fillOpacity) !== null && _g !== void 0 ? _g : .3
                            },
                            'draggable': (_h = polygon.drag) !== null && _h !== void 0 ? _h : false,
                            'editable': (_j = polygon.edit) !== null && _j !== void 0 ? _j : false
                        });
                        this.access.vectorLayer.addGeometry(obj);
                        if (polygon.edit) {
                            obj.startEdit();
                        }
                        obj.on('click', () => {
                            this.emit('polygonClick', key);
                        });
                        obj.on('handledragging', () => {
                            this.emit('polygonDrag', key);
                        });
                        obj.on('dragging', () => {
                            this.emit('polygonDrag', key);
                        });
                        obj.on('handledragend', () => {
                            this.emit('polygonDragend', key);
                        });
                        obj.on('dragend', () => {
                            this.emit('polygonDragend', key);
                        });
                        obj.on('positionchange', () => {
                            const coords = obj.getCoordinates();
                            const paths = [];
                            for (const item of coords[0]) {
                                paths.push({
                                    'lat': Math.round(item.y * 1000000) / 1000000,
                                    'lng': Math.round(item.x * 1000000) / 1000000
                                });
                            }
                            this.access.polygons[key].path = paths;
                            this.props.polygons[key].path = JSON.parse(JSON.stringify(paths));
                            this.emit('update:polygon', this.props.polygons);
                            this.emit('polygonUpdate', key);
                        });
                        obj.on('shapechange', () => {
                            const paths = [];
                            const coords = obj.getCoordinates();
                            for (const coord of coords[0]) {
                                paths.push({
                                    'lat': Math.round(coord.y * 1000000) / 1000000,
                                    'lng': Math.round(coord.x * 1000000) / 1000000
                                });
                            }
                            const newstr = JSON.stringify(paths);
                            const oldstr = JSON.stringify(this.access.polygons[key].path);
                            if (newstr === oldstr) {
                                return;
                            }
                            this.props.polygons[key].path = paths;
                            this.emit('update:polygons', this.props.polygons);
                            if (paths.length === this.access.polygons[key].path.length) {
                                this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('polygonUpdate', key);
                            }
                            else {
                                for (let i = 0; i < paths.length; ++i) {
                                    const old = this.access.polygons[key].path[i];
                                    if (old.lat === paths[i].lat && old.lng === paths[i].lng) {
                                        continue;
                                    }
                                    if (paths.length > this.access.polygons[key].path.length) {
                                        this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('polygonInsert', key, i);
                                    }
                                    else {
                                        this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('polygonRemove', key, i, {
                                            'lat': old.lat,
                                            'lng': old.lng
                                        });
                                    }
                                    return;
                                }
                                const i = this.access.polygons[key].path.length - 1;
                                const old = this.access.polygons[key].path[i];
                                this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('polygonRemove', key, i, {
                                    'lat': old.lat,
                                    'lng': old.lng
                                });
                            }
                        });
                        this.access.polygons[key] = {
                            'path': JSON.parse(JSON.stringify(polygon.path)),
                            'strokeColor': polygon.strokeColor,
                            'strokeOpacity': polygon.strokeOpacity,
                            'strokeWeight': polygon.strokeWeight,
                            'fillColor': polygon.fillColor,
                            'fillOpacity': polygon.fillOpacity,
                            'drag': (_k = polygon.drag) !== null && _k !== void 0 ? _k : false,
                            'edit': (_l = polygon.edit) !== null && _l !== void 0 ? _l : false,
                            'obj': obj
                        };
                        continue;
                    }
                    const accessPath = JSON.stringify(this.access.polygons[key].path);
                    const path = JSON.stringify(polygon.path);
                    if (accessPath !== path) {
                        this.access.polygons[key].path = JSON.parse(path);
                        const paths = [];
                        for (const item of polygon.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        this.access.polygons[key].obj.setCoordinates(paths);
                    }
                    if (this.access.polygons[key].strokeColor !== polygon.strokeColor) {
                        this.access.polygons[key].strokeColor = polygon.strokeColor;
                        this.access.polygons[key].obj.updateSymbol({
                            'lineColor': polygon.strokeColor
                        });
                    }
                    if (this.access.polygons[key].strokeOpacity !== polygon.strokeOpacity) {
                        this.access.polygons[key].strokeOpacity = polygon.strokeOpacity;
                        this.access.polygons[key].obj.updateSymbol({
                            'lineOpacity': polygon.strokeOpacity
                        });
                    }
                    if (this.access.polygons[key].strokeWeight !== polygon.strokeWeight) {
                        this.access.polygons[key].strokeWeight = polygon.strokeWeight;
                        this.access.polygons[key].obj.updateSymbol({
                            'lineWeight': polygon.strokeWeight
                        });
                    }
                    if (this.access.polygons[key].fillColor !== polygon.fillColor) {
                        this.access.polygons[key].fillColor = polygon.fillColor;
                        this.access.polygons[key].obj.updateSymbol({
                            'polygonFill': polygon.fillColor
                        });
                    }
                    if (this.access.polygons[key].fillOpacity !== polygon.fillOpacity) {
                        this.access.polygons[key].fillOpacity = polygon.fillOpacity;
                        this.access.polygons[key].obj.updateSymbol({
                            'polygonOpacity': polygon.fillOpacity
                        });
                    }
                    const drag = (_m = polygon.drag) !== null && _m !== void 0 ? _m : false;
                    if (this.access.polygons[key].drag !== drag) {
                        this.access.polygons[key].drag = drag;
                        this.access.polygons[key].obj.config('draggable', drag);
                    }
                    const edit = (_o = polygon.edit) !== null && _o !== void 0 ? _o : false;
                    if (this.access.polygons[key].edit !== edit) {
                        this.access.polygons[key].edit = edit;
                        if (edit) {
                            this.access.polygons[key].obj.startEdit();
                        }
                        else {
                            this.access.polygons[key].obj.endEdit();
                        }
                        this.access.polygons[key].obj.config('editable', edit);
                    }
                }
                break;
            }
        }
        this.removeNoex(this.props.polygons, this.access.polygons);
    }
    addPolygonPathEvent(path, key) {
        path.addListener('insert_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonInsert', key, index);
        });
        path.addListener('remove_at', (index, removed) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        });
        path.addListener('set_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineUpdate', key, index);
        });
    }
    removeNoex(newo, oldo) {
        switch (this.props.factory) {
            case 'google': {
                for (const key in oldo) {
                    if (newo[key]) {
                        continue;
                    }
                    oldo[key].obj.setMap(null);
                    delete oldo[key];
                }
                break;
            }
            case 'tianditu': {
                for (const key in oldo) {
                    if (newo[key]) {
                        continue;
                    }
                    this.access.vectorLayer.removeGeometry(oldo[key].obj);
                    delete oldo[key];
                }
                break;
            }
        }
    }
    removeNode() {
        switch (this.selectedObject.type) {
            case 'line': {
                const path = this.access.lines[this.selectedObject.key].obj.getPath();
                path.removeAt(this.selectedObject.index);
                break;
            }
            case 'polygon': {
                const path = this.access.polygons[this.selectedObject.key].obj.getPath();
                path.removeAt(this.selectedObject.index);
                break;
            }
        }
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.load();
            this.watch('akey', () => {
                this.load();
            });
            this.watch('factory', () => {
                this.load();
            });
            this.access.markerImg = yield clickgo.tool.blob2DataUrl(this.packageFiles['/res/marker.svg']);
            this.watch('zoom', () => {
                if (!this.access.map) {
                    return;
                }
                switch (this.props.factory) {
                    case 'google': {
                        this.access.map.setZoom(this.propNumber('zoom'));
                        break;
                    }
                    case 'tianditu': {
                        this.access.map.setZoom(this.propNumber('zoom'), {
                            'animation': false
                        });
                        break;
                    }
                }
            });
            this.watch('zoomControl', () => {
                if (!this.access.map) {
                    return;
                }
                switch (this.props.factory) {
                    case 'google': {
                        this.access.map.setOptions({
                            'zoomControl': this.propBoolean('zoomControl')
                        });
                        break;
                    }
                    case 'tianditu': {
                        if (this.propBoolean('zoomControl')) {
                            this.access.zoom = new this.access.lib.control.Zoom({
                                'position': 'bottom-right',
                                'zoomLevel': false
                            });
                            this.access.map.addControl(this.access.zoom);
                        }
                        else {
                            this.access.map.removeControl(this.access.zoom);
                        }
                        break;
                    }
                }
            });
            this.watch('markers', () => {
                if (!this.access.map) {
                    return;
                }
                this.updateMarkers();
            }, {
                'deep': true
            });
            this.watch('lines', () => {
                if (!this.access.map) {
                    return;
                }
                this.updateLines();
            }, {
                'deep': true
            });
            this.watch('polygons', () => {
                if (!this.access.map) {
                    return;
                }
                this.updatePolygons();
            }, {
                'deep': true
            });
            this.watch('overlays', () => {
                if (!this.access.map) {
                    return;
                }
                this.updateOverlays();
            }, {
                'deep': true
            });
        });
    }
}
exports.default = default_1;
