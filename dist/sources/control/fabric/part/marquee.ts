import * as clickgo from 'clickgo';
import * as fabric from 'fabric';

import * as pCore from './core';
import * as pArtboard from './artboard';
import * as pLayer from './layer';

/** --- 矩形（画布坐标系） --- */
export interface IRect { 'x': number; 'y': number; 'width': number; 'height': number; }
/** --- 线段（屏幕坐标系） --- */
export interface IEdge { 'x1': number; 'y1': number; 'x2': number; 'y2': number; }
/** --- 点坐标 --- */
export interface IPoint { 'x': number; 'y': number; }

/**
 * --- 计算两个矩形的交集区域，无交集时返回 null ---
 * @param a 矩形 a
 * @param b 矩形 b
 * @returns [x1, y1, x2, y2] 或 null
 */
function intersect(a: IRect, b: IRect): [number, number, number, number] | null {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    const y2 = Math.min(a.y + a.height, b.y + b.height);
    return (x2 > x1 && y2 > y1) ? [x1, y1, x2, y2] : null;
}

/**
 * --- 从矩形列表中提取合并后的外轮廓边缘线段 ---
 * @param rects 矩形列表（画布坐标系）
 * @param zoom 缩放倍数
 * @param vpt 视口变换矩阵
 * @returns 边缘线段数组（屏幕坐标系）
 */
export function extractOutlineEdges(rects: IRect[], zoom: number, vpt: number[]): IEdge[] {
    if (rects.length === 0) {
        return [];
    }
    // --- 将矩形坐标转换为屏幕坐标并取整，防止浮点精度问题 ---
    const screenRects = rects.map((r) => ({
        'x': Math.round(r.x * zoom + vpt[4]),
        'y': Math.round(r.y * zoom + vpt[5]),
        'w': Math.round(r.width * zoom),
        'h': Math.round(r.height * zoom),
    }));
    // --- 收集所有唯一的坐标轴边界并排序 ---
    const xSet = new Set<number>();
    const ySet = new Set<number>();
    for (const sr of screenRects) {
        xSet.add(sr.x); xSet.add(sr.x + sr.w);
        ySet.add(sr.y); ySet.add(sr.y + sr.h);
    }
    const xs = [...xSet].sort((a, b) => a - b);
    const ys = [...ySet].sort((a, b) => a - b);
    const cols = xs.length - 1;
    const rows = ys.length - 1;
    if (cols <= 0 || rows <= 0) {
        return [];
    }
    // --- 用 Map 加速坐标到索引的查找，避免 indexOf 的 O(n) 开销 ---
    const xi = new Map(xs.map((v, i) => [v, i]));
    const yi = new Map(ys.map((v, i) => [v, i]));
    // --- 构建网格：每个格子标记是否被至少一个矩形覆盖 ---
    const grid: boolean[][] = Array.from({ 'length': rows }, () => new Array(cols).fill(false));
    for (const sr of screenRects) {
        const left = xi.get(sr.x)!, right = xi.get(sr.x + sr.w)!;
        const top = yi.get(sr.y)!, bottom = yi.get(sr.y + sr.h)!;
        for (let r = top; r < bottom; r++) {
            for (let c = left; c < right; c++) {
                grid[r][c] = true;
            }
        }
    }
    // --- 扫描网格边缘：只保留一侧被覆盖、另一侧未被覆盖的边 ---
    const edges: IEdge[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c]) {
                continue;
            }
            const x1 = xs[c], x2 = xs[c + 1];
            const y1 = ys[r], y2 = ys[r + 1];
            // --- 上边 ---
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
}

/**
 * --- 将外轮廓边缘线段链式连接为多边形顶点数组 ---
 * @param edges 边缘线段数组
 * @returns 多边形顶点数组（不规则选区可能包含多个独立闭合多边形）
 */
export function buildOutlinePolygons(edges: IEdge[]): IPoint[][] {
    if (edges.length === 0) {
        return [];
    }
    // --- 构建端点邻接表 ---
    const key = (x: number, y: number): string => `${x},${y}`;
    const adj = new Map<string, Array<{ 'idx': number; 'to': IPoint; }>>();
    for (let i = 0; i < edges.length; i++) {
        const { x1, y1, x2, y2 } = edges[i];
        const k1 = key(x1, y1), k2 = key(x2, y2);
        if (!adj.has(k1)) {
            adj.set(k1, []);
        }
        if (!adj.has(k2)) {
            adj.set(k2, []);
        }
        adj.get(k1)!.push({ 'idx': i, 'to': { 'x': x2, 'y': y2 } });
        adj.get(k2)!.push({ 'idx': i, 'to': { 'x': x1, 'y': y1 } });
    }
    // --- 链式游走：从每条未访问边出发，依次连接成多边形 ---
    const visited = new Set<number>();
    const polygons: IPoint[][] = [];
    for (let i = 0; i < edges.length; i++) {
        if (visited.has(i)) {
            continue;
        }
        const polygon: IPoint[] = [];
        let cur: IPoint = { 'x': edges[i].x1, 'y': edges[i].y1 };
        let idx = i;
        while (!visited.has(idx)) {
            visited.add(idx);
            polygon.push({ 'x': cur.x, 'y': cur.y });
            const e = edges[idx];
            const next: IPoint = (e.x1 === cur.x && e.y1 === cur.y)
                ? { 'x': e.x2, 'y': e.y2 }
                : { 'x': e.x1, 'y': e.y1 };
            const nextEdge = (adj.get(key(next.x, next.y)) ?? []).find(n => !visited.has(n.idx));
            if (!nextEdge) {
                break;
            }
            cur = next;
            idx = nextEdge.idx;
        }
        if (polygon.length >= 3) {
            polygons.push(polygon);
        }
    }
    return polygons;
}

/**
 * --- 从已有矩形列表中减去新矩形重叠区域（subtract 模式）---
 * @param existing 已有矩形列表
 * @param cut 要减去的矩形
 * @returns 减去后的矩形列表
 */
export function subtractRect(existing: IRect[], cut: IRect): IRect[] {
    const result: IRect[] = [];
    for (const r of existing) {
        const its = intersect(r, cut);
        if (!its) {
            result.push(r);
            continue;
        }
        // --- 有交集，将 r 分割为最多 4 条带状矩形（上/下/左/右）---
        const [ix1, iy1, ix2, iy2] = its;
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
}

/**
 * --- 保留已有矩形与新矩形的交集部分（intersect 模式）---
 * @param existing 已有矩形列表
 * @param clip 交集矩形
 * @returns 交集后的矩形列表
 */
export function intersectRect(existing: IRect[], clip: IRect): IRect[] {
    const result: IRect[] = [];
    for (const r of existing) {
        const its = intersect(r, clip);
        if (!its) {
            continue;
        }
        const [ix1, iy1, ix2, iy2] = its;
        result.push({ 'x': ix1, 'y': iy1, 'width': ix2 - ix1, 'height': iy2 - iy1 });
    }
    return result;
}

// ==============================
// --- Marquee Mixin ---
// ==============================

type TConstructor<T = clickgo.control.AbstractControl &
    pCore.ICore &
    pArtboard.IArtboardMixin
> = abstract new (...args: any[]) => T;

export function marqueeMixin<
    TBase extends TConstructor<clickgo.control.AbstractControl>
>(base: TBase): TBase & TConstructor<IMarqueeMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements IMarqueeMixin {

        // --- 选区状态 ---

        /** --- 选区矩形列表（canvas 坐标系）--- */
        private _marqueeRects: IRect[] = [];

        /** --- 当前正在绘制的临时矩形 --- */
        private _drawingRect: IRect | null = null;

        /** --- 是否正在拖拽创建新选区 --- */
        private _isMarqueeDrawing: boolean = false;

        /** --- 选区绘制起始点（canvas 坐标）--- */
        private _marqueeStartX: number = 0;

        private _marqueeStartY: number = 0;

        /** --- 是否正在拖拽移动已有选区 --- */
        private _isMarqueeMoving: boolean = false;

        /** --- 选区移动上一帧鼠标位置 --- */
        private _marqueeMoveLastX: number = 0;

        private _marqueeMoveLastY: number = 0;

        /** --- after:render 监听器引用 --- */
        private _marqueeRenderHandler: ((e: any) => void) | null = null;

        // --- 内部辅助方法 ---

        /**
         * --- 将选区矩形限制在画板范围内 ---
         * @param rect 待裁剪矩形
         * @returns 裁剪后矩形，若完全超出画板则返回 null
         */
        private _marqueeClipToArtboard(rect: IRect): IRect | null {
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
        }

        /**
         * --- 判断屏幕坐标点是否在已有选区内 ---
         * @param screenX 鼠标在 canvas 元素内的屏幕 x
         * @param screenY 鼠标在 canvas 元素内的屏幕 y
         */
        private _isPointInMarquee(screenX: number, screenY: number): boolean {
            if (this._marqueeRects.length === 0 || !this.access.canvas) {
                return false;
            }
            const zoom = this.access.canvas.getZoom();
            const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
            const cx = (screenX - vpt[4]) / zoom;
            const cy = (screenY - vpt[5]) / zoom;
            for (const r of this._marqueeRects) {
                if (cx >= r.x && cx <= r.x + r.width && cy >= r.y && cy <= r.y + r.height) {
                    return true;
                }
            }
            return false;
        }

        /**
         * --- 同步 access.marquee 并触发 marqueechange 事件 ---
         */
        private _marqueeSync(): void {
            this.access.marquee = this._marqueeRects.map(r => ({ ...r }));
            this.emit('marqueechange');
        }

        /**
         * --- 将新绘制的选区按当前组合模式应用到 _marqueeRects ---
         * @param newRect 新绘制的矩形
         */
        private _marqueeApplyCompose(newRect: IRect): void {
            if (this._marqueeRects.length === 0) {
                this._marqueeRects = [newRect];
                return;
            }
            switch (this.props.marqueeCompose) {
                case 'add': {
                    this._marqueeRects = [...this._marqueeRects, newRect];
                    break;
                }
                case 'subtract': {
                    this._marqueeRects = subtractRect(this._marqueeRects, newRect);
                    break;
                }
                case 'intersect': {
                    this._marqueeRects = intersectRect(this._marqueeRects, newRect);
                    break;
                }
                default: {
                    this._marqueeRects = [newRect];
                    break;
                }
            }
        }

        /**
         * --- 清除上层 canvas（contextTop）的旧选区绘制 ---
         */
        private _marqueeClearContextTop(): void {
            if (!this.access.canvas) {
                return;
            }
            const ctxTop = (this.access.canvas as any).contextTop as CanvasRenderingContext2D | undefined;
            if (ctxTop) {
                ctxTop.clearRect(0, 0, ctxTop.canvas.width, ctxTop.canvas.height);
            }
        }

        // --- 初始化 ---

        /**
         * --- 注册 after:render 监听器，在画布内容上层绘制选区虚线 ---
         */
        public marqueeSetup(): void {
            if (this._marqueeRenderHandler || !this.access.canvas) {
                return;
            }
            this._marqueeRenderHandler = (): void => {
                if (this._marqueeRects.length === 0 && !this._drawingRect) {
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
                // --- 双色虚线绘制 ---
                const drawEdges = (edges: IEdge[]): void => {
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
                // --- 绘制稳定选区合并外轮廓 ---
                if (this._marqueeRects.length > 0) {
                    drawEdges(extractOutlineEdges(this._marqueeRects, zoom, vpt));
                }
                // --- 绘制正在拖拽的临时矩形 ---
                if (this._drawingRect) {
                    const sx = this._drawingRect.x * zoom + vpt[4];
                    const sy = this._drawingRect.y * zoom + vpt[5];
                    const sw = this._drawingRect.width * zoom;
                    const sh = this._drawingRect.height * zoom;
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
            this.access.canvas.on('after:render', this._marqueeRenderHandler);
        }

        // --- 拖拽交互方法 ---

        /**
         * --- 重置选区拖拽状态 ---
         */
        public marqueeResetDrag(): void {
            this._isMarqueeDrawing = false;
            this._isMarqueeMoving = false;
            this._drawingRect = null;
        }

        /**
         * --- 处理 mouse:down:before 中选区模式的逻辑 ---
         * @param e fabric 事件对象
         * @returns 是否已处理
         */
        public marqueeHandleMouseDown(e: any): boolean {
            if (this.props.mode !== 'marquee' || !this.access.canvas) {
                return false;
            }
            const canvasEl = this.access.canvas.getElement();
            const rect = canvasEl.getBoundingClientRect();
            const sx = e.e.clientX - rect.left;
            const sy = e.e.clientY - rect.top;
            if (this._marqueeRects.length > 0 && this.props.marqueeCompose === 'replace' && this._isPointInMarquee(sx, sy)) {
                // --- 点击在已有选区内且 replace 模式 → 移动选区 ---
                this._isMarqueeMoving = true;
                this._marqueeMoveLastX = e.e.clientX;
                this._marqueeMoveLastY = e.e.clientY;
            }
            else {
                // --- 其他情况 → 创建新选区 ---
                this._isMarqueeDrawing = true;
                const zoom = this.access.canvas.getZoom();
                const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                this._marqueeStartX = (sx - vpt[4]) / zoom;
                this._marqueeStartY = (sy - vpt[5]) / zoom;
            }
            return true;
        }

        /**
         * --- 处理 mouse:move 中选区模式的逻辑 ---
         * @param e fabric 事件对象
         * @returns 是否已处理
         */
        public marqueeHandleMouseMove(e: any): boolean {
            if (!this.access.canvas) {
                return false;
            }
            // --- 选区绘制 ---
            if (this._isMarqueeDrawing) {
                const canvasEl = this.access.canvas.getElement();
                const rect = canvasEl.getBoundingClientRect();
                const sx = e.e.clientX - rect.left;
                const sy = e.e.clientY - rect.top;
                const zoom = this.access.canvas.getZoom();
                const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                const cx = (sx - vpt[4]) / zoom;
                const cy = (sy - vpt[5]) / zoom;
                const tempRect: IRect = {
                    'x': Math.min(this._marqueeStartX, cx),
                    'y': Math.min(this._marqueeStartY, cy),
                    'width': Math.abs(cx - this._marqueeStartX),
                    'height': Math.abs(cy - this._marqueeStartY),
                };
                this._drawingRect = this._marqueeClipToArtboard(tempRect);
                this.access.canvas.requestRenderAll();
                return true;
            }
            // --- 选区移动 ---
            if (this._isMarqueeMoving) {
                const dx = e.e.clientX - this._marqueeMoveLastX;
                const dy = e.e.clientY - this._marqueeMoveLastY;
                this._marqueeMoveLastX = e.e.clientX;
                this._marqueeMoveLastY = e.e.clientY;
                if (dx !== 0 || dy !== 0) {
                    const zoom = this.access.canvas.getZoom();
                    const cdx = dx / zoom;
                    const cdy = dy / zoom;
                    this._marqueeRects = this._marqueeRects.map(r => ({
                        'x': r.x + cdx,
                        'y': r.y + cdy,
                        'width': r.width,
                        'height': r.height,
                    }));
                    this.access.canvas.requestRenderAll();
                }
                return true;
            }
            return false;
        }

        /**
         * --- 处理 mouse:up 中选区模式的逻辑 ---
         * @returns 是否已处理
         */
        public marqueeHandleMouseUp(): boolean {
            if (!this.access.canvas) {
                return false;
            }
            // --- 选区绘制结束 ---
            if (this._isMarqueeDrawing) {
                this._isMarqueeDrawing = false;
                if (this._drawingRect && this._drawingRect.width > 0 && this._drawingRect.height > 0) {
                    this._marqueeApplyCompose(this._drawingRect);
                }
                this._drawingRect = null;
                this._marqueeSync();
                this.access.canvas.requestRenderAll();
                return true;
            }
            // --- 选区移动结束 ---
            if (this._isMarqueeMoving) {
                this._isMarqueeMoving = false;
                this._marqueeSync();
                this.access.canvas.requestRenderAll();
                return true;
            }
            return false;
        }

        // --- 公共方法 ---

        /**
         * --- 清除所有选区 ---
         */
        public clearMarquee(): void {
            this._isMarqueeDrawing = false;
            this._drawingRect = null;
            this._marqueeRects = [];
            this._marqueeSync();
            this._marqueeClearContextTop();
            this.access.canvas?.renderAll();
        }

        /**
         * --- 以编程方式设置选区矩形 ---
         * @param x 矩形左上角 x
         * @param y 矩形左上角 y
         * @param width 矩形宽度
         * @param height 矩形高度
         */
        public setMarqueeRect(x: number, y: number, width: number, height: number): void {
            this._isMarqueeDrawing = false;
            this._drawingRect = null;
            this._marqueeRects = [{ 'x': x, 'y': y, 'width': width, 'height': height }];
            this._marqueeSync();
            this._marqueeClearContextTop();
            this.access.canvas?.renderAll();
        }

        /**
         * --- 获取选区的外接矩形（canvas 内部坐标），无选区时返回 null ---
         */
        public getMarqueeRect(): IRect | null {
            if (this.access.marquee.length === 0) {
                return null;
            }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const r of this.access.marquee) {
                minX = Math.min(minX, r.x);
                minY = Math.min(minY, r.y);
                maxX = Math.max(maxX, r.x + r.width);
                maxY = Math.max(maxY, r.y + r.height);
            }
            return { 'x': minX, 'y': minY, 'width': maxX - minX, 'height': maxY - minY };
        }

        /**
         * --- 获取与选区有交集的 fabric 对象列表 ---
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
         * --- 获取选区外轮廓的多边形顶点数组（canvas 内部坐标） ---
         */
        public getMarqueePolygon(): IPoint[][] {
            if (this.access.marquee.length === 0) {
                return [];
            }
            const edges = extractOutlineEdges(this.access.marquee, 1, [1, 0, 0, 1, 0, 0]);
            return buildOutlinePolygons(edges);
        }

    }

    return Mixed as unknown as TBase & TConstructor<IMarqueeMixin>;
}

export interface IMarqueeMixin {

    /**
     * --- 注册 after:render 监听器，在画布内容上层绘制选区虚线，在 onMounted 中调用 ---
     */
    marqueeSetup(): void;

    /**
     * --- 重置选区拖拽状态 ---
     */
    marqueeResetDrag(): void;

    /**
     * --- 处理 mouse:down:before 中选区模式的逻辑 ---
     * @param e fabric 事件对象
     * @returns 是否已处理
     */
    marqueeHandleMouseDown(e: any): boolean;

    /**
     * --- 处理 mouse:move 中选区模式的逻辑 ---
     * @param e fabric 事件对象
     * @returns 是否已处理
     */
    marqueeHandleMouseMove(e: any): boolean;

    /**
     * --- 处理 mouse:up 中选区模式的逻辑 ---
     * @returns 是否已处理
     */
    marqueeHandleMouseUp(): boolean;

    /**
     * --- 清除所有选区 ---
     */
    clearMarquee(): void;

    /**
     * --- 以编程方式设置选区矩形 ---
     * @param x 矩形左上角 x
     * @param y 矩形左上角 y
     * @param width 矩形宽度
     * @param height 矩形高度
     */
    setMarqueeRect(x: number, y: number, width: number, height: number): void;

    /**
     * --- 获取选区的外接矩形（canvas 内部坐标），无选区时返回 null ---
     */
    getMarqueeRect(): IRect | null;

    /**
     * --- 获取与选区有交集的 fabric 对象列表 ---
     */
    getMarqueeObjects(): fabric.FabricObject[];

    /**
     * --- 获取选区外轮廓的多边形顶点数组（canvas 内部坐标） ---
     */
    getMarqueePolygon(): IPoint[][];

}
