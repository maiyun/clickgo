import * as fabric from 'fabric';

/**
 * --- split.ts 主 form 暴露给分包访问的公共接口 ---
 * 分包文件通过 (this as unknown as ISplitForm) 读取主 form 的属性和方法
 */
export interface ICore {

    'emits': {
        'init': null;
        /** --- v-model:layer 双向绑定，值为激活图层对象的 name 属性数组，无选中时为空数组 --- */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'update:layer': null;
        /** --- 激活图层变更时触发（仅 autoLayer=true 时），参数为 { prev: 变更前图层 name, next: 变更后图层 name } --- */
        'layerchange': null;
        /** --- 选区变更时触发（创建、移动、组合、清除） --- */
        'marqueechange': null;
        /** --- 图层列表变更时触发（新建空图层、移除图层或通过 canvas.add 首次使用某 name 时自动注册） --- */
        'layerlistchange': null;
    };

    'props': {
        'disabled': boolean | string;
        /** --- 是否允许点击对象自动切换激活图层，关闭时只有 layer 属性指定的对象可被操作 --- */
        'autoLayer': boolean | string;
        /** --- 是否显示控制点（自由变换句柄），关闭后只能拖动，不能缩放/旋转 --- */
        'transform': boolean | string;
        /** --- 当前激活图层的 fabric 对象 name 属性值（数组），支持 v-model:layer --- */
        'layer': string[];
        /** --- 是否显示框选矩形 --- */
        'selector': boolean | string;
        /** --- 画板宽度（像素），0 = 不启用画板，canvas 本身即全部展示区域 --- */
        'artboardWidth': number | string;
        /** --- 画板高度（像素），0 = 不启用画板 --- */
        'artboardHeight': number | string;
        /** --- 画板外背景色，支持任意 CSS 颜色字符串，空字符串表示透明 --- */
        'artboardBg': string;
        /** --- 画板内填充色，支持任意 CSS 颜色字符串，空字符串表示透明（透过画板看到外部背景色） --- */
        'artboardFill': string;
        /** --- 画布交互模式，'' 为正常模式，'pan' 为平移模式，'zoom' 为拖拽缩放模式，'marquee' 为选区模式 --- */
        'mode': '' | 'pan' | 'zoom' | 'marquee';
        /** --- 画布最小缩放倍数，默认为 0.01 --- */
        'zoomMin': number | string;
        /** --- 画布最大缩放倍数，默认为 100 --- */
        'zoomMax': number | string;
        /** --- 选区组合模式：replace 替换、add 合并、subtract 减去、intersect 交集 --- */
        'marqueeCompose': 'replace' | 'add' | 'subtract' | 'intersect';
    };

    'access': {
        'fabric': typeof fabric | null;
        /** --- fabric Canvas 对象 --- */
        'canvas': fabric.Canvas | null;
        /** --- 当前选区矩形列表（canvas 内部坐标），无选区时为空数组 --- */
        'marquee': Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }>;
    };

    /** --- 是否未初始化 --- */
    'notInit': boolean;

    /** --- 是否正在加载 --- */
    'isLoading': boolean;

}
