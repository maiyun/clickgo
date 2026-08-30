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
    }
}
