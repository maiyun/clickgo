import * as clickgo from 'clickgo';

type TDock = clickgo.control.AbstractControl & {
    'expandedData': boolean;
    'narrow': boolean;
    'floatGroup': number;
    'viewportWidth': number;
    'viewportHeight': number;
    'formWidth': number;
    'positionData': 'left' | 'right';
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
        'update:expanded': null
    };

    public props: {
        /** --- expanded，当前列的展开偏好 --- */
        'expanded': boolean | string;
        /** --- width，当前列展开时的像素宽度 --- */
        'width': number | string;
        /** --- label，当前列展开按钮的无障碍名称 --- */
        'label': string;
    } = {
            'expanded': true,
            'width': 280,
            'label': ''
        };

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
        const width = this.propNumber('width');
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
        this.dock?.unregisterColumn(this);
    }

}
