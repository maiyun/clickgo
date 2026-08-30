import * as clickgo from 'clickgo';
/** --- 同一窗体内的 Dock 实例注册表，确保同时只有一个浮动面板打开 --- */
const formDocks = new WeakMap();
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:expanded': null
    };
    props = {
        'expanded': true,
        'width': 280
    };
    /** --- 当前是否展开 --- */
    expandedData = true;
    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    floatGroup = -1;
    /** --- 展开时的宽度 --- */
    get widthComp() {
        if (typeof this.props.width === 'number') {
            return `${this.props.width}px`;
        }
        if (/^\d+$/.test(this.props.width)) {
            return `${this.props.width}px`;
        }
        return this.props.width;
    }
    /** --- 切换展开/收起 --- */
    toggle() {
        this.expandedData = !this.expandedData;
        this.emit('update:expanded', this.expandedData);
        if (!this.expandedData) {
            this.floatGroup = -1;
        }
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
    onMounted() {
        const form = this.rootForm;
        if (!formDocks.has(form)) {
            formDocks.set(form, new Set());
        }
        formDocks.get(form).add(this);
        this.watch('expanded', () => {
            this.expandedData = this.propBoolean('expanded');
            if (!this.expandedData) {
                this.floatGroup = -1;
            }
        }, {
            'immediate': true
        });
    }
    onUnmounted() {
        const siblings = formDocks.get(this.rootForm);
        siblings?.delete(this);
        if (!siblings?.size) {
            formDocks.delete(this.rootForm);
        }
    }
}
