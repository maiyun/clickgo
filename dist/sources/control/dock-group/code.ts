import * as clickgo from 'clickgo';
import * as resize from './abox/resize';
import type { IDockGroupSizing } from './lib/resize';

interface IDockItemInfo {
    'name': string;
    'label': string;
    'icon': string;
}

type TDock = clickgo.control.AbstractControl & {
    'expandedData': boolean;
    'floatGroup': number;
    'floatAreaHeight': number;
    'viewportWidth': number;
    'viewportHeight': number;
    'formWidth': number;
    'positionData': 'left' | 'right';
    'widthComp': string;
    getFloatArea(): HTMLElement | null;
    getFloatBounds?(): { 'left': number; 'right': number; 'top': number; 'bottom': number; };
    registerGroup(): number;
    unregisterGroup(index: number): void;
    toggleFloat(groupIndex: number): void;
};

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:height': null,
        'update:collapsed': null,
        'update:modelValue': null
    };

    public props: {
        /** --- height，分组总高度，0 为自动布局 --- */
        'height': number | string;
        /** --- minHeight，拖拽时分组总高度下限 --- */
        'minHeight': number | string;
        /** --- resizable，是否允许拖拽调整分组高度 --- */
        'resizable': boolean | string;
        /** --- maxFloatHeight，浮层高度上限，0 使用可用空间 --- */
        'maxFloatHeight': number | string;
        /** --- collapsed，当前分组是否折叠 --- */
        'collapsed': boolean | string;
        /** --- collapsible，当前分组是否允许折叠 --- */
        'collapsible': boolean | string;
        /** --- grow，当前分组是否优先占用 Dock 的剩余高度 --- */
        'grow': boolean | string;
        /** --- modelValue，当前选中的 Dock Item 名称 --- */
        'modelValue': string;
    } = {
            'height': 0,
            'minHeight': 60,
            'resizable': true,
            'maxFloatHeight': 0,
            'collapsed': false,
            'collapsible': true,
            'grow': false,
            'modelValue': ''
        };

    /** --- 不参与响应式处理的拖拽会话和菜单元素 --- */
    public access: IDockGroupSizing['access'] & { 'menuElement': HTMLElement | null; } = {
        'cancelResize': null,
        'menuElement': null
    };

    /** --- 用户指定或拖拽得到的分组总高度 --- */
    public heightData = 0;

    /** --- 同列分组，按当前 DOM 顺序排列 --- */
    public groups: IDockGroupSizing[] = [];

    /** --- 当前分组后面的相邻分组 --- */
    public get nextGroup(): IDockGroupSizing | null {
        const index = this.groups.indexOf(this);
        return index < 0 ? null : this.groups[index + 1] ?? null;
    }

    /** --- 分隔条仅在相邻两组均展开且允许调整时显示 --- */
    public get canResize(): boolean {
        return this.isExpanded && !this.isCollapsed && this.propBoolean('resizable') &&
            !!this.nextGroup?.isExpanded && !this.nextGroup.isCollapsed && this.nextGroup.propBoolean('resizable');
    }

    /** --- 拖拽至少保留标题和一小块内容区域 --- */
    public get minimumHeight(): number {
        const height = this.propNumber('minHeight');
        return Math.max(this.refs.tabs?.offsetHeight + 8 || 30, Number.isFinite(height) ? height : 60);
    }

    /** --- 手动高度优先于 grow；空间不足时仍允许压缩和滚动 --- */
    public get groupStyle(): Record<string, string> | undefined {
        if (!this.isExpanded || this.isCollapsed || !this.heightData) {
            return undefined;
        }
        return { 'flex': `0 1 ${this.heightData}px` };
    }

    /**
     * --- 调整本组与下一组的高度 ---
     * @param event 指针事件
     * @returns 无返回值
     */
    public resizeDown(event: PointerEvent): void {
        resize.resizeDown(this, event);
    }

    /**
     * --- 使用方向键调整分组高度 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    public resizeKeydown(event: KeyboardEvent): void {
        resize.resizeKeydown(this, event);
    }

    /**
     * --- 打开当前标签的自定义菜单 ---
     * @param event 菜单按钮事件
     * @returns 无返回值
     */
    public menuClick(event: MouseEvent | KeyboardEvent): void {
        if (!this.slots['menu']) {
            return;
        }
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        if (target.dataset.cgPopOpen !== undefined) {
            this.closeMenu();
            return;
        }
        this.access.menuElement = this.refs.menu;
        clickgo.form.showPop(target, this.refs.menu, 'v', { 'autoScroll': true, 'way': 'click' });
    }

    /**
     * --- 关闭菜单并释放打开时的元素引用 ---
     * @returns 无返回值
     */
    public closeMenu(): void {
        if (!this.access.menuElement) {
            return;
        }
        clickgo.form.hidePop(this.access.menuElement);
        this.access.menuElement = null;
    }

    /**
     * --- 键盘打开菜单，焦点与关闭由框架浮层管理 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    public menuKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        this.menuClick(event);
    }

    /** --- 当前选中的 item name --- */
    public selectedData: string = '';

    /** --- 当前分组是否折叠 --- */
    public collapsedData: boolean = false;

    /** --- 父级 Dock --- */
    public dock: TDock | null = null;

    /** --- 当前 group 在 Dock 中的索引 --- */
    public index: number = 0;

    /** --- 浮动面板相对当前分组的顶部偏移 --- */
    public floatTop: number = 0;

    /** --- 浮动面板在当前视窗中可使用的最大宽度 --- */
    public floatMaxWidth: number = -1;

    /** --- 与 Form 和视窗交集相交后的浮动内容区高度 --- */
    public floatAreaHeight: number = -1;

    /** --- 是否处于展开模式 --- */
    public get isExpanded(): boolean {
        return this.dock?.expandedData ?? true;
    }

    /** --- 是否正在浮动显示 --- */
    public get isFloating(): boolean {
        return !this.isExpanded && (this.dock?.floatGroup === this.index);
    }

    /** --- 当前展开 Dock 中的分组是否折叠 --- */
    public get isCollapsed(): boolean {
        return this.isExpanded && this.collapsedData;
    }

    /** --- 当前分组是否允许折叠 --- */
    public get canCollapse(): boolean {
        return this.propBoolean('collapsible');
    }

    /** --- 当前分组是否优先占用剩余高度 --- */
    public get canGrow(): boolean {
        return this.propBoolean('grow');
    }

    /** --- 浮动面板宽度 --- */
    public get floatWidth(): string {
        return this.dock?.widthComp ?? '280px';
    }

    /** --- 浮动面板相对折叠侧栏的展开方向 --- */
    public get floatPosition(): 'left' | 'right' {
        return this.dock?.positionData ?? 'right';
    }

    /** --- 浮动面板最大高度 --- */
    public get floatMaxHeight(): string {
        const available = this.floatAreaHeight >= 0 ? this.floatAreaHeight : (this.dock?.floatAreaHeight ?? 0);
        const limit = this.propNumber('maxFloatHeight');
        return `${limit > 0 ? Math.min(available, limit) : available}px`;
    }

    /** --- 浮动面板布局样式 --- */
    public get floatStyle(): Record<string, string> | undefined {
        if (!this.isFloating) {
            return undefined;
        }
        return {
            'width': this.floatWidth,
            'max-height': this.floatMaxHeight,
            'max-width': this.floatMaxWidth >= 0 ? `${this.floatMaxWidth}px` : 'calc(100vw - 40px)',
            'top': `${this.floatTop}px`
        };
    }

    /** --- 子项信息列表 --- */
    public get items(): IDockItemInfo[] {
        const list: IDockItemInfo[] = [];
        for (const item of this.slotsAll('default')) {
            if (!item.props?.name) {
                continue;
            }
            list.push({
                'name': item.props.name,
                'label': item.props.label ?? item.props.name,
                'icon': item.props.icon ?? ''
            });
        }
        return list;
    }

    /** --- 将当前选中项修正到有效 name --- */
    public normalizeSelected(): void {
        if (this.items.some(item => item.name === this.selectedData)) {
            return;
        }
        this.selectedData = this.items[0]?.name ?? '';
    }

    /**
     * --- 选中一个 Dock Item ---
     * @param name item name
     */
    public select(name: string): void {
        if (this.selectedData === name) {
            return;
        }
        this.selectedData = name;
        this.emit('update:modelValue', name);
    }

    /**
     * --- 标签过多时用滚轮横向浏览，保留固定高度的标题栏 ---
     * @param event 滚轮事件
     * @returns 无返回值
     */
    public tabsWheel(event: WheelEvent): void {
        const tabs = event.currentTarget as HTMLElement;
        if (tabs.scrollWidth <= tabs.clientWidth) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        let delta = event.deltaX || event.deltaY;
        if (event.deltaX && this.localeDirection === 'rtl') {
            delta = -delta;
        }
        clickgo.dom.setScrollInlineOffset(tabs, clickgo.dom.getScrollInlineOffset(tabs) + delta);
    }

    /** --- 切换当前分组折叠状态 --- */
    public toggleCollapsed(): void {
        if (!this.canCollapse) {
            return;
        }
        this.collapsedData = !this.collapsedData;
        this.emit('update:collapsed', this.collapsedData);
    }

    /**
     * --- 收起模式下点击图标 ---
     * @param name item name
     */
    public iconClick(name: string): void {
        if (!this.dock) {
            return;
        }
        if (!this.isFloating || this.selectedData === name) {
            this.dock.toggleFloat(this.index);
        }
        this.select(name);
    }

    /**
     * --- 标签、收起图标和折叠按钮支持键盘操作 ---
     * @param event 键盘事件
     * @param name 标签名称；省略时切换分组折叠
     * @param floating 是否操作收起模式的图标
     */
    public activateKeydown(event: KeyboardEvent, name?: string, floating = false): void {
        if ((event.key !== 'Enter') && (event.key !== ' ')) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (name === undefined) {
            this.toggleCollapsed();
        }
        else if (floating) {
            this.iconClick(name);
        }
        else {
            this.select(name);
        }
    }

    /** --- 根据 Dock 内容区自动调整浮动面板高度和垂直位置 --- */
    public updateFloatLayout(): void {
        if (!this.isFloating || !this.dock) {
            this.floatTop = 0;
            return;
        }
        const area = this.dock.getFloatArea();
        const content = this.refs.content;
        if (!area || !content) {
            return;
        }
        const areaRect = area.getBoundingClientRect();
        const groupRect = this.element.getBoundingClientRect();
        const opensInlineEnd = this.floatPosition === 'left';
        const opensRight = opensInlineEnd !== clickgo.dom.isRtl(this.element);
        const bounds = this.dock.getFloatBounds?.() ?? {
            'left': 0,
            'right': document.documentElement.clientWidth,
            'top': areaRect.top,
            'bottom': areaRect.bottom
        };
        this.floatMaxWidth = Math.max(0, opensRight ?
            bounds.right - areaRect.right : areaRect.left - bounds.left);
        const top = Math.max(areaRect.top, bounds.top);
        const bottom = Math.min(areaRect.bottom, bounds.bottom);
        this.floatAreaHeight = Math.max(0, bottom - top);
        const topLimit = top - groupRect.top;
        const bottomLimit = bottom - groupRect.top - Math.min(content.offsetHeight, this.floatAreaHeight);
        this.floatTop = Math.max(topLimit, Math.min(0, bottomLimit));
    }

    public onMounted(): void {
        this.dock = (this.parentByName('dock-column') ?? this.parentByName('dock')) as TDock | null;
        if (this.dock) {
            this.index = this.dock.registerGroup();
        }
        resize.register(this);
        this.watch('height', () => {
            this.access.cancelResize?.();
            const height = this.propNumber('height');
            this.heightData = Number.isFinite(height) ? Math.max(0, height) : 0;
        }, { 'immediate': true });
        this.watch(() => [
            this.isExpanded, this.isCollapsed, this.propBoolean('resizable'), this.canResize,
            this.dock?.floatAreaHeight, this.props.minHeight
        ], () => {
            this.access.cancelResize?.();
        });
        this.watch(() => [this.selectedData, this.isExpanded, this.isFloating], () => {
            this.closeMenu();
        });
        this.watch('modelValue', () => {
            this.selectedData = this.props.modelValue;
            this.normalizeSelected();
        }, {
            'immediate': true
        });
        this.watch('collapsed', () => {
            this.collapsedData = this.propBoolean('collapsed');
        }, {
            'immediate': true
        });
        this.watch(() => this.items.map(item => item.name), () => {
            this.normalizeSelected();
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch(() => this.isFloating, () => {
            this.nextTick().then(() => {
                this.updateFloatLayout();
            }).catch(() => {});
        }, {
            'immediate': true
        });
        this.watch(() => [
            this.dock?.floatAreaHeight,
            this.dock?.viewportWidth,
            this.dock?.viewportHeight,
            this.dock?.formWidth,
            this.floatPosition,
            this.localeDirection
        ], () => {
            this.nextTick().then(() => {
                this.updateFloatLayout();
            }).catch(() => {});
        });
        clickgo.dom.watchSize(this, this.refs.content, () => {
            this.updateFloatLayout();
        });
    }

    public onUnmounted(): void {
        resize.unregister(this);
        this.closeMenu();
        this.dock?.unregisterGroup(this.index);
    }

    /** --- 动态增删或重排分组后同步分隔条相邻关系 --- */
    public onUpdated(): void {
        resize.refresh(this);
        if (!this.slots['menu']) {
            this.closeMenu();
        }
    }

}
