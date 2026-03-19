import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null
    };
    props = {
        'modelValue': 0
    };
    /** --- 当前选中的 item 索引 --- */
    selected = 0;
    /** --- 父级 sform 控件实例 --- */
    sform = null;
    /** --- 当前 group 在 sform 中的索引 --- */
    index = 0;
    /** --- 是否处于展开模式 --- */
    get isExpanded() {
        return this.sform?.expandedData ?? true;
    }
    /** --- 是否正在浮动显示 --- */
    get isFloating() {
        return this.sform?.floatGroup === this.index;
    }
    /** --- 获取子项信息列表 --- */
    get items() {
        const list = [];
        const els = this.slotsAll('default');
        for (const el of els) {
            if (!el.props) {
                continue;
            }
            list.push({
                'label': el.props.label ?? '',
                'icon': el.props.icon ?? ''
            });
        }
        return list;
    }
    /**
     * --- 选中某个 item ---
     * @param index 要选中的索引
     */
    select(index) {
        if (this.selected === index) {
            return;
        }
        this.selected = index;
        this.emit('update:modelValue', this.selected);
    }
    /**
     * --- 收起模式下点击 icon，通知父级 sform 打开浮动面板 ---
     * @param index 点击的 item 索引
     */
    iconClick(index) {
        if (!this.sform) {
            return;
        }
        this.sform.toggleFloat(this.index, index);
        // --- 如果当前 group 正在浮动，则选中点击的 item ---
        if (this.isFloating) {
            this.select(index);
        }
    }
    /**
     * --- 浮动面板中点击 tab 切换选中项 ---
     * @param index tab 索引
     */
    floatTabClick(index) {
        this.select(index);
        if (this.sform) {
            this.sform.floatItem = index;
        }
    }
    onMounted() {
        this.sform = this.parentByName('sform');
        if (this.sform) {
            this.index = clickgo.dom.index(this.element);
        }
        this.watch('modelValue', () => {
            const v = Number(this.props.modelValue);
            if (this.selected === v) {
                return;
            }
            this.selected = v;
        }, {
            'immediate': true
        });
    }
}
