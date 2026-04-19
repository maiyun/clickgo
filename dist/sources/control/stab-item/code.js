import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    /** --- 当前 item 在父容器中的索引 --- */
    index = 0;
    /** --- 父级 stab 控件实例 --- */
    stab = null;
    /** --- 是否处于选中状态 --- */
    get isSelected() {
        return this.stab?.selected === this.index;
    }
    /** --- 父级 stab 的显示类型 --- */
    get type() {
        return (this.stab?.props).type ?? 'default';
    }
    /**
     * --- 更新 rect 模式下的滑块位置到父级 stab ---
     */
    resize() {
        if ((this.stab?.props).type !== 'rect') {
            return;
        }
        this.stab?.select(this.index, this.element.offsetWidth, this.element.offsetLeft);
    }
    /**
     * --- 点击 item 选中 ---
     */
    click() {
        if (!this.stab) {
            return;
        }
        this.stab.select(this.index);
        this.resize();
    }
    onMounted() {
        this.stab = this.parentByName('stab');
        if (!this.stab) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
        // --- 选中时更新 rect 滑块位置 ---
        this.watch('isSelected', () => {
            if (!this.isSelected) {
                return;
            }
            this.resize();
        }, {
            'immediate': true
        });
    }
}
