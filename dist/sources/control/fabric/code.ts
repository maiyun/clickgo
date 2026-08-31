import * as clickgo from 'clickgo';
import type * as fabric from 'fabric';

import * as mHost from './module/host';
import * as mLayer from './module/layer';
import * as mArtboard from './module/artboard';
import * as mZoom from './module/zoom';
import * as mMarquee from './module/marquee';
import * as mSnap from './module/snap';

// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---

interface IFabricModules {
    'layer': mLayer.LayerModule;
    'artboard': mArtboard.ArtboardModule;
    'zoom': mZoom.ZoomModule;
    'marquee': mMarquee.MarqueeModule;
    'snap': mSnap.SnapModule;
}

/** --- 功能对象不进入 Vue data，避免宿主引用形成循环克隆。 --- */
const fabricModules = new WeakMap<object, IFabricModules>();

function getModules(host: mHost.TFabricHost): IFabricModules {
    let modules = fabricModules.get(host);
    if (modules) {
        return modules;
    }
    modules = {
        'layer': new mLayer.LayerModule(host),
        'artboard': new mArtboard.ArtboardModule(host),
        'zoom': new mZoom.ZoomModule(host),
        'marquee': new mMarquee.MarqueeModule(host),
        'snap': new mSnap.SnapModule(host),
    };
    fabricModules.set(host, modules);
    return modules;
}

export default class extends clickgo.control.AbstractControl implements mHost.IFabricControl,
    mLayer.ILayerModule,
    mArtboard.IArtboardModule,
    mZoom.IZoomModule,
    mMarquee.IMarqueeModule,
    mSnap.ISnapModule {

    public emits: mHost.IFabricControl['emits'] = {
        'init': null,
        'update:layer': null,
        'layerchange': null,
        'marqueechange': null,
        'layerlistchange': null,
        'objectchanged': null,
    };

    public props: mHost.IFabricControl['props'] = {
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
        'cursor': 'default',
        'snap': false,
        'snapThreshold': 5,
    };

    public notInit = false;

    public isLoading = true;

    public access: mHost.IFabricControl['access'] = {
        'fabric': null,
        'canvas': null,
        'marquee': [],
    };

    /** --- 对外公开且需要参与 Vue 响应式追踪的功能状态。 --- */
    public layerList: mLayer.ILayerItem[] = [];

    public artboard: mHost.TArtboard = null;

    public artboardBeforeRender: ((e: any) => void) | null = null;

    /** --- 各功能以普通对象组合到真实控件中，不再生成匿名继承链。 --- */
    private get _layerModule(): mLayer.LayerModule {
        return getModules(this).layer;
    }

    private get _artboardModule(): mArtboard.ArtboardModule {
        return getModules(this).artboard;
    }

    private get _zoomModule(): mZoom.ZoomModule {
        return getModules(this).zoom;
    }

    private get _marqueeModule(): mMarquee.MarqueeModule {
        return getModules(this).marquee;
    }

    private get _snapModule(): mSnap.SnapModule {
        return getModules(this).snap;
    }

    public layerUpdateStyle(isDragging: boolean): void {
        this._layerModule.layerUpdateStyle(isDragging);
    }

    public layerApplyMode(): void {
        this._layerModule.layerApplyMode();
    }

    public layerSetup(): void {
        this._layerModule.layerSetup();
    }

    public layerOnObjectAdded(obj: fabric.FabricObject): void {
        this._layerModule.layerOnObjectAdded(obj);
    }

    public layerOnSelectionCleared(): void {
        this._layerModule.layerOnSelectionCleared();
    }

    public layerGetNames(): string[] {
        return this._layerModule.layerGetNames();
    }

    public addLayer(name: string, title?: string): boolean {
        return this._layerModule.addLayer(name, title);
    }

    public removeLayer(name: string): void {
        this._layerModule.removeLayer(name);
    }

    public renameLayer(name: string, title: string): boolean {
        return this._layerModule.renameLayer(name, title);
    }

    public setLayerVisible(name: string, visible: boolean): boolean {
        return this._layerModule.setLayerVisible(name, visible);
    }

    public setLayerLocked(name: string, locked: boolean): boolean {
        return this._layerModule.setLayerLocked(name, locked);
    }

    public addFolder(name: string, title?: string): boolean {
        return this._layerModule.addFolder(name, title);
    }

    public moveLayer(
        names: string | string[],
        refName: string | null,
        position: 'before' | 'after' | 'inside'
    ): boolean {
        return this._layerModule.moveLayer(names, refName, position);
    }

    public artboardApplyObjClip(obj: fabric.FabricObject): void {
        this._artboardModule.artboardApplyObjClip(obj);
    }

    public artboardApply(): void {
        this._artboardModule.artboardApply();
    }

    public zoomResetDrag(): void {
        this._zoomModule.zoomResetDrag();
    }

    public zoomHandleMouseDown(e: any): boolean {
        return this._zoomModule.zoomHandleMouseDown(e);
    }

    public zoomHandleMouseMove(e: any): boolean {
        return this._zoomModule.zoomHandleMouseMove(e);
    }

    public zoomHandleMouseUp(): boolean {
        return this._zoomModule.zoomHandleMouseUp();
    }

    public zoomTo(zoom: number, screenX?: number, screenY?: number): void {
        this._zoomModule.zoomTo(zoom, screenX, screenY);
    }

    public zoomActual(): void {
        this._zoomModule.zoomActual();
    }

    public zoomFit(): void {
        this._zoomModule.zoomFit();
    }

    public zoomIn(): void {
        this._zoomModule.zoomIn();
    }

    public zoomOut(): void {
        this._zoomModule.zoomOut();
    }

    public marqueeSetup(): void {
        this._marqueeModule.marqueeSetup();
    }

    public marqueeResetDrag(): void {
        this._marqueeModule.marqueeResetDrag();
    }

    public marqueeHandleMouseDown(e: any): boolean {
        return this._marqueeModule.marqueeHandleMouseDown(e);
    }

    public marqueeHandleMouseMove(e: any): boolean {
        return this._marqueeModule.marqueeHandleMouseMove(e);
    }

    public marqueeHandleMouseUp(): boolean {
        return this._marqueeModule.marqueeHandleMouseUp();
    }

    public clearMarquee(): void {
        this._marqueeModule.clearMarquee();
    }

    public setMarqueeRect(x: number, y: number, width: number, height: number): void {
        this._marqueeModule.setMarqueeRect(x, y, width, height);
    }

    public getMarqueeRect(): mMarquee.IRect | null {
        return this._marqueeModule.getMarqueeRect();
    }

    public getMarqueeObjects(): fabric.FabricObject[] {
        return this._marqueeModule.getMarqueeObjects();
    }

    public getMarqueePolygon(): mMarquee.IPoint[][] {
        return this._marqueeModule.getMarqueePolygon();
    }

    public snapSetup(): void {
        this._snapModule.snapSetup();
    }

    public snapApply(target: fabric.FabricObject, rawLeft?: number, rawTop?: number): void {
        this._snapModule.snapApply(target, rawLeft, rawTop);
    }

    public snapClearGuides(): void {
        this._snapModule.snapClearGuides();
    }

    // ==============================
    // --- PS 拖拽状态（transform=false 时从空白区域拖动激活图层）---
    // ==============================

    /** --- 是否正在 PS 拖拽 --- */
    private _isPsDragging: boolean = false;

    /** --- PS 拖拽过程中是否发生了移动 --- */
    private _psDragHasMoved: boolean = false;

    private _psDragLastX: number = 0;

    private _psDragLastY: number = 0;

    /** --- PS 拖拽期间的原始累计坐标（像素模式下用于保留亚像素值） --- */
    private _psDragRawLeft: number = 0;

    private _psDragRawTop: number = 0;

    /** --- transform=true 时点击空白区域是否保持激活对象 --- */
    private _isTransformKeep: boolean = false;

    /** --- 恢复 discardActiveObject 原始方法的回调 --- */
    private _restoreDiscard: (() => void) | null = null;

    /** --- 异步加载 Fabric 期间控件是否已开始卸载 --- */
    private _isUnmounting: boolean = false;

    /**
     * --- 临时屏蔽 discardActiveObject，防止 fabric 清除当前激活对象 ---
     */
    private _blockDiscard(): void {
        if (!this.access.canvas || this._restoreDiscard) {
            return;
        }
        const canvas = this.access.canvas;
        const origDiscard = canvas.discardActiveObject;
        (canvas as any).discardActiveObject = () => canvas;
        this._restoreDiscard = () => {
            canvas.discardActiveObject = origDiscard;
        };
    }

    /**
     * --- 重置 PS 拖拽和 transform 保持状态 ---
     */
    private _resetDragState(): void {
        this._isPsDragging = false;
        this._isTransformKeep = false;
        if (this._restoreDiscard) {
            this._restoreDiscard();
            this._restoreDiscard = null;
        }
    }

    public async onMounted(): Promise<void> {

        // --- 加载 fabric 模块 ---

        const fabricModule = await clickgo.core.getModule('fabric');
        if (this._isUnmounting) {
            return;
        }
        if (!fabricModule) {
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.fabric = fabricModule;

        // --- 初始化画布 ---

        this.access.canvas = new fabricModule.Canvas(this.refs.content as unknown as HTMLCanvasElement, {
            'width': this.refs.content.clientWidth,
            'height': this.refs.content.clientHeight,
        });

        // --- fabric 包裹的 div(.canvas-container) 改为 absolute 脱离 flex 流 ---
        const canvasContainer = (this.refs.content as HTMLElement).parentElement;
        if (canvasContainer) {
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.top = '0';
            canvasContainer.style.left = '0';
        }

        // --- 设置画布默认选框样式 ---
        const style = getComputedStyle(this.element);
        this.access.canvas.selectionColor = style.getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = style.getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;

        // --- 图层管理初始化 ---
        this.layerSetup();

        // --- 选区渲染初始化 ---
        this.marqueeSetup();

        // --- 画板 prop 监听 ---
        this.watch('artboardWidth', () => {
            this._artboardModule.artboardScheduleApply();
        });
        this.watch('artboardHeight', () => {
            this._artboardModule.artboardScheduleApply();
        });
        this.watch('artboardBg', () => {
            if (!this.access.canvas || !this.artboard) {
                return;
            }
            this.access.canvas.requestRenderAll();
        });
        this.watch('artboardFill', () => {
            if (!this.access.canvas || !this.artboard) {
                return;
            }
            const artboardRect = this.access.canvas.getObjects().find(o => mLayer.isArtboard(o));
            if (artboardRect) {
                artboardRect.set('fill', (this.props.artboardFill || null) as any);
                artboardRect.dirty = true;
                this.access.canvas.requestRenderAll();
            }
        });
        this.watch('cursor', () => {
            this.layerUpdateStyle(false);
        });

        // ==============================
        // --- 事件绑定 ---
        // ==============================

        this.access.canvas.on('mouse:down:before', (e: any) => {
            // --- 重置所有拖拽状态 ---
            this._resetDragState();
            this.zoomResetDrag();
            this.marqueeResetDrag();

            // --- 按优先级依次交给各模式处理 ---
            if (this.marqueeHandleMouseDown(e)) {
                return;
            }
            if (this.zoomHandleMouseDown(e)) {
                return;
            }
            // --- 点击了对象或 selector=true 时交由 fabric 自然处理 ---
            if (e.target || this.propBoolean('selector')) {
                return;
            }
            const activeObj = this.access.canvas?.getActiveObject();
            if (!activeObj) {
                return;
            }
            if (this.propBoolean('transform')) {
                // --- transform=true + selector=false + 空白区域 → 阻止 fabric 清除激活对象 ---
                this._isTransformKeep = true;
                this._blockDiscard();
            }
            else {
                // --- transform=false + selector=false + 空白区域 → PS 拖拽 ---
                this._isPsDragging = true;
                this._psDragHasMoved = false;
                this._psDragLastX = e.e.clientX;
                this._psDragLastY = e.e.clientY;
                // --- 记录拖拽起始的原始坐标 ---
                this._psDragRawLeft = activeObj.left ?? 0;
                this._psDragRawTop = activeObj.top ?? 0;
                this._blockDiscard();
            }
        });

        // --- 新对象加入时同步图层和画板裁剪 ---
        this.access.canvas.on('object:added', (e: any) => {
            if (mLayer.isArtboard(e.target)) {
                return;
            }
            if (this.artboard) {
                this.artboardApplyObjClip(e.target);
            }
            this.layerOnObjectAdded(e.target);
            this._layerModule.layerScheduleApplyMode();
        });

        this.access.canvas.on('selection:cleared', () => {
            this.layerUpdateStyle(false);
            this.layerOnSelectionCleared();
        });

        this.access.canvas.on('mouse:move', (e: any) => {
            if (!this.access.fabric) {
                return;
            }
            // --- 按优先级交给各模式处理 ---
            if (this.marqueeHandleMouseMove(e)) {
                return;
            }
            if (this.zoomHandleMouseMove(e)) {
                return;
            }
            // --- PS 拖拽 ---
            if (!this._isPsDragging || !this.access.canvas) {
                return;
            }
            const dragObj = this.access.canvas.getActiveObject();
            if (!dragObj) {
                return;
            }
            const zoom = this.access.canvas.getZoom();
            const dx = (e.e.clientX - this._psDragLastX) / zoom;
            const dy = (e.e.clientY - this._psDragLastY) / zoom;
            this._psDragLastX = e.e.clientX;
            this._psDragLastY = e.e.clientY;
            if (dx === 0 && dy === 0) {
                return;
            }
            // --- 移动整个激活对象（ActiveSelection 整体移动，单对象直接移动）---
            this._psDragRawLeft += dx;
            this._psDragRawTop += dy;
            this.snapApply(dragObj, this._psDragRawLeft, this._psDragRawTop);
            this._psDragHasMoved = true;
            this.access.canvas.requestRenderAll();
        });

        this.access.canvas.on('mouse:up', () => {
            this.layerUpdateStyle(false);
            // --- 按优先级交给各模式处理 ---
            if (this.marqueeHandleMouseUp()) {
                return;
            }
            if (this.zoomHandleMouseUp()) {
                return;
            }
            // --- transform 保持模式结束 ---
            if (this._isTransformKeep) {
                this._resetDragState();
                if (this.access.canvas) {
                    this.access.canvas.selection = this.propBoolean('selector');
                }
                return;
            }
            // --- PS 拖拽结束 ---
            if (!this._isPsDragging || !this.access.canvas) {
                return;
            }
            const hasMoved = this._psDragHasMoved;
            const obj = this.access.canvas.getActiveObject();
            this._resetDragState();
            this.access.canvas.selection = this.propBoolean('selector');
            if (hasMoved && obj) {
                this.access.canvas.fire('object:modified', { 'target': obj });
            }
        });

        // --- 自适应大小 ---
        clickgo.dom.watchSize(this, this.element, () => {
            if (!this.access.canvas) {
                return;
            }
            const width = this.element.clientWidth;
            const height = this.element.clientHeight;
            if (this.access.canvas.getWidth() === width && this.access.canvas.getHeight() === height) {
                return;
            }
            this.access.canvas.setDimensions({
                'width': width,
                'height': height,
            });
        }, true);

        // --- 像素和吸附功能初始化 ---
        this.snapSetup();

        // --- 初始化完成 ---
        this.layerApplyMode();
        this.artboardApply();
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }

    public onBeforeUnmount(): void {
        this._isUnmounting = true;
        this._resetDragState();
    }

    public async onUnmounted(): Promise<void> {
        try {
            await this.access.canvas?.dispose();
        }
        finally {
            this.access.canvas = null;
            fabricModules.delete(this);
        }
    }

}
