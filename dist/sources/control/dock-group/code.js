import * as clickgo from 'clickgo';
import * as resize from './abox/resize';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:height': null,
        'update:collapsed': null,
        'update:modelValue': null
    };
    props = {
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
    access = {
        'cancelResize': null,
        'menuElement': null
    };
    /** --- 用户指定或拖拽得到的分组总高度 --- */
    heightData = 0;
    /** --- 同列分组，按当前 DOM 顺序排列 --- */
    groups = [];
    /** --- 当前分组后面的相邻分组 --- */
    get nextGroup() {
        const index = this.groups.indexOf(this);
        return index < 0 ? null : this.groups[index + 1] ?? null;
    }
    /** --- 分隔条仅在相邻两组均展开且允许调整时显示 --- */
    get canResize() {
        return this.isExpanded && !this.isCollapsed && this.propBoolean('resizable') &&
            !!this.nextGroup?.isExpanded && !this.nextGroup.isCollapsed && this.nextGroup.propBoolean('resizable');
    }
    /** --- 拖拽至少保留标题和一小块内容区域 --- */
    get minimumHeight() {
        const height = this.propNumber('minHeight');
        return Math.max(this.refs.tabs?.offsetHeight + 8 || 30, Number.isFinite(height) ? height : 60);
    }
    /** --- 手动高度优先于 grow；空间不足时仍允许压缩和滚动 --- */
    get groupStyle() {
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
    resizeDown(event) {
        resize.resizeDown(this, event);
    }
    /**
     * --- 使用方向键调整分组高度 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    resizeKeydown(event) {
        resize.resizeKeydown(this, event);
    }
    /**
     * --- 打开当前标签的自定义菜单 ---
     * @param event 菜单按钮事件
     * @returns 无返回值
     */
    menuClick(event) {
        if (!this.slots['menu']) {
            return;
        }
        event.stopPropagation();
        const target = event.currentTarget;
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
    closeMenu() {
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
    menuKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        this.menuClick(event);
    }
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
        const available = this.floatAreaHeight >= 0 ? this.floatAreaHeight : (this.dock?.floatAreaHeight ?? 0);
        const limit = this.propNumber('maxFloatHeight');
        return `${limit > 0 ? Math.min(available, limit) : available}px`;
    }
    /** --- 浮动面板布局样式 --- */
    get floatStyle() {
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
    /**
     * --- 标签过多时用滚轮横向浏览，保留固定高度的标题栏 ---
     * @param event 滚轮事件
     * @returns 无返回值
     */
    tabsWheel(event) {
        const tabs = event.currentTarget;
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
        resize.unregister(this);
        this.closeMenu();
        this.dock?.unregisterGroup(this.index);
    }
    /** --- 动态增删或重排分组后同步分隔条相邻关系 --- */
    onUpdated() {
        resize.refresh(this);
        if (!this.slots['menu']) {
            this.closeMenu();
        }
    }
}
