import * as clickgo from 'clickgo';
// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null
    };
    props = {
        'disabled': false,
    };
    notInit = false;
    isLoading = true;
    access = {
        'canvas': undefined,
    };
    async onMounted() {
        const fabric = await clickgo.core.getModule('fabric');
        if (!fabric) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 获取元素实际宽高 ---
        const cw = this.refs.content.clientWidth;
        const ch = this.refs.content.clientHeight;
        // --- 初始化 fabric canvas ---
        this.access.canvas = new fabric.Canvas(this.refs.content, {
            'width': cw,
            'height': ch,
        });
        const borderColor = getComputedStyle(this.element).getPropertyValue('--cg').trim();
        const cornerColor = getComputedStyle(this.element).getPropertyValue('--g-plain-background').trim();
        // --- 设置画布默认选框样式 ---
        this.access.canvas.selectionColor = getComputedStyle(this.element).getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = getComputedStyle(this.element).getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;
        const updateSelectionStyle = (isDragging) => {
            if (!this.access.canvas) {
                return;
            }
            /** --- 获取当前选中的对象（单个或多个组合） --- */
            const activeObject = this.access.canvas.getActiveObject();
            /** --- 是否为多选状态（ActiveSelection 类型） --- */
            const isMulti = activeObject instanceof fabric.ActiveSelection;
            this.access.canvas.forEachObject(obj => {
                obj.set({
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
                    /** --- 拖动时临时隐藏控制点 --- */
                    'hasControls': !isDragging
                });
            });
            // --- 多选外框（组合框）样式设置 ---
            if (isMulti) {
                activeObject.set({
                    'cornerColor': cornerColor,
                    'cornerStrokeColor': borderColor,
                    'cornerSize': 8,
                    'cornerStyle': 'rect',
                    'transparentCorners': false,
                    'borderColor': borderColor,
                    'borderScaleFactor': isDragging ? 2 : 1,
                    /** --- 确保拖动时不透明度不降低 --- */
                    'borderOpacityWhenMoving': 1,
                    /** --- 拖动组时临时隐藏各角控制点 --- */
                    'hasControls': !isDragging
                });
            }
            // --- 强制重新渲染画布 ---
            this.access.canvas.requestRenderAll();
        };
        this.access.canvas.on('object:added', () => {
            updateSelectionStyle(false);
        });
        this.access.canvas.on('before:selection:cleared', () => {
            updateSelectionStyle(false);
        });
        this.access.canvas.on('selection:created', () => {
            updateSelectionStyle(false);
        });
        this.access.canvas.on('selection:updated', () => {
            updateSelectionStyle(false);
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
        this.access.canvas.on('selection:cleared', () => {
            updateSelectionStyle(false);
        });
        this.access.canvas.on('mouse:up', () => {
            // --- 兜底恢复 ---
            updateSelectionStyle(false);
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
            // this.access.canvas.renderAll();
        }, true);
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }
    async onUnmounted() {
        if (!this.access.canvas) {
            return;
        }
        await this.access.canvas.dispose();
        this.access.canvas = undefined;
    }
}
