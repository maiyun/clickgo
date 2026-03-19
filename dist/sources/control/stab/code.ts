import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null
    };

    public props: {
        'modelValue': number;
        'type': 'default' | 'plain' | 'light' | 'rect';
    } = {
            'modelValue': 0,
            'type': 'default'
        };

    /** --- 当前选中索引 --- */
    public selected: number = 0;

    /** --- rect 模式下滑块宽度 --- */
    public tabItemWidth: number = 0;

    /** --- rect 模式下滑块左偏移 --- */
    public tabItemLeft: number = 0;

    /**
     * --- 由 stab-item 调用，设置选中索引并更新 rect 滑块位置 ---
     * @param index 要选中的索引
     * @param width rect 模式下的滑块宽度
     * @param left rect 模式下的滑块左偏移
     */
    public select(index: number, width?: number, left?: number): void {
        if (this.selected !== index) {
            this.selected = index;
            this.emit('update:modelValue', this.selected);
        }
        if (width !== undefined) {
            this.tabItemWidth = width;
        }
        if (left !== undefined) {
            this.tabItemLeft = left;
        }
    }

    public onMounted(): void | Promise<void> {
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
