import fabric from 'fabric';
import * as clickgo from 'clickgo';

// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
        /** --- v-model:layer 双向绑定，值为激活图层对象的 name 属性，无选中时为空字符串 --- */
        'update:layer': null,
        /** --- 激活图层变更时触发（仅 autoLayer=true 时），参数为 { prev: 变更前图层 name, next: 变更后图层 name } --- */
        'layerchange': null,
    };

    public props: {
        'disabled': boolean | string;
        /** --- 是否允许点击对象自动切换激活图层，关闭时只有 layer 属性指定的对象可被操作 --- */
        'autoLayer': boolean | string;
        /** --- 是否显示控制点（自由变换句柄），关闭后只能拖动，不能缩放/旋转 --- */
        'transform': boolean | string;
        /** --- 当前激活图层的 fabric 对象 name 属性值，支持 v-model:layer --- */
        'layer': string;
        /** --- 是否显示框选矩形 --- */
        'selector': boolean | string;
    } = {
            'disabled': false,
            'autoLayer': true,
            'transform': true,
            'layer': '',
            'selector': true,
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- fabric Canvas 对象 --- */
        'canvas': fabric.Canvas | undefined;
    } = {
            'canvas': undefined,
        };

    public async onMounted(): Promise<void> {
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
        this.access.canvas = new fabric.Canvas(this.refs.content as unknown as HTMLCanvasElement, {
            'width': cw,
            'height': ch,
        });

        const borderColor = getComputedStyle(this.element).getPropertyValue('--cg').trim();
        const cornerColor = getComputedStyle(this.element).getPropertyValue('--g-plain-background').trim();

        // --- 设置画布默认选框样式 ---
        this.access.canvas.selectionColor = getComputedStyle(this.element).getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = getComputedStyle(this.element).getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;

        /** --- 因为 fabric.js v7 类型定义中 FabricObject 实例的 name 字段不在直接类型上，需转换访问 --- */
        const getObjName = (obj: fabric.FabricObject): string => ((obj as unknown as { 'name'?: string; }).name) ?? '';

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
                obj.set(styleProps);
            });
            // --- ActiveSelection 为虚拟对象不计入 forEachObject，需单独应用样式 ---
            if (activeObject instanceof fabric.ActiveSelection) {
                activeObject.set(styleProps);
            }
            this.access.canvas.requestRenderAll();
        };

        /**
         * --- 根据 mode / layer / selector prop 同步画布内所有对象的交互状态 ---
         */
        const applyMode = (): void => {
            if (!this.access.canvas) {
                return;
            }
            const isAutoLayer = this.propBoolean('autoLayer');
            const layerName = this.props.layer;

            // --- 按 autoLayer 更新所有对象的可交互状态 ---
            this.access.canvas.forEachObject(obj => {
                if (isAutoLayer) {
                    // --- 自动切换图层：所有对象均可被点选 ---
                    obj.set({
                        'evented': true,
                        'selectable': true,
                    });
                }
                else {
                    // --- 手动指定图层：仅 layer 对应对象响应鼠标事件，其他穿透 ---
                    const isActive = !!layerName && (getObjName(obj) === layerName);
                    obj.set({
                        'evented': isActive,
                        'selectable': isActive,
                    });
                }
            });

            // --- 将 layer prop 对应的对象同步为 canvas 激活对象 ---
            if (layerName) {
                const layerObj = this.access.canvas.getObjects().find(o => getObjName(o) === layerName);
                if (layerObj) {
                    this.access.canvas.setActiveObject(layerObj);
                }
                else {
                    this.access.canvas.discardActiveObject();
                }
            }
            else if (!isAutoLayer) {
                this.access.canvas.discardActiveObject();
            }

            // --- 同步框选矩形开关 ---
            this.access.canvas.selection = this.propBoolean('selector');

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

        // --- PS 模式拖拽：transform=false 时从画布任意区域拖动激活图层 ---
        let isPsDragging = false;
        let psDragHasMoved = false;
        let psDragLastX = 0;
        let psDragLastY = 0;
        /** --- PS 拖拽暂存的激活对象，防止 fabric 清除选区时丢失引用 --- */
        let psDragObj: fabric.FabricObject | null = null;
        /** --- transform=true 时点击空白区域是否需要保持激活对象 --- */
        let isTransformKeep = false;
        /** --- transform=true 时暂存的激活对象 --- */
        let transformKeepObj: fabric.FabricObject | null = null;

        // --- 捕获空白区域按下：selector=true 时不接管（交由 fabric 框选）；selector=false 时才处理保持或 PS 拖拽 ---
        this.access.canvas.on('mouse:down:before', (e: any) => {
            // --- 重置可能残留的上一次状态 ---
            isPsDragging = false;
            psDragObj = null;
            isTransformKeep = false;
            transformKeepObj = null;
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
                psDragHasMoved = false;
                psDragLastX = e.e.clientX;
                psDragLastY = e.e.clientY;
            }
        });

        // --- 新对象加入时同步当前模式状态 ---
        this.access.canvas.on('object:added', () => {
            applyMode();
        });

        this.access.canvas.on('before:selection:cleared', () => {
            updateSelectionStyle(false);
        });

        this.access.canvas.on('selection:created', () => {
            updateSelectionStyle(false);
            if (!this.propBoolean('autoLayer')) {
                return;
            }
            const activeObject = this.access.canvas?.getActiveObject();
            /** --- 多选（ActiveSelection）时无单一激活图层，以空字符串表示 --- */
            const name = (activeObject instanceof fabric.ActiveSelection) ? '' : (activeObject ? getObjName(activeObject) : '');
            const prevName = this.props.layer || '';
            if (name === prevName) {
                return;
            }
            this.emit('update:layer', name);
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': prevName,
                    'next': name,
                }
            };
            this.emit('layerchange', event);
        });

        this.access.canvas.on('selection:updated', () => {
            updateSelectionStyle(false);
            if (!this.propBoolean('autoLayer')) {
                return;
            }
            const activeObject = this.access.canvas?.getActiveObject();
            /** --- 多选（ActiveSelection）时无单一激活图层，以空字符串表示 --- */
            const name = (activeObject instanceof fabric.ActiveSelection) ? '' : (activeObject ? getObjName(activeObject) : '');
            const prevName = this.props.layer || '';
            if (name === prevName) {
                return;
            }
            this.emit('update:layer', name);
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': prevName,
                    'next': name,
                }
            };
            this.emit('layerchange', event);
        });

        this.access.canvas.on('selection:cleared', () => {
            updateSelectionStyle(false);
            if (isTransformKeep && transformKeepObj && this.access.canvas) {
                // --- transform 保持模式：恢复激活对象，不触发图层变更事件 ---
                this.access.canvas.setActiveObject(transformKeepObj);
                return;
            }
            if (isPsDragging && psDragObj && this.access.canvas) {
                // --- PS 拖拽进行中：恢复激活对象，不触发图层变更事件 ---
                this.access.canvas.setActiveObject(psDragObj);
                return;
            }
            if (!this.propBoolean('autoLayer')) {
                return;
            }
            const prevName = this.props.layer || '';
            if (!prevName) {
                return;
            }
            this.emit('update:layer', '');
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': prevName,
                    'next': '',
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

        // --- PS 拖拽移动：在画布上跟踪鼠标位移并平移激活图层 ---
        this.access.canvas.on('mouse:move', (e: any) => {
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
            psDragObj.set({
                'left': (psDragObj.left ?? 0) + dx,
                'top': (psDragObj.top ?? 0) + dy,
            });
            psDragObj.setCoords();
            psDragHasMoved = true;
            this.access.canvas.requestRenderAll();
        });

        this.access.canvas.on('mouse:up', () => {
            // --- 兜底恢复控制点样式 ---
            updateSelectionStyle(false);
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
            // --- 恢复框选状态 ---
            this.access.canvas.selection = this.propBoolean('selector');
            if (hasMoved && obj) {
                // --- 移动完成：触发 modified 事件 ---
                this.access.canvas.fire('object:modified', { 'target': obj });
                return;
            }
            // --- 未移动：点击了空白区域，autoLayer=true 时取消图层选中 ---
            // --- 图层变更事件由随后触发的 selection:cleared 统一处理，此处不重复 emit ---
            if (this.propBoolean('autoLayer')) {
                this.access.canvas.discardActiveObject();
                this.access.canvas.requestRenderAll();
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

        // --- 初始化完成，应用初始模式 ---
        applyMode();
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }

    public async onUnmounted(): Promise<void> {
        if (!this.access.canvas) {
            return;
        }
        await this.access.canvas.dispose();
        this.access.canvas = undefined;
    }

}
