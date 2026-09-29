import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:collapsed': null,
        'update:modelValue': null
    };
    props = {
        'collapsed': false,
        'collapsible': true,
        'grow': false,
        'modelValue': ''
    };
    /** --- 当前选中的 item name --- */
    selectedData = '';
    /** --- 当前分组是否折叠 --- */
    collapsedData = false;
    /** --- 父级 Dock --- */
    dock = null;
    /** --- 当前 group 在 Dock 中的索引 --- */
    index = 0;
    /** --- 浮动面板相对当前分组的顶部偏移 --- */
    floatTop = 0;
    /** --- 浮动面板在当前视窗中可使用的最大宽度 --- */
    floatMaxWidth = -1;
    /** --- 与 Form 和视窗交集相交后的浮动内容区高度 --- */
    floatAreaHeight = -1;
    /** --- 是否处于展开模式 --- */
    get isExpanded() {
        return this.dock?.expandedData ?? true;
    }
    /** --- 是否正在浮动显示 --- */
    get isFloating() {
        return !this.isExpanded && (this.dock?.floatGroup === this.index);
    }
    /** --- 当前展开 Dock 中的分组是否折叠 --- */
    get isCollapsed() {
        return this.isExpanded && this.collapsedData;
    }
    /** --- 当前分组是否允许折叠 --- */
    get canCollapse() {
        return this.propBoolean('collapsible');
    }
    /** --- 当前分组是否优先占用剩余高度 --- */
    get canGrow() {
        return this.propBoolean('grow');
    }
    /** --- 浮动面板宽度 --- */
    get floatWidth() {
        return this.dock?.widthComp ?? '280px';
    }
    /** --- 浮动面板相对折叠侧栏的展开方向 --- */
    get floatPosition() {
        return this.dock?.positionData ?? 'right';
    }
    /** --- 浮动面板最大高度 --- */
    get floatMaxHeight() {
        if (this.floatAreaHeight >= 0) {
            return `${Math.min(this.floatAreaHeight, 400)}px`;
        }
        if (!this.dock?.floatAreaHeight) {
            return '400px';
        }
        return `${Math.min(this.dock.floatAreaHeight, 400)}px`;
    }
    /** --- 浮动面板布局样式 --- */
    get floatStyle() {
        if (!this.isFloating) {
            return undefined;
        }
        const style = {
            'width': this.floatWidth,
            'max-height': this.floatMaxHeight,
            'max-width': this.floatMaxWidth >= 0 ? `${this.floatMaxWidth}px` : 'calc(100vw - 40px)',
            'top': `${this.floatTop}px`
        };
        if (this.canGrow) {
            style.height = this.floatMaxHeight;
        }
        return style;
    }
    /** --- 子项信息列表 --- */
    get items() {
        const list = [];
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
    normalizeSelected() {
        if (this.items.some(item => item.name === this.selectedData)) {
            return;
        }
        this.selectedData = this.items[0]?.name ?? '';
    }
    /**
     * --- 选中一个 Dock Item ---
     * @param name item name
     */
    select(name) {
        if (this.selectedData === name) {
            return;
        }
        this.selectedData = name;
        this.emit('update:modelValue', name);
    }
    /** --- 切换当前分组折叠状态 --- */
    toggleCollapsed() {
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
    iconClick(name) {
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
    /**
     * --- 标签、收起图标和折叠按钮支持键盘操作 ---
     * @param event 键盘事件
     * @param name 标签名称；省略时切换分组折叠
     * @param floating 是否操作收起模式的图标
     */
    activateKeydown(event, name, floating = false) {
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
    updateFloatLayout() {
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
    onMounted() {
        this.dock = (this.parentByName('dock-column') ?? this.parentByName('dock'));
        if (this.dock) {
            this.index = this.dock.registerGroup();
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
            }).catch(() => { });
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
            }).catch(() => { });
        });
        clickgo.dom.watchSize(this, this.refs.content, () => {
            this.updateFloatLayout();
        });
    }
    onUnmounted() {
        this.dock?.unregisterGroup(this.index);
    }
}
