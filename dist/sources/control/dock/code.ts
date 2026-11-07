import * as clickgo from 'clickgo';
import * as width from './lib/width';

interface IDockInstance {
    'floatGroup': number;
}

type TDockColumn = clickgo.control.AbstractControl & {
    'preferredWidth': number;
    'expandedPreference': boolean;
    'expandedData': boolean;
    'autoCollapsed': boolean;
    cancelResize(): void;
};

/** --- 同一窗体内的 Dock 实例注册表，确保同时只有一个浮动面板打开 --- */
const formDocks = new WeakMap<object, Set<IDockInstance>>();

/** --- Dock 进入窄布局的宽度，与 Nav 的浮层模式断点保持一致 --- */
const narrowWidth = 600;

export default class extends clickgo.control.AbstractControl implements IDockInstance {

    public emits = {
        'update:expanded': null,
        'update:width': null
    };

    public props: {
        /** --- expanded，是否展开侧栏 --- */
        'expanded': boolean | string;
        /** --- position，侧栏位于内容区域的左侧或右侧 --- */
        'position': 'left' | 'right';
        /** --- width，侧栏展开时的宽度 --- */
        'width': number | string;
        /** --- minWidth，拖拽调整侧栏宽度的下限，单位为像素 --- */
        'minWidth': number | string;
        /** --- maxWidth，拖拽调整侧栏宽度的上限，0 使用可用空间 --- */
        'maxWidth': number | string;
        /** --- resizable，是否允许拖拽调整侧栏宽度 --- */
        'resizable': boolean | string;
        /** --- minContentWidth，自动布局及拖拽时为工作区预留的宽度 --- */
        'minContentWidth': number | string;
    } = {
            'expanded': true,
            'position': 'right',
            'width': 280,
            'minWidth': 160,
            'maxWidth': 0,
            'resizable': true,
            'minContentWidth': 320
        };

    /** --- 不参与响应式处理的 Form 尺寸监听状态 --- */
    public access: {
        'formSizeWatch': {
            'element': HTMLElement;
            'handler': () => void;
        } | null;
        'viewportSizeWatch': {
            'element': HTMLElement;
            'handler': () => void;
        } | null;
        'ownerSizeWatch': { 'element': HTMLElement; 'handler': () => void; } | null;
        'nextGroupIndex': number;
        'resizeCancel': (() => void) | null;
    } = {
            'formSizeWatch': null,
            'viewportSizeWatch': null,
            'ownerSizeWatch': null,
            'nextGroupIndex': 0,
            'resizeCancel': null
        };

    /** --- 拖拽后的宽度，未拖拽时保留原有 CSS 宽度 --- */
    public widthData: number | string = 280;

    /** --- 当前是否展开 --- */
    public expandedData: boolean = true;

    /** --- 当前是否因所在布局区域过窄而强制收起 --- */
    public narrow: boolean = false;

    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    public floatGroup: number = -1;

    /** --- 浮动面板可使用的 Dock 内容区高度 --- */
    public floatAreaHeight: number = 0;

    /** --- 当前浏览器视窗宽度，用于在视窗缩放时刷新浮动面板 --- */
    public viewportWidth: number = 0;

    /** --- 当前视窗高度，用于限制浮动面板的可用范围 --- */
    public viewportHeight: number = 0;

    /** --- 所属 Form 宽度，列的自动收起不会改写用户的展开偏好 --- */
    public formWidth: number = 0;

    /** --- 容器内容区与视窗的交集宽度 --- */
    public layoutWidth: number = 0;

    /** --- 参与布局计算的列实例；业务状态仍由各列的 v-model 管理 --- */
    public columns: TDockColumn[] = [];

    /** --- 侧栏所在位置 --- */
    public get positionData(): 'left' | 'right' {
        return this.props.position === 'left' ? 'left' : 'right';
    }

    /** --- 展开时的宽度 --- */
    public get widthComp(): string {
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
    public availableWidth(column?: TDockColumn): number {
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
    public get resizeBounds(): { 'min': number; 'max': number; } {
        const maxProp = this.propNumber('maxWidth');
        const max = Math.max(0, Math.min(maxProp > 0 ? maxProp : Infinity, this.availableWidth()));
        return { 'min': Math.min(max, Math.max(0, this.propNumber('minWidth') || 0)), 'max': max };
    }

    /**
     * --- 拖动展开侧栏的工作区边缘 ---
     * @param event 指针按下事件
     * @returns 无返回值
     */
    public resizeWidth(event: PointerEvent): void {
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
                this.widthData = Math.min(bounds.max,
                    Math.max(bounds.min, Math.round(initial + (e.clientX - start) * direction)));
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
    public resizeKey(event: KeyboardEvent): void {
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
        const value = Math.min(bounds.max, Math.max(bounds.min,
            Math.round(this.element.getBoundingClientRect().width + delta * direction)));
        this.widthData = value;
        this.emit('update:width', value);
    }

    /**
     * --- 取消当前宽度拖拽 ---
     * @returns 无返回值
     */
    public cancelResize(): void {
        this.access.resizeCancel?.();
    }

    /**
     * --- 取消 Dock 及各列的宽度拖拽 ---
     * @returns 无返回值
     */
    public cancelAllResizes(): void {
        this.cancelResize();
        for (const column of this.columns) {
            column.cancelResize();
        }
    }

    /**
     * --- 重新测量可用空间并更新列布局 ---
     * @returns 无返回值
     */
    public refreshLayout(): void {
        this.layoutWidth = width.measureWidth(this.element, this.rootForm.element);
        this.updateColumns();
    }

    /**
     * --- 注册独立停靠列 ---
     * @param column 列实例
     */
    public registerColumn(column: TDockColumn): void {
        this.columns.push(column);
        this.updateColumns();
    }

    /**
     * --- 移除停靠列并释放当前浮层 ---
     * @param column 列实例
     */
    public unregisterColumn(column: TDockColumn): void {
        this.columns = this.columns.filter(item => item !== column);
        this.closeFloat();
        this.updateColumns();
    }

    /** --- 为跨列分组分配不会发生碰撞的索引 --- */
    public registerGroup(): number {
        return this.access.nextGroupIndex++;
    }

    /**
     * --- 分组卸载时释放其浮层状态 ---
     * @param index 分组索引
     */
    public unregisterGroup(index: number): void {
        if (this.floatGroup === index) {
            this.closeFloat();
        }
    }

    /** --- 空间不足时按列顺序收起，最后一列优先保留展开 --- */
    public updateColumns(): void {
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
    public toggle(): void {
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
    public toggleFloat(groupIndex: number): void {
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
    public closeFloat(): void {
        this.floatGroup = -1;
    }

    /**
     * --- 获取浮动面板所在的 Dock 内容区 ---
     * @returns Dock 内容区元素
     */
    public getFloatArea(): HTMLElement | null {
        return this.refs.body ?? null;
    }

    /** --- 浮层同时受所属 Form 和浏览器视窗边界约束 --- */
    public getFloatBounds(): { 'left': number; 'right': number; 'top': number; 'bottom': number; } {
        const rect = this.rootForm.element.getBoundingClientRect();
        return {
            'left': Math.max(0, rect.left),
            'right': Math.min(document.documentElement.clientWidth, rect.right),
            'top': Math.max(0, rect.top),
            'bottom': Math.min(document.documentElement.clientHeight, rect.bottom)
        };
    }

    public async onMounted(): Promise<void> {
        const form = this.rootForm;
        if (!formDocks.has(form)) {
            formDocks.set(form, new Set());
        }
        formDocks.get(form)!.add(this);

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
        const handler = (): void => {
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
            const ownerHandler = (): void => {
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
        const viewportHandler = (): void => {
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

    public onUnmounted(): void {
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
