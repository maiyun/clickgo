import * as clickgo from 'clickgo';

type TDock = clickgo.control.AbstractControl & {
    'expandedData': boolean;
    'narrow': boolean;
    'floatGroup': number;
    'viewportWidth': number;
    'viewportHeight': number;
    'formWidth': number;
    'positionData': 'left' | 'right';
    availableWidth(column: clickgo.control.AbstractControl): number;
    refreshLayout(): void;
    registerColumn(column: clickgo.control.AbstractControl): void;
    unregisterColumn(column: clickgo.control.AbstractControl): void;
    registerGroup(): number;
    unregisterGroup(index: number): void;
    toggle(): void;
    toggleFloat(index: number): void;
    closeFloat(): void;
    getFloatBounds(): { 'left': number; 'right': number; 'top': number; 'bottom': number; };
};

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:expanded': null,
        'update:width': null
    };

    public props: {
        /** --- expanded，当前列的展开偏好 --- */
        'expanded': boolean | string;
        /** --- width，当前列展开时的像素宽度 --- */
        'width': number | string;
        /** --- minWidth，拖拽调整列宽的下限，单位为像素 --- */
        'minWidth': number | string;
        /** --- maxWidth，拖拽调整列宽的上限，0 使用可用空间 --- */
        'maxWidth': number | string;
        /** --- resizable，是否允许拖拽调整列宽 --- */
        'resizable': boolean | string;
        /** --- label，当前列展开按钮的无障碍名称 --- */
        'label': string;
    } = {
            'expanded': true,
            'width': 280,
            'minWidth': 160,
            'maxWidth': 0,
            'resizable': true,
            'label': ''
        };

    public access: { 'resizeCancel': (() => void) | null; } = { 'resizeCancel': null };

    /** --- 当前保存的展开宽度 --- */
    public widthData: number | string = 280;

    /** --- 所属 Dock，所有列共享浮层调度和 Form 尺寸监听 --- */
    public dock: TDock | null = null;

    /** --- 用户的展开偏好与自动收起状态分别保留 --- */
    public expandedPreference = true;

    /** --- 当前列是否因布局空间不足而收起 --- */
    public autoCollapsed = false;

    /** --- 当前列浮层可使用的内容区高度 --- */
    public floatAreaHeight = 0;

    /** --- 展开时的像素宽度 --- */
    public get preferredWidth(): number {
        const width = typeof this.widthData === 'number' ? this.widthData : parseFloat(this.widthData);
        return Number.isFinite(width) && (width > 0) ? Math.max(40, width) : 280;
    }

    public get widthComp(): string {
        return `${this.preferredWidth}px`;
    }

    public get expandedData(): boolean {
        return (this.dock?.expandedData ?? true) && this.expandedPreference && !this.autoCollapsed;
    }

    public get narrow(): boolean {
        return (this.dock?.narrow ?? false) || this.autoCollapsed;
    }

    public get positionData(): 'left' | 'right' {
        return this.dock?.positionData ?? 'right';
    }

    public get floatGroup(): number {
        return this.dock?.floatGroup ?? -1;
    }

    public get viewportWidth(): number {
        return this.dock?.viewportWidth ?? 0;
    }

    public get viewportHeight(): number {
        return this.dock?.viewportHeight ?? 0;
    }

    public get formWidth(): number {
        return this.dock?.formWidth ?? 0;
    }

    /** --- 当前可拖拽宽度范围 --- */
    public get resizeBounds(): { 'min': number; 'max': number; } {
        const maxProp = this.propNumber('maxWidth');
        const max = Math.max(0, Math.min(maxProp > 0 ? maxProp : Infinity, this.dock?.availableWidth(this) ?? 0));
        return { 'min': Math.min(max, Math.max(40, this.propNumber('minWidth') || 0)), 'max': max };
    }

    /**
     * --- 拖动当前列的工作区边缘 ---
     * @param event 指针按下事件
     * @returns 无返回值
     */
    public resizeWidth(event: PointerEvent): void {
        if (!this.propBoolean('resizable') || !this.expandedData || !this.dock || event.button !== 0) {
            return;
        }
        event.preventDefault();
        this.cancelResize();
        this.dock.refreshLayout();
        if (!this.expandedData) {
            return;
        }
        const initial = this.element.getBoundingClientRect().width;
        const original = this.widthData;
        const start = event.clientX;
        const direction = (this.positionData === 'left') !== (this.localeDirection === 'rtl') ? 1 : -1;
        const bounds = this.resizeBounds;
        if (bounds.max < 40) {
            return;
        }
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
     * --- 用方向键调整当前列宽度 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    public resizeKey(event: KeyboardEvent): void {
        if (!this.propBoolean('resizable') || !this.expandedData || !this.dock ||
            (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
            return;
        }
        event.preventDefault();
        this.cancelResize();
        this.dock.refreshLayout();
        if (!this.expandedData) {
            return;
        }
        const direction = (this.positionData === 'left') !== (this.localeDirection === 'rtl') ? 1 : -1;
        const bounds = this.resizeBounds;
        if (bounds.max < 40) {
            return;
        }
        const delta = event.key === 'ArrowRight' ? 10 : -10;
        const width = Math.min(bounds.max, Math.max(bounds.min,
            Math.round(this.element.getBoundingClientRect().width + delta * direction)));
        this.widthData = width;
        this.emit('update:width', width);
    }

    /**
     * --- 取消当前宽度拖拽 ---
     * @returns 无返回值
     */
    public cancelResize(): void {
        this.access.resizeCancel?.();
    }

    /** --- 切换当前列，自动收起时由图标打开浮层 --- */
    public toggle(): void {
        if (this.narrow) {
            return;
        }
        if (this.dock && !this.dock.expandedData) {
            this.dock.toggle();
            return;
        }
        this.expandedPreference = !this.expandedPreference;
        this.dock?.closeFloat();
        this.emit('update:expanded', this.expandedPreference);
    }

    public registerGroup(): number {
        // --- 子分组先于列执行 mounted，索引分配不能等待列的 mounted。 ---
        this.dock ??= this.parentByName('dock') as TDock | null;
        return this.dock?.registerGroup() ?? 0;
    }

    public unregisterGroup(index: number): void {
        this.dock?.unregisterGroup(index);
    }

    public toggleFloat(index: number): void {
        this.dock?.toggleFloat(index);
    }

    public getFloatArea(): HTMLElement | null {
        return this.refs.body ?? null;
    }

    public getFloatBounds(): { 'left': number; 'right': number; 'top': number; 'bottom': number; } {
        return this.dock?.getFloatBounds() ?? {
            'left': 0,
            'right': document.documentElement.clientWidth,
            'top': 0,
            'bottom': document.documentElement.clientHeight
        };
    }

    public onMounted(): void {
        this.dock = this.parentByName('dock') as TDock | null;
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
            this.cancelResize();
        });
        this.watch('expanded', () => {
            this.expandedPreference = this.propBoolean('expanded');
        }, {
            'immediate': true
        });
        this.dock?.registerColumn(this);
        clickgo.dom.watchSize(this, this.refs.body, () => {
            this.floatAreaHeight = this.refs.body.clientHeight;
        }, true);
    }

    public onUnmounted(): void {
        this.access.resizeCancel?.();
        this.dock?.unregisterColumn(this);
    }

}
