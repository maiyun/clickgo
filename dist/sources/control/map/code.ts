import * as clickgo from 'clickgo';

/** --- 标记点 --- */
interface IMarker {
    'lat': number;
    'lng': number;
    'title'?: string;
    'drag'?: boolean;
}

/** --- 折线 --- */
interface ILine {
    'path': Array<{
        'lat': number;
        'lng': number;
    }>;
    'strokeColor'?: string;
    'strokeOpacity'?: number;
    'strokeWeight'?: number;
    'drag'?: boolean;
    'edit'?: boolean;
}

/** --- 区域 --- */
interface IPolygon {
    'path': Array<{
        'lat': number;
        'lng': number;
    }>;
    'strokeColor'?: string;
    'strokeOpacity'?: number;
    'strokeWeight'?: number;
    'fillColor'?: string;
    'fillOpacity'?: number;
    'drag'?: boolean;
    'edit'?: boolean;
}

/** --- 自定义覆盖物 --- */
interface IOverlay {
    'lat': number;
    'lng': number;
    'html': string;
}

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'factory': 'tianditu' | 'google';
        'akey': string;
        'css': string;

        'lat': number;
        'lng': number;
        'zoom': number;
        'zoomControl': boolean | string;

        // --- 以下支持数组模式，例如 Array<IMarker> ---
        'markers': Record<string, IMarker>;
        'lines': Record<string, ILine>;
        'polygons': Record<string, IPolygon>;
        'overlays': Record<string, IOverlay>;
    } = {
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

    public get showMask(): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }

    public access: {
        'lib': any;
        'map': any;

        'overlay': any;
        'markerImg': string;
        'zoom': any;
        'vectorLayer': any;

        /** --- iframe 对象 --- */
        'iframe'?: HTMLIFrameElement;
        'iwindow'?: Window & Record<string, any>;

        'markers': Record<string, {
            'lat': number;
            'lng': number;
            'title'?: string;
            'drag': boolean;
            'obj': any;
        }>;
        'lines': Record<string, {
            'path': Array<{
                'lat': number;
                'lng': number;
            }>;
            'strokeColor'?: string;
            'strokeOpacity'?: number;
            'strokeWeight'?: number;
            'drag': boolean;
            'edit': boolean;
            'obj': any;
        }>;
        'polygons': Record<string, {
            'path': Array<{
                'lat': number;
                'lng': number;
            }>;
            'strokeColor'?: string;
            'strokeOpacity'?: number;
            'strokeWeight'?: number;
            'fillColor'?: string;
            'fillOpacity'?: number;
            'drag': boolean;
            'edit': boolean;
            'obj': any;
        }>;
        'overlays': Record<string, {
            'lat': number;
            'lng': number;
            'html': string;
            'obj': any;
        }>;
    } = {
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

    /** --- 是否没有初始化 --- */
    public notInit = true;

    /** --- 当前是否加载中 --- */
    public isLoading = false;

    /** --- 当前选中对象情况 --- */
    public selectedObject: {
        'type': 'line' | 'polygon';
        'key': string;
        'index': 0;
    } = {
            'type': 'line',
            'key': '',
            'index': 0
        };

    public localeData = {
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

    // --- iframe ---
    public iframeLoad(e: Event): void {
        this.access.iframe = e.currentTarget as HTMLIFrameElement;
        if (!this.access.iframe.contentWindow) {
            return;
        }
        this.access.iwindow = this.access.iframe.contentWindow;
        const idoc = this.access.iwindow.document;
        idoc.body.style.margin = '0';
        idoc.body.style.overflow = 'hidden';
        // --- 创建 style ---
        const styleEl = idoc.createElement('style');
        styleEl.textContent = 'body,html{font-size:12px;line-height:1;font-family:"Lucida Sans Unicode","Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif;}' + this.props.css;
        idoc.head.append(styleEl);
        // --- 创建 map 标签 ---
        const mapEl = idoc.createElement('div');
        mapEl.id = 'map';
        mapEl.style.height = '100%';
        // --- 绑定 down 事件 ---
        const down = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            // --- 让本窗体获取焦点 ---
            clickgo.form.changeFocus(this.formId);
            // --- 无论是否 menu 是否被展开，都要隐藏，因为 iframe 外的 doFocusAndPopEvent 并不会执行 ---
            clickgo.form.hidePop();
        };
        mapEl.addEventListener('mousedown', down);
        mapEl.addEventListener('touchstart', down, {
            'passive': true
        });
        idoc.body.append(mapEl);
        // --- 加载 script ---
        switch (this.props.factory) {
            case 'google': {
                const scriptEl = idoc.createElement('script');
                scriptEl.textContent = `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                    key: "${this.props.akey}",
                    v: "weekly"
                });`;
                idoc.head.append(scriptEl);
                this.access.iwindow.initMap = async () => {
                    await this.access.iwindow!.google.maps.importLibrary('maps');
                    this.access.lib = this.access.iwindow!.google.maps;

                    const props = this.props;
                    const access = this.access;
                    class Overlay extends this.access.lib.OverlayView {

                        private readonly _key: string;

                        private _position: any;

                        private _el?: HTMLElement;

                        public constructor(opt: {
                            'map': any;
                            'key': string;
                        }) {
                            super();
                            this._key = opt.key;
                            this._position =
                                new access.lib.LatLng(props.overlays[opt.key].lat, props.overlays[opt.key].lng);
                            this.setMap(opt.map);
                        }

                        public onAdd(): void {
                            const panes = this.getPanes();
                            const tel = idoc.createElement('div');
                            tel.innerHTML = props.overlays[this._key].html;
                            this._el = tel.firstChild as HTMLElement;
                            panes.overlayLayer.appendChild(this._el);
                        }

                        public draw(): void {
                            if (!this._el) {
                                return;
                            }
                            const pixel = this.getProjection().fromLatLngToDivPixel(this._position);
                            this._el.style.left = pixel.x + 'px';
                            this._el.style.top = pixel.y + 'px';
                        }

                        public onRemove(): void {
                            if (!this._el) {
                                return;
                            }
                            (this._el.parentNode as HTMLElement).removeChild(this._el);
                            delete this._el;
                        }

                        // --- 更新方法 ---

                        public setPosition(): void {
                            if (!this._el) {
                                return;
                            }
                            this._position =
                                new access.lib.LatLng(props.overlays[this._key].lat, props.overlays[this._key].lng);
                            const pixel = this.getProjection().fromLatLngToDivPixel(this._position);
                            this._el.style.left = pixel.x + 'px';
                            this._el.style.top = pixel.y + 'px';
                        }

                        public refreshHTML(): void {
                            if (!this._el) {
                                return;
                            }
                            (this._el.parentNode as HTMLElement).removeChild(this._el);
                            // --- 移除老的后添加新的 ---
                            const panes = this.getPanes();
                            const tel = idoc.createElement('div');
                            tel.innerHTML = props.overlays[this._key].html;
                            this._el = tel.firstChild as HTMLElement;
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
                    // --- 绑定事件 ---
                    this.access.map.addListener('click', (e: any) => {
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
                    // --- 更新覆盖物 ---
                    this.updateMarkers();
                    this.updateLines();
                    this.updatePolygons();
                    this.updateOverlays();
                    // --- 初始化成功 ---
                    this.isLoading = false;
                    this.emit('init', {
                        'lib': this.access.lib,
                        'map': this.access.map
                    });
                };
                this.access.iwindow.initMap();
                break;
            }
            case 'tianditu': {
                // ---- 加载天地图 ---
                const scriptEl = idoc.createElement('script');
                scriptEl.src = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.23/dist/maptalks.min.js';
                scriptEl.addEventListener('load', () => {
                    this.access.lib = this.access.iwindow!.maptalks;
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
                    // --- 绑定事件 ---
                    this.access.map.on('click', (e: any) => {
                        this.access.map.identify({
                            'coordinate': e.coordinate,
                            'layers': [this.access.vectorLayer],
                            'includeInternals': true,
                            'includeInvisible': true
                        }, (geos: any) => {
                            if (geos.length > 0) {
                                return;
                            }
                            this.emit('mapClick', {
                                'lat': e.coordinate.y,
                                'lng': e.coordinate.x
                            });
                        });
                    });
                    this.access.map.on('zooming', (e: any) => {
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
                    // --- 更新覆盖物 ---
                    this.updateMarkers();
                    this.updateLines();
                    this.updatePolygons();
                    this.updateOverlays();
                    // --- 初始化成功 ---
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

    public load(): void {
        if (this.access.map) {
            this.access.map = undefined;
        }
        // --- 清除老数据 ---
        this.access.overlay = undefined;
        this.access.zoom = undefined;
        this.access.vectorLayer = undefined;
        this.access.iwindow = undefined;
        this.access.markers = {};
        this.access.lines = {};
        this.access.polygons = {};
        this.access.overlays = {};
        if (this.props.akey === '') {
            // --- 如果 akey 是空，则不显示 iframe ---
            if (!this.notInit) {
                this.notInit = true;
            }
            if (this.isLoading) {
                this.isLoading = false;
            }
            return;
        }
        if (this.notInit) {
            // --- 如果没显示，让他显示 ---
            this.notInit = false;
        }
        else {
            // --- 如果已经显示，让他刷新 ---
            if (!this.access.iframe?.contentWindow) {
                return;
            }
            this.access.iframe.contentWindow.location.reload();
        }
        this.isLoading = true;
    }

    // --- 更新 markers ---
    public updateMarkers(): void {
        switch (this.props.factory) {
            case 'google': {
                for (const key in this.props.markers) {
                    const marker = this.props.markers[key];
                    if (!this.access.markers[key]) {
                        const obj = new this.access.lib.Marker({
                            'position': new this.access.lib.LatLng(marker.lat, marker.lng),
                            'title': marker.title,
                            'draggable': marker.drag ?? false,
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
                            // --- 更新到上级 ---
                            (this.props.markers as any)[key].lat = lat;
                            (this.props.markers as any)[key].lng = lng;
                            this.emit('update:markers', this.props.markers);
                            this.emit('markerUpdate', key);
                        });
                        this.access.markers[key] = {
                            'lat': marker.lat,
                            'lng': marker.lng,
                            'title': marker.title,
                            'drag': marker.drag ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 marker，更新原 marker ---
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
                    const drag = marker.drag ?? false;
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
                            'draggable': marker.drag ?? false,
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
                            // --- 更新到上级 ---
                            (this.props.markers as any)[key].lat = lat;
                            (this.props.markers as any)[key].lng = lng;
                            this.emit('update:markers', this.props.markers);
                            this.emit('markerUpdate', key);
                        });
                        this.access.markers[key] = {
                            'lat': marker.lat,
                            'lng': marker.lng,
                            'title': marker.title,
                            'drag': marker.drag ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 marker，更新原 marker ---
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
                    const drag = marker.drag ?? false;
                    if (this.access.markers[key].drag !== drag) {
                        this.access.markers[key].drag = drag;
                        this.access.markers[key].obj.config('draggable', drag);
                    }
                }
                break;
            }
        }
        // --- 移除已经消失的 marker ---
        this.removeNoex(this.props.markers, this.access.markers);
    }

    // --- 更新 overlays ---
    public updateOverlays(): void {
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
                    // --- 存在老，更新原 ---
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
                    // --- 存在老，更新原 ---
                    if (this.access.overlays[key].lat !== overlay.lat
                        || this.access.overlays[key].lng !== overlay.lng) {
                        this.access.overlays[key].lat = overlay.lat;
                        this.access.overlays[key].lng = overlay.lng;
                        this.access.overlays[key].obj.setCoordinates(
                            new this.access.lib.Coordinate(overlay.lng, overlay.lat)
                        );
                    }
                    if (this.access.overlays[key].html !== overlay.html) {
                        this.access.overlays[key].html = overlay.html;
                        this.access.overlays[key].obj.setContent(overlay.html);
                    }
                }
                break;
            }
        }
        // --- 移除已经消失的 marker ---
        this.removeNoex(this.props.markers, this.access.markers);
    }

    // --- 更新折线 ---
    public updateLines(): void {
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
                            'draggable': line.drag ?? false,
                            'editable': line.edit ?? false,
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
                        // --- 其他事件 ---
                        obj.addListener('contextmenu', (e: any) => {
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
                        obj.addListener('mousedown', (e: any) => {
                            if (e.domEvent.type !== 'touchstart') {
                                return;
                            }
                            if (e.vertex === undefined) {
                                return;
                            }
                            this.selectedObject.type = 'line';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            // --- touch 长按弹出 ---
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
                            'drag': line.drag ?? false,
                            'edit': line.edit ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 line，更新原 line ---
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
                    const drag = line.drag ?? false;
                    if (this.access.lines[key].drag !== drag) {
                        this.access.lines[key].drag = drag;
                        this.access.lines[key].obj.setDraggable(drag);
                    }
                    const edit = line.edit ?? false;
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
                        const paths: number[][] = [];
                        for (const item of line.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        const obj = new this.access.lib.LineString(paths, {
                            'symbol': {
                                'lineColor': line.strokeColor,
                                'lineOpacity': line.strokeOpacity,
                                'lineWidth': line.strokeWeight
                            },
                            'draggable': line.drag ?? false,
                            'editable': line.edit ?? false
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
                            const paths: any[] = [];
                            for (const item of coor) {
                                paths.push({
                                    'lat': Math.round(item.y * 1000000) / 1000000,
                                    'lng': Math.round(item.x * 1000000) / 1000000
                                });
                            }
                            this.access.lines[key].path = paths;
                            // --- 更新到上级 ---
                            (this.props.lines as any)[key].path = JSON.parse(JSON.stringify(paths));
                            this.emit('update:lines', this.props.lines);
                            this.emit('lineUpdate', key);
                        });
                        obj.on('shapechange', () => {
                            // --- 图形发生变动 ---
                            const paths: any[] = [];
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
                            // --- 向上更新新的 ---
                            (this.props.lines as any)[key].path = paths;
                            this.emit('update:lines', this.props.lines);

                            // --- 判断老的和新的一不一样 ---
                            if (paths.length === this.access.lines[key].path.length) {
                                // --- 节点移动 ---
                                this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('lineUpdate', key);
                            }
                            else {
                                // --- 节点新增、移除 ---
                                for (let i = 0; i < paths.length; ++i) {
                                    const old = this.access.lines[key].path[i];
                                    if (old.lat === paths[i].lat && old.lng === paths[i].lng) {
                                        continue;
                                    }
                                    // --- 不同的节点，新增的或已被移除 ---
                                    if (paths.length > this.access.lines[key].path.length) {
                                        // --- 新增 ---
                                        this.access.lines[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('lineInsert', key, i);
                                    }
                                    else {
                                        // --- 移除 ---
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
                            'drag': line.drag ?? false,
                            'edit': line.edit ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 line，更新原 line ---
                    const accessPath = JSON.stringify(this.access.lines[key].path);
                    const path = JSON.stringify(line.path);
                    if (accessPath !== path) {
                        this.access.lines[key].path = JSON.parse(path);
                        const paths: number[][] = [];
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
                    const drag = line.drag ?? false;
                    if (this.access.lines[key].drag !== drag) {
                        this.access.lines[key].drag = drag;
                        this.access.lines[key].obj.config('draggable', drag);
                    }
                    const edit = line.edit ?? false;
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
        // --- 移除已经消失的 marker ---
        this.removeNoex(this.props.lines, this.access.lines);
    }

    /** --- 给 line 的 path 增加事件 --- */
    public addLinePathEvent(path: Record<string, any>, key: string): void {
        path.addListener('insert_at', (index: number) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.lines as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineInsert', key, index);
        });
        path.addListener('remove_at', (index: number, removed: any) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.lines as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        });
        path.addListener('set_at', () => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.lines as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineUpdate', key);
        });
    }

    // --- 更新区域 ---
    public updatePolygons(): void {
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
                            'draggable': polygon.drag ?? false,
                            'editable': polygon.edit ?? false,
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
                        // --- 其他事件 ---
                        obj.addListener('contextmenu', (e: any) => {
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
                        obj.addListener('mousedown', (e: any) => {
                            if (e.domEvent.type !== 'touchstart') {
                                return;
                            }
                            if (e.vertex === undefined) {
                                return;
                            }
                            this.selectedObject.type = 'polygon';
                            this.selectedObject.key = key;
                            this.selectedObject.index = e.vertex;
                            // --- touch 长按弹出 ---
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
                            'drag': polygon.drag ?? false,
                            'edit': polygon.edit ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 polygon，更新原 polygon ---
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
                    const drag = polygon.drag ?? false;
                    if (this.access.polygons[key].drag !== drag) {
                        this.access.polygons[key].drag = drag;
                        this.access.polygons[key].obj.setDraggable(drag);
                    }
                    const edit = polygon.edit ?? false;
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
                        const paths: number[][] = [];
                        for (const item of polygon.path) {
                            paths.push([item.lng, item.lat]);
                        }
                        const obj = new this.access.lib.Polygon(paths, {
                            'symbol': {
                                'lineColor': polygon.strokeColor,
                                'lineOpacity': polygon.strokeOpacity,
                                'lineWidth': polygon.strokeWeight,
                                'polygonFill': polygon.fillColor,
                                'polygonOpacity': polygon.fillOpacity ?? .3
                            },

                            'draggable': polygon.drag ?? false,
                            'editable': polygon.edit ?? false
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
                            const paths: any[] = [];
                            for (const item of coords[0]) {
                                paths.push({
                                    'lat': Math.round(item.y * 1000000) / 1000000,
                                    'lng': Math.round(item.x * 1000000) / 1000000
                                });
                            }
                            this.access.polygons[key].path = paths;
                            // --- 更新到上级 ---
                            (this.props.polygons as any)[key].path = JSON.parse(JSON.stringify(paths));
                            this.emit('update:polygon', this.props.polygons);
                            this.emit('polygonUpdate', key);
                        });
                        obj.on('shapechange', () => {
                            // --- 图形发生变动 ---
                            const paths: any[] = [];
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
                            // --- 向上更新新的 ---
                            (this.props.polygons as any)[key].path = paths;
                            this.emit('update:polygons', this.props.polygons);

                            // --- 判断老的和新的一不一样 ---
                            if (paths.length === this.access.polygons[key].path.length) {
                                // --- 节点移动 ---
                                this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                this.emit('polygonUpdate', key);
                            }
                            else {
                                // --- 节点新增、移除 ---
                                for (let i = 0; i < paths.length; ++i) {
                                    const old = this.access.polygons[key].path[i];
                                    if (old.lat === paths[i].lat && old.lng === paths[i].lng) {
                                        continue;
                                    }
                                    // --- 不同的节点，新增的或已被移除 ---
                                    if (paths.length > this.access.polygons[key].path.length) {
                                        // --- 新增 ---
                                        this.access.polygons[key].path = JSON.parse(JSON.stringify(paths));
                                        this.emit('polygonInsert', key, i);
                                    }
                                    else {
                                        // --- 移除 ---
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
                            'drag': polygon.drag ?? false,
                            'edit': polygon.edit ?? false,
                            'obj': obj
                        };
                        continue;
                    }
                    // --- 存在老 polygon，更新原 polygon ---
                    const accessPath = JSON.stringify(this.access.polygons[key].path);
                    const path = JSON.stringify(polygon.path);
                    if (accessPath !== path) {
                        this.access.polygons[key].path = JSON.parse(path);
                        const paths: number[][] = [];
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
                    const drag = polygon.drag ?? false;
                    if (this.access.polygons[key].drag !== drag) {
                        this.access.polygons[key].drag = drag;
                        this.access.polygons[key].obj.config('draggable', drag);
                    }
                    const edit = polygon.edit ?? false;
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
        // --- 移除已经消失的 marker ---
        this.removeNoex(this.props.polygons, this.access.polygons);
    }

    /** --- 给 polygon 的 path 增加事件 --- */
    public addPolygonPathEvent(path: Record<string, any>, key: string): void {
        path.addListener('insert_at', (index: number) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.polygons as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonInsert', key, index);
        });
        path.addListener('remove_at', (index: number, removed: any) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.polygons as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        });
        path.addListener('set_at', (index: number) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            (this.props.polygons as any)[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineUpdate', key, index);
        });
    }

    /** --- 移除在新对象中找不到的老对象中的项目 --- */
    public removeNoex(newo: Record<string, any>, oldo: Record<string, any>): void {
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

    // --- 右键菜单 ---

    public removeNode(): void {
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

    // --- 初次装载 ---

    public async onMounted(): Promise<void> {
        this.load();
        this.watch('akey', () => {
            this.load();
        });
        this.watch('factory', () => {
            this.load();
        });

        /** --- 加载 marker 样式图片（天地图-Maptalks） --- */
        this.access.markerImg = await clickgo.tool.blob2DataUrl(this.files['/res/marker.svg'] as Blob);

        // --- 选项变更 ---

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
                        // --- 添加 ---
                        this.access.zoom = new this.access.lib.control.Zoom({
                            'position': 'bottom-right',
                            'zoomLevel': false
                        });
                        this.access.map.addControl(this.access.zoom);
                    }
                    else {
                        // --- 移除 ---
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
    }

}
