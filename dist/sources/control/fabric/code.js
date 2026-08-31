import * as clickgo from 'clickgo';
import * as mLayer from './module/layer';
import * as mArtboard from './module/artboard';
import * as mZoom from './module/zoom';
import * as mMarquee from './module/marquee';
import * as mSnap from './module/snap';
/** --- 功能对象不进入 Vue data，避免宿主引用形成循环克隆。 --- */
const fabricModules = new WeakMap();
function getModules(host) {
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
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null,
        'update:layer': null,
        'layerchange': null,
        'marqueechange': null,
        'layerlistchange': null,
        'objectchanged': null,
    };
    props = {
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
    notInit = false;
    isLoading = true;
    access = {
        'fabric': null,
        'canvas': null,
        'marquee': [],
    };
    /** --- 对外公开且需要参与 Vue 响应式追踪的功能状态。 --- */
    layerList = [];
    artboard = null;
    artboardBeforeRender = null;
    /** --- 各功能以普通对象组合到真实控件中，不再生成匿名继承链。 --- */
    get _layerModule() {
        return getModules(this).layer;
    }
    get _artboardModule() {
        return getModules(this).artboard;
    }
    get _zoomModule() {
        return getModules(this).zoom;
    }
    get _marqueeModule() {
        return getModules(this).marquee;
    }
    get _snapModule() {
        return getModules(this).snap;
    }
    layerUpdateStyle(isDragging) {
        this._layerModule.layerUpdateStyle(isDragging);
    }
    layerApplyMode() {
        this._layerModule.layerApplyMode();
    }
    layerSetup() {
        this._layerModule.layerSetup();
    }
    layerOnObjectAdded(obj) {
        this._layerModule.layerOnObjectAdded(obj);
    }
    layerOnSelectionCleared() {
        this._layerModule.layerOnSelectionCleared();
    }
    layerGetNames() {
        return this._layerModule.layerGetNames();
    }
    addLayer(name, title) {
        return this._layerModule.addLayer(name, title);
    }
    removeLayer(name) {
        this._layerModule.removeLayer(name);
    }
    renameLayer(name, title) {
        return this._layerModule.renameLayer(name, title);
    }
    setLayerVisible(name, visible) {
        return this._layerModule.setLayerVisible(name, visible);
    }
    setLayerLocked(name, locked) {
        return this._layerModule.setLayerLocked(name, locked);
    }
    addFolder(name, title) {
        return this._layerModule.addFolder(name, title);
    }
    moveLayer(names, refName, position) {
        return this._layerModule.moveLayer(names, refName, position);
    }
    artboardApplyObjClip(obj) {
        this._artboardModule.artboardApplyObjClip(obj);
    }
    artboardApply() {
        this._artboardModule.artboardApply();
    }
    zoomResetDrag() {
        this._zoomModule.zoomResetDrag();
    }
    zoomHandleMouseDown(e) {
        return this._zoomModule.zoomHandleMouseDown(e);
    }
    zoomHandleMouseMove(e) {
        return this._zoomModule.zoomHandleMouseMove(e);
    }
    zoomHandleMouseUp() {
        return this._zoomModule.zoomHandleMouseUp();
    }
    zoomTo(zoom, screenX, screenY) {
        this._zoomModule.zoomTo(zoom, screenX, screenY);
    }
    zoomActual() {
        this._zoomModule.zoomActual();
    }
    zoomFit() {
        this._zoomModule.zoomFit();
    }
    zoomIn() {
        this._zoomModule.zoomIn();
    }
    zoomOut() {
        this._zoomModule.zoomOut();
    }
    marqueeSetup() {
        this._marqueeModule.marqueeSetup();
    }
    marqueeResetDrag() {
        this._marqueeModule.marqueeResetDrag();
    }
    marqueeHandleMouseDown(e) {
        return this._marqueeModule.marqueeHandleMouseDown(e);
    }
    marqueeHandleMouseMove(e) {
        return this._marqueeModule.marqueeHandleMouseMove(e);
    }
    marqueeHandleMouseUp() {
        return this._marqueeModule.marqueeHandleMouseUp();
    }
    clearMarquee() {
        this._marqueeModule.clearMarquee();
    }
    setMarqueeRect(x, y, width, height) {
        this._marqueeModule.setMarqueeRect(x, y, width, height);
    }
    getMarqueeRect() {
        return this._marqueeModule.getMarqueeRect();
    }
    getMarqueeObjects() {
        return this._marqueeModule.getMarqueeObjects();
    }
    getMarqueePolygon() {
        return this._marqueeModule.getMarqueePolygon();
    }
    snapSetup() {
        this._snapModule.snapSetup();
    }
    snapApply(target, rawLeft, rawTop) {
        this._snapModule.snapApply(target, rawLeft, rawTop);
    }
    snapClearGuides() {
        this._snapModule.snapClearGuides();
    }
    // ==============================
    // --- PS 拖拽状态（transform=false 时从空白区域拖动激活图层）---
    // ==============================
    /** --- 是否正在 PS 拖拽 --- */
    _isPsDragging = false;
    /** --- PS 拖拽过程中是否发生了移动 --- */
    _psDragHasMoved = false;
    _psDragLastX = 0;
    _psDragLastY = 0;
    /** --- PS 拖拽期间的原始累计坐标（像素模式下用于保留亚像素值） --- */
    _psDragRawLeft = 0;
    _psDragRawTop = 0;
    /** --- transform=true 时点击空白区域是否保持激活对象 --- */
    _isTransformKeep = false;
    /** --- 恢复 discardActiveObject 原始方法的回调 --- */
    _restoreDiscard = null;
    /** --- 异步加载 Fabric 期间控件是否已开始卸载 --- */
    _isUnmounting = false;
    /**
     * --- 临时屏蔽 discardActiveObject，防止 fabric 清除当前激活对象 ---
     */
    _blockDiscard() {
        if (!this.access.canvas || this._restoreDiscard) {
            return;
        }
        const canvas = this.access.canvas;
        const origDiscard = canvas.discardActiveObject;
        canvas.discardActiveObject = () => canvas;
        this._restoreDiscard = () => {
            canvas.discardActiveObject = origDiscard;
        };
    }
    /**
     * --- 重置 PS 拖拽和 transform 保持状态 ---
     */
    _resetDragState() {
        this._isPsDragging = false;
        this._isTransformKeep = false;
        if (this._restoreDiscard) {
            this._restoreDiscard();
            this._restoreDiscard = null;
        }
    }
    async onMounted() {
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
        this.access.canvas = new fabricModule.Canvas(this.refs.content, {
            'width': this.refs.content.clientWidth,
            'height': this.refs.content.clientHeight,
        });
        // --- fabric 包裹的 div(.canvas-container) 改为 absolute 脱离 flex 流 ---
        const canvasContainer = this.refs.content.parentElement;
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
                artboardRect.set('fill', (this.props.artboardFill || null));
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
        this.access.canvas.on('mouse:down:before', (e) => {
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
        this.access.canvas.on('object:added', (e) => {
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
        this.access.canvas.on('mouse:move', (e) => {
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
    onBeforeUnmount() {
        this._isUnmounting = true;
        this._resetDragState();
    }
    async onUnmounted() {
        try {
            await this.access.canvas?.dispose();
        }
        finally {
            this.access.canvas = null;
            fabricModules.delete(this);
        }
    }
}
