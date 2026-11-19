/// <reference types="google.maps" />
import * as clickgo from 'clickgo';
import { MapLibreAdapter } from './abox/maplibre';
/** --- 天地图底图与 OSM 底图切换范围，并不代表任何区域/国境线 --- */
// eslint-disable-next-line @stylistic/key-spacing, @stylistic/comma-spacing, @stylistic/object-curly-spacing
const tdpolygon = [{ 'lat': 48.450203, 'lng': 85.779506 }, { 'lat': 48.196905, 'lng': 85.484964 }, { 'lat': 47.118502, 'lng': 85.489791 }, { 'lat': 47.051568, 'lng': 83.874497 }, { 'lat': 47.291454, 'lng': 82.995577 }, { 'lat': 45.614305, 'lng': 82.145471 }, { 'lat': 45.248283, 'lng': 82.504298 }, { 'lat': 45.465301, 'lng': 81.854461 }, { 'lat': 45.028273, 'lng': 79.749485 }, { 'lat': 43.250186, 'lng': 80.666645 }, { 'lat': 42.920257, 'lng': 80.146637 }, { 'lat': 42.122486, 'lng': 80.089135 }, { 'lat': 41.478927, 'lng': 78.230156 }, { 'lat': 41.125925, 'lng': 77.70275 }, { 'lat': 41.149542, 'lng': 76.826364 }, { 'lat': 40.477242, 'lng': 76.470331 }, { 'lat': 40.366876, 'lng': 75.782885 }, { 'lat': 40.747633, 'lng': 75.637102 }, { 'lat': 40.554106, 'lng': 74.840279 }, { 'lat': 40.137634, 'lng': 73.870804 }, { 'lat': 39.556288, 'lng': 73.750286 }, { 'lat': 39.500496, 'lng': 73.350206 }, { 'lat': 38.511124, 'lng': 73.74586 }, { 'lat': 38.464105, 'lng': 74.698112 }, { 'lat': 37.385111, 'lng': 74.914031 }, { 'lat': 37.344806, 'lng': 74.418208 }, { 'lat': 37.029986, 'lng': 74.378385 }, { 'lat': 36.646667, 'lng': 75.736854 }, { 'lat': 36.022157, 'lng': 75.779226 }, { 'lat': 35.399525, 'lng': 77.248964 }, { 'lat': 35.387481, 'lng': 77.864858 }, { 'lat': 32.793943, 'lng': 79.00728 }, { 'lat': 32.691787, 'lng': 78.186076 }, { 'lat': 31.029463, 'lng': 78.827991 }, { 'lat': 29.914897, 'lng': 81.237128 }, { 'lat': 30.30827, 'lng': 81.528831 }, { 'lat': 27.919926, 'lng': 85.789773 }, { 'lat': 27.695771, 'lng': 87.299969 }, { 'lat': 27.975023, 'lng': 88.725285 }, { 'lat': 27.371729, 'lng': 88.673764 }, { 'lat': 27.104419, 'lng': 89.08026 }, { 'lat': 28.11168, 'lng': 89.671715 }, { 'lat': 27.747947, 'lng': 91.364162 }, { 'lat': 26.813117, 'lng': 92.046289 }, { 'lat': 26.913633, 'lng': 93.74285 }, { 'lat': 28.11852, 'lng': 95.871935 }, { 'lat': 27.661535, 'lng': 97.06375 }, { 'lat': 28.127458, 'lng': 98.008955 }, { 'lat': 26.205632, 'lng': 98.551991 }, { 'lat': 24.690439, 'lng': 97.372098 }, { 'lat': 23.742346, 'lng': 97.544862 }, { 'lat': 24.040013, 'lng': 98.537267 }, { 'lat': 22.099233, 'lng': 99.117237 }, { 'lat': 21.971814, 'lng': 99.896468 }, { 'lat': 21.510738, 'lng': 99.972002 }, { 'lat': 21.343015, 'lng': 100.540488 }, { 'lat': 21.687813, 'lng': 101.040349 }, { 'lat': 21.170124, 'lng': 101.194254 }, { 'lat': 21.13175, 'lng': 101.857792 }, { 'lat': 21.840658, 'lng': 101.814364 }, { 'lat': 21.973453, 'lng': 101.666887 }, { 'lat': 22.392019, 'lng': 101.700064 }, { 'lat': 22.362935, 'lng': 102.198458 }, { 'lat': 22.720893, 'lng': 102.489763 }, { 'lat': 22.411966, 'lng': 103.081813 }, { 'lat': 22.773836, 'lng': 103.344971 }, { 'lat': 22.574143, 'lng': 103.530313 }, { 'lat': 22.791159, 'lng': 103.6438 }, { 'lat': 22.505199, 'lng': 103.941914 }, { 'lat': 22.506605, 'lng': 104.010065 }, { 'lat': 22.721504, 'lng': 104.053004 }, { 'lat': 22.823848, 'lng': 104.252844 }, { 'lat': 22.743761, 'lng': 104.246474 }, { 'lat': 22.668125, 'lng': 104.375574 }, { 'lat': 22.817177, 'lng': 104.547557 }, { 'lat': 22.808577, 'lng': 104.730215 }, { 'lat': 22.927311, 'lng': 104.878599 }, { 'lat': 23.100528, 'lng': 104.824939 }, { 'lat': 23.256604, 'lng': 105.239989 }, { 'lat': 23.357486, 'lng': 105.328007 }, { 'lat': 23.078377, 'lng': 105.537416 }, { 'lat': 22.908357, 'lng': 105.850551 }, { 'lat': 22.955018, 'lng': 106.197311 }, { 'lat': 22.866414, 'lng': 106.237257 }, { 'lat': 22.794224, 'lng': 106.784385 }, { 'lat': 22.606187, 'lng': 106.696641 }, { 'lat': 22.625312, 'lng': 106.590684 }, { 'lat': 22.358103, 'lng': 106.54564 }, { 'lat': 22.317184, 'lng': 106.59183 }, { 'lat': 21.981753, 'lng': 106.65266 }, { 'lat': 21.819269, 'lng': 106.98995 }, { 'lat': 21.595217, 'lng': 107.343718 }, { 'lat': 21.590711, 'lng': 107.469554 }, { 'lat': 21.559744, 'lng': 107.926214 }, { 'lat': 21.352116, 'lng': 108.098069 }, { 'lat': 18.848867, 'lng': 106.365221 }, { 'lat': 16.639856, 'lng': 109.001483 }, { 'lat': 12.354209, 'lng': 110.144143 }, { 'lat': 6.898159, 'lng': 107.693078 }, { 'lat': 2.411098, 'lng': 109.712197 }, { 'lat': 3.608205, 'lng': 112.685627 }, { 'lat': 6.917141, 'lng': 115.65903 }, { 'lat': 11.621863, 'lng': 119.117695 }, { 'lat': 17.427307, 'lng': 119.181631 }, { 'lat': 21.559136, 'lng': 121.944652 }, { 'lat': 24.692908, 'lng': 122.813551 }, { 'lat': 25.804961, 'lng': 125.605796 }, { 'lat': 28.902045, 'lng': 123.868392 }, { 'lat': 39.90736, 'lng': 124.360414 }, { 'lat': 40.066205, 'lng': 124.3809 }, { 'lat': 40.439782, 'lng': 124.890951 }, { 'lat': 40.45972, 'lng': 125.068013 }, { 'lat': 40.527594, 'lng': 125.065451 }, { 'lat': 40.869317, 'lng': 126.010098 }, { 'lat': 41.33995, 'lng': 126.476201 }, { 'lat': 41.60523, 'lng': 126.617014 }, { 'lat': 41.766003, 'lng': 126.931591 }, { 'lat': 41.510138, 'lng': 127.077456 }, { 'lat': 41.320014, 'lng': 128.102703 }, { 'lat': 41.486041, 'lng': 128.404762 }, { 'lat': 41.997492, 'lng': 128.094529 }, { 'lat': 42.001111, 'lng': 128.933119 }, { 'lat': 42.116075, 'lng': 129.178446 }, { 'lat': 42.372408, 'lng': 129.29815 }, { 'lat': 42.431228, 'lng': 129.437197 }, { 'lat': 42.353695, 'lng': 129.547389 }, { 'lat': 42.420265, 'lng': 129.610984 }, { 'lat': 42.424085, 'lng': 129.702434 }, { 'lat': 42.462124, 'lng': 129.747722 }, { 'lat': 42.576265, 'lng': 129.747706 }, { 'lat': 42.598597, 'lng': 129.784763 }, { 'lat': 42.705073, 'lng': 129.78115 }, { 'lat': 42.916487, 'lng': 129.87516 }, { 'lat': 42.95932, 'lng': 129.870308 }, { 'lat': 42.967079, 'lng': 130.082224 }, { 'lat': 42.902427, 'lng': 130.103318 }, { 'lat': 42.888846, 'lng': 130.246131 }, { 'lat': 42.69931, 'lng': 130.183364 }, { 'lat': 42.397308, 'lng': 130.650496 }, { 'lat': 42.737426, 'lng': 130.603166 }, { 'lat': 42.839518, 'lng': 131.143634 }, { 'lat': 43.366525, 'lng': 131.360013 }, { 'lat': 44.028043, 'lng': 131.35622 }, { 'lat': 44.836955, 'lng': 131.088684 }, { 'lat': 44.964281, 'lng': 131.539184 }, { 'lat': 45.262532, 'lng': 131.873955 }, { 'lat': 44.975256, 'lng': 133.017162 }, { 'lat': 46.053746, 'lng': 133.755692 }, { 'lat': 46.140663, 'lng': 133.72556 }, { 'lat': 46.240843, 'lng': 133.93668 }, { 'lat': 46.988564, 'lng': 134.084767 }, { 'lat': 47.106612, 'lng': 134.248747 }, { 'lat': 47.31182, 'lng': 134.190123 }, { 'lat': 47.453882, 'lng': 134.551237 }, { 'lat': 47.730982, 'lng': 134.806545 }, { 'lat': 48.012002, 'lng': 134.580478 }, { 'lat': 48.109307, 'lng': 134.684949 }, { 'lat': 48.26088, 'lng': 134.691984 }, { 'lat': 48.397305, 'lng': 135.138638 }, { 'lat': 48.487535, 'lng': 135.12153 }, { 'lat': 48.402161, 'lng': 134.23148 }, { 'lat': 48.148786, 'lng': 133.131845 }, { 'lat': 47.989237, 'lng': 132.660165 }, { 'lat': 47.775175, 'lng': 132.543443 }, { 'lat': 47.733535, 'lng': 131.125889 }, { 'lat': 48.862439, 'lng': 130.735731 }, { 'lat': 49.404189, 'lng': 129.639086 }, { 'lat': 49.600085, 'lng': 128.819985 }, { 'lat': 49.616134, 'lng': 127.947989 }, { 'lat': 52.797943, 'lng': 126.261345 }, { 'lat': 53.605774, 'lng': 123.92994 }, { 'lat': 53.509858, 'lng': 120.972201 }, { 'lat': 52.591649, 'lng': 119.752004 }, { 'lat': 52.530967, 'lng': 120.579839 }, { 'lat': 52.031972, 'lng': 120.513135 }, { 'lat': 51.782882, 'lng': 119.872711 }, { 'lat': 50.182899, 'lng': 118.945525 }, { 'lat': 49.556974, 'lng': 117.80773 }, { 'lat': 49.894417, 'lng': 116.71725 }, { 'lat': 47.646, 'lng': 115.095524 }, { 'lat': 47.609054, 'lng': 119.048075 }, { 'lat': 46.796656, 'lng': 119.861435 }, { 'lat': 46.79858, 'lng': 116.81335 }, { 'lat': 45.751738, 'lng': 116.055292 }, { 'lat': 45.493109, 'lng': 114.690026 }, { 'lat': 44.785075, 'lng': 113.603211 }, { 'lat': 45.096691, 'lng': 111.810423 }, { 'lat': 44.369551, 'lng': 111.291066 }, { 'lat': 43.732257, 'lng': 111.872232 }, { 'lat': 42.579933, 'lng': 109.400016 }, { 'lat': 42.526246, 'lng': 107.388334 }, { 'lat': 41.803058, 'lng': 105.177347 }, { 'lat': 42.738446, 'lng': 101.194736 }, { 'lat': 42.833595, 'lng': 96.513761 }, { 'lat': 44.331662, 'lng': 95.53591 }, { 'lat': 44.297478, 'lng': 95.029834 }, { 'lat': 44.985916, 'lng': 93.633238 }, { 'lat': 45.260259, 'lng': 91.004807 }, { 'lat': 45.493364, 'lng': 90.756695 }, { 'lat': 45.979527, 'lng': 91.062312 }, { 'lat': 46.631254, 'lng': 91.146309 }, { 'lat': 47.901679, 'lng': 90.29278 }, { 'lat': 47.930065, 'lng': 89.706102 }, { 'lat': 48.031383, 'lng': 89.647632 }, { 'lat': 48.20611, 'lng': 88.687193 }, { 'lat': 48.361037, 'lng': 88.66978 }, { 'lat': 48.591853, 'lng': 88.014352 }, { 'lat': 48.701138, 'lng': 88.13692 }, { 'lat': 49.195897, 'lng': 87.840332 }, { 'lat': 49.150227, 'lng': 86.886047 }, { 'lat': 48.995127, 'lng': 86.71887 }, { 'lat': 48.925105, 'lng': 86.729035 }, { 'lat': 48.840935, 'lng': 86.804793 }, { 'lat': 48.805172, 'lng': 86.752248 }, { 'lat': 48.726764, 'lng': 86.765929 }, { 'lat': 48.513322, 'lng': 86.478271 }, { 'lat': 48.450203, 'lng': 85.779506 }];
/** --- 判断一个经纬度是否在一个经纬度集合组成的面里 --- */
function isPointInPolygon(point, polygon) {
    const { lat, lng } = point;
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat;
        const yi = polygon[i].lng;
        const xj = polygon[j].lat;
        const yj = polygon[j].lng;
        const intersect = yi > lng !== yj > lng &&
            lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
        if (intersect) {
            isInside = !isInside;
        }
    }
    return isInside;
}
export default class extends clickgo.control.AbstractControl {
    _disposed = false;
    _pathListeners = new WeakMap();
    emits = {
        'mapClick': null,
        'init': null,
        'error': null,
        'markerClick': null,
        'markerDrag': null,
        'markerDragend': null,
        'markerUpdate': null,
        'overlayClick': null,
        'lineClick': null,
        'lineDrag': null,
        'lineDragend': null,
        'lineUpdate': null,
        'lineInsert': null,
        'lineRemove': null,
        'polygonClick': null,
        'polygonDrag': null,
        'polygonDragend': null,
        'polygonUpdate': null,
        'polygonInsert': null,
        'polygonRemove': null,
        'update:zoom': null,
        'update:lat': null,
        'update:lng': null,
        'update:markers': null,
        'update:lines': null,
        'update:polygons': null
    };
    props = {
        'disabled': false,
        'factory': 'google',
        'akey': '',
        'mapId': '',
        'css': '',
        'tdurlcn': undefined,
        'tdhostintl': undefined,
        'lat': 31.223704,
        'lng': 121.366077,
        'zoom': 10,
        'zoomControl': false,
        'markers': {},
        'lines': {},
        'polygons': {},
        'overlays': {}
    };
    get showMask() {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }
    access = {
        'mapLibre': undefined,
        'lib': undefined,
        'map': undefined,
        'markerLib': undefined,
        'overlay': undefined,
        'markerImg': '',
        'iframe': undefined,
        'iwindow': undefined,
        'markers': {},
        'lines': {},
        'polygons': {},
        'overlays': {}
    };
    /** --- 是否没有初始化 --- */
    notInit = true;
    /** --- 当前是否加载中 --- */
    isLoading = false;
    /** --- 当前地图的缩放级别 --- */
    zoomData = 10;
    latData = 0;
    lngData = 0;
    /** --- 当前选中对象情况 --- */
    selectedObject = {
        'type': 'line',
        'key': '',
        'index': 0
    };
    localeData = {
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
        },
        'ar': {
            'remove node': 'إزالة العقدة'
        },
        'id': {
            'remove node': 'Hapus simpul'
        },
        'it': {
            'remove node': 'Rimuovi nodo'
        },
        'tr': {
            'remove node': 'Düğümü kaldır'
        }
    };
    // --- iframe ---
    iframeLoad(e) {
        this.access.iframe = e.currentTarget;
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
        const down = async () => {
            // --- 让本窗体获取焦点 ---
            await clickgo.form.changeFocus(this.formId);
            // --- 无论是否 menu 是否被展开，都要隐藏，因为 iframe 外的 doFocusAndPopEvent 并不会执行 ---
            clickgo.form.hidePop();
        };
        mapEl.addEventListener('pointerdown', () => {
            down().catch(() => { });
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
                    if (!this.access.iwindow?.google) {
                        return;
                    }
                    const [, markerLib] = await Promise.all([
                        this.access.iwindow.google.maps.importLibrary('maps'),
                        this.access.iwindow.google.maps.importLibrary('marker')
                    ]);
                    if (this.access.iwindow !== idoc.defaultView || this.access.iwindow?.document !== idoc
                        || !this.access.iwindow?.google) {
                        return;
                    }
                    const lib = this.access.iwindow.google.maps;
                    const props = this.props;
                    class Overlay extends lib.OverlayView {
                        _key;
                        _position;
                        _el;
                        constructor(opt) {
                            super();
                            this._key = opt.key;
                            this._position =
                                new lib.LatLng(props.overlays[opt.key].lat, props.overlays[opt.key].lng);
                            this.setMap(opt.map);
                        }
                        onAdd() {
                            const panes = this.getPanes();
                            if (!panes) {
                                return;
                            }
                            this._el = idoc.createElement('div');
                            this._el.style.position = 'absolute';
                            this._el.innerHTML = props.overlays[this._key].html;
                            this._el.addEventListener('click', (event) => {
                                event.stopPropagation();
                                lib.event.trigger(this, 'click');
                            });
                            panes.overlayMouseTarget.appendChild(this._el);
                        }
                        draw() {
                            if (!this._el) {
                                return;
                            }
                            const pixel = this.getProjection().fromLatLngToDivPixel(this._position);
                            if (!pixel) {
                                return;
                            }
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
                        // --- 更新方法 ---
                        setPosition() {
                            this._position =
                                new lib.LatLng(props.overlays[this._key].lat, props.overlays[this._key].lng);
                            this.draw();
                        }
                        refreshHTML() {
                            if (!this._el) {
                                return;
                            }
                            this._el.innerHTML = props.overlays[this._key].html;
                            this.draw();
                        }
                    }
                    this.access.overlay = Overlay;
                    this.access.markerLib = markerLib;
                    const map = new lib.Map(idoc.getElementById('map'), {
                        'center': {
                            'lat': this.propNumber('lat'),
                            'lng': this.propNumber('lng')
                        },
                        'zoom': this.propNumber('zoom'),
                        'zoomControl': this.propBoolean('zoomControl'),
                        'mapId': this.props.mapId || 'DEMO_MAP_ID',
                        'mapTypeControl': false,
                        'streetViewControl': false,
                        'fullscreenControl': false,
                        'gestureHandling': 'greedy'
                    });
                    this.latData = this.propNumber('lat');
                    this.lngData = this.propNumber('lng');
                    this.zoomData = this.propNumber('zoom');
                    // --- 绑定事件 ---
                    map.addListener('click', (e) => {
                        this.emit('mapClick', {
                            'lat': e.latLng.lat(),
                            'lng': e.latLng.lng()
                        });
                    });
                    map.addListener('zoom_changed', () => {
                        this.zoomData = map.getZoom() ?? 0;
                        this.emit('update:zoom', this.zoomData);
                    });
                    map.addListener('center_changed', () => {
                        const center = map.getCenter();
                        const lat = center?.lat() ?? 0;
                        const lng = center?.lng() ?? 0;
                        if (lat !== this.latData) {
                            this.latData = lat;
                            this.emit('update:lat', lat);
                        }
                        if (lng !== this.lngData) {
                            this.lngData = lng;
                            this.emit('update:lng', lng);
                        }
                    });
                    // --- 更新 ---
                    this.access.lib = lib;
                    this.access.map = map;
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
                this.access.iwindow.initMap().catch((error) => {
                    if (this.access.iwindow === idoc.defaultView && this.access.iwindow?.document === idoc) {
                        this.isLoading = false;
                        this.emit('error', error);
                    }
                });
                break;
            }
            case 'tianditu': {
                const scriptEl = idoc.createElement('script');
                scriptEl.type = 'module';
                const moduleUrl = `${clickgo.getCdn()}/npm/maplibre-gl@6.18.0/dist/maplibre-gl.mjs`;
                scriptEl.textContent = `import * as maplibregl from ${JSON.stringify(moduleUrl)};
                    window.initMapLibre(maplibregl);`;
                // --- 模块在 iframe 中执行，SDK 不会自动挂载到 window ---
                this.access.iwindow.initMapLibre = (lib) => {
                    if (this.access.iwindow !== idoc.defaultView || this.access.iwindow?.document !== idoc) {
                        return;
                    }
                    this.access.lib = lib;
                    this.latData = this.propNumber('lat');
                    this.lngData = this.propNumber('lng');
                    this.zoomData = this.propNumber('zoom');
                    try {
                        this.access.mapLibre = new MapLibreAdapter({
                            'lib': this.access.lib,
                            'container': mapEl,
                            'key': this.props.akey,
                            'center': { 'lat': this.latData, 'lng': this.lngData },
                            'zoom': this.zoomData,
                            'zoomControl': this.propBoolean('zoomControl'),
                            'markerImage': this.access.markerImg,
                            'urlCn': this.props.tdurlcn,
                            'hostIntl': this.props.tdhostintl,
                            'inChina': (point) => isPointInPolygon(point, tdpolygon),
                            'emit': (event, ...args) => {
                                if (event === 'center') {
                                    const center = args[0];
                                    if (center.lat !== this.latData) {
                                        this.latData = center.lat;
                                        this.emit('update:lat', center.lat);
                                    }
                                    if (center.lng !== this.lngData) {
                                        this.lngData = center.lng;
                                        this.emit('update:lng', center.lng);
                                    }
                                }
                                else if (event === 'zoom') {
                                    this.zoomData = args[0];
                                    this.emit('update:zoom', this.zoomData);
                                }
                                else {
                                    this.emit(event, ...args);
                                }
                            },
                            'pathChange': (type, key, path, action, index, old) => {
                                const items = type === 'line' ? this.props.lines : this.props.polygons;
                                if (!items[key]) {
                                    return;
                                }
                                items[key].path = path;
                                this.emit(type === 'line' ? 'update:lines' : 'update:polygons', items);
                                if (action === 'insert') {
                                    this.emit(type === 'line' ? 'lineInsert' : 'polygonInsert', key, index);
                                }
                                else if (action === 'remove') {
                                    this.emit(type === 'line' ? 'lineRemove' : 'polygonRemove', key, index, old);
                                }
                                else {
                                    this.emit(type === 'line' ? 'lineUpdate' : 'polygonUpdate', key);
                                }
                            },
                            'markerChange': (key, point) => {
                                if (!this.props.markers[key]) {
                                    return;
                                }
                                this.props.markers[key].lat = point.lat;
                                this.props.markers[key].lng = point.lng;
                                this.emit('update:markers', this.props.markers);
                                this.emit('markerUpdate', key);
                            },
                            'nodeMenu': (type, key, index, event) => {
                                this.selectedObject = { type, key, index };
                                clickgo.modules.pointer.menu(event, (e) => {
                                    const rect = this.element.getBoundingClientRect();
                                    clickgo.form.showPop(this.element, this.refs.pop, {
                                        'x': rect.left + e.clientX,
                                        'y': rect.top + e.clientY
                                    });
                                });
                            }
                        });
                        this.access.map = this.access.mapLibre.map;
                        const adapter = this.access.mapLibre;
                        adapter.map.once('load', () => {
                            if (this.access.mapLibre !== adapter) {
                                return;
                            }
                            try {
                                this.updateMarkers();
                                this.updateLines();
                                this.updatePolygons();
                                this.updateOverlays();
                                this.isLoading = false;
                                this.emit('init', { 'lib': this.access.lib, 'map': this.access.map });
                            }
                            catch (error) {
                                adapter.destroy();
                                this.access.mapLibre = undefined;
                                this.access.map = undefined;
                                this.isLoading = false;
                                this.emit('error', error);
                            }
                        });
                    }
                    catch (error) {
                        this.isLoading = false;
                        this.emit('error', error);
                    }
                };
                scriptEl.onerror = (event) => {
                    if (this.access.iwindow === idoc.defaultView && this.access.iwindow?.document === idoc) {
                        this.isLoading = false;
                        this.emit('error', event);
                    }
                };
                idoc.head.append(scriptEl);
                const linkEl = idoc.createElement('link');
                linkEl.rel = 'stylesheet';
                linkEl.href = `${clickgo.getCdn()}/npm/maplibre-gl@6.18.0/dist/maplibre-gl.css`;
                linkEl.onerror = (event) => {
                    if (this.access.iwindow === idoc.defaultView && this.access.iwindow?.document === idoc) {
                        this.isLoading = false;
                        this.emit('error', event);
                    }
                };
                idoc.head.append(linkEl);
                break;
            }
        }
    }
    /**
     * --- 释放当前地图与覆盖物，保留 iframe 和标记图片以供重新加载 ---
     * @returns 无返回值
     */
    _disposeMap() {
        this.access.iwindow = undefined;
        this.access.mapLibre?.destroy();
        for (const key in this.access.markers) {
            this._removeGoogleMarker(key);
        }
        this._removeGoogleObjects({}, this.access.lines);
        this._removeGoogleObjects({}, this.access.polygons);
        this._removeGoogleObjects({}, this.access.overlays);
        this.access.mapLibre = undefined;
        this.access.markerLib = undefined;
        this.access.lib = undefined;
        this.access.map = undefined;
        this.access.overlay = undefined;
        this.access.markers = {};
        this.access.lines = {};
        this.access.polygons = {};
        this.access.overlays = {};
    }
    load() {
        this._disposeMap();
        if (this.props.akey === '' && !(this.props.factory === 'tianditu' && this.props.tdurlcn)) {
            // --- 如果 akey 是空，则不显示 iframe ---
            this.notInit = true;
            this.isLoading = false;
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
    /** --- 按地图引擎同步标记的新增、修改和移除 --- */
    updateMarkers() {
        if (this.props.factory === 'tianditu') {
            this.access.mapLibre?.syncMarkers(this.props.markers);
            return;
        }
        for (const key in this.props.markers) {
            const marker = this.props.markers[key];
            if (!this.access.markers[key]) {
                const obj = new this.access.markerLib.AdvancedMarkerElement({
                    'position': { 'lat': marker.lat, 'lng': marker.lng },
                    'title': marker.title,
                    'gmpDraggable': marker.drag ?? false,
                    'gmpClickable': true,
                    'map': this.access.map
                });
                const entry = {
                    'lat': marker.lat,
                    'lng': marker.lng,
                    'title': marker.title,
                    'drag': marker.drag ?? false,
                    'obj': obj,
                    'listeners': []
                };
                this.access.markers[key] = entry;
                const syncPosition = () => {
                    if (this.access.markers[key] !== entry || !this.props.markers[key] || !obj.position) {
                        return;
                    }
                    const position = obj.position;
                    const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
                    const lng = typeof position.lng === 'function' ? position.lng() : position.lng;
                    if (lat === entry.lat && lng === entry.lng) {
                        return;
                    }
                    entry.lat = lat;
                    entry.lng = lng;
                    this.props.markers[key].lat = lat;
                    this.props.markers[key].lng = lng;
                    this.emit('update:markers', this.props.markers);
                    this.emit('markerUpdate', key);
                };
                const listen = (type, callback) => {
                    obj.addEventListener(type, callback);
                    entry.listeners.push({ type, callback });
                };
                listen('gmp-click', () => {
                    if (this.access.markers[key] === entry && this.props.markers[key]) {
                        this.emit('markerClick', key);
                    }
                });
                listen('gmp-drag', () => {
                    syncPosition();
                    if (this.access.markers[key] === entry && this.props.markers[key]) {
                        this.emit('markerDrag', key);
                    }
                });
                listen('gmp-dragend', () => {
                    syncPosition();
                    if (this.access.markers[key] === entry && this.props.markers[key]) {
                        this.emit('markerDragend', key);
                    }
                });
                continue;
            }
            const entry = this.access.markers[key];
            if (entry.lat !== marker.lat || entry.lng !== marker.lng) {
                entry.lat = marker.lat;
                entry.lng = marker.lng;
                entry.obj.position = { 'lat': marker.lat, 'lng': marker.lng };
                this.emit('update:markers', this.props.markers);
                this.emit('markerUpdate', key);
            }
            if (entry.title !== marker.title) {
                entry.title = marker.title;
                entry.obj.title = marker.title ?? '';
            }
            const drag = marker.drag ?? false;
            if (entry.drag !== drag) {
                entry.drag = drag;
                entry.obj.gmpDraggable = drag;
            }
        }
        for (const key in this.access.markers) {
            if (!this.props.markers[key]) {
                this._removeGoogleMarker(key);
            }
        }
    }
    /**
     * --- 移除 Google 标记和其事件监听 ---
     * @param key 标记键
     * @returns 无返回值
     */
    _removeGoogleMarker(key) {
        const entry = this.access.markers[key];
        if (!entry) {
            return;
        }
        delete this.access.markers[key];
        for (const listener of entry.listeners) {
            entry.obj.removeEventListener(listener.type, listener.callback);
        }
        entry.obj.map = null;
    }
    /** --- 按地图引擎同步自定义覆盖物的新增、修改和移除 --- */
    updateOverlays() {
        if (this.props.factory === 'tianditu') {
            this.access.mapLibre?.syncOverlays(this.props.overlays);
            return;
        }
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
        this._removeGoogleObjects(this.props.overlays, this.access.overlays);
    }
    /** --- 按地图引擎同步折线的新增、修改和移除 --- */
    updateLines() {
        if (this.props.factory === 'tianditu') {
            this.access.mapLibre?.syncShapes('line', this.props.lines);
            return;
        }
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
                obj.addListener('mousedown', (oe) => {
                    if (oe.vertex === undefined) {
                        return;
                    }
                    this.selectedObject.type = 'line';
                    this.selectedObject.key = key;
                    this.selectedObject.index = oe.vertex;
                    // --- 长按弹出 ---
                    clickgo.modules.pointer.menu(oe.domEvent, (e) => {
                        const rect = this.element.getBoundingClientRect();
                        clickgo.form.showPop(this.element, this.refs.pop, {
                            'x': rect.left + e.clientX,
                            'y': rect.top + e.clientY
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
                this._removePathListeners(this.access.lines[key].obj.getPath());
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
        this._removeGoogleObjects(this.props.lines, this.access.lines);
    }
    /** --- 给 line 的 path 增加事件 --- */
    addLinePathEvent(path, key) {
        const listeners = [];
        this._pathListeners.set(path, listeners);
        listeners.push(path.addListener('insert_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineInsert', key, index);
        }));
        listeners.push(path.addListener('remove_at', (index, removed) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        }));
        listeners.push(path.addListener('set_at', () => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.lines[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.lines[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:lines', this.props.lines);
            this.emit('lineUpdate', key);
        }));
    }
    /** --- 按地图引擎同步多边形的新增、修改和移除 --- */
    updatePolygons() {
        if (this.props.factory === 'tianditu') {
            this.access.mapLibre?.syncShapes('polygon', this.props.polygons);
            return;
        }
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
                obj.addListener('mousedown', (oe) => {
                    if (oe.vertex === undefined) {
                        return;
                    }
                    this.selectedObject.type = 'polygon';
                    this.selectedObject.key = key;
                    this.selectedObject.index = oe.vertex;
                    // --- 弹出菜单 ---
                    clickgo.modules.pointer.menu(oe.domEvent, (e) => {
                        const rect = this.element.getBoundingClientRect();
                        clickgo.form.showPop(this.element, this.refs.pop, {
                            'x': rect.left + e.clientX,
                            'y': rect.top + e.clientY
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
                this._removePathListeners(this.access.polygons[key].obj.getPath());
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
        this._removeGoogleObjects(this.props.polygons, this.access.polygons);
    }
    /** --- 给 polygon 的 path 增加事件 --- */
    addPolygonPathEvent(path, key) {
        const listeners = [];
        this._pathListeners.set(path, listeners);
        listeners.push(path.addListener('insert_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonInsert', key, index);
        }));
        listeners.push(path.addListener('remove_at', (index, removed) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonRemove', key, index, {
                'lat': removed.lat(),
                'lng': removed.lng()
            });
        }));
        listeners.push(path.addListener('set_at', (index) => {
            const pathArray = JSON.parse(JSON.stringify(path.getArray()));
            this.access.polygons[key].path = pathArray;
            // --- 更新到上级 ---
            this.props.polygons[key].path = JSON.parse(JSON.stringify(pathArray));
            this.emit('update:polygons', this.props.polygons);
            this.emit('polygonUpdate', key, index);
        }));
    }
    _removePathListeners(path) {
        for (const listener of this._pathListeners.get(path) ?? []) {
            listener.remove();
        }
        this._pathListeners.delete(path);
    }
    /**
     * --- 从地图移除已不在绑定集合中的 Google 覆盖物，并删除缓存 ---
     * @param items 当前绑定的覆盖物集合
     * @param objects 已创建的 Google 覆盖物
     * @returns 无返回值
     */
    _removeGoogleObjects(items, objects) {
        for (const key in objects) {
            if (items[key]) {
                continue;
            }
            const object = objects[key].obj;
            if (object.getPath) {
                this._removePathListeners(object.getPath());
            }
            object.setMap(null);
            delete objects[key];
        }
    }
    // --- 右键菜单 ---
    removeNode() {
        if (this.props.factory === 'tianditu') {
            this.access.mapLibre?.removeNode(this.selectedObject.type, this.selectedObject.key, this.selectedObject.index);
            return;
        }
        switch (this.selectedObject.type) {
            case 'line': {
                const path = this.access.lines[this.selectedObject.key]?.obj.getPath();
                if (path && this.selectedObject.index >= 0 && this.selectedObject.index < path.getLength()
                    && path.getLength() > 2) {
                    path.removeAt(this.selectedObject.index);
                }
                break;
            }
            case 'polygon': {
                const path = this.access.polygons[this.selectedObject.key]?.obj.getPath();
                if (path && this.selectedObject.index >= 0 && this.selectedObject.index < path.getLength()
                    && path.getLength() > 3) {
                    path.removeAt(this.selectedObject.index);
                }
                break;
            }
        }
    }
    onUnmounted() {
        this._disposed = true;
        this._disposeMap();
    }
    // --- 初次装载 ---
    async onMounted() {
        this.load();
        this.watch('akey', () => {
            this.load();
        });
        for (const prop of ['tdurlcn', 'tdhostintl', 'css']) {
            this.watch(prop, () => {
                this.load();
            });
        }
        this.watch('mapId', () => {
            if (this.props.factory === 'google') {
                this.load();
            }
        });
        this.watch('factory', () => {
            this.load();
        });
        /** --- 加载 marker 样式图片（天地图） --- */
        this.access.markerImg = await clickgo.tool.blob2DataUrl(this.packageFiles['/res/marker.svg']);
        if (this._disposed) {
            return;
        }
        this.access.mapLibre?.setMarkerImage(this.access.markerImg);
        // --- 选项变更 ---
        this.watch('lat', () => {
            if (!this.access.map) {
                return;
            }
            if (this.latData === this.propNumber('lat')) {
                return;
            }
            this.latData = this.propNumber('lat');
            switch (this.props.factory) {
                case 'google': {
                    this.access.map.setCenter({
                        'lat': this.latData,
                        'lng': this.lngData
                    });
                    break;
                }
                case 'tianditu': {
                    this.access.map.setCenter([this.lngData, this.latData]);
                    break;
                }
            }
        });
        this.watch('lng', () => {
            if (!this.access.map) {
                return;
            }
            if (this.lngData === this.propNumber('lng')) {
                return;
            }
            this.lngData = this.propNumber('lng');
            switch (this.props.factory) {
                case 'google': {
                    this.access.map.setCenter({
                        'lat': this.latData,
                        'lng': this.lngData
                    });
                    break;
                }
                case 'tianditu': {
                    this.access.map.setCenter([this.lngData, this.latData]);
                    break;
                }
            }
        });
        this.watch('zoom', () => {
            const zoom = this.propNumber('zoom');
            // 地图动画也会逐帧更新绑定值，重复设置会中止当前动画。
            if (!this.access.map || zoom === this.zoomData) {
                return;
            }
            this.zoomData = zoom;
            this.access.map.setZoom(this.props.factory === 'tianditu' ? zoom - 1 : zoom);
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
                    this.access.mapLibre?.setZoomControl(this.propBoolean('zoomControl'));
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
