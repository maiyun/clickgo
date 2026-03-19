import * as clickgo from 'clickgo';
/** --- 同一窗体内的 sform 实例注册表，确保同时只有一个浮动面板打开 --- */
const formSforms = new WeakMap();
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
    /** --- 浮动面板当前选中的 item 索引 --- */
    floatItem = 0;
    /** --- 展开时的宽度 --- */
    get widthComp() {
        if (typeof this.props.width === 'number') {
            return this.props.width.toString() + 'px';
        }
        if (/^\d+$/.test(this.props.width)) {
            return this.props.width + 'px';
        }
        return this.props.width;
    }
    /**
     * --- 切换展开/收起 ---
     */
    toggle() {
        this.expandedData = !this.expandedData;
        this.emit('update:expanded', this.expandedData);
        // --- 收起时关闭浮动面板 ---
        if (!this.expandedData) {
            this.floatGroup = -1;
        }
    }
    /**
     * --- 收起模式下，点击 icon 打开/关闭浮动面板 ---
     * @param groupIndex group 索引
     * @param itemIndex item 索引
     */
    toggleFloat(groupIndex, itemIndex) {
        if (this.floatGroup === groupIndex && this.floatItem === itemIndex) {
            // --- 再次点击同一个则关闭 ---
            this.floatGroup = -1;
            return;
        }
        // --- 关闭同一窗体内其他 sform 的浮动面板 ---
        const siblings = formSforms.get(this.rootForm);
        if (siblings) {
            for (const sform of siblings) {
                if (sform !== this) {
                    sform.floatGroup = -1;
                }
            }
        }
        this.floatGroup = groupIndex;
        this.floatItem = itemIndex;
    }
    /**
     * --- 关闭浮动面板 ---
     */
    closeFloat() {
        this.floatGroup = -1;
    }
    onMounted() {
        // --- 注册到窗体级别的 sform 集合 ---
        const form = this.rootForm;
        if (!formSforms.has(form)) {
            formSforms.set(form, new Set());
        }
        formSforms.get(form).add(this);
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
        formSforms.get(this.rootForm)?.delete(this);
    }
}
