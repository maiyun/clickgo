import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    /** --- 当前 item 在父容器中的索引 --- */
    public index: number = 0;

    /** --- 父级 stab 控件实例 --- */
    public stab: any = null;

    /** --- 是否处于选中状态 --- */
    public get isSelected(): boolean {
        return this.stab?.selected === this.index;
    }

    /** --- 父级 stab 的显示类型 --- */
    public get type(): string {
        return this.stab?.props.type ?? 'default';
    }

    /**
     * --- 更新 rect 模式下的滑块位置到父级 stab ---
     */
    public resize(): void {
        if (!this.stab || this.stab.props.type !== 'rect') {
            return;
        }
        this.stab.select(this.index, this.element.offsetWidth, this.element.offsetLeft);
    }

    /**
     * --- 点击 item 选中 ---
     */
    public click(): void {
        if (!this.stab) {
            return;
        }
        this.stab.select(this.index);
        this.resize();
    }

    public onMounted(): void | Promise<void> {
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
