import * as clickgo from 'clickgo';
import * as width from './lib/width';
/** --- 同一窗体内的 Dock 实例注册表，确保同时只有一个浮动面板打开 --- */
const formDocks = new WeakMap();
/** --- Dock 进入窄布局的宽度，与 Nav 的浮层模式断点保持一致 --- */
const narrowWidth = 600;
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:expanded': null,
        'update:width': null
    };
    props = {
        'expanded': true,
        'position': 'right',
        'width': 280,
        'minWidth': 160,
        'maxWidth': 0,
        'resizable': true,
        'minContentWidth': 320
    };
    /** --- 不参与响应式处理的 Form 尺寸监听状态 --- */
    access = {
        'formSizeWatch': null,
        'viewportSizeWatch': null,
        'ownerSizeWatch': null,
        'nextGroupIndex': 0,
        'resizeCancel': null
    };
    /** --- 拖拽后的宽度，未拖拽时保留原有 CSS 宽度 --- */
    widthData = 280;
    /** --- 当前是否展开 --- */
    expandedData = true;
    /** --- 当前是否因所在布局区域过窄而强制收起 --- */
    narrow = false;
    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    floatGroup = -1;
    /** --- 浮动面板可使用的 Dock 内容区高度 --- */
    floatAreaHeight = 0;
    /** --- 当前浏览器视窗宽度，用于在视窗缩放时刷新浮动面板 --- */
    viewportWidth = 0;
    /** --- 当前视窗高度，用于限制浮动面板的可用范围 --- */
    viewportHeight = 0;
    /** --- 所属 Form 宽度，列的自动收起不会改写用户的展开偏好 --- */
    formWidth = 0;
    /** --- 容器内容区与视窗的交集宽度 --- */
    layoutWidth = 0;
    /** --- 参与布局计算的列实例；业务状态仍由各列的 v-model 管理 --- */
    columns = [];
    /** --- 侧栏所在位置 --- */
    get positionData() {
        return this.props.position === 'left' ? 'left' : 'right';
    }
    /** --- 展开时的宽度 --- */
    get widthComp() {
        if (this.columns.length) {
            return `calc(${this.columns.map(column => column.expandedData ?
                `${column.preferredWidth}px` : 'var(--dock-collapsed-width)').join(' + ')} + 1px)`;
        }
        if (typeof this.widthData === 'number') {
            return `${this.widthData}px`;
        }
        if (/^\d+$/.test(this.widthData)) {
            return `${this.widthData}px`;
        }
        return this.widthData;
    }
    /**
     * --- 获取容器中扣除工作区后的可用宽度 ---
     * @param column 正在调整的列，省略时计算 Dock 宽度
     * @returns 可分配的像素宽度
     */
    availableWidth(column) {
        const reserve = this.propNumber('minContentWidth');
        const available = Math.max(0, this.layoutWidth - Math.max(0, Number.isFinite(reserve) ? reserve : 320));
        if (!column) {
            return available;
        }
        const columns = [...this.columns].sort((a, b) => clickgo.dom.index(a.element) - clickgo.dom.index(b.element));
        const index = columns.indexOf(column);
        return Math.max(0, available - 1 - columns.reduce((total, item, i) => {
            if (item === column) {
                return total;
            }
            return total + (i > index && item.expandedPreference ? item.preferredWidth : 40);
        }, 0));
    }
    /** --- 当前可拖拽宽度范围 --- */
    get resizeBounds() {
        const maxProp = this.propNumber('maxWidth');
        const max = Math.max(0, Math.min(maxProp > 0 ? maxProp : Infinity, this.availableWidth()));
        return { 'min': Math.min(max, Math.max(0, this.propNumber('minWidth') || 0)), 'max': max };
    }
    /**
     * --- 拖动展开侧栏的工作区边缘 ---
     * @param event 指针按下事件
     * @returns 无返回值
     */
    resizeWidth(event) {
        if (!this.propBoolean('resizable') || !this.expandedData || this.columns.length || event.button !== 0) {
            return;
        }
        event.preventDefault();
        this.cancelResize();
        this.refreshLayout();
        const initial = this.element.getBoundingClientRect().width;
        const original = this.widthData;
        const start = event.clientX;
        const direction = (this.positionData === 'left') !== (this.localeDirection === 'rtl') ? 1 : -1;
        const bounds = this.resizeBounds;
        this.access.resizeCancel = clickgo.modules.pointer.move(event, {
            'cursor': 'col-resize',
            'single': true,
            'escape': true,
            move: (e) => {
                this.widthData = Math.min(bounds.max, Math.max(bounds.min, Math.round(initial + (e.clientX - start) * direction)));
            },
            finish: (_e, detail) => {
                this.access.resizeCancel = null;
                if (detail.cancelled) {
                    this.widthData = original;
                }
                else if (this.widthData !== original) {
                    this.emit('update:width', this.widthData);
                }
            }
        }).cancel;
    }
    /**
     * --- 用方向键调整展开宽度 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    resizeKey(event) {
        if (!this.propBoolean('resizable') || !this.expandedData || this.columns.length ||
            (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
            return;
        }
        event.preventDefault();
        this.cancelResize();
        this.refreshLayout();
        const direction = (this.positionData === 'left') !== (this.localeDirection === 'rtl') ? 1 : -1;
        const bounds = this.resizeBounds;
        const delta = event.key === 'ArrowRight' ? 10 : -10;
        const value = Math.min(bounds.max, Math.max(bounds.min, Math.round(this.element.getBoundingClientRect().width + delta * direction)));
        this.widthData = value;
        this.emit('update:width', value);
    }
    /**
     * --- 取消当前宽度拖拽 ---
     * @returns 无返回值
     */
    cancelResize() {
        this.access.resizeCancel?.();
    }
    /**
     * --- 取消 Dock 及各列的宽度拖拽 ---
     * @returns 无返回值
     */
    cancelAllResizes() {
        this.cancelResize();
        for (const column of this.columns) {
            column.cancelResize();
        }
    }
    /**
     * --- 重新测量可用空间并更新列布局 ---
     * @returns 无返回值
     */
    refreshLayout() {
        this.layoutWidth = width.measureWidth(this.element, this.rootForm.element);
        this.updateColumns();
    }
    /**
     * --- 注册独立停靠列 ---
     * @param column 列实例
     */
    registerColumn(column) {
        this.columns.push(column);
        this.updateColumns();
    }
    /**
     * --- 移除停靠列并释放当前浮层 ---
     * @param column 列实例
     */
    unregisterColumn(column) {
        this.columns = this.columns.filter(item => item !== column);
        this.closeFloat();
        this.updateColumns();
    }
    /** --- 为跨列分组分配不会发生碰撞的索引 --- */
    registerGroup() {
        return this.access.nextGroupIndex++;
    }
    /**
     * --- 分组卸载时释放其浮层状态 ---
     * @param index 分组索引
     */
    unregisterGroup(index) {
        if (this.floatGroup === index) {
            this.closeFloat();
        }
    }
    /** --- 空间不足时按列顺序收起，最后一列优先保留展开 --- */
    updateColumns() {
        if (!this.columns.length || !this.formWidth) {
            return;
        }
        const available = this.availableWidth();
        const columns = [...this.columns].sort((a, b) => clickgo.dom.index(a.element) - clickgo.dom.index(b.element));
        let width = columns.reduce((total, column) => total +
            (column.expandedPreference ? column.preferredWidth : 40), 1);
        for (const column of columns) {
            const collapsed = column.expandedPreference && (width > available);
            if (column.autoCollapsed !== collapsed) {
                column.autoCollapsed = collapsed;
                this.closeFloat();
            }
            if (collapsed) {
                width -= column.preferredWidth - 40;
            }
        }
    }
    /** --- 切换展开/收起 --- */
    toggle() {
        if (this.narrow) {
            return;
        }
        this.expandedData = !this.expandedData;
        this.floatGroup = -1;
        this.emit('update:expanded', this.expandedData);
    }
    /**
     * --- 收起模式下打开或关闭浮动分组 ---
     * @param groupIndex 分组索引
     */
    toggleFloat(groupIndex) {
        if (this.floatGroup === groupIndex) {
            this.floatGroup = -1;
            return;
        }
        const siblings = formDocks.get(this.rootForm);
        if (siblings) {
            for (const dock of siblings) {
                if (dock !== this) {
                    dock.floatGroup = -1;
                }
            }
        }
        this.floatGroup = groupIndex;
    }
    /** --- 关闭浮动面板 --- */
    closeFloat() {
        this.floatGroup = -1;
    }
    /**
     * --- 获取浮动面板所在的 Dock 内容区 ---
     * @returns Dock 内容区元素
     */
    getFloatArea() {
        return this.refs.body ?? null;
    }
    /** --- 浮层同时受所属 Form 和浏览器视窗边界约束 --- */
    getFloatBounds() {
        const rect = this.rootForm.element.getBoundingClientRect();
        return {
            'left': Math.max(0, rect.left),
            'right': Math.min(document.documentElement.clientWidth, rect.right),
            'top': Math.max(0, rect.top),
            'bottom': Math.min(document.documentElement.clientHeight, rect.bottom)
        };
    }
    async onMounted() {
        const form = this.rootForm;
        if (!formDocks.has(form)) {
            formDocks.set(form, new Set());
        }
        formDocks.get(form).add(this);
        this.watch(() => [this.expandedData, this.propBoolean('resizable')], () => {
            if (!this.expandedData || !this.propBoolean('resizable')) {
                this.access.resizeCancel?.();
            }
        });
        this.watch('width', () => {
            if (this.props.width !== this.widthData) {
                this.cancelResize();
            }
            this.widthData = this.props.width;
        }, { 'immediate': true });
        this.watch(() => [this.positionData, this.localeDirection, this.props.minWidth, this.props.maxWidth], () => {
            this.cancelAllResizes();
        });
        this.watch('expanded', () => {
            this.expandedData = !this.narrow && this.propBoolean('expanded');
            this.floatGroup = -1;
        }, {
            'immediate': true
        });
        await this.nextTick();
        const formElement = this.rootForm.element;
        if (!this.element?.isConnected || !formElement.isConnected) {
            return;
        }
        const handler = () => {
            this.cancelAllResizes();
            this.formWidth = formElement.offsetWidth;
            const narrow = formElement.offsetWidth < narrowWidth;
            if (this.narrow !== narrow) {
                this.narrow = narrow;
                this.expandedData = !narrow && this.propBoolean('expanded');
                this.floatGroup = -1;
            }
            this.refreshLayout();
        };
        if (clickgo.dom.watchSizeMulti(this, formElement, handler, true)) {
            this.access.formSizeWatch = {
                'element': formElement,
                'handler': handler
            };
        }
        const owner = this.element.parentElement;
        if (owner) {
            const ownerHandler = () => {
                this.cancelAllResizes();
                this.refreshLayout();
            };
            if (clickgo.dom.watchSizeMulti(this, owner, ownerHandler, true)) {
                this.access.ownerSizeWatch = { 'element': owner, 'handler': ownerHandler };
            }
        }
        clickgo.dom.watchSize(this, this.refs.body, () => {
            this.floatAreaHeight = this.refs.body.clientHeight;
        }, true);
        const viewportHandler = () => {
            this.cancelAllResizes();
            this.viewportWidth = document.documentElement.clientWidth;
            this.viewportHeight = document.documentElement.clientHeight;
            this.refreshLayout();
        };
        if (clickgo.dom.watchSizeMulti(this, document.documentElement, viewportHandler, true)) {
            this.access.viewportSizeWatch = {
                'element': document.documentElement,
                'handler': viewportHandler
            };
        }
        this.watch(() => this.columns.map(column => [column.preferredWidth, column.expandedPreference]), () => {
            this.updateColumns();
        }, {
            'deep': true
        });
        this.watch('minContentWidth', () => {
            this.cancelAllResizes();
            this.updateColumns();
        });
    }
    onUnmounted() {
        this.cancelAllResizes();
        const ownerSizeWatch = this.access.ownerSizeWatch;
        if (ownerSizeWatch) {
            clickgo.dom.unwatchSizeMulti(this, ownerSizeWatch.element, ownerSizeWatch.handler);
            this.access.ownerSizeWatch = null;
        }
        const sizeWatch = this.access.formSizeWatch;
        if (sizeWatch) {
            clickgo.dom.unwatchSizeMulti(this, sizeWatch.element, sizeWatch.handler);
            this.access.formSizeWatch = null;
        }
        const viewportSizeWatch = this.access.viewportSizeWatch;
        if (viewportSizeWatch) {
            clickgo.dom.unwatchSizeMulti(this, viewportSizeWatch.element, viewportSizeWatch.handler);
            this.access.viewportSizeWatch = null;
        }
        const siblings = formDocks.get(this.rootForm);
        siblings?.delete(this);
        if (!siblings?.size) {
            formDocks.delete(this.rootForm);
        }
    }
}
