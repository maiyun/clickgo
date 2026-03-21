import * as fabric from 'fabric';
import * as clickgo from 'clickgo';

// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---

// ==============================
// --- 模块级常量与工具函数 ---
// ==============================

/** --- 内部画板矩形的保留 name --- */
const ARTBOARD_NAME = '__cg_artboard__';

/** --- 获取 fabric 对象 name 属性（fabric v7 类型定义中 name 不在直接类型上，需转换访问）--- */
const getObjName = (obj: fabric.FabricObject): string => {
    return ((obj as unknown as { 'name'?: string; }).name) ?? '';
};

/**
 * --- 从矩形列表中提取合并后的外轮廓边缘线段 ---
 * @param rects 矩形列表（画布坐标系）
 * @param zoom 缩放倍数
 * @param vpt 视口变换矩阵
 * @returns 边缘线段数组，每条线段为 { x1, y1, x2, y2 }（屏幕坐标系）
 */
const extractOutlineEdges = (
    rects: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }>,
    zoom: number,
    vpt: number[]
): Array<{ 'x1': number; 'y1': number; 'x2': number; 'y2': number; }> => {
    if (rects.length === 0) {
        return [];
    }
    // --- 将矩形坐标转换为屏幕坐标并取整，防止浮点精度问题 ---
    const screenRects = rects.map((r) => {
        const sx = Math.round(r.x * zoom + vpt[4]);
        const sy = Math.round(r.y * zoom + vpt[5]);
        const sw = Math.round(r.width * zoom);
        const sh = Math.round(r.height * zoom);
        return { 'x': sx, 'y': sy, 'w': sw, 'h': sh };
    });
    // --- 收集所有唯一的 x 坐标和 y 坐标 ---
    const xCoords = new Set<number>();
    const yCoords = new Set<number>();
    for (const sr of screenRects) {
        xCoords.add(sr.x);
        xCoords.add(sr.x + sr.w);
        yCoords.add(sr.y);
        yCoords.add(sr.y + sr.h);
    }
    const sortedX = [...xCoords].sort((a, b) => a - b);
    const sortedY = [...yCoords].sort((a, b) => a - b);
    // --- 构建网格：每个格子标记是否被至少一个矩形覆盖 ---
    const cols = sortedX.length - 1;
    const rows = sortedY.length - 1;
    if (cols <= 0 || rows <= 0) {
        return [];
    }
    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
        grid.push(new Array(cols).fill(false));
    }
    for (const sr of screenRects) {
        const left = sortedX.indexOf(sr.x);
        const right = sortedX.indexOf(sr.x + sr.w);
        const top = sortedY.indexOf(sr.y);
        const bottom = sortedY.indexOf(sr.y + sr.h);
        for (let r = top; r < bottom; r++) {
            for (let c = left; c < right; c++) {
                grid[r][c] = true;
            }
        }
    }
    // --- 扫描网格边缘：只保留一侧被覆盖、另一侧未被覆盖的边 ---
    const edges: Array<{ 'x1': number; 'y1': number; 'x2': number; 'y2': number; }> = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c]) {
                continue;
            }
            const x1 = sortedX[c];
            const x2 = sortedX[c + 1];
            const y1 = sortedY[r];
            const y2 = sortedY[r + 1];
            // --- 上边：如果上方格子不在区域内，此边为外轮廓 ---
            if (r === 0 || !grid[r - 1][c]) {
                edges.push({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y1 });
            }
            // --- 下边 ---
            if (r === rows - 1 || !grid[r + 1][c]) {
                edges.push({ 'x1': x1, 'y1': y2, 'x2': x2, 'y2': y2 });
            }
            // --- 左边 ---
            if (c === 0 || !grid[r][c - 1]) {
                edges.push({ 'x1': x1, 'y1': y1, 'x2': x1, 'y2': y2 });
            }
            // --- 右边 ---
            if (c === cols - 1 || !grid[r][c + 1]) {
                edges.push({ 'x1': x2, 'y1': y1, 'x2': x2, 'y2': y2 });
            }
        }
    }
    return edges;
};

/**
 * --- 将外轮廓边缘线段链式连接为多边形顶点数组 ---
 * @param edges 边缘线段数组
 * @returns 多边形顶点数组的数组（不规则选区可能包含多个独立闭合多边形）
 */
const buildOutlinePolygons = (
    edges: Array<{ 'x1': number; 'y1': number; 'x2': number; 'y2': number; }>
): Array<Array<{ 'x': number; 'y': number; }>> => {
    if (edges.length === 0) {
        return [];
    }
    // --- 构建端点邻接表：每个端点记录与之相连的边索引和对端坐标 ---
    const ptKey = (x: number, y: number): string => `${x},${y}`;
    const adjacency = new Map<string, Array<{ 'idx': number; 'to': { 'x': number; 'y': number; }; }>>();
    for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const k1 = ptKey(e.x1, e.y1);
        const k2 = ptKey(e.x2, e.y2);
        if (!adjacency.has(k1)) {
            adjacency.set(k1, []);
        }
        if (!adjacency.has(k2)) {
            adjacency.set(k2, []);
        }
        adjacency.get(k1)!.push({ 'idx': i, 'to': { 'x': e.x2, 'y': e.y2 } });
        adjacency.get(k2)!.push({ 'idx': i, 'to': { 'x': e.x1, 'y': e.y1 } });
    }
    // --- 链式游走：从每条未访问边出发，依次连接成多边形 ---
    const visited = new Set<number>();
    const polygons: Array<Array<{ 'x': number; 'y': number; }>> = [];
    for (let i = 0; i < edges.length; i++) {
        if (visited.has(i)) {
            continue;
        }
        const polygon: Array<{ 'x': number; 'y': number; }> = [];
        let current = { 'x': edges[i].x1, 'y': edges[i].y1 };
        let edgeIdx = i;
        while (!visited.has(edgeIdx)) {
            visited.add(edgeIdx);
            polygon.push({ 'x': current.x, 'y': current.y });
            const edge = edges[edgeIdx];
            const next = (edge.x1 === current.x && edge.y1 === current.y)
                ? { 'x': edge.x2, 'y': edge.y2 }
                : { 'x': edge.x1, 'y': edge.y1 };
            const neighbors = adjacency.get(ptKey(next.x, next.y)) ?? [];
            const nextEdge = neighbors.find(n => !visited.has(n.idx));
            if (!nextEdge) {
                break;
            }
            current = next;
            edgeIdx = nextEdge.idx;
        }
        if (polygon.length >= 3) {
            polygons.push(polygon);
        }
    }
    return polygons;
};

/**
 * --- 从已有矩形列表中减去新矩形重叠区域（subtract 模式）---
 * @param existing 已有矩形列表
 * @param cut 要减去的矩形
 * @returns 减去后的矩形列表
 */
const subtractRect = (
    existing: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }>,
    cut: { 'x': number; 'y': number; 'width': number; 'height': number; }
): Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }> => {
    const result: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }> = [];
    for (const r of existing) {
        const ix1 = Math.max(r.x, cut.x);
        const iy1 = Math.max(r.y, cut.y);
        const ix2 = Math.min(r.x + r.width, cut.x + cut.width);
        const iy2 = Math.min(r.y + r.height, cut.y + cut.height);
        if (ix1 >= ix2 || iy1 >= iy2) {
            result.push(r);
            continue;
        }
        // --- 有交集，将 r 分割为最多 4 条带状矩形（上/下/左/右）---
        if (r.y < iy1) {
            result.push({ 'x': r.x, 'y': r.y, 'width': r.width, 'height': iy1 - r.y });
        }
        if (iy2 < r.y + r.height) {
            result.push({ 'x': r.x, 'y': iy2, 'width': r.width, 'height': r.y + r.height - iy2 });
        }
        if (r.x < ix1) {
            result.push({ 'x': r.x, 'y': iy1, 'width': ix1 - r.x, 'height': iy2 - iy1 });
        }
        if (ix2 < r.x + r.width) {
            result.push({ 'x': ix2, 'y': iy1, 'width': r.x + r.width - ix2, 'height': iy2 - iy1 });
        }
    }
    return result;
};

/**
 * --- 保留已有矩形与新矩形的交集部分（intersect 模式）---
 * @param existing 已有矩形列表
 * @param clip 交集矩形
 * @returns 交集后的矩形列表
 */
const intersectRect = (
    existing: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }>,
    clip: { 'x': number; 'y': number; 'width': number; 'height': number; }
): Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }> => {
    const result: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }> = [];
    for (const r of existing) {
        const ix1 = Math.max(r.x, clip.x);
        const iy1 = Math.max(r.y, clip.y);
        const ix2 = Math.min(r.x + r.width, clip.x + clip.width);
        const iy2 = Math.min(r.y + r.height, clip.y + clip.height);
        if (ix2 > ix1 && iy2 > iy1) {
            result.push({ 'x': ix1, 'y': iy1, 'width': ix2 - ix1, 'height': iy2 - iy1 });
        }
    }
    return result;
};

// ==============================
// --- 控件类 ---
// ==============================

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
        /** --- v-model:layer 双向绑定，值为激活图层对象的 name 属性数组，无选中时为空数组 --- */
        'update:layer': null,
        /** --- 激活图层变更时触发（仅 autoLayer=true 时），参数为 { prev: 变更前图层 name, next: 变更后图层 name } --- */
        'layerchange': null,
        /** --- 选区变更时触发（创建、移动、组合、清除） --- */
        'marqueechange': null,
    };

    public props: {
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
    } = {
            'disabled': false,
            'autoLayer': true,
            'transform': true,
            'layer': [],
            'selector': true,
            'artboardWidth': 0,
            'artboardHeight': 0,
            'artboardBg': '#7a7a7a',
            'artboardFill': '#ffffff',
            'mode': '',
            'zoomMin': 0.01,
            'zoomMax': 100,
            'marqueeCompose': 'replace',
        };

    public notInit = false;

    public isLoading = true;

    /** --- 内部闭包暴露的选区清除函数引用 --- */
    private _clearMarquee: (() => void) | null = null;

    /** --- 内部闭包暴露的选区设置函数引用 --- */
    private _setMarqueeRect: ((x: number, y: number, w: number, h: number) => void) | null = null;

    public access: {
        /** --- fabric Canvas 对象 --- */
        'canvas': fabric.Canvas | undefined;
        /** --- 当前画板在 canvas 中的位置与尺寸，未启用画板时为 null --- */
        'artboard': { 'left': number; 'top': number; 'width': number; 'height': number; } | null;
        /** --- 当前选区矩形列表（canvas 内部坐标），无选区时为空数组 --- */
        'marquee': Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }>;
    } = {
            'canvas': undefined,
            'artboard': null,
            'marquee': [],
        };

    public async onMounted(): Promise<void> {
        // ==============================
        // --- 加载 fabric 模块 ---
        // ==============================

        const fabric = await clickgo.core.getModule('fabric');
        if (!fabric) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }

        // ==============================
        // --- 初始化画布 ---
        // ==============================

        // --- 获取元素实际宽高 ---
        const cw = this.refs.content.clientWidth;
        const ch = this.refs.content.clientHeight;

        // --- 初始化 fabric canvas ---
        this.access.canvas = new fabric.Canvas(this.refs.content as unknown as HTMLCanvasElement, {
            'width': cw,
            'height': ch,
        });

        // --- fabric 会在 canvas 外层包裹一个 div(.canvas-container) 并设置 position:relative 内联样式 ---
        // --- 该 div 若留在 flex 流中，其固定宽度会阻止父容器收缩；改为 absolute 脱离 flex 流 ---
        const canvasContainer = (this.refs.content as HTMLElement).parentElement;
        if (canvasContainer) {
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.top = '0';
            canvasContainer.style.left = '0';
        }

        // ==============================
        // --- 主题色与画布样式 ---
        // ==============================

        const borderColor = getComputedStyle(this.element).getPropertyValue('--cg').trim();
        const cornerColor = getComputedStyle(this.element).getPropertyValue('--g-plain-background').trim();

        // --- 设置画布默认选框样式 ---
        this.access.canvas.selectionColor = getComputedStyle(this.element).getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = getComputedStyle(this.element).getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;

        // ==============================
        // --- 控制点与边框样式管理 ---
        // ==============================

        /**
         * --- 构建控制点和边框样式属性，用于统一应用到 fabric 对象 ---
         * @param isDragging 是否处于拖动/变换操作中
         * @param showControls 是否显示控制点
         */
        const buildStyleProps = (isDragging: boolean, showControls: boolean): any => ({
            'cornerColor': cornerColor,
            'cornerStrokeColor': borderColor,
            'cornerSize': 8,
            'cornerStyle': 'rect',
            'transparentCorners': false,
            'borderColor': borderColor,
            /** --- 拖动时线条变粗（2px），常态为 1px --- */
            'borderScaleFactor': isDragging ? 2 : 1,
            /** --- 确保拖动时不透明度不降低 --- */
            'borderOpacityWhenMoving': 1,
            /** --- transform=false 时同时隐藏边框和控制点 --- */
            'hasBorders': showControls,
            'hasControls': showControls,
            /** --- transform=false 时任何位置都能拖动，鼠标悬停在元素上时不显示移动指针 --- */
            'hoverCursor': showControls ? 'move' : 'default',
            'moveCursor': showControls ? 'move' : 'default',
        });

        /**
         * --- 更新选中对象的控制点和边框样式 ---
         * @param isDragging 是否处于拖动/变换操作中
         */
        const updateSelectionStyle = (isDragging: boolean): void => {
            if (!this.access.canvas) {
                return;
            }
            /** --- 是否开启自由变换（控制点），拖动中临时隐藏 --- */
            const showControls = this.propBoolean('transform') && !isDragging;
            const activeObject = this.access.canvas.getActiveObject();
            const styleProps = buildStyleProps(isDragging, showControls);
            this.access.canvas.forEachObject(obj => {
                // --- 跳过内部画板矩形 ---
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
                obj.set(styleProps);
            });
            // --- ActiveSelection 为虚拟对象不计入 forEachObject，需单独应用样式 ---
            if (activeObject instanceof fabric.ActiveSelection) {
                activeObject.set(styleProps);
            }
            this.access.canvas.requestRenderAll();
        };

        // ==============================
        // --- 交互模式与图层管理 ---
        // ==============================

        /**
         * --- 根据 mode / layer / selector prop 同步画布内所有对象的交互状态 ---
         */
        const applyMode = (): void => {
            if (!this.access.canvas) {
                return;
            }
            const isAutoLayer = this.propBoolean('autoLayer');
            const layerNames: string[] = this.props.layer;

            // --- 按 autoLayer 更新所有对象的可交互状态 ---
            this.access.canvas.forEachObject(obj => {
                // --- 跳过内部画板矩形，始终保持不可选中/不响应事件 ---
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
                // --- pan / zoom / marquee 模式下所有对象均不可交互 ---
                if (this.props.mode === 'pan' || this.props.mode === 'zoom' || this.props.mode === 'marquee') {
                    obj.set({ 'evented': false, 'selectable': false });
                    return;
                }
                if (isAutoLayer) {
                    // --- 自动切换图层：所有对象均可被点选 ---
                    obj.set({
                        'evented': true,
                        'selectable': true,
                    });
                }
                else {
                    // --- 手动指定图层：仅 layer 数组中包含的对象响应鼠标事件，其他穿透 ---
                    const isActive = layerNames.includes(getObjName(obj));
                    obj.set({
                        'evented': isActive,
                        'selectable': isActive,
                    });
                }
            });

            // --- 将 layer prop 对应的对象同步为 canvas 激活对象 ---
            if (layerNames.length > 0) {
                const allObjs = this.access.canvas.getObjects();
                const targetObjs = layerNames
                    .map(n => allObjs.find(o => getObjName(o) === n))
                    .filter((o): o is fabric.FabricObject => !!o);
                if (targetObjs.length === 1) {
                    // --- 仅当当前激活对象不同时才切换，避免触发多余的 selection 事件 ---
                    if (this.access.canvas.getActiveObject() !== targetObjs[0]) {
                        this.access.canvas.setActiveObject(targetObjs[0]);
                    }
                }
                else if (targetObjs.length > 1) {
                    const cur = this.access.canvas.getActiveObject();
                    const curObjs = (cur instanceof fabric.ActiveSelection) ? cur.getObjects() : [];
                    // --- 仅当当前不是同等内容的 ActiveSelection 时才重建，避免触发多余的 selection 事件 ---
                    if (curObjs.length !== targetObjs.length || !targetObjs.every(o => curObjs.includes(o))) {
                        const sel = new fabric.ActiveSelection(targetObjs, { 'canvas': this.access.canvas });
                        this.access.canvas.setActiveObject(sel);
                    }
                }
                else {
                    this.access.canvas.discardActiveObject();
                }
            }
            else if (!isAutoLayer) {
                this.access.canvas.discardActiveObject();
            }

            // --- 同步框选矩形开关 ---
            // --- marquee 模式强制禁用 fabric 框选，防止上层 canvas 产生残留虚线框 ---
            this.access.canvas.selection = (this.props.mode !== 'marquee') && this.propBoolean('selector');

            updateSelectionStyle(false);
        };

        // --- 监听 autoLayer prop 变更 ---
        this.watch('autoLayer', () => {
            applyMode();
        });

        // --- 监听 transform prop 变更 ---
        this.watch('transform', () => {
            updateSelectionStyle(false);
        });

        // --- 监听 layer prop 变更（外部手动指定图层或 v-model 更新）---
        this.watch('layer', () => {
            applyMode();
        });

        // --- 监听 selector prop 变更 ---
        this.watch('selector', () => {
            if (!this.access.canvas) {
                return;
            }
            this.access.canvas.selection = this.propBoolean('selector');
        });

        // --- 监听 mode prop 变更 ---
        this.watch('mode', () => {
            applyMode();
        });

        // ==============================
        // --- 画板管理 ---
        // ==============================

        /**
         * --- 为指定用户对象设置画板裁剪，对象内容被裁剪到画板范围内，控制点不受影响 ---
         * @param obj 要设置裁剪的对象
         * @param ab 当前画板信息
         */
        const applyObjClip = (obj: fabric.FabricObject, ab: { 'left': number; 'top': number; 'width': number; 'height': number; }): void => {
            obj.clipPath = new fabric.Rect({
                'left': ab.left,
                'top': ab.top,
                'width': ab.width,
                'height': ab.height,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                /** --- absolutePositioned=true 表示 clipPath 使用画布绝对坐标，不受对象自身变换影响 --- */
                'absolutePositioned': true,
            });
        };

        /** --- before:render 监听器引用，用于在画板外部绘制背景色（在对象和控制点之前绘制，不覆盖任何内容） --- */
        let beforeRenderHandler: ((e: any) => void) | null = null;
        /**
         * --- 同步画板矩形：居中显示画板区域，外部背景；为所有用户对象设置 clipPath 裁剪至画板内 ---
         */
        const applyArtboard = (): void => {
            if (!this.access.canvas) {
                return;
            }
            // --- 移除旧的 before:render 监听器 ---
            if (beforeRenderHandler) {
                this.access.canvas.off('before:render', beforeRenderHandler);
                beforeRenderHandler = null;
            }
            const aw = parseFloat(String(this.props.artboardWidth)) || 0;
            const ah = parseFloat(String(this.props.artboardHeight)) || 0;
            // --- 移除旧画板矩形（若存在）---
            const oldArtboard = this.access.canvas.getObjects().find(o => getObjName(o) === ARTBOARD_NAME);
            if (oldArtboard) {
                this.access.canvas.remove(oldArtboard);
            }
            if (!aw || !ah) {
                // --- 关闭画板：清除所有用户对象的 clipPath ---
                this.access.canvas.forEachObject(obj => {
                    if (getObjName(obj) === ARTBOARD_NAME) {
                        return;
                    }
                    /** --- fabric v7 类型中 clipPath 不含 undefined，用 unknown 中转 --- */
                    (obj as unknown as { 'clipPath': undefined; }).clipPath = undefined;
                });
                this.access.canvas.backgroundColor = '';
                this.access.artboard = null;
                this.access.canvas.requestRenderAll();
                return;
            }
            const cw = this.access.canvas.getWidth();
            const ch = this.access.canvas.getHeight();
            const left = Math.round((cw - aw) / 2);
            const top = Math.round((ch - ah) / 2);
            this.access.artboard = {
                'left': left,
                'top': top,
                'width': aw,
                'height': ah,
            };
            // --- 为所有现有用户对象应用画板 clipPath ---
            this.access.canvas.forEachObject(obj => {
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
                applyObjClip(obj, this.access.artboard!);
            });
            // --- 创建画板矩形底层背景 ---
            const artboardRect = new fabric.Rect({
                'left': left,
                'top': top,
                'width': aw,
                'height': ah,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                /** --- 无描边，避免 strokeWidth 影响边界计算 --- */
                'strokeWidth': 0,
                /** --- artboardFill 为空字符串时使用 null 表示完全透明 --- */
                'fill': (this.props.artboardFill || null) as any,
                'selectable': false,
                'evented': false,
                'hasControls': false,
                'hasBorders': false,
                'lockMovementX': true,
                'lockMovementY': true,
            });
            (artboardRect as unknown as { 'name': string; }).name = ARTBOARD_NAME;
            this.access.canvas.add(artboardRect);
            /** --- fabric.js v7 Canvas.sendObjectToBack 方法将画板压到最底层 --- */
            (this.access.canvas as any).sendObjectToBack(artboardRect);
            // --- 画板外背景色通过 before:render 绘制，不影响对象和控制点的渲染 ---
            // --- before:render 在 clearContext 之后、renderObjects 之前触发，绝不覆盖 controls ---
            beforeRenderHandler = (e: any): void => {
                const bg = this.props.artboardBg;
                if (!this.access.artboard || !bg) {
                    return;
                }
                const ab = this.access.artboard;
                const zoom = this.access.canvas!.getZoom();
                const vpt = this.access.canvas!.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                const canvasWidth = this.access.canvas!.getWidth();
                const canvasHeight = this.access.canvas!.getHeight();
                // --- 画板在当前 viewport 下的屏幕坐标 ---
                const sx = ab.left * zoom + vpt[4];
                const sy = ab.top * zoom + vpt[5];
                const sw = ab.width * zoom;
                const sh = ab.height * zoom;
                const ctx: CanvasRenderingContext2D = e.ctx;
                ctx.save();
                ctx.fillStyle = bg;
                // --- evenodd 裁剪区域：外矩形减去画板区域，只绘制 4 个外周区域 ---
                ctx.beginPath();
                ctx.rect(0, 0, canvasWidth, canvasHeight);
                ctx.rect(sx, sy, sw, sh);
                ctx.clip('evenodd');
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                ctx.restore();
            };
            this.access.canvas.on('before:render', beforeRenderHandler);
            // --- canvas 自身背景设为透明，让画板内部区域可透过至 HTML 层 ---
            this.access.canvas.backgroundColor = '';
            this.access.canvas.requestRenderAll();
        };

        // --- 监听画板尺寸变更 ---
        this.watch('artboardWidth', () => {
            applyArtboard();
        });
        this.watch('artboardHeight', () => {
            applyArtboard();
        });
        this.watch('artboardBg', () => {
            if (!this.access.canvas || !this.access.artboard) {
                return;
            }
            // --- before:render 处理程序动态读取 artboardBg，此处只需触发重绘 ---
            this.access.canvas.requestRenderAll();
        });
        this.watch('artboardFill', () => {
            if (!this.access.canvas || !this.access.artboard) {
                return;
            }
            const artboardRect = this.access.canvas.getObjects().find(o => getObjName(o) === ARTBOARD_NAME);
            if (artboardRect) {
                artboardRect.set('fill', (this.props.artboardFill || null) as any);
                /** --- fabric v7 必须手动标记 dirty 才能触发重绘 --- */
                artboardRect.dirty = true;
                this.access.canvas.requestRenderAll();
            }
        });

        // ==============================
        // --- 选区（Marquee）管理 ---
        // ==============================

        // --- 选区矩形列表（canvas 坐标系）---
        /** --- 选区矩形列表，每项为 canvas 坐标系中的矩形 --- */
        let marqueeRects: Array<{ 'x': number; 'y': number; 'width': number; 'height': number; }> = [];
        /** --- 当前正在绘制的临时矩形，仅用于预览渲染，不混入稳定选区 --- */
        let drawingRect: { 'x': number; 'y': number; 'width': number; 'height': number; } | null = null;
        /** --- 是否正在拖拽创建新选区 --- */
        let isMarqueeDrawing = false;
        /** --- 选区绘制起始点（canvas 坐标） --- */
        let marqueeStartX = 0;
        let marqueeStartY = 0;
        /** --- 是否正在拖拽移动已有选区 --- */
        let isMarqueeMoving = false;
        /** --- 选区移动上一帧鼠标位置（屏幕坐标） --- */
        let marqueeMoveLastX = 0;
        let marqueeMoveLastY = 0;

        /**
         * --- 将选区矩形限制在画板范围内，画板未启用时不裁剪 ---
         * @param rect 待裁剪矩形
         * @returns 裁剪后矩形，若完全超出画板则返回 null
         */
        const clipRectToArtboard = (rect: { 'x': number; 'y': number; 'width': number; 'height': number; }): { 'x': number; 'y': number; 'width': number; 'height': number; } | null => {
            if (!this.access.artboard) {
                return rect;
            }
            const ab = this.access.artboard;
            const x1 = Math.max(rect.x, ab.left);
            const y1 = Math.max(rect.y, ab.top);
            const x2 = Math.min(rect.x + rect.width, ab.left + ab.width);
            const y2 = Math.min(rect.y + rect.height, ab.top + ab.height);
            if (x2 <= x1 || y2 <= y1) {
                return null;
            }
            return { 'x': x1, 'y': y1, 'width': x2 - x1, 'height': y2 - y1 };
        };

        /**
         * --- 判断屏幕坐标点是否在已有选区内（任一矩形） ---
         * @param screenX 鼠标在 canvas 元素内的屏幕 x
         * @param screenY 鼠标在 canvas 元素内的屏幕 y
         */
        const isPointInMarquee = (screenX: number, screenY: number): boolean => {
            if (marqueeRects.length === 0 || !this.access.canvas) {
                return false;
            }
            const zoom = this.access.canvas.getZoom();
            const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
            // --- 屏幕坐标转 canvas 坐标 ---
            const cx = (screenX - vpt[4]) / zoom;
            const cy = (screenY - vpt[5]) / zoom;
            for (const r of marqueeRects) {
                if (cx >= r.x && cx <= r.x + r.width && cy >= r.y && cy <= r.y + r.height) {
                    return true;
                }
            }
            return false;
        };

        /**
         * --- 同步 access.marquee 并触发 marqueechange 事件 ---
         */
        const syncMarquee = (): void => {
            this.access.marquee = marqueeRects.map(r => ({ ...r }));
            this.emit('marqueechange');
        };

        /**
         * --- 将新绘制的选区按当前组合模式应用到 marqueeRects ---
         * @param newRect 新绘制的矩形（已裁剪到画板范围）
         */
        const applyMarqueeCompose = (newRect: { 'x': number; 'y': number; 'width': number; 'height': number; }): void => {
            // --- 当前无选区时，任何模式均退化为 replace ---
            if (marqueeRects.length === 0) {
                marqueeRects = [newRect];
                return;
            }
            switch (this.props.marqueeCompose) {
                case 'add': {
                    marqueeRects = [...marqueeRects, newRect];
                    break;
                }
                case 'subtract': {
                    marqueeRects = subtractRect(marqueeRects, newRect);
                    break;
                }
                case 'intersect': {
                    marqueeRects = intersectRect(marqueeRects, newRect);
                    break;
                }
                default: {
                    // --- replace 模式：直接替换 ---
                    marqueeRects = [newRect];
                    break;
                }
            }
        };

        /**
         * --- 清除上层 canvas（contextTop）的旧选区绘制 ---
         */
        const clearContextTop = (): void => {
            if (!this.access.canvas) {
                return;
            }
            const ctxTop = (this.access.canvas as any).contextTop as CanvasRenderingContext2D | undefined;
            if (ctxTop) {
                ctxTop.clearRect(0, 0, ctxTop.canvas.width, ctxTop.canvas.height);
            }
        };

        /** --- after:render 监听器引用，用于在画布内容上层绘制选区虚线 --- */
        let afterRenderHandler: ((e: any) => void) | null = null;

        /** --- 创建并注册 after:render 监听器 --- */
        const setupAfterRender = (): void => {
            if (afterRenderHandler || !this.access.canvas) {
                return;
            }
            afterRenderHandler = (): void => {
                // --- 无选区且无正在绘制的矩形时直接返回 ---
                if (marqueeRects.length === 0 && !drawingRect) {
                    return;
                }
                const canvas = this.access.canvas!;
                const contextTop = (canvas as any).contextTop as CanvasRenderingContext2D;
                contextTop.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
                const zoom = canvas.getZoom();
                const vpt = canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                contextTop.save();
                contextTop.setLineDash([4, 4]);
                contextTop.lineWidth = 1;
                // --- 双色虚线绘制函数 ---
                const drawEdges = (edges: Array<{ 'x1': number; 'y1': number; 'x2': number; 'y2': number; }>): void => {
                    for (const pass of [{ 'color': '#ffffff', 'offset': 0 }, { 'color': '#000000', 'offset': 4 }]) {
                        contextTop.strokeStyle = pass.color;
                        contextTop.lineDashOffset = pass.offset;
                        contextTop.beginPath();
                        for (const edge of edges) {
                            contextTop.moveTo(edge.x1 + 0.5, edge.y1 + 0.5);
                            contextTop.lineTo(edge.x2 + 0.5, edge.y2 + 0.5);
                        }
                        contextTop.stroke();
                    }
                };
                // --- 绘制稳定选区的合并外轮廓 ---
                if (marqueeRects.length > 0) {
                    drawEdges(extractOutlineEdges(marqueeRects, zoom, vpt));
                }
                // --- 绘制正在拖拽中的临时矩形（独立显示，不与稳定选区合并）---
                if (drawingRect) {
                    const sx = drawingRect.x * zoom + vpt[4];
                    const sy = drawingRect.y * zoom + vpt[5];
                    const sw = drawingRect.width * zoom;
                    const sh = drawingRect.height * zoom;
                    drawEdges([{
                        'x1': Math.round(sx), 'y1': Math.round(sy),
                        'x2': Math.round(sx + sw), 'y2': Math.round(sy),
                    }, {
                        'x1': Math.round(sx + sw), 'y1': Math.round(sy),
                        'x2': Math.round(sx + sw), 'y2': Math.round(sy + sh),
                    }, {
                        'x1': Math.round(sx + sw), 'y1': Math.round(sy + sh),
                        'x2': Math.round(sx), 'y2': Math.round(sy + sh),
                    }, {
                        'x1': Math.round(sx), 'y1': Math.round(sy + sh),
                        'x2': Math.round(sx), 'y2': Math.round(sy),
                    }]);
                }
                contextTop.restore();
            };
            this.access.canvas.on('after:render', afterRenderHandler);
        };
        // --- 初始注册 ---
        setupAfterRender();

        // ==============================
        // --- 交互状态变量 ---
        // ==============================

        // --- PS 拖拽状态（transform=false 时从画布任意区域拖动激活图层）---
        let isPsDragging = false;
        let psDragHasMoved = false;
        let psDragLastX = 0;
        let psDragLastY = 0;
        /** --- PS 拖拽暂存的激活对象，防止 fabric 清除选区时丢失引用 --- */
        let psDragObj: fabric.FabricObject | null = null;
        /** --- PS 拖拽时多选的子对象引用，用于 selection:cleared 后重建 ActiveSelection --- */
        let psDragChildren: fabric.FabricObject[] = [];
        /** --- transform=true 时点击空白区域是否需要保持激活对象 --- */
        let isTransformKeep = false;
        /** --- transform=true 时暂存的激活对象 --- */
        let transformKeepObj: fabric.FabricObject | null = null;
        /** --- 画布平移模式（pan=true）是否正在拖拽 --- */
        let isPanDragging = false;
        let panLastX = 0;
        let panLastY = 0;
        /** --- 缩放模式（zoom）拖拽状态 --- */
        let isZoomDragging = false;
        /** --- zoom 拖拽起始 X，用于计算拖拽距离 --- */
        let zoomDragStartX = 0;
        /** --- zoom 拖拽起始时画布的当前缩放倍数 --- */
        let zoomDragStartZoom = 1;
        /** --- zoom 拖拽起始点的屏幕坐标（相对于 canvas 元素），用于传入 fabric 原生 zoomToPoint --- */
        let zoomDragScreenX = 0;
        let zoomDragScreenY = 0;

        // ==============================
        // --- 事件绑定 ---
        // ==============================

        // --- 捕获空白区域按下 ---
        this.access.canvas.on('mouse:down:before', (e: any) => {
            // --- 重置可能残留的上一次状态 ---
            isPsDragging = false;
            psDragObj = null;
            psDragChildren = [];
            isTransformKeep = false;
            transformKeepObj = null;
            isPanDragging = false;
            isZoomDragging = false;
            isMarqueeDrawing = false;
            isMarqueeMoving = false;
            drawingRect = null;
            // --- marquee 模式：判断是移动已有选区还是创建新选区 ---
            if (this.props.mode === 'marquee') {
                const canvasEl = this.access.canvas!.getElement();
                const rect = canvasEl.getBoundingClientRect();
                const sx = e.e.clientX - rect.left;
                const sy = e.e.clientY - rect.top;
                if (marqueeRects.length > 0 && this.props.marqueeCompose === 'replace' && isPointInMarquee(sx, sy)) {
                    // --- 点击在已有选区内且 replace 模式 → 移动选区 ---
                    isMarqueeMoving = true;
                    marqueeMoveLastX = e.e.clientX;
                    marqueeMoveLastY = e.e.clientY;
                }
                else {
                    // --- 其他情况 → 创建新选区 ---
                    isMarqueeDrawing = true;
                    const zoom = this.access.canvas!.getZoom();
                    const vpt = this.access.canvas!.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                    marqueeStartX = (sx - vpt[4]) / zoom;
                    marqueeStartY = (sy - vpt[5]) / zoom;
                }
                return;
            }
            // --- zoom 模式优先与 pan 互斥：任意位置按下记录锁定点 ---
            if (this.props.mode === 'zoom') {
                isZoomDragging = true;
                zoomDragStartX = e.e.clientX;
                zoomDragStartZoom = this.access.canvas!.getZoom();
                // --- 记录屏幕坐标（相对于 canvas 元素），传入 fabric 原生 zoomToPoint ---
                const canvasEl = this.access.canvas!.getElement();
                const rect = canvasEl.getBoundingClientRect();
                zoomDragScreenX = e.e.clientX - rect.left;
                zoomDragScreenY = e.e.clientY - rect.top;
                return;
            }
            // --- pan 模式：任意位置按下都进入画布平移 ---
            if (this.props.mode === 'pan') {
                isPanDragging = true;
                panLastX = e.e.clientX;
                panLastY = e.e.clientY;
                return;
            }
            // --- 点击了对象或 selector=true 时交由 fabric 自然处理（保留框选能力）---
            if (e.target || this.propBoolean('selector')) {
                return;
            }
            const activeObj = this.access.canvas?.getActiveObject();
            if (!activeObj) {
                return;
            }
            if (this.propBoolean('transform')) {
                // --- transform=true + selector=false + 空白区域 → 保持激活对象不清除 ---
                isTransformKeep = true;
                transformKeepObj = activeObj;
            }
            else {
                // --- transform=false + selector=false + 空白区域 → PS 拖拽 ---
                isPsDragging = true;
                psDragObj = activeObj;
                // --- 多选时须在 discardActiveObject 清空子对象前保存引用 ---
                psDragChildren = (activeObj instanceof fabric.ActiveSelection) ? [...activeObj.getObjects()] : [];
                psDragHasMoved = false;
                psDragLastX = e.e.clientX;
                psDragLastY = e.e.clientY;
            }
        });

        // --- 新对象加入时同步当前模式状态（跳过内部画板矩形，避免干扰）---
        this.access.canvas.on('object:added', (e: any) => {
            if (getObjName(e.target) === ARTBOARD_NAME) {
                return;
            }
            // --- 若画板已激活则为新对象自动应用裁剪 ---
            if (this.access.artboard) {
                applyObjClip(e.target, this.access.artboard);
            }
            applyMode();
        });

        this.access.canvas.on('before:selection:cleared', () => {
            updateSelectionStyle(false);
        });

        /**
         * --- 选区创建/更新时：刷新控制点样式并触发图层变更事件 ---
         */
        const onSelectionChange = (): void => {
            updateSelectionStyle(false);
            if (!this.propBoolean('autoLayer')) {
                return;
            }
            const activeObject = this.access.canvas?.getActiveObject();
            let names: string[];
            if (activeObject instanceof fabric.ActiveSelection) {
                // --- 多选时返回所有选中对象的名称数组 ---
                names = activeObject.getObjects().map(o => getObjName(o));
            }
            else if (activeObject) {
                names = [getObjName(activeObject)];
            }
            else {
                names = [];
            }
            const prevNames = this.props.layer;
            if (names.length === prevNames.length && names.every(n => prevNames.includes(n))) {
                return;
            }
            this.emit('update:layer', names);
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': [...prevNames],
                    'next': names,
                }
            };
            this.emit('layerchange', event);
        };

        this.access.canvas.on('selection:created', onSelectionChange);
        this.access.canvas.on('selection:updated', onSelectionChange);

        this.access.canvas.on('selection:cleared', () => {
            updateSelectionStyle(false);
            if (isTransformKeep && transformKeepObj && this.access.canvas) {
                // --- transform 保持模式：恢复激活对象，不触发图层变更事件 ---
                this.access.canvas.setActiveObject(transformKeepObj);
                return;
            }
            if (isPsDragging && this.access.canvas) {
                // --- PS 拖拽进行中：重建激活对象（discardActiveObject 已将子对象坐标恢复为绝对值）---
                if (psDragChildren.length > 0) {
                    const newSel = new fabric.ActiveSelection(psDragChildren, { 'canvas': this.access.canvas });
                    psDragObj = newSel;
                    this.access.canvas.setActiveObject(newSel);
                }
                else if (psDragObj) {
                    this.access.canvas.setActiveObject(psDragObj);
                }
                return;
            }
            if (!this.propBoolean('autoLayer')) {
                return;
            }
            const prevNames = this.props.layer;
            if (prevNames.length === 0) {
                return;
            }
            this.emit('update:layer', []);
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': [...prevNames],
                    'next': [],
                }
            };
            this.emit('layerchange', event);
        });

        this.access.canvas.on('object:moving', () => {
            updateSelectionStyle(true);
        });

        this.access.canvas.on('object:scaling', () => {
            updateSelectionStyle(true);
        });

        this.access.canvas.on('object:rotating', () => {
            updateSelectionStyle(true);
        });

        this.access.canvas.on('object:modified', () => {
            updateSelectionStyle(false);
        });

        // --- mouse:move ---
        this.access.canvas.on('mouse:move', (e: any) => {
            // --- 选区绘制 ---
            if (isMarqueeDrawing && this.access.canvas) {
                const canvasEl = this.access.canvas.getElement();
                const rect = canvasEl.getBoundingClientRect();
                const sx = e.e.clientX - rect.left;
                const sy = e.e.clientY - rect.top;
                const zoom = this.access.canvas.getZoom();
                const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                const cx = (sx - vpt[4]) / zoom;
                const cy = (sy - vpt[5]) / zoom;
                const tempRect = {
                    'x': Math.min(marqueeStartX, cx),
                    'y': Math.min(marqueeStartY, cy),
                    'width': Math.abs(cx - marqueeStartX),
                    'height': Math.abs(cy - marqueeStartY),
                };
                // --- drawingRect 仅用于预览渲染，不混入 marqueeRects ---
                drawingRect = clipRectToArtboard(tempRect);
                this.access.canvas.requestRenderAll();
                return;
            }
            // --- 选区模式：移动已有选区 ---
            if (isMarqueeMoving && this.access.canvas) {
                const dx = e.e.clientX - marqueeMoveLastX;
                const dy = e.e.clientY - marqueeMoveLastY;
                marqueeMoveLastX = e.e.clientX;
                marqueeMoveLastY = e.e.clientY;
                if (dx !== 0 || dy !== 0) {
                    const zoom = this.access.canvas.getZoom();
                    const cdx = dx / zoom;
                    const cdy = dy / zoom;
                    marqueeRects = marqueeRects.map(r => ({
                        'x': r.x + cdx,
                        'y': r.y + cdy,
                        'width': r.width,
                        'height': r.height,
                    }));
                    this.access.canvas.requestRenderAll();
                }
                return;
            }
            // --- 缩放模式：左移缩小、右移放大，以按下位置为锁定点 ---
            if (isZoomDragging && this.access.canvas) {
                const dx = e.e.clientX - zoomDragStartX;
                // --- 每 100px 对应 1 倍变化，采用指数曲线保证缩放手感平滑 ---
                const newZoom = zoomDragStartZoom * Math.pow(2, dx / 100);
                this.zoomTo(newZoom, zoomDragScreenX, zoomDragScreenY);
                return;
            }
            // --- 画布平移模式 ---
            if (isPanDragging && this.access.canvas) {
                const dx = e.e.clientX - panLastX;
                const dy = e.e.clientY - panLastY;
                panLastX = e.e.clientX;
                panLastY = e.e.clientY;
                if (dx !== 0 || dy !== 0) {
                    const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                    vpt[4] += dx;
                    vpt[5] += dy;
                    this.access.canvas.setViewportTransform(vpt);
                    this.access.canvas.requestRenderAll();
                }
                return;
            }
            if (!isPsDragging || !psDragObj || !this.access.canvas) {
                return;
            }
            const zoom = this.access.canvas.getZoom();
            const dx = (e.e.clientX - psDragLastX) / zoom;
            const dy = (e.e.clientY - psDragLastY) / zoom;
            psDragLastX = e.e.clientX;
            psDragLastY = e.e.clientY;
            if (dx === 0 && dy === 0) {
                return;
            }
            if (psDragObj instanceof fabric.ActiveSelection) {
                // --- 多选：ActiveSelection 是虚拟容器，需要逐个移动子对象 ---
                const objs = psDragObj.getObjects();
                for (const o of objs) {
                    o.set({ 'left': (o.left ?? 0) + dx, 'top': (o.top ?? 0) + dy });
                    o.setCoords();
                }
                psDragObj.setCoords();
            }
            else {
                psDragObj.set({
                    'left': (psDragObj.left ?? 0) + dx,
                    'top': (psDragObj.top ?? 0) + dy,
                });
                psDragObj.setCoords();
            }
            psDragHasMoved = true;
            this.access.canvas.requestRenderAll();
        });

        // --- mouse:up ---
        this.access.canvas.on('mouse:up', () => {
            updateSelectionStyle(false);
            // --- 选区绘制结束 ---
            if (isMarqueeDrawing && this.access.canvas) {
                isMarqueeDrawing = false;
                if (drawingRect && drawingRect.width > 0 && drawingRect.height > 0) {
                    applyMarqueeCompose(drawingRect);
                }
                drawingRect = null;
                syncMarquee();
                this.access.canvas.requestRenderAll();
                return;
            }
            // --- 选区移动结束 ---
            if (isMarqueeMoving && this.access.canvas) {
                isMarqueeMoving = false;
                syncMarquee();
                this.access.canvas.requestRenderAll();
                return;
            }
            // --- 缩放模式结束 ---
            if (isZoomDragging) {
                isZoomDragging = false;
                return;
            }
            // --- 画布平移结束 ---
            if (isPanDragging) {
                isPanDragging = false;
                return;
            }
            // --- transform 保持模式：恢复框选开关，清除暂存 ---
            if (isTransformKeep) {
                isTransformKeep = false;
                transformKeepObj = null;
                if (this.access.canvas) {
                    this.access.canvas.selection = this.propBoolean('selector');
                }
                return;
            }
            if (!isPsDragging || !this.access.canvas) {
                return;
            }
            const hasMoved = psDragHasMoved;
            const obj = psDragObj;
            isPsDragging = false;
            psDragHasMoved = false;
            psDragObj = null;
            psDragChildren = [];
            // --- 恢复框选状态 ---
            this.access.canvas.selection = this.propBoolean('selector');
            if (hasMoved && obj) {
                // --- 移动完成：触发 modified 事件 ---
                this.access.canvas.fire('object:modified', { 'target': obj });
                return;
            }
            // --- 未移动：点击空白区域，不改变图层选中状态 ---
        });

        // ==============================
        // --- 自适应大小 ---
        // ==============================

        clickgo.dom.watchSize(this, this.element, () => {
            if (!this.access.canvas) {
                return;
            }
            this.access.canvas.setDimensions({
                'width': this.element.clientWidth,
                'height': this.element.clientHeight,
            });
            // --- 画布尺寸变化时不重新居中画板，避免已有对象出现视觉偏移 ---
            // --- 画板居中仅在 artboardWidth/artboardHeight prop 变更时触发 ---
        }, true);

        // ==============================
        // --- 初始化完成 ---
        // ==============================

        applyMode();
        applyArtboard();

        // --- 将闭包内的选区操作函数暴露给实例方法 ---
        this._clearMarquee = (): void => {
            isMarqueeDrawing = false;
            drawingRect = null;
            marqueeRects = [];
            syncMarquee();
            clearContextTop();
            this.access.canvas?.renderAll();
        };
        this._setMarqueeRect = (x: number, y: number, w: number, h: number): void => {
            isMarqueeDrawing = false;
            drawingRect = null;
            marqueeRects = [{ 'x': x, 'y': y, 'width': w, 'height': h }];
            syncMarquee();
            clearContextTop();
            this.access.canvas?.renderAll();
        };

        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }

    /**
     * --- 供用户调用，将画布缩放到指定倍数，以指定屏幕坐标点为锁定点（fabric 原生 zoomToPoint） ---
     * @param zoom 目标缩放倍数
     * @param screenX 锁定点在 canvas 元素内的屏幕 x 坐标，默认 0
     * @param screenY 锁定点在 canvas 元素内的屏幕 y 坐标，默认 0
     */
    public zoomTo(zoom: number, screenX: number = 0, screenY: number = 0): void {
        if (!this.access.canvas) {
            return;
        }
        const zoomMin = parseFloat(String(this.props.zoomMin)) || 0.01;
        const zoomMax = parseFloat(String(this.props.zoomMax)) || 100;
        const newZoom = Math.min(zoomMax, Math.max(zoomMin, zoom));
        const fabric = clickgo.modules.fabric;
        this.access.canvas.zoomToPoint(new fabric.Point(screenX, screenY), newZoom);
    }

    /**
     * --- 供用户调用，将画布恢复到实际像素（1:1）并居中画板 ---
     */
    public zoomActual(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        if (this.access.artboard) {
            // --- 画板居中：zoom=1，画板左上角对齐 canvas 中心 ---
            // --- screen = canvas * zoom + vpt，居中需减去画板在 canvas 中的初始偏移 ---
            const vpt: fabric.TMat2D = [
                1, 0, 0, 1,
                Math.round((cw - this.access.artboard.width) / 2 - this.access.artboard.left),
                Math.round((ch - this.access.artboard.height) / 2 - this.access.artboard.top)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            // --- 无画板：zoom=1，viewport 重置 ---
            this.access.canvas.setViewportTransform([1, 0, 0, 1, 0, 0] as fabric.TMat2D);
        }
        this.access.canvas.requestRenderAll();
    }

    /**
     * --- 供用户调用，将画布适应屏幕并居中画板 ---
     */
    public zoomFit(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        if (this.access.artboard) {
            // --- 按画板尺寸适应屏, 保留 10px 内边距 ---
            const scaleX = (cw - 20) / this.access.artboard.width;
            const scaleY = (ch - 20) / this.access.artboard.height;
            const newZoom = Math.min(scaleX, scaleY);
            const scaledW = this.access.artboard.width * newZoom;
            const scaledH = this.access.artboard.height * newZoom;
            // --- screen = canvas * newZoom + vpt，居中需减去画板初始偏移乘以缩放倍数 ---
            const vpt: fabric.TMat2D = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this.access.artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this.access.artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            // --- 无画板：viewport 重置 ---
            this.access.canvas.setViewportTransform([1, 0, 0, 1, 0, 0] as fabric.TMat2D);
        }
        this.access.canvas.requestRenderAll();
    }

    /**
     * --- 供用户调用，放大画布，以中心点为锁定点，每次按 1.25 倍放大 ---
     */
    public zoomIn(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        this.zoomTo(this.access.canvas.getZoom() * 1.25, cw / 2, ch / 2);
    }

    /**
     * --- 供用户调用，缩小画布，以中心点为锁定点，每次按 1.25 倍缩小 ---
     */
    public zoomOut(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        this.zoomTo(this.access.canvas.getZoom() / 1.25, cw / 2, ch / 2);
    }

    /**
     * --- 供用户调用，清除所有选区 ---
     */
    public clearMarquee(): void {
        this._clearMarquee?.();
    }

    /**
     * --- 供用户调用，获取选区的外接矩形（canvas 内部坐标），无选区时返回 null ---
     * @returns 外接矩形或 null
     */
    public getMarqueeRect(): { 'x': number; 'y': number; 'width': number; 'height': number; } | null {
        if (this.access.marquee.length === 0) {
            return null;
        }
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const r of this.access.marquee) {
            if (r.x < minX) {
                minX = r.x;
            }
            if (r.y < minY) {
                minY = r.y;
            }
            if (r.x + r.width > maxX) {
                maxX = r.x + r.width;
            }
            if (r.y + r.height > maxY) {
                maxY = r.y + r.height;
            }
        }
        return { 'x': minX, 'y': minY, 'width': maxX - minX, 'height': maxY - minY };
    }

    /**
     * --- 供用户调用，获取与选区有交集的 fabric 对象列表 ---
     * @returns fabric 对象数组
     */
    public getMarqueeObjects(): fabric.FabricObject[] {
        if (!this.access.canvas || this.access.marquee.length === 0) {
            return [];
        }
        const result: fabric.FabricObject[] = [];
        this.access.canvas.forEachObject(obj => {
            if (getObjName(obj) === ARTBOARD_NAME) {
                return;
            }
            const bound = obj.getBoundingRect();
            // --- 检查对象包围盒是否与任一选区矩形有交集 ---
            for (const r of this.access.marquee) {
                if (bound.left < r.x + r.width && bound.left + bound.width > r.x &&
                    bound.top < r.y + r.height && bound.top + bound.height > r.y) {
                    result.push(obj);
                    return;
                }
            }
        });
        return result;
    }

    /**
     * --- 供用户调用，获取选区外轮廓的多边形顶点数组（canvas 内部坐标），无选区时返回空数组 ---
     * @returns 多边形顶点数组的数组（不规则选区可能包含多个独立闭合多边形）
     */
    public getMarqueePolygon(): Array<Array<{ 'x': number; 'y': number; }>> {
        if (this.access.marquee.length === 0) {
            return [];
        }
        // --- 使用 zoom=1、单位矩阵变换，直接在 canvas 坐标系中提取边缘并转换为多边形 ---
        const edges = extractOutlineEdges(this.access.marquee, 1, [1, 0, 0, 1, 0, 0]);
        return buildOutlinePolygons(edges);
    }

    /**
     * --- 供用户调用，以编程方式设置选区矩形（canvas 内部坐标） ---
     * @param x 矩形左上角 x
     * @param y 矩形左上角 y
     * @param width 矩形宽度
     * @param height 矩形高度
     */
    public setMarqueeRect(x: number, y: number, width: number, height: number): void {
        this._setMarqueeRect?.(x, y, width, height);
    }

    public async onUnmounted(): Promise<void> {
        if (!this.access.canvas) {
            return;
        }
        await this.access.canvas.dispose();
        this.access.canvas = undefined;
    }

}
