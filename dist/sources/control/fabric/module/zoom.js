// --- 缩放功能模块 ---
export class ZoomModule {
    _host;
    constructor(_host) {
        this._host = _host;
    }
    get access() {
        return this._host.access;
    }
    get props() {
        return this._host.props;
    }
    get _artboard() {
        return this._host.artboard;
    }
    // --- Zoom / Pan 拖拽状态 ---
    /** --- 画布平移模式是否正在拖拽 --- */
    _isPanDragging = false;
    _panLastX = 0;
    _panLastY = 0;
    /** --- 缩放模式拖拽状态 --- */
    _isZoomDragging = false;
    /** --- zoom 拖拽起始 X，用于计算拖拽距离 --- */
    _zoomDragStartX = 0;
    /** --- zoom 拖拽起始时的缩放倍数 --- */
    _zoomDragStartZoom = 1;
    /** --- zoom 拖拽起始点屏幕坐标 --- */
    _zoomDragScreenX = 0;
    _zoomDragScreenY = 0;
    /**
     * --- 将缩放值限制在有效且有序的 zoomMin/zoomMax 范围内。 ---
     * @param zoom 待限制缩放值
     */
    _clampZoom(zoom) {
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
    zoomResetDrag() {
        this._isPanDragging = false;
        this._isZoomDragging = false;
    }
    /**
         * --- 处理 mouse:down:before 中 zoom/pan 模式的逻辑 ---
         * @param e fabric 事件对象
         * @returns 是否已处理（true 则外层应 return）
         */
    zoomHandleMouseDown(e) {
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
    zoomHandleMouseMove(e) {
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
    zoomHandleMouseUp() {
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
    zoomTo(zoom, screenX = 0, screenY = 0) {
        if (!this.access.canvas || !this.access.fabric) {
            return;
        }
        const newZoom = this._clampZoom(zoom);
        this.access.canvas.zoomToPoint(new this.access.fabric.Point(screenX, screenY), newZoom);
    }
    /**
         * --- 将画布恢复到实际像素（1:1）并居中画板 ---
         */
    zoomActual() {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        const newZoom = this._clampZoom(1);
        if (this._artboard) {
            const scaledW = this._artboard.width * newZoom;
            const scaledH = this._artboard.height * newZoom;
            const vpt = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this._artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this._artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            this.access.canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0]);
        }
        this.access.canvas.requestRenderAll();
    }
    /**
         * --- 将画布适应屏幕并居中画板 ---
         */
    zoomFit() {
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
            const vpt = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this._artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this._artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            const newZoom = this._clampZoom(1);
            this.access.canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0]);
        }
        this.access.canvas.requestRenderAll();
    }
    /**
         * --- 放大画布，以中心点为锁定点，每次 1.25 倍 ---
         */
    zoomIn() {
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
    zoomOut() {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        this.zoomTo(this.access.canvas.getZoom() / 1.25, cw / 2, ch / 2);
    }
}
