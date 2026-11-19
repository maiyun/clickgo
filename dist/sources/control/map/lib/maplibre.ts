/** 地理坐标。 */
export interface IPoint {
    'lat': number;
    'lng': number;
}

/** 地图图形：path 的顺序表示节点顺序；edit 允许移动、插入和删除节点。 */
export interface IShape {
    'path': IPoint[];
    'strokeColor'?: string;
    'strokeOpacity'?: number;
    'strokeWeight'?: number;
    'fillColor'?: string;
    'fillOpacity'?: number;
    'drag'?: boolean;
    'edit'?: boolean;
}

/**
 * MapLibre 适配层接收的数据和事件。
 *
 * lib 是 iframe 中按版本加载的 MapLibre 原生库，动态脚本无本地类型声明；
 * emit 转发地图交互，pathChange 和 markerChange 在用户修改后同步数据。
 * nodeMenu 请求显示节点删除菜单，销毁由调用方负责。
 */
export interface IMapLibreOptions {
    'lib': any;
    'container': HTMLElement;
    'key': string;
    'center': IPoint;
    'zoom': number;
    'zoomControl': boolean;
    'markerImage': string;
    'urlCn'?: string;
    /** OpenFreeMap 兼容镜像的主机名及可选端口；空值使用 tiles.openfreemap.org。 */
    'hostIntl'?: string;
    'inChina': (point: IPoint) => boolean;
    'emit': (event: string, ...args: any[]) => void;
    'pathChange': (type: 'line' | 'polygon', key: string, path: IPoint[], action: 'update' | 'insert' | 'remove', index?: number, old?: IPoint) => void;
    'markerChange': (key: string, point: IPoint) => void;
    'nodeMenu': (type: 'line' | 'polygon', key: string, index: number, event: MouseEvent) => void;
}
