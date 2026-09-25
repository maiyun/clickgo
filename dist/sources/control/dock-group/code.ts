import * as clickgo from 'clickgo';

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
    'positionData': 'left' | 'right';
    'widthComp': string;
    getFloatArea(): HTMLElement | null;
    toggleFloat(groupIndex: number): void;
};

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:collapsed': null,
        'update:modelValue': null
    };

    public props: {
        /** --- collapsed，当前分组是否折叠 --- */
        'collapsed': boolean | string;
        /** --- collapsible，当前分组是否允许折叠 --- */
        'collapsible': boolean | string;
        /** --- grow，当前分组是否优先占用 Dock 的剩余高度 --- */
        'grow': boolean | string;
        /** --- modelValue，当前选中的 Dock Item 名称 --- */
        'modelValue': string;
    } = {
            'collapsed': false,
            'collapsible': true,
            'grow': false,
            'modelValue': ''
        };

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
    public floatMaxWidth: number = 0;

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
        if (!this.dock?.floatAreaHeight) {
            return '400px';
        }
        return `${Math.min(this.dock.floatAreaHeight, 400)}px`;
    }

    /** --- 浮动面板布局样式 --- */
    public get floatStyle(): Record<string, string> | undefined {
        if (!this.isFloating) {
            return undefined;
        }
        return {
            'width': this.floatWidth,
            'height': this.floatMaxHeight,
            'max-height': this.floatMaxHeight,
            'max-width': this.floatMaxWidth ? `${this.floatMaxWidth}px` : 'calc(100vw - 40px)',
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
        const opening = !this.isFloating || (this.selectedData !== name);
        if (!this.isFloating) {
            this.dock.toggleFloat(this.index);
        }
        else if (!opening) {
            this.dock.toggleFloat(this.index);
        }
        this.select(name);
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
        this.floatMaxWidth = Math.max(0, opensRight ?
            document.documentElement.clientWidth - areaRect.right : areaRect.left);
        const topLimit = areaRect.top - groupRect.top;
        const bottomLimit = areaRect.bottom - groupRect.top - content.offsetHeight;
        this.floatTop = Math.max(topLimit, Math.min(0, bottomLimit));
    }

    public onMounted(): void {
        this.dock = this.parentByName('dock') as TDock | null;
        if (this.dock) {
            this.index = clickgo.dom.index(this.element);
        }
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

}
