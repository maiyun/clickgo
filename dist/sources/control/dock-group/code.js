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
    /** --- 是否处于展开模式 --- */
    get isExpanded() {
        return this.dock?.expandedData ?? true;
    }
    /** --- 是否正在浮动显示 --- */
    get isFloating() {
        return this.dock?.floatGroup === this.index;
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
        return {
            'width': this.floatWidth,
            'height': this.floatMaxHeight,
            'max-height': this.floatMaxHeight,
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
        const topLimit = areaRect.top - groupRect.top;
        const bottomLimit = areaRect.bottom - groupRect.top - content.offsetHeight;
        this.floatTop = Math.max(topLimit, Math.min(0, bottomLimit));
    }
    onMounted() {
        this.dock = this.parentByName('dock');
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
            }).catch(() => { });
        }, {
            'immediate': true
        });
        this.watch(() => this.dock?.floatAreaHeight, () => {
            this.nextTick().then(() => {
                this.updateFloatLayout();
            }).catch(() => { });
        });
        clickgo.dom.watchSize(this, this.refs.content, () => {
            this.updateFloatLayout();
        });
    }
}
