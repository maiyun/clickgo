import * as fabric from 'fabric';
import * as clickgo from 'clickgo';

import * as lMarquee from './lib/marquee';

import * as pCore from './part/core';
import * as pLayer from './part/layer';
import * as pArtboard from './part/artboard';

// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---

const base1 = pLayer.layerMixin(clickgo.control.AbstractControl);
const base2 = pArtboard.artboardMixin(base1);

export default class extends base2 implements pCore.ICore /* AbstractControl */ {

    public emits: pCore.ICore['emits'] = {
        'init': null,
        'update:layer': null,
        'layerchange': null,
        'marqueechange': null,
        'layerlistchange': null,
    };

    public props: pCore.ICore['props'] = {
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

    public access: pCore.ICore['access'] = {
        'fabric': null,
        'canvas': null,
        'marquee': [],
    };

    public async onMounted(): Promise<void> {

        // --- 加载 fabric 模块 ---

        const fabric = await clickgo.core.getModule('fabric');
        if (!fabric) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.fabric = fabric;

        // --- 初始化画布 ---

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

        // --- 主题色与画布样式 ---

        // --- 设置画布默认选框样式 ---
        this.access.canvas.selectionColor = getComputedStyle(this.element).getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = getComputedStyle(this.element).getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;

        // --- 图层管理初始化 ---
        this.layerSetup();

        // --- 画板管理 ---

        // --- 监听画板尺寸变更 ---
        this.watch('artboardWidth', () => {
            this.artboardApply();
        });
        this.watch('artboardHeight', () => {
            this.artboardApply();
        });
        this.watch('artboardBg', () => {
            if (!this.access.canvas || !this.artboard) {
                return;
            }
            // --- before:render 处理程序动态读取 artboardBg，此处只需触发重绘 ---
            this.access.canvas.requestRenderAll();
        });
        this.watch('artboardFill', () => {
            if (!this.access.canvas || !this.artboard) {
                return;
            }
            const artboardRect = this.access.canvas.getObjects().find(o => pLayer.isArtboard(o));
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
            if (!this.artboard) {
                return rect;
            }
            const ab = this.artboard;
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
                    marqueeRects = lMarquee.subtractRect(marqueeRects, newRect);
                    break;
                }
                case 'intersect': {
                    marqueeRects = lMarquee.intersectRect(marqueeRects, newRect);
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
                    drawEdges(lMarquee.extractOutlineEdges(marqueeRects, zoom, vpt));
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
        /** --- transform=true 时多选的子对象引用，用于 selection:cleared 后重建 ActiveSelection（discardActiveObject 会使原对象失效）--- */
        let transformKeepChildren: fabric.FabricObject[] = [];
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
            transformKeepChildren = [];
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
                // --- 多选时须在 discardActiveObject 清空子对象前保存引用，以便 selection:cleared 后重建 ---
                transformKeepChildren = (activeObj instanceof fabric.ActiveSelection)
                    ? [...activeObj.getObjects()] : [];
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
            if (pLayer.isArtboard(e.target)) {
                return;
            }
            // --- 若画板已激活则为新对象自动应用裁剪 ---
            if (this.artboard) {
                this.artboardApplyObjClip(e.target);
            }
            // --- 注册图层并同步交互状态 ---
            this.layerOnObjectAdded(e.target);
            this.layerApplyMode();
        });

        this.access.canvas.on('selection:cleared', () => {
            this.layerUpdateStyle(false);
            if (isTransformKeep && this.access.canvas) {
                // --- transform 保持模式：恢复激活对象，不触发图层变更事件 ---
                // --- 多选时需重建 ActiveSelection（discardActiveObject 已释放子对象坐标，原对象已失效）---
                if (transformKeepChildren.length > 0) {
                    const newSel = new fabric.ActiveSelection(transformKeepChildren, { 'canvas': this.access.canvas });
                    this.access.canvas.setActiveObject(newSel);
                }
                else if (transformKeepObj) {
                    this.access.canvas.setActiveObject(transformKeepObj);
                }
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
            this.layerOnSelectionCleared();
        });

        this.access.canvas.on('object:moving', () => {
            this.layerUpdateStyle(true);
        });

        this.access.canvas.on('object:scaling', () => {
            this.layerUpdateStyle(true);
        });

        this.access.canvas.on('object:rotating', () => {
            this.layerUpdateStyle(true);
        });

        this.access.canvas.on('object:modified', () => {
            this.layerUpdateStyle(false);
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
            this.layerUpdateStyle(false);
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
                transformKeepChildren = [];
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

        this.layerApplyMode();
        this.artboardApply();

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
        if (this.artboard) {
            // --- 画板居中：zoom=1，画板左上角对齐 canvas 中心 ---
            // --- screen = canvas * zoom + vpt，居中需减去画板在 canvas 中的初始偏移 ---
            const vpt: fabric.TMat2D = [
                1, 0, 0, 1,
                Math.round((cw - this.artboard.width) / 2 - this.artboard.left),
                Math.round((ch - this.artboard.height) / 2 - this.artboard.top)
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
        if (this.artboard) {
            // --- 按画板尺寸适应屏, 保留 10px 内边距 ---
            const scaleX = (cw - 20) / this.artboard.width;
            const scaleY = (ch - 20) / this.artboard.height;
            const newZoom = Math.min(scaleX, scaleY);
            const scaledW = this.artboard.width * newZoom;
            const scaledH = this.artboard.height * newZoom;
            // --- screen = canvas * newZoom + vpt，居中需减去画板初始偏移乘以缩放倍数 ---
            const vpt: fabric.TMat2D = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this.artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this.artboard.top * newZoom)
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
            if (pLayer.isArtboard(obj)) {
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
        const edges = lMarquee.extractOutlineEdges(this.access.marquee, 1, [1, 0, 0, 1, 0, 0]);
        return lMarquee.buildOutlinePolygons(edges);
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
        this.access.canvas = null;
    }

}
