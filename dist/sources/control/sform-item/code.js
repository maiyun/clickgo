import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'label': '',
        'icon': ''
    };
    /** --- 当前 item 在 group 中的索引 --- */
    index = 0;
    /** --- 父级 sform-group 控件实例 --- */
    group = null;
    /** --- 是否处于选中状态 --- */
    get isSelected() {
        return this.group?.selected === this.index;
    }
    onMounted() {
        this.group = this.parentByName('sform-group');
        if (!this.group) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
    }
}
