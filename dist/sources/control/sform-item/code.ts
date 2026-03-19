import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'label': string;
        'icon': string;
    } = {
            'label': '',
            'icon': ''
        };

    /** --- 当前 item 在 group 中的索引 --- */
    public index: number = 0;

    /** --- 父级 sform-group 控件实例 --- */
    public group: any = null;

    /** --- 是否处于选中状态 --- */
    public get isSelected(): boolean {
        return this.group?.selected === this.index;
    }

    public onMounted(): void {
        this.group = this.parentByName('sform-group');
        if (!this.group) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
    }

}
