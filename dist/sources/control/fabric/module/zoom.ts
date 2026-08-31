import * as fabric from 'fabric';

import * as mHost from './host';

// --- 缩放功能模块 ---

export class ZoomModule implements IZoomModule {

    public constructor(private readonly _host: mHost.TFabricHost) {
    }

    public get access(): mHost.IFabricControl['access'] {
        return this._host.access;
    }

    public get props(): mHost.IFabricControl['props'] {
        return this._host.props;
    }

    private get _artboard(): mHost.TArtboard {
        return this._host.artboard;
    }

    // --- Zoom / Pan 拖拽状态 ---

    /** --- 画布平移模式是否正在拖拽 --- */
    private _isPanDragging: boolean = false;

    private _panLastX: number = 0;

    private _panLastY: number = 0;

    /** --- 缩放模式拖拽状态 --- */
    private _isZoomDragging: boolean = false;

    /** --- zoom 拖拽起始 X，用于计算拖拽距离 --- */
    private _zoomDragStartX: number = 0;

    /** --- zoom 拖拽起始时的缩放倍数 --- */
    private _zoomDragStartZoom: number = 1;

    /** --- zoom 拖拽起始点屏幕坐标 --- */
    private _zoomDragScreenX: number = 0;

    private _zoomDragScreenY: number = 0;

    /**
     * --- 将缩放值限制在有效且有序的 zoomMin/zoomMax 范围内。 ---
     * @param zoom 待限制缩放值
     */
    private _clampZoom(zoom: number): number {
        const minProp = Number(this.props.zoomMin);
        const maxProp = Number(this.props.zoomMax);
        const min = Number.isFinite(minProp) && minProp > 0 ? minProp : 0.01;
        const max = Number.isFinite(maxProp) && maxProp >= min ? maxProp : Math.max(min, 100);
        const value = Number.isFinite(zoom) && zoom > 0 ? zoom : min;
        return Math.min(max, Math.max(min, value));
    }

    // --- 拖拽交互方法 ---

    /**
         * --- 重置 zoom/pan 拖拽状态 ---
         */
    public zoomResetDrag(): void {
        this._isPanDragging = false;
        this._isZoomDragging = false;
    }

    /**
         * --- 处理 mouse:down:before 中 zoom/pan 模式的逻辑 ---
         * @param e fabric 事件对象
         * @returns 是否已处理（true 则外层应 return）
         */
    public zoomHandleMouseDown(e: any): boolean {
        if (!this.access.canvas) {
            return false;
        }
        // --- zoom 模式：记录起始位置和缩放倍数 ---
        if (this.props.mode === 'zoom') {
            this._isZoomDragging = true;
            this._zoomDragStartX = e.e.clientX;
            this._zoomDragStartZoom = this.access.canvas.getZoom();
            const canvasEl = this.access.canvas.getElement();
            const rect = canvasEl.getBoundingClientRect();
            this._zoomDragScreenX = e.e.clientX - rect.left;
            this._zoomDragScreenY = e.e.clientY - rect.top;
            return true;
        }
        // --- pan 模式：记录起始位置 ---
        if (this.props.mode === 'pan') {
            this._isPanDragging = true;
            this._panLastX = e.e.clientX;
            this._panLastY = e.e.clientY;
            return true;
        }
        return false;
    }

    /**
         * --- 处理 mouse:move 中 zoom/pan 模式的逻辑 ---
         * @param e fabric 事件对象
         * @returns 是否已处理
         */
    public zoomHandleMouseMove(e: any): boolean {
        if (!this.access.canvas) {
            return false;
        }
        // --- 缩放模式：左移缩小、右移放大 ---
        if (this._isZoomDragging) {
            const dx = e.e.clientX - this._zoomDragStartX;
            const newZoom = this._zoomDragStartZoom * Math.pow(2, dx / 100);
            this.zoomTo(newZoom, this._zoomDragScreenX, this._zoomDragScreenY);
            return true;
        }
        // --- 画布平移模式 ---
        if (this._isPanDragging) {
            const dx = e.e.clientX - this._panLastX;
            const dy = e.e.clientY - this._panLastY;
            this._panLastX = e.e.clientX;
            this._panLastY = e.e.clientY;
            if (dx !== 0 || dy !== 0) {
                const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                vpt[4] += dx;
                vpt[5] += dy;
                this.access.canvas.setViewportTransform(vpt);
                this.access.canvas.requestRenderAll();
            }
            return true;
        }
        return false;
    }

    /**
         * --- 处理 mouse:up 中 zoom/pan 模式的逻辑 ---
         * @returns 是否已处理
         */
    public zoomHandleMouseUp(): boolean {
        if (this._isZoomDragging) {
            this._isZoomDragging = false;
            return true;
        }
        if (this._isPanDragging) {
            this._isPanDragging = false;
            return true;
        }
        return false;
    }
    // --- 可供用户调用的公共缩放方法 ---

    /**
         * --- 将画布缩放到指定倍数，以指定屏幕坐标点为锁定点 ---
         * @param zoom 目标缩放倍数
         * @param screenX 锁定点 x 坐标，默认 0
         * @param screenY 锁定点 y 坐标，默认 0
         */
    public zoomTo(zoom: number, screenX: number = 0, screenY: number = 0): void {
        if (!this.access.canvas || !this.access.fabric) {
            return;
        }
        const newZoom = this._clampZoom(zoom);
        this.access.canvas.zoomToPoint(new this.access.fabric.Point(screenX, screenY), newZoom);
    }

    /**
         * --- 将画布恢复到实际像素（1:1）并居中画板 ---
         */
    public zoomActual(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        const newZoom = this._clampZoom(1);
        if (this._artboard) {
            const scaledW = this._artboard.width * newZoom;
            const scaledH = this._artboard.height * newZoom;
            const vpt: fabric.TMat2D = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this._artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this._artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            this.access.canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0] as fabric.TMat2D);
        }
        this.access.canvas.requestRenderAll();
    }

    /**
         * --- 将画布适应屏幕并居中画板 ---
         */
    public zoomFit(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        if (this._artboard) {
            const scaleX = (cw - 20) / this._artboard.width;
            const scaleY = (ch - 20) / this._artboard.height;
            const newZoom = this._clampZoom(Math.min(scaleX, scaleY));
            const scaledW = this._artboard.width * newZoom;
            const scaledH = this._artboard.height * newZoom;
            const vpt: fabric.TMat2D = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this._artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this._artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            const newZoom = this._clampZoom(1);
            this.access.canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0] as fabric.TMat2D);
        }
        this.access.canvas.requestRenderAll();
    }

    /**
         * --- 放大画布，以中心点为锁定点，每次 1.25 倍 ---
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
         * --- 缩小画布，以中心点为锁定点，每次 1/1.25 ---
         */
    public zoomOut(): void {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        this.zoomTo(this.access.canvas.getZoom() / 1.25, cw / 2, ch / 2);
    }

}

export interface IZoomModule {

    /**
     * --- 重置 zoom/pan 拖拽状态 ---
     */
    zoomResetDrag(): void;

    /**
     * --- 处理 mouse:down:before 中 zoom/pan 模式的逻辑 ---
     * @param e fabric 事件对象
     * @returns 是否已处理
     */
    zoomHandleMouseDown(e: any): boolean;

    /**
     * --- 处理 mouse:move 中 zoom/pan 模式的逻辑 ---
     * @param e fabric 事件对象
     * @returns 是否已处理
     */
    zoomHandleMouseMove(e: any): boolean;

    /**
     * --- 处理 mouse:up 中 zoom/pan 模式的逻辑 ---
     * @returns 是否已处理
     */
    zoomHandleMouseUp(): boolean;

    /**
     * --- 将画布缩放到指定倍数，以指定屏幕坐标点为锁定点 ---
     * @param zoom 目标缩放倍数
     * @param screenX 锁定点 x 坐标，默认 0
     * @param screenY 锁定点 y 坐标，默认 0
     */
    zoomTo(zoom: number, screenX?: number, screenY?: number): void;

    /**
     * --- 将画布恢复到实际像素（1:1）并居中画板 ---
     */
    zoomActual(): void;

    /**
     * --- 将画布适应屏幕并居中画板 ---
     */
    zoomFit(): void;

    /**
     * --- 放大画布，以中心点为锁定点，每次 1.25 倍 ---
     */
    zoomIn(): void;

    /**
     * --- 缩小画布，以中心点为锁定点，每次 1/1.25 ---
     */
    zoomOut(): void;

}
