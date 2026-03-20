import * as clickgo from 'clickgo';
// --- 当前 fabric 库版本为 7.2.0，文档：https://fabricjs.com/docs/ ---
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null,
        /** --- v-model:layer 双向绑定，值为激活图层对象的 name 属性，无选中时为空字符串 --- */
        'update:layer': null,
        /** --- 激活图层变更时触发（仅 autoLayer=true 时），参数为 { prev: 变更前图层 name, next: 变更后图层 name } --- */
        'layerchange': null,
    };
    props = {
        'disabled': false,
        'autoLayer': true,
        'transform': true,
        'layer': '',
        'selector': true,
        'artboardWidth': 0,
        'artboardHeight': 0,
        'artboardBg': '#7a7a7a',
        'artboardFill': '#ffffff',
        'mode': '',
        'zoomMin': 0.01,
        'zoomMax': 100,
    };
    notInit = false;
    isLoading = true;
    access = {
        'canvas': undefined,
        'artboard': null,
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
        // --- fabric 会在 canvas 外层包裹一个 div(.canvas-container) 并设置 position:relative 内联样式 ---
        // --- 该 div 若留在 flex 流中，其固定宽度会阻止父容器收缩；改为 absolute 脱离 flex 流 ---
        const canvasContainer = this.refs.content.parentElement;
        if (canvasContainer) {
            canvasContainer.style.position = 'absolute';
            canvasContainer.style.top = '0';
            canvasContainer.style.left = '0';
        }
        const borderColor = getComputedStyle(this.element).getPropertyValue('--cg').trim();
        const cornerColor = getComputedStyle(this.element).getPropertyValue('--g-plain-background').trim();
        // --- 设置画布默认选框样式 ---
        this.access.canvas.selectionColor = getComputedStyle(this.element).getPropertyValue('--g-background-opacity').trim();
        this.access.canvas.selectionBorderColor = getComputedStyle(this.element).getPropertyValue('--g-border-color').trim();
        this.access.canvas.selectionLineWidth = 1;
        /** --- 因为 fabric.js v7 类型定义中 FabricObject 实例的 name 字段不在直接类型上，需转换访问 --- */
        const getObjName = (obj) => (obj.name) ?? '';
        /** --- 内部画板矩形的保留 name，过滤所有对外逻辑 --- */
        const ARTBOARD_NAME = '__cg_artboard__';
        /**
         * --- 构建控制点和边框样式属性，用于统一应用到 fabric 对象 ---
         * @param isDragging 是否处于拖动/变换操作中
         * @param showControls 是否显示控制点
         */
        const buildStyleProps = (isDragging, showControls) => ({
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
        const updateSelectionStyle = (isDragging) => {
            if (!this.access.canvas) {
                return;
            }
            /** --- 是否开启自由变换（控制点），拖动中临时隐藏 --- */
            const showControls = this.propBoolean('transform') && !isDragging;
            const activeObject = this.access.canvas.getActiveObject();
            const styleProps = buildStyleProps(isDragging, showControls);
            this.access.canvas.forEachObject(obj => {
                // --- 跳过内部画板矩形 ---
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
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
        const applyMode = () => {
            if (!this.access.canvas) {
                return;
            }
            const isAutoLayer = this.propBoolean('autoLayer');
            const layerName = this.props.layer;
            // --- 按 autoLayer 更新所有对象的可交互状态 ---
            this.access.canvas.forEachObject(obj => {
                // --- 跳过内部画板矩形，始终保持不可选中/不响应事件 ---
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
                // --- pan 模式或 zoom 模式下所有对象均不可交互 ---
                if (this.props.mode === 'pan' || this.props.mode === 'zoom') {
                    obj.set({ 'evented': false, 'selectable': false });
                    return;
                }
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
        /**
         * --- 为指定用户对象设置画板裁剪，对象内容被裁剪到画板范围内，控制点不受影响 ---
         * @param obj 要设置裁剪的对象
         * @param ab 当前画板信息
         */
        const applyObjClip = (obj, ab) => {
            obj.clipPath = new fabric.Rect({
                'left': ab.left,
                'top': ab.top,
                'width': ab.width,
                'height': ab.height,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                /** --- absolutePositioned=true 表示 clipPath 使用画布绝对坐标，不受对象自身变换影响 --- */
                'absolutePositioned': true,
            });
        };
        /** --- before:render 监听器引用，用于在画板外部绘制背景色（在对象和控制点之前绘制，不覆盖任何内容） --- */
        let beforeRenderHandler = null;
        /**
         * --- 同步画板矩形：居中显示画板区域，外部背景；为所有用户对象设置 clipPath 裁剪至画板内 ---
         */
        const applyArtboard = () => {
            if (!this.access.canvas) {
                return;
            }
            // --- 移除旧的 before:render 监听器 ---
            if (beforeRenderHandler) {
                this.access.canvas.off('before:render', beforeRenderHandler);
                beforeRenderHandler = null;
            }
            const aw = parseFloat(String(this.props.artboardWidth)) || 0;
            const ah = parseFloat(String(this.props.artboardHeight)) || 0;
            // --- 移除旧画板矩形（若存在）---
            const oldArtboard = this.access.canvas.getObjects().find(o => getObjName(o) === ARTBOARD_NAME);
            if (oldArtboard) {
                this.access.canvas.remove(oldArtboard);
            }
            if (!aw || !ah) {
                // --- 关闭画板：清除所有用户对象的 clipPath ---
                this.access.canvas.forEachObject(obj => {
                    if (getObjName(obj) === ARTBOARD_NAME) {
                        return;
                    }
                    /** --- fabric v7 类型中 clipPath 不含 undefined，用 unknown 中转 --- */
                    obj.clipPath = undefined;
                });
                this.access.canvas.backgroundColor = '';
                this.access.artboard = null;
                this.access.canvas.requestRenderAll();
                return;
            }
            const cw = this.access.canvas.getWidth();
            const ch = this.access.canvas.getHeight();
            const left = Math.round((cw - aw) / 2);
            const top = Math.round((ch - ah) / 2);
            this.access.artboard = {
                'left': left,
                'top': top,
                'width': aw,
                'height': ah,
            };
            // --- 为所有现有用户对象应用画板 clipPath ---
            this.access.canvas.forEachObject(obj => {
                if (getObjName(obj) === ARTBOARD_NAME) {
                    return;
                }
                applyObjClip(obj, this.access.artboard);
            });
            // --- 创建画板矩形底层背景 ---
            const artboardRect = new fabric.Rect({
                'left': left,
                'top': top,
                'width': aw,
                'height': ah,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                /** --- 无描边，避免 strokeWidth 影响边界计算 --- */
                'strokeWidth': 0,
                /** --- artboardFill 为空字符串时使用 null 表示完全透明 --- */
                'fill': (this.props.artboardFill || null),
                'selectable': false,
                'evented': false,
                'hasControls': false,
                'hasBorders': false,
                'lockMovementX': true,
                'lockMovementY': true,
            });
            artboardRect.name = ARTBOARD_NAME;
            this.access.canvas.add(artboardRect);
            /** --- fabric.js v7 Canvas.sendObjectToBack 方法将画板压到最底层 --- */
            this.access.canvas.sendObjectToBack(artboardRect);
            // --- 画板外背景色通过 before:render 绘制，不影响对象和控制点的渲染 ---
            // --- before:render 在 clearContext 之后、renderObjects 之前触发，绝不覆盖 controls ---
            beforeRenderHandler = (e) => {
                const bg = this.props.artboardBg;
                if (!this.access.artboard || !bg) {
                    return;
                }
                const ab = this.access.artboard;
                const zoom = this.access.canvas.getZoom();
                const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                const canvasWidth = this.access.canvas.getWidth();
                const canvasHeight = this.access.canvas.getHeight();
                // --- 画板在当前 viewport 下的屏幕坐标 ---
                const sx = ab.left * zoom + vpt[4];
                const sy = ab.top * zoom + vpt[5];
                const sw = ab.width * zoom;
                const sh = ab.height * zoom;
                const ctx = e.ctx;
                ctx.save();
                ctx.fillStyle = bg;
                // --- evenodd 裁剪区域：外矩形减去画板区域，只绘制 4 个外周区域 ---
                ctx.beginPath();
                ctx.rect(0, 0, canvasWidth, canvasHeight);
                ctx.rect(sx, sy, sw, sh);
                ctx.clip('evenodd');
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                ctx.restore();
            };
            this.access.canvas.on('before:render', beforeRenderHandler);
            // --- canvas 自身背景设为透明，让画板内部区域可透过至 HTML 层 ---
            this.access.canvas.backgroundColor = '';
            this.access.canvas.requestRenderAll();
        };
        // --- 监听画板尺寸变更 ---
        this.watch('artboardWidth', () => {
            applyArtboard();
        });
        this.watch('artboardHeight', () => {
            applyArtboard();
        });
        this.watch('artboardBg', () => {
            if (!this.access.canvas || !this.access.artboard) {
                return;
            }
            // --- before:render 处理程序动态读取 artboardBg，此处只需触发重绘 ---
            this.access.canvas.requestRenderAll();
        });
        this.watch('artboardFill', () => {
            if (!this.access.canvas || !this.access.artboard) {
                return;
            }
            const artboardRect = this.access.canvas.getObjects().find(o => getObjName(o) === ARTBOARD_NAME);
            if (artboardRect) {
                artboardRect.set('fill', (this.props.artboardFill || null));
                /** --- fabric v7 必须手动标记 dirty 才能触发重绘 --- */
                artboardRect.dirty = true;
                this.access.canvas.requestRenderAll();
            }
        });
        // --- 监听 mode prop 变更 ---
        this.watch('mode', () => {
            applyMode();
        });
        // --- PS 模式拖拽：transform=false 时从画布任意区域拖动激活图层 ---
        let isPsDragging = false;
        let psDragHasMoved = false;
        let psDragLastX = 0;
        let psDragLastY = 0;
        /** --- PS 拖拽暂存的激活对象，防止 fabric 清除选区时丢失引用 --- */
        let psDragObj = null;
        /** --- transform=true 时点击空白区域是否需要保持激活对象 --- */
        let isTransformKeep = false;
        /** --- transform=true 时暂存的激活对象 --- */
        let transformKeepObj = null;
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
        // --- 捕获空白区域按下：selector=true 时不接管（交由 fabric 框选）；selector=false 时才处理保持或 PS 拖拽 ---
        this.access.canvas.on('mouse:down:before', (e) => {
            // --- 重置可能残留的上一次状态 ---
            isPsDragging = false;
            psDragObj = null;
            isTransformKeep = false;
            transformKeepObj = null;
            isPanDragging = false;
            isZoomDragging = false;
            // --- zoom 模式优先与 pan 互斥：任意位置按下记录锁定点 ---
            if (this.props.mode === 'zoom') {
                isZoomDragging = true;
                zoomDragStartX = e.e.clientX;
                zoomDragStartZoom = this.access.canvas.getZoom();
                // --- 记录屏幕坐标（相对于 canvas 元素），传入 fabric 原生 zoomToPoint ---
                const canvasEl = this.access.canvas.getElement();
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
        // --- 新对象加入时同步当前模式状态（跳过内部画板矩形，避免干扰）---
        this.access.canvas.on('object:added', (e) => {
            if (getObjName(e.target) === ARTBOARD_NAME) {
                return;
            }
            // --- 若画板已激活则为新对象自动应用裁剪 ---
            if (this.access.artboard) {
                applyObjClip(e.target, this.access.artboard);
            }
            applyMode();
        });
        this.access.canvas.on('before:selection:cleared', () => {
            updateSelectionStyle(false);
        });
        /**
         * --- 选区创建/更新时：刷新控制点样式并触发图层变更事件 ---
         */
        const onSelectionChange = () => {
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
            const event = {
                'detail': {
                    'prev': prevName,
                    'next': name,
                }
            };
            this.emit('layerchange', event);
        };
        this.access.canvas.on('selection:created', onSelectionChange);
        this.access.canvas.on('selection:updated', onSelectionChange);
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
            const event = {
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
        // --- PS 拖拽移动：平移激活图层；画布平移：移动 viewport；缩放模式：以锁定点缩放 ---
        this.access.canvas.on('mouse:move', (e) => {
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
            // --- 画布尺寸变化时不重新居中画板，避免已有对象出现视觉偏移 ---
            // --- 画板居中仅在 artboardWidth/artboardHeight prop 变更时触发 ---
        }, true);
        // --- 初始化完成，应用初始模式与画板 ---
        applyMode();
        applyArtboard();
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }
    /**
     * --- 供用户调用，将画布缩放到指定倍数，以指定屏幕坐标点为锁定点（fabric 原生 zoomToPoint） ---
     * @param zoom 目标缩放倍数
     * @param screenX 锁定点在 canvas 元素内的屏幕 x 坐标，默认 0
     * @param screenY 锁定点在 canvas 元素内的屏幕 y 坐标，默认 0
     */
    zoomTo(zoom, screenX = 0, screenY = 0) {
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
    zoomActual() {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        if (this.access.artboard) {
            // --- 画板居中：zoom=1，画板左上角对齐 canvas 中心 ---
            // --- screen = canvas * zoom + vpt，居中需减去画板在 canvas 中的初始偏移 ---
            const vpt = [
                1, 0, 0, 1,
                Math.round((cw - this.access.artboard.width) / 2 - this.access.artboard.left),
                Math.round((ch - this.access.artboard.height) / 2 - this.access.artboard.top)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            // --- 无画板：zoom=1，viewport 重置 ---
            this.access.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        }
        this.access.canvas.requestRenderAll();
    }
    /**
     * --- 供用户调用，将画布适应屏幕并居中画板 ---
     */
    zoomFit() {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        if (this.access.artboard) {
            // --- 按画板尺寸适应屏, 保留 10px 内边距 ---
            const scaleX = (cw - 20) / this.access.artboard.width;
            const scaleY = (ch - 20) / this.access.artboard.height;
            const newZoom = Math.min(scaleX, scaleY);
            const scaledW = this.access.artboard.width * newZoom;
            const scaledH = this.access.artboard.height * newZoom;
            // --- screen = canvas * newZoom + vpt，居中需减去画板初始偏移乘以缩放倍数 ---
            const vpt = [
                newZoom, 0, 0, newZoom,
                Math.round((cw - scaledW) / 2 - this.access.artboard.left * newZoom),
                Math.round((ch - scaledH) / 2 - this.access.artboard.top * newZoom)
            ];
            this.access.canvas.setViewportTransform(vpt);
        }
        else {
            // --- 无画板：viewport 重置 ---
            this.access.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        }
        this.access.canvas.requestRenderAll();
    }
    /**
     * --- 供用户调用，放大画布，以中心点为锁定点，每次按 1.25 倍放大 ---
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
     * --- 供用户调用，缩小画布，以中心点为锁定点，每次按 1.25 倍缩小 ---
     */
    zoomOut() {
        if (!this.access.canvas) {
            return;
        }
        const cw = this.access.canvas.getWidth();
        const ch = this.access.canvas.getHeight();
        this.zoomTo(this.access.canvas.getZoom() / 1.25, cw / 2, ch / 2);
    }
    async onUnmounted() {
        if (!this.access.canvas) {
            return;
        }
        await this.access.canvas.dispose();
        this.access.canvas = undefined;
    }
}
