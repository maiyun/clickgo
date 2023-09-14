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
const tdpolygon = [{ 'lat': 48.450203, 'lng': 85.779506 }, { 'lat': 48.196905, 'lng': 85.484964 }, { 'lat': 47.118502, 'lng': 85.489791 }, { 'lat': 47.051568, 'lng': 83.874497 }, { 'lat': 47.291454, 'lng': 82.995577 }, { 'lat': 45.614305, 'lng': 82.145471 }, { 'lat': 45.248283, 'lng': 82.504298 }, { 'lat': 45.465301, 'lng': 81.854461 }, { 'lat': 45.028273, 'lng': 79.749485 }, { 'lat': 43.250186, 'lng': 80.666645 }, { 'lat': 42.920257, 'lng': 80.146637 }, { 'lat': 42.122486, 'lng': 80.089135 }, { 'lat': 41.478927, 'lng': 78.230156 }, { 'lat': 41.125925, 'lng': 77.70275 }, { 'lat': 41.149542, 'lng': 76.826364 }, { 'lat': 40.477242, 'lng': 76.470331 }, { 'lat': 40.366876, 'lng': 75.782885 }, { 'lat': 40.747633, 'lng': 75.637102 }, { 'lat': 40.554106, 'lng': 74.840279 }, { 'lat': 40.137634, 'lng': 73.870804 }, { 'lat': 39.556288, 'lng': 73.750286 }, { 'lat': 39.500496, 'lng': 73.350206 }, { 'lat': 38.511124, 'lng': 73.74586 }, { 'lat': 38.464105, 'lng': 74.698112 }, { 'lat': 37.385111, 'lng': 74.914031 }, { 'lat': 37.344806, 'lng': 74.418208 }, { 'lat': 37.029986, 'lng': 74.378385 }, { 'lat': 36.646667, 'lng': 75.736854 }, { 'lat': 36.022157, 'lng': 75.779226 }, { 'lat': 35.399525, 'lng': 77.248964 }, { 'lat': 35.387481, 'lng': 77.864858 }, { 'lat': 32.793943, 'lng': 79.00728 }, { 'lat': 32.691787, 'lng': 78.186076 }, { 'lat': 31.029463, 'lng': 78.827991 }, { 'lat': 29.914897, 'lng': 81.237128 }, { 'lat': 30.30827, 'lng': 81.528831 }, { 'lat': 27.919926, 'lng': 85.789773 }, { 'lat': 27.695771, 'lng': 87.299969 }, { 'lat': 27.975023, 'lng': 88.725285 }, { 'lat': 27.371729, 'lng': 88.673764 }, { 'lat': 27.104419, 'lng': 89.08026 }, { 'lat': 28.11168, 'lng': 89.671715 }, { 'lat': 27.747947, 'lng': 91.364162 }, { 'lat': 26.813117, 'lng': 92.046289 }, { 'lat': 26.913633, 'lng': 93.74285 }, { 'lat': 28.11852, 'lng': 95.871935 }, { 'lat': 27.661535, 'lng': 97.06375 }, { 'lat': 28.127458, 'lng': 98.008955 }, { 'lat': 26.205632, 'lng': 98.551991 }, { 'lat': 24.690439, 'lng': 97.372098 }, { 'lat': 23.742346, 'lng': 97.544862 }, { 'lat': 24.040013, 'lng': 98.537267 }, { 'lat': 22.099233, 'lng': 99.117237 }, { 'lat': 21.971814, 'lng': 99.896468 }, { 'lat': 21.510738, 'lng': 99.972002 }, { 'lat': 21.343015, 'lng': 100.540488 }, { 'lat': 21.687813, 'lng': 101.040349 }, { 'lat': 21.170124, 'lng': 101.194254 }, { 'lat': 21.13175, 'lng': 101.857792 }, { 'lat': 21.840658, 'lng': 101.814364 }, { 'lat': 21.973453, 'lng': 101.666887 }, { 'lat': 22.392019, 'lng': 101.700064 }, { 'lat': 22.362935, 'lng': 102.198458 }, { 'lat': 22.720893, 'lng': 102.489763 }, { 'lat': 22.411966, 'lng': 103.081813 }, { 'lat': 22.773836, 'lng': 103.344971 }, { 'lat': 22.574143, 'lng': 103.530313 }, { 'lat': 22.791159, 'lng': 103.6438 }, { 'lat': 22.505199, 'lng': 103.941914 }, { 'lat': 22.506605, 'lng': 104.010065 }, { 'lat': 22.721504, 'lng': 104.053004 }, { 'lat': 22.823848, 'lng': 104.252844 }, { 'lat': 22.743761, 'lng': 104.246474 }, { 'lat': 22.668125, 'lng': 104.375574 }, { 'lat': 22.817177, 'lng': 104.547557 }, { 'lat': 22.808577, 'lng': 104.730215 }, { 'lat': 22.927311, 'lng': 104.878599 }, { 'lat': 23.100528, 'lng': 104.824939 }, { 'lat': 23.256604, 'lng': 105.239989 }, { 'lat': 23.357486, 'lng': 105.328007 }, { 'lat': 23.078377, 'lng': 105.537416 }, { 'lat': 22.908357, 'lng': 105.850551 }, { 'lat': 22.955018, 'lng': 106.197311 }, { 'lat': 22.866414, 'lng': 106.237257 }, { 'lat': 22.794224, 'lng': 106.784385 }, { 'lat': 22.606187, 'lng': 106.696641 }, { 'lat': 22.625312, 'lng': 106.590684 }, { 'lat': 22.358103, 'lng': 106.54564 }, { 'lat': 22.317184, 'lng': 106.59183 }, { 'lat': 21.981753, 'lng': 106.65266 }, { 'lat': 21.819269, 'lng': 106.98995 }, { 'lat': 21.595217, 'lng': 107.343718 }, { 'lat': 21.590711, 'lng': 107.469554 }, { 'lat': 21.559744, 'lng': 107.926214 }, { 'lat': 21.352116, 'lng': 108.098069 }, { 'lat': 18.848867, 'lng': 106.365221 }, { 'lat': 16.639856, 'lng': 109.001483 }, { 'lat': 12.354209, 'lng': 110.144143 }, { 'lat': 6.898159, 'lng': 107.693078 }, { 'lat': 2.411098, 'lng': 109.712197 }, { 'lat': 3.608205, 'lng': 112.685627 }, { 'lat': 6.917141, 'lng': 115.65903 }, { 'lat': 11.621863, 'lng': 119.117695 }, { 'lat': 17.427307, 'lng': 119.181631 }, { 'lat': 21.559136, 'lng': 121.944652 }, { 'lat': 24.692908, 'lng': 122.813551 }, { 'lat': 25.804961, 'lng': 125.605796 }, { 'lat': 28.902045, 'lng': 123.868392 }, { 'lat': 39.90736, 'lng': 124.360414 }, { 'lat': 40.066205, 'lng': 124.3809 }, { 'lat': 40.439782, 'lng': 124.890951 }, { 'lat': 40.45972, 'lng': 125.068013 }, { 'lat': 40.527594, 'lng': 125.065451 }, { 'lat': 40.869317, 'lng': 126.010098 }, { 'lat': 41.33995, 'lng': 126.476201 }, { 'lat': 41.60523, 'lng': 126.617014 }, { 'lat': 41.766003, 'lng': 126.931591 }, { 'lat': 41.510138, 'lng': 127.077456 }, { 'lat': 41.320014, 'lng': 128.102703 }, { 'lat': 41.486041, 'lng': 128.404762 }, { 'lat': 41.997492, 'lng': 128.094529 }, { 'lat': 42.001111, 'lng': 128.933119 }, { 'lat': 42.116075, 'lng': 129.178446 }, { 'lat': 42.372408, 'lng': 129.29815 }, { 'lat': 42.431228, 'lng': 129.437197 }, { 'lat': 42.353695, 'lng': 129.547389 }, { 'lat': 42.420265, 'lng': 129.610984 }, { 'lat': 42.424085, 'lng': 129.702434 }, { 'lat': 42.462124, 'lng': 129.747722 }, { 'lat': 42.576265, 'lng': 129.747706 }, { 'lat': 42.598597, 'lng': 129.784763 }, { 'lat': 42.705073, 'lng': 129.78115 }, { 'lat': 42.916487, 'lng': 129.87516 }, { 'lat': 42.95932, 'lng': 129.870308 }, { 'lat': 42.967079, 'lng': 130.082224 }, { 'lat': 42.902427, 'lng': 130.103318 }, { 'lat': 42.888846, 'lng': 130.246131 }, { 'lat': 42.69931, 'lng': 130.183364 }, { 'lat': 42.397308, 'lng': 130.650496 }, { 'lat': 42.737426, 'lng': 130.603166 }, { 'lat': 42.839518, 'lng': 131.143634 }, { 'lat': 43.366525, 'lng': 131.360013 }, { 'lat': 44.028043, 'lng': 131.35622 }, { 'lat': 44.836955, 'lng': 131.088684 }, { 'lat': 44.964281, 'lng': 131.539184 }, { 'lat': 45.262532, 'lng': 131.873955 }, { 'lat': 44.975256, 'lng': 133.017162 }, { 'lat': 46.053746, 'lng': 133.755692 }, { 'lat': 46.140663, 'lng': 133.72556 }, { 'lat': 46.240843, 'lng': 133.93668 }, { 'lat': 46.988564, 'lng': 134.084767 }, { 'lat': 47.106612, 'lng': 134.248747 }, { 'lat': 47.31182, 'lng': 134.190123 }, { 'lat': 47.453882, 'lng': 134.551237 }, { 'lat': 47.730982, 'lng': 134.806545 }, { 'lat': 48.012002, 'lng': 134.580478 }, { 'lat': 48.109307, 'lng': 134.684949 }, { 'lat': 48.26088, 'lng': 134.691984 }, { 'lat': 48.397305, 'lng': 135.138638 }, { 'lat': 48.487535, 'lng': 135.12153 }, { 'lat': 48.402161, 'lng': 134.23148 }, { 'lat': 48.148786, 'lng': 133.131845 }, { 'lat': 47.989237, 'lng': 132.660165 }, { 'lat': 47.775175, 'lng': 132.543443 }, { 'lat': 47.733535, 'lng': 131.125889 }, { 'lat': 48.862439, 'lng': 130.735731 }, { 'lat': 49.404189, 'lng': 129.639086 }, { 'lat': 49.600085, 'lng': 128.819985 }, { 'lat': 49.616134, 'lng': 127.947989 }, { 'lat': 52.797943, 'lng': 126.261345 }, { 'lat': 53.605774, 'lng': 123.92994 }, { 'lat': 53.509858, 'lng': 120.972201 }, { 'lat': 52.591649, 'lng': 119.752004 }, { 'lat': 52.530967, 'lng': 120.579839 }, { 'lat': 52.031972, 'lng': 120.513135 }, { 'lat': 51.782882, 'lng': 119.872711 }, { 'lat': 50.182899, 'lng': 118.945525 }, { 'lat': 49.556974, 'lng': 117.80773 }, { 'lat': 49.894417, 'lng': 116.71725 }, { 'lat': 47.646, 'lng': 115.095524 }, { 'lat': 47.609054, 'lng': 119.048075 }, { 'lat': 46.796656, 'lng': 119.861435 }, { 'lat': 46.79858, 'lng': 116.81335 }, { 'lat': 45.751738, 'lng': 116.055292 }, { 'lat': 45.493109, 'lng': 114.690026 }, { 'lat': 44.785075, 'lng': 113.603211 }, { 'lat': 45.096691, 'lng': 111.810423 }, { 'lat': 44.369551, 'lng': 111.291066 }, { 'lat': 43.732257, 'lng': 111.872232 }, { 'lat': 42.579933, 'lng': 109.400016 }, { 'lat': 42.526246, 'lng': 107.388334 }, { 'lat': 41.803058, 'lng': 105.177347 }, { 'lat': 42.738446, 'lng': 101.194736 }, { 'lat': 42.833595, 'lng': 96.513761 }, { 'lat': 44.331662, 'lng': 95.53591 }, { 'lat': 44.297478, 'lng': 95.029834 }, { 'lat': 44.985916, 'lng': 93.633238 }, { 'lat': 45.260259, 'lng': 91.004807 }, { 'lat': 45.493364, 'lng': 90.756695 }, { 'lat': 45.979527, 'lng': 91.062312 }, { 'lat': 46.631254, 'lng': 91.146309 }, { 'lat': 47.901679, 'lng': 90.29278 }, { 'lat': 47.930065, 'lng': 89.706102 }, { 'lat': 48.031383, 'lng': 89.647632 }, { 'lat': 48.20611, 'lng': 88.687193 }, { 'lat': 48.361037, 'lng': 88.66978 }, { 'lat': 48.591853, 'lng': 88.014352 }, { 'lat': 48.701138, 'lng': 88.13692 }, { 'lat': 49.195897, 'lng': 87.840332 }, { 'lat': 49.150227, 'lng': 86.886047 }, { 'lat': 48.995127, 'lng': 86.71887 }, { 'lat': 48.925105, 'lng': 86.729035 }, { 'lat': 48.840935, 'lng': 86.804793 }, { 'lat': 48.805172, 'lng': 86.752248 }, { 'lat': 48.726764, 'lng': 86.765929 }, { 'lat': 48.513322, 'lng': 86.478271 }, { 'lat': 48.450203, 'lng': 85.779506 }];
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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'factory': 'google',
            'akey': '',
            'css': '',
            'tdurlcn': undefined,
            'tdurlintl': undefined,
            'lat': 31.223704,
            'lng': 121.366077,
            'zoom': 10,
            'zoomControl': false,
            'markers': {},
            'lines': {},
            'polygons': {},
            'overlays': {}
        };
        this.needReUpdateMarkers = false;
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
        this.zoomData = 10;
        this.latData = 0;
        this.lngData = 0;
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
                    this.latData = this.propNumber('lat');
                    this.lngData = this.propNumber('lng');
                    this.zoomData = this.propNumber('zoom');
                    this.access.map.addListener('click', (e) => {
                        this.emit('mapClick', {
                            'lat': e.latLng.lat(),
                            'lng': e.latLng.lng()
                        });
                    });
                    this.access.map.addListener('zoom_changed', () => {
                        this.zoomData = this.access.map.getZoom();
                        this.emit('update:zoom', this.access.map.getZoom());
                    });
                    this.access.map.addListener('center_changed', () => {
                        const center = this.access.map.getCenter();
                        const lat = center.lat();
                        const lng = center.lng();
                        if (lat !== this.latData) {
                            this.latData = lat;
                            this.emit('update:lat', lat);
                        }
                        if (lng !== this.lngData) {
                            this.lngData = lng;
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
                scriptEl.src = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.24/dist/maptalks.min.js';
                scriptEl.addEventListener('load', () => {
                    var _a;
                    this.access.lib = this.access.iwindow.maptalks;
                    const attributions = {
                        'cn': '&copy;<a target="_blank" href="https://www.tianditu.gov.cn">天地图</a> - GS(2023)336号 - 甲测资字1100471',
                        'intl': '&copy;<a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy;<a target="_blank" href="https://carto.com">CARTO</a>'
                    };
                    const baseLayer = new this.access.lib.TileLayer('base', {
                        'urlTemplate': (x, y, z, s) => {
                            if (this.zoomData < 10.5) {
                                if (this.props.tdurlcn) {
                                    return this.props.tdurlcn.replace(/{x}/g, x.toString())
                                        .replace(/{y}/g, x.toString())
                                        .replace(/{z}/g, x.toString());
                                }
                                else {
                                    return `https://t${s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=${z}&TILEROW=${y}&TILECOL=${x}&tk=${this.props.akey}`;
                                }
                            }
                            const ltLng = (x / Math.pow(2, z)) * 360 - 180;
                            const ltLat = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / Math.pow(2, z)))) * 180 / Math.PI;
                            const rbLng = ((x + 1) / Math.pow(2, z)) * 360 - 180;
                            const rbLat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / Math.pow(2, z)))) * 180 / Math.PI;
                            const centerLng = (ltLng + rbLng) / 2;
                            const centerLat = (ltLat + rbLat) / 2;
                            if (isPointInPolygon({
                                'lat': centerLat,
                                'lng': centerLng
                            }, tdpolygon)) {
                                if (this.props.tdurlcn) {
                                    return this.props.tdurlcn.replace(/{x}/g, x.toString())
                                        .replace(/{y}/g, x.toString())
                                        .replace(/{z}/g, x.toString())
                                        .replace(/{s}/g, x.toString());
                                }
                                else {
                                    return `https://t${s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=${z}&TILEROW=${y}&TILECOL=${x}&tk=${this.props.akey}`;
                                }
                            }
                            if (this.props.tdurlintl) {
                                return this.props.tdurlintl.replace(/{x}/g, x.toString())
                                    .replace(/{y}/g, x.toString())
                                    .replace(/{z}/g, x.toString())
                                    .replace(/{s}/g, x.toString());
                            }
                            else {
                                return `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}@2x.png`;
                            }
                        },
                        'subdomains': ['0', '1', '2', '3', '4', '5', '6', '7'],
                        'attribution': attributions.cn
                    });
                    let nowBaseLayer = 'cn';
                    const boudariesLayerCn = new this.access.lib.TileLayer('boudaries', {
                        'urlTemplate': (_a = this.props.tdurlcn) !== null && _a !== void 0 ? _a : ('https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + this.props.akey),
                        'subdomains': ['0', '1', '2', '3', '4', '5', '6', '7']
                    });
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
                        'baseLayer': baseLayer,
                        'layers': [
                            boudariesLayerCn
                        ]
                    });
                    this.latData = this.propNumber('lat');
                    this.lngData = this.propNumber('lng');
                    this.zoomData = this.propNumber('zoom');
                    if (this.propBoolean('zoomControl')) {
                        this.access.zoom = new this.access.lib.control.Zoom({
                            'position': 'bottom-right',
                            'zoomLevel': false
                        });
                        this.access.map.addControl(this.access.zoom);
                    }
                    this.access.vectorLayer = new this.access.lib.VectorLayer('vector');
                    this.access.vectorLayer.addTo(this.access.map);
                    const render = (x, y) => {
                        if (this.zoomData >= 10.5) {
                            if (isPointInPolygon({
                                'lat': y,
                                'lng': x
                            }, tdpolygon)) {
                                if (nowBaseLayer === 'cn') {
                                    return;
                                }
                                nowBaseLayer = 'cn';
                                baseLayer.setOptions({
                                    'attribution': attributions.cn
                                });
                                this.access.map.addLayer(boudariesLayerCn);
                            }
                            else {
                                if (nowBaseLayer === 'intl') {
                                    return;
                                }
                                nowBaseLayer = 'intl';
                                baseLayer.setOptions({
                                    'attribution': attributions.intl
                                });
                                this.access.map.removeLayer(boudariesLayerCn);
                            }
                        }
                        else {
                            if (nowBaseLayer === 'cn') {
                                return;
                            }
                            nowBaseLayer = 'cn';
                            baseLayer.setOptions({
                                'attribution': attributions.cn
                            });
                            this.access.map.addLayer(boudariesLayerCn);
                        }
                    };
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
                        this.zoomData = e.to;
                        this.emit('update:zoom', e.to);
                        const center = this.access.map.getCenter();
                        if (center.y !== this.latData) {
                            this.latData = center.y;
                            this.emit('update:lat', center.y);
                        }
                        if (center.x !== this.lngData) {
                            this.lngData = center.x;
                            this.emit('update:lng', center.x);
                        }
                        render(center.x, center.y);
                    });
                    this.access.map.on('moving', () => {
                        const center = this.access.map.getCenter();
                        if (center.y !== this.propNumber('lat')) {
                            this.emit('update:lat', center.y);
                        }
                        if (center.x !== this.propNumber('lng')) {
                            this.emit('update:lng', center.x);
                        }
                        render(center.x, center.y);
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
                linkEl.href = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.24/dist/maptalks.min.css';
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
                if (!this.access.markerImg) {
                    this.needReUpdateMarkers = true;
                    return;
                }
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
            if (this.needReUpdateMarkers) {
                this.updateMarkers();
            }
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
                if (!this.access.map) {
                    return;
                }
                this.zoomData = this.propNumber('zoom');
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
