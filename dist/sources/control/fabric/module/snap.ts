import * as fabric from 'fabric';

import * as mHost from './host';
import * as mLayer from './layer';

/** --- 吸附辅助线（canvas 坐标系） --- */
interface IGuide {
    /** --- 方向：h=水平线（固定 y），v=垂直线（固定 x） --- */
    'dir': 'h' | 'v';
    /** --- 在 canvas 坐标系中的位置 --- */
    'pos': number;
}

/** --- 单次拖拽期间复用的吸附候选线 --- */
interface ISnapCandidates {
    'target': fabric.FabricObject;
    'vertical': number[];
    'horizontal': number[];
}

// --- 吸附功能模块 ---

export class SnapModule implements ISnapModule {

    public constructor(private readonly _host: mHost.TFabricHost) {
    }

    public get access(): mHost.IFabricControl['access'] {
        return this._host.access;
    }

    public get propBoolean(): (name: keyof mHost.IFabricControl['props']) => boolean {
        return this._host.propBoolean as (name: keyof mHost.IFabricControl['props']) => boolean;
    }

    public get propNumber(): (name: keyof mHost.IFabricControl['props']) => number {
        return this._host.propNumber as (name: keyof mHost.IFabricControl['props']) => number;
    }

    private get _artboard(): mHost.TArtboard {
        return this._host.artboard;
    }

    /** --- 当前活跃的辅助线列表 --- */
    private _guides: IGuide[] = [];

    /** --- after:render 渲染处理器引用 --- */
    private _snapRenderHandler: ((e: any) => void) | null = null;

    /** --- before:render 渲染处理器引用 --- */
    private _snapBeforeRenderHandler: ((e: any) => void) | null = null;

    /** --- 当前拖拽对象对应的候选线缓存，避免每个 mousemove 重扫所有对象 --- */
    private _candidates: ISnapCandidates | null = null;

    // --- 吸附辅助线绘制 ---

    /**
         * --- 在主画布上绘制吸附辅助线（青色实线） ---
         * @param ctx 主画布 2D 渲染上下文
         */
    private _drawGuides(ctx: CanvasRenderingContext2D): void {
        if (this._guides.length === 0 || !this.access.canvas) {
            return;
        }
        const zoom = this.access.canvas.getZoom();
        const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        const dpr = this.access.canvas.getRetinaScaling();

        ctx.save();
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1 / dpr;
        ctx.setLineDash([]);
        ctx.beginPath();

        for (const g of this._guides) {
            if (g.dir === 'h') {
                const sy = (Math.floor((g.pos * zoom + vpt[5]) * dpr) + 0.5) / dpr;
                ctx.moveTo(0, sy);
                ctx.lineTo(cw, sy);
            }
            else {
                const sx = (Math.floor((g.pos * zoom + vpt[4]) * dpr) + 0.5) / dpr;
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx, ch);
            }
        }

        ctx.stroke();
        ctx.restore();
    }

    // --- 初始化 ---

    public snapSetup(): void {
        if (!this.access.canvas) {
            return;
        }

        // --- 注册 before:render：清除 contextTop 残影，防止缩放时出现双重网格 ---
        this._snapBeforeRenderHandler = (): void => {
            const ctxTop = (this.access.canvas as any)?.contextTop as CanvasRenderingContext2D | undefined;
            if (ctxTop) {
                this.access.canvas!.clearContext(ctxTop);
            }
        };
        this.access.canvas.on('before:render', this._snapBeforeRenderHandler);

        // --- 注册 after:render 绘制吸附辅助线 ---
        this._snapRenderHandler = (e: any): void => {
            const ctx: CanvasRenderingContext2D = e.ctx;
            this._drawGuides(ctx);
        };
        this.access.canvas.on('after:render', this._snapRenderHandler);

        // --- 注册 object:moving 处理 fabric 内置拖拽的吸附 ---
        this.access.canvas.on('object:moving', (e: any): void => {
            this.snapApply(e.target);
        });

        // --- mouse:up 时清除辅助线 ---
        this.access.canvas.on('mouse:up', (): void => {
            this.snapClearGuides();
        });

    }

    // --- 吸附计算与应用 ---

    /**
     * --- 获取当前拖拽对象的吸附候选线，同一拖拽期间只构建一次。 ---
     * @param target 当前移动对象
     */
    private _getCandidates(target: fabric.FabricObject): ISnapCandidates {
        if (this._candidates?.target === target) {
            return this._candidates;
        }
        const movingSet = new Set<fabric.FabricObject>([target]);
        if (this.access.fabric && target instanceof this.access.fabric.ActiveSelection) {
            for (const child of target.getObjects()) {
                movingSet.add(child);
            }
        }
        const vertical: number[] = [];
        const horizontal: number[] = [];
        if (this._artboard) {
            const artboard = this._artboard;
            vertical.push(artboard.left, artboard.left + artboard.width, artboard.left + artboard.width / 2);
            horizontal.push(artboard.top, artboard.top + artboard.height, artboard.top + artboard.height / 2);
        }
        this.access.canvas?.forEachObject((other: fabric.FabricObject) => {
            if (movingSet.has(other) || mLayer.isArtboard(other) || !other.visible) {
                return;
            }
            const bound = other.getBoundingRect();
            vertical.push(bound.left, bound.left + bound.width, bound.left + bound.width / 2);
            horizontal.push(bound.top, bound.top + bound.height, bound.top + bound.height / 2);
        });
        this._candidates = { 'target': target, 'vertical': vertical, 'horizontal': horizontal };
        return this._candidates;
    }

    /**
         * --- 对目标对象应用吸附调整 ---
         * @param target fabric 对象或 ActiveSelection
         * @param rawLeft 原始 left 坐标（PS 拖拽模式下传入，用于保留亚像素累计值）
         * @param rawTop 原始 top 坐标
         */
    public snapApply(target: fabric.FabricObject, rawLeft?: number, rawTop?: number): void {
        if (!this.access.canvas || !this.access.fabric) {
            return;
        }
        if (mLayer.isArtboard(target)) {
            return;
        }

        let left: number = rawLeft ?? (target.left ?? 0);
        let top: number = rawTop ?? (target.top ?? 0);

        // --- 先设置位置以获取准确的边界框 ---
        target.set({ 'left': left, 'top': top });
        target.setCoords();

        if (!this.propBoolean('snap')) {
            this._guides = [];
            this._candidates = null;
            return;
        }

        const thresholdProp = this.propNumber('snapThreshold');
        const threshold = Number.isFinite(thresholdProp) ? Math.max(0, thresholdProp) : 5;
        const zoom = this.access.canvas.getZoom();
        // --- 吸附阈值从屏幕像素转换为 canvas 坐标单位 ---
        const th = threshold / zoom;

        // --- 获取移动对象的边界 ---
        const bound = target.getBoundingRect();
        const bLeft = bound.left;
        const bTop = bound.top;
        const bRight = bound.left + bound.width;
        const bBottom = bound.top + bound.height;
        const bCenterX = bound.left + bound.width / 2;
        const bCenterY = bound.top + bound.height / 2;

        const candidates = this._getCandidates(target);
        const vCandidates = candidates.vertical;
        const hCandidates = candidates.horizontal;

        const objRefX = [bLeft, bRight, bCenterX];
        const objRefY = [bTop, bBottom, bCenterY];

        // --- 第一遍：找最小吸附距离 ---
        let bestDx: number | null = null;
        let bestDxDist = Infinity;
        let bestDy: number | null = null;
        let bestDyDist = Infinity;

        for (const rx of objRefX) {
            for (const cx of vCandidates) {
                const dist = Math.abs(rx - cx);
                if (dist <= th && dist < bestDxDist) {
                    bestDxDist = dist;
                    bestDx = cx - rx;
                }
            }
        }

        for (const ry of objRefY) {
            for (const cy of hCandidates) {
                const dist = Math.abs(ry - cy);
                if (dist <= th && dist < bestDyDist) {
                    bestDyDist = dist;
                    bestDy = cy - ry;
                }
            }
        }

        // --- 应用吸附偏移 ---
        if (bestDx !== null) {
            left += bestDx;
        }
        if (bestDy !== null) {
            top += bestDy;
        }

        target.set({ 'left': left, 'top': top });
        target.setCoords();

        // --- 第二遍：收集吸附后匹配的所有辅助线 ---
        const guides: IGuide[] = [];

        if (bestDx !== null) {
            const vSet = new Set<number>();
            for (const rx of objRefX) {
                const snappedX = rx + bestDx;
                for (const cx of vCandidates) {
                    if (Math.abs(snappedX - cx) < 0.5) {
                        vSet.add(cx);
                    }
                }
            }
            for (const vx of vSet) {
                guides.push({ 'dir': 'v', 'pos': vx });
            }
        }

        if (bestDy !== null) {
            const hSet = new Set<number>();
            for (const ry of objRefY) {
                const snappedY = ry + bestDy;
                for (const cy of hCandidates) {
                    if (Math.abs(snappedY - cy) < 0.5) {
                        hSet.add(cy);
                    }
                }
            }
            for (const hy of hSet) {
                guides.push({ 'dir': 'h', 'pos': hy });
            }
        }

        this._guides = guides;
    }

    /**
         * --- 清除当前显示的所有吸附辅助线 ---
         */
    public snapClearGuides(): void {
        this._candidates = null;
        if (this._guides.length > 0) {
            this._guides = [];
            this.access.canvas?.requestRenderAll();
        }
    }

}

export interface ISnapModule {

    /**
     * --- 初始化吸附和像素网格功能，注册画布事件监听器，在 onMounted 中调用 ---
     */
    snapSetup(): void;

    /**
     * --- 对目标对象应用吸附调整 ---
     * @param target fabric 对象或 ActiveSelection
     * @param rawLeft 原始 left 坐标（PS 拖拽模式下传入）
     * @param rawTop 原始 top 坐标
     */
    snapApply(target: fabric.FabricObject, rawLeft?: number, rawTop?: number): void;

    /**
     * --- 清除当前显示的所有吸附辅助线 ---
     */
    snapClearGuides(): void;

}
