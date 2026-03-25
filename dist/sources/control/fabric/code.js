import * as clickgo from 'clickgo';
import * as pLayer from './part/layer';
import * as pArtboard from './part/artboard';
import * as pZoom from './part/zoom';
import * as pMarquee from './part/marquee';
// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---
const base1 = pLayer.layerMixin(clickgo.control.AbstractControl);
const base2 = pArtboard.artboardMixin(base1);
const base3 = pZoom.zoomMixin(base2);
const base4 = pMarquee.marqueeMixin(base3);
export default class extends base4 /* AbstractControl */ {
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
    };
    notInit = false;
    isLoading = true;
    access = {
        'fabric': null,
        'canvas': null,
        'marquee': [],
    };
    // ==============================
    // --- PS 拖拽状态（transform=false 时从空白区域拖动激活图层）---
    // ==============================
    /** --- 是否正在 PS 拖拽 --- */
    _isPsDragging = false;
    /** --- PS 拖拽过程中是否发生了移动 --- */
    _psDragHasMoved = false;
    _psDragLastX = 0;
    _psDragLastY = 0;
    /** --- transform=true 时点击空白区域是否保持激活对象 --- */
    _isTransformKeep = false;
    /** --- 恢复 discardActiveObject 原始方法的回调 --- */
    _restoreDiscard = null;
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
            this.artboardApply();
        });
        this.watch('artboardHeight', () => {
            this.artboardApply();
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
            const artboardRect = this.access.canvas.getObjects().find(o => pLayer.isArtboard(o));
            if (artboardRect) {
                artboardRect.set('fill', (this.props.artboardFill || null));
                artboardRect.dirty = true;
                this.access.canvas.requestRenderAll();
            }
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
                this._blockDiscard();
            }
        });
        // --- 新对象加入时同步图层和画板裁剪 ---
        this.access.canvas.on('object:added', (e) => {
            if (pLayer.isArtboard(e.target)) {
                return;
            }
            if (this.artboard) {
                this.artboardApplyObjClip(e.target);
            }
            this.layerOnObjectAdded(e.target);
            this.layerApplyMode();
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
            dragObj.set({ 'left': (dragObj.left ?? 0) + dx, 'top': (dragObj.top ?? 0) + dy });
            dragObj.setCoords();
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
            this.access.canvas.setDimensions({
                'width': this.element.clientWidth,
                'height': this.element.clientHeight,
            });
        }, true);
        // --- 初始化完成 ---
        this.layerApplyMode();
        this.artboardApply();
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }
    async onUnmounted() {
        if (!this.access.canvas) {
            return;
        }
        await this.access.canvas.dispose();
        this.access.canvas = null;
    }
}
