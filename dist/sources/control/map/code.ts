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

/** --- 天地图底图与 OSM 底图切换范围，并不代表任何区域/国境线 --- */
// eslint-disable-next-line key-spacing, @typescript-eslint/object-curly-spacing, @typescript-eslint/comma-spacing
const tdpolygon = [{'lat':48.450203,'lng':85.779506},{'lat':48.196905,'lng':85.484964},{'lat':47.118502,'lng':85.489791},{'lat':47.051568,'lng':83.874497},{'lat':47.291454,'lng':82.995577},{'lat':45.614305,'lng':82.145471},{'lat':45.248283,'lng':82.504298},{'lat':45.465301,'lng':81.854461},{'lat':45.028273,'lng':79.749485},{'lat':43.250186,'lng':80.666645},{'lat':42.920257,'lng':80.146637},{'lat':42.122486,'lng':80.089135},{'lat':41.478927,'lng':78.230156},{'lat':41.125925,'lng':77.70275},{'lat':41.149542,'lng':76.826364},{'lat':40.477242,'lng':76.470331},{'lat':40.366876,'lng':75.782885},{'lat':40.747633,'lng':75.637102},{'lat':40.554106,'lng':74.840279},{'lat':40.137634,'lng':73.870804},{'lat':39.556288,'lng':73.750286},{'lat':39.500496,'lng':73.350206},{'lat':38.511124,'lng':73.74586},{'lat':38.464105,'lng':74.698112},{'lat':37.385111,'lng':74.914031},{'lat':37.344806,'lng':74.418208},{'lat':37.029986,'lng':74.378385},{'lat':36.646667,'lng':75.736854},{'lat':36.022157,'lng':75.779226},{'lat':35.399525,'lng':77.248964},{'lat':35.387481,'lng':77.864858},{'lat':32.793943,'lng':79.00728},{'lat':32.691787,'lng':78.186076},{'lat':31.029463,'lng':78.827991},{'lat':29.914897,'lng':81.237128},{'lat':30.30827,'lng':81.528831},{'lat':27.919926,'lng':85.789773},{'lat':27.695771,'lng':87.299969},{'lat':27.975023,'lng':88.725285},{'lat':27.371729,'lng':88.673764},{'lat':27.104419,'lng':89.08026},{'lat':28.11168,'lng':89.671715},{'lat':27.747947,'lng':91.364162},{'lat':26.813117,'lng':92.046289},{'lat':26.913633,'lng':93.74285},{'lat':28.11852,'lng':95.871935},{'lat':27.661535,'lng':97.06375},{'lat':28.127458,'lng':98.008955},{'lat':26.205632,'lng':98.551991},{'lat':24.690439,'lng':97.372098},{'lat':23.742346,'lng':97.544862},{'lat':24.040013,'lng':98.537267},{'lat':22.099233,'lng':99.117237},{'lat':21.971814,'lng':99.896468},{'lat':21.510738,'lng':99.972002},{'lat':21.343015,'lng':100.540488},{'lat':21.687813,'lng':101.040349},{'lat':21.170124,'lng':101.194254},{'lat':21.13175,'lng':101.857792},{'lat':21.840658,'lng':101.814364},{'lat':21.973453,'lng':101.666887},{'lat':22.392019,'lng':101.700064},{'lat':22.362935,'lng':102.198458},{'lat':22.720893,'lng':102.489763},{'lat':22.411966,'lng':103.081813},{'lat':22.773836,'lng':103.344971},{'lat':22.574143,'lng':103.530313},{'lat':22.791159,'lng':103.6438},{'lat':22.505199,'lng':103.941914},{'lat':22.506605,'lng':104.010065},{'lat':22.721504,'lng':104.053004},{'lat':22.823848,'lng':104.252844},{'lat':22.743761,'lng':104.246474},{'lat':22.668125,'lng':104.375574},{'lat':22.817177,'lng':104.547557},{'lat':22.808577,'lng':104.730215},{'lat':22.927311,'lng':104.878599},{'lat':23.100528,'lng':104.824939},{'lat':23.256604,'lng':105.239989},{'lat':23.357486,'lng':105.328007},{'lat':23.078377,'lng':105.537416},{'lat':22.908357,'lng':105.850551},{'lat':22.955018,'lng':106.197311},{'lat':22.866414,'lng':106.237257},{'lat':22.794224,'lng':106.784385},{'lat':22.606187,'lng':106.696641},{'lat':22.625312,'lng':106.590684},{'lat':22.358103,'lng':106.54564},{'lat':22.317184,'lng':106.59183},{'lat':21.981753,'lng':106.65266},{'lat':21.819269,'lng':106.98995},{'lat':21.595217,'lng':107.343718},{'lat':21.590711,'lng':107.469554},{'lat':21.559744,'lng':107.926214},{'lat':21.352116,'lng':108.098069},{'lat':18.848867,'lng':106.365221},{'lat':16.639856,'lng':109.001483},{'lat':12.354209,'lng':110.144143},{'lat':6.898159,'lng':107.693078},{'lat':2.411098,'lng':109.712197},{'lat':3.608205,'lng':112.685627},{'lat':6.917141,'lng':115.65903},{'lat':11.621863,'lng':119.117695},{'lat':17.427307,'lng':119.181631},{'lat':21.559136,'lng':121.944652},{'lat':24.692908,'lng':122.813551},{'lat':25.804961,'lng':125.605796},{'lat':28.902045,'lng':123.868392},{'lat':39.90736,'lng':124.360414},{'lat':40.066205,'lng':124.3809},{'lat':40.439782,'lng':124.890951},{'lat':40.45972,'lng':125.068013},{'lat':40.527594,'lng':125.065451},{'lat':40.869317,'lng':126.010098},{'lat':41.33995,'lng':126.476201},{'lat':41.60523,'lng':126.617014},{'lat':41.766003,'lng':126.931591},{'lat':41.510138,'lng':127.077456},{'lat':41.320014,'lng':128.102703},{'lat':41.486041,'lng':128.404762},{'lat':41.997492,'lng':128.094529},{'lat':42.001111,'lng':128.933119},{'lat':42.116075,'lng':129.178446},{'lat':42.372408,'lng':129.29815},{'lat':42.431228,'lng':129.437197},{'lat':42.353695,'lng':129.547389},{'lat':42.420265,'lng':129.610984},{'lat':42.424085,'lng':129.702434},{'lat':42.462124,'lng':129.747722},{'lat':42.576265,'lng':129.747706},{'lat':42.598597,'lng':129.784763},{'lat':42.705073,'lng':129.78115},{'lat':42.916487,'lng':129.87516},{'lat':42.95932,'lng':129.870308},{'lat':42.967079,'lng':130.082224},{'lat':42.902427,'lng':130.103318},{'lat':42.888846,'lng':130.246131},{'lat':42.69931,'lng':130.183364},{'lat':42.397308,'lng':130.650496},{'lat':42.737426,'lng':130.603166},{'lat':42.839518,'lng':131.143634},{'lat':43.366525,'lng':131.360013},{'lat':44.028043,'lng':131.35622},{'lat':44.836955,'lng':131.088684},{'lat':44.964281,'lng':131.539184},{'lat':45.262532,'lng':131.873955},{'lat':44.975256,'lng':133.017162},{'lat':46.053746,'lng':133.755692},{'lat':46.140663,'lng':133.72556},{'lat':46.240843,'lng':133.93668},{'lat':46.988564,'lng':134.084767},{'lat':47.106612,'lng':134.248747},{'lat':47.31182,'lng':134.190123},{'lat':47.453882,'lng':134.551237},{'lat':47.730982,'lng':134.806545},{'lat':48.012002,'lng':134.580478},{'lat':48.109307,'lng':134.684949},{'lat':48.26088,'lng':134.691984},{'lat':48.397305,'lng':135.138638},{'lat':48.487535,'lng':135.12153},{'lat':48.402161,'lng':134.23148},{'lat':48.148786,'lng':133.131845},{'lat':47.989237,'lng':132.660165},{'lat':47.775175,'lng':132.543443},{'lat':47.733535,'lng':131.125889},{'lat':48.862439,'lng':130.735731},{'lat':49.404189,'lng':129.639086},{'lat':49.600085,'lng':128.819985},{'lat':49.616134,'lng':127.947989},{'lat':52.797943,'lng':126.261345},{'lat':53.605774,'lng':123.92994},{'lat':53.509858,'lng':120.972201},{'lat':52.591649,'lng':119.752004},{'lat':52.530967,'lng':120.579839},{'lat':52.031972,'lng':120.513135},{'lat':51.782882,'lng':119.872711},{'lat':50.182899,'lng':118.945525},{'lat':49.556974,'lng':117.80773},{'lat':49.894417,'lng':116.71725},{'lat':47.646,'lng':115.095524},{'lat':47.609054,'lng':119.048075},{'lat':46.796656,'lng':119.861435},{'lat':46.79858,'lng':116.81335},{'lat':45.751738,'lng':116.055292},{'lat':45.493109,'lng':114.690026},{'lat':44.785075,'lng':113.603211},{'lat':45.096691,'lng':111.810423},{'lat':44.369551,'lng':111.291066},{'lat':43.732257,'lng':111.872232},{'lat':42.579933,'lng':109.400016},{'lat':42.526246,'lng':107.388334},{'lat':41.803058,'lng':105.177347},{'lat':42.738446,'lng':101.194736},{'lat':42.833595,'lng':96.513761},{'lat':44.331662,'lng':95.53591},{'lat':44.297478,'lng':95.029834},{'lat':44.985916,'lng':93.633238},{'lat':45.260259,'lng':91.004807},{'lat':45.493364,'lng':90.756695},{'lat':45.979527,'lng':91.062312},{'lat':46.631254,'lng':91.146309},{'lat':47.901679,'lng':90.29278},{'lat':47.930065,'lng':89.706102},{'lat':48.031383,'lng':89.647632},{'lat':48.20611,'lng':88.687193},{'lat':48.361037,'lng':88.66978},{'lat':48.591853,'lng':88.014352},{'lat':48.701138,'lng':88.13692},{'lat':49.195897,'lng':87.840332},{'lat':49.150227,'lng':86.886047},{'lat':48.995127,'lng':86.71887},{'lat':48.925105,'lng':86.729035},{'lat':48.840935,'lng':86.804793},{'lat':48.805172,'lng':86.752248},{'lat':48.726764,'lng':86.765929},{'lat':48.513322,'lng':86.478271},{'lat':48.450203,'lng':85.779506}];

/** --- 判断一个经纬度是否在一个经纬度集合组成的面里 --- */
function isPointInPolygon(point: {
    'lat': number;
    'lng': number;
}, polygon: Array<{
    'lat': number;
    'lng': number;
}>): boolean {
    const { lat, lng } = point;
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat;
        const yi = polygon[i].lng;
        const xj = polygon[j].lat;
        const yj = polygon[j].lng;

        const intersect =
            yi > lng !== yj > lng &&
            lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

        if (intersect) {
            isInside = !isInside;
        }
    }

    return isInside;
}

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'factory': 'tianditu' | 'google';
        'akey': string;
        'css': string;

        'tdurlcn'?: string;
        'tdurlintl'?: string;

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

    public get showMask(): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }

    /** --- 如果 markerImg 还没加载就执行了 updateMakers（天地图），那么加载后需要重新执行一遍 updateMarkers --- */
    public needReUpdateMarkers = false;

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

    /** --- 当前地图的缩放级别 --- */
    public zoomData: number = 10;

    public latData: number = 0;

    public lngData: number = 0;

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
                    this.latData = this.propNumber('lat');
                    this.lngData = this.propNumber('lng');
                    this.zoomData = this.propNumber('zoom');
                    // --- 绑定事件 ---
                    this.access.map.addListener('click', (e: any) => {
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
                scriptEl.src = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.24/dist/maptalks.min.js';
                scriptEl.addEventListener('load', () => {
                    this.access.lib = this.access.iwindow!.maptalks;
                    const attributions = {
                        'cn': '&copy;<a target="_blank" href="https://www.tianditu.gov.cn">天地图</a> - GS(2023)336号 - 甲测资字1100471',
                        'intl': '&copy;<a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, &copy;<a target="_blank" href="https://carto.com">CARTO</a>'
                    };
                    /** --- 天地图底图 --- */
                    const baseLayer = new this.access.lib.TileLayer('base', {
                        'urlTemplate': (x: number, y: number, z: number, s: string) => {
                            if (this.zoomData < 10.5) {
                                // --- 只加载天地图 ---
                                if (this.props.tdurlcn) {
                                    return this.props.tdurlcn.replace(/{x}/g, x.toString())
                                        .replace(/{y}/g, x.toString())
                                        .replace(/{z}/g, x.toString());
                                }
                                else {
                                    return `https://t${s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=${z}&TILEROW=${y}&TILECOL=${x}&tk=${this.props.akey}`;
                                }
                            }
                            // 计算瓦片左上角和右下角的经纬度坐标
                            const ltLng = (x / Math.pow(2, z)) * 360 - 180;
                            const ltLat =
                                Math.atan(Math.sinh(Math.PI * (1 - 2 * y / Math.pow(2, z)))) * 180 / Math.PI;
                            const rbLng = ((x + 1) / Math.pow(2, z)) * 360 - 180;
                            const rbLat =
                                Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / Math.pow(2, z)))) * 180 / Math.PI;
                            // 计算瓦片中心点的经纬度坐标
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
                            // --- OSM ---
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
                        'urlTemplate': this.props.tdurlcn ?? ('https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + this.props.akey),
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
                    /** --- 修改地图图层显示、地图版权信息等 --- */
                    const render = (x: number, y: number): void => {
                        if (this.zoomData >= 10.5) {
                            // --- 可能以国际底图为准 ---
                            if (isPointInPolygon({
                                'lat': y,
                                'lng': x
                            }, tdpolygon)) {
                                // --- 还是中国底图 ---
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
                                // --- 国际底图 ---
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
                            // --- 中国底图 ---
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
                    // --- 监听地图移动事件 ---
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
                linkEl.href = 'https://js.maiyun.net/npm/maptalks@1.0.0-rc.24/dist/maptalks.min.css';
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
                if (!this.access.markerImg) {
                    this.needReUpdateMarkers = true;
                    return;
                }
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
        this.access.markerImg = await clickgo.tool.blob2DataUrl(this.packageFiles['/res/marker.svg'] as Blob);
        if (this.needReUpdateMarkers) {
            this.updateMarkers();
        }

        // --- 选项变更 ---

        this.watch('lat', () => {
            if (!this.access.map) {
                return;
            }
            if (this.latData === this.propNumber('lat')) {
                return;
            }
            console.log('x', this.latData, this.propNumber('lat'));
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
