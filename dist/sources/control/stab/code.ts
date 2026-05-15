import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null,
        'change': null
    };

    public props: {
        'modelValue': number | string;
        'type': 'default' | 'plain' | 'light' | 'rect';
    } = {
            'modelValue': 0,
            'type': 'default'
        };

    /** --- 当前选中值（支持字符串 key 或数字索引） --- */
    public selected: number | string = 0;

    /** --- rect 模式下滑块宽度 --- */
    public tabItemWidth: number = 0;

    /** --- rect 模式下滑块左偏移 --- */
    public tabItemLeft: number = 0;

    /**
     * --- 由 stab-item 调用，设置选中值并更新 rect 滑块位置 ---
     * @param v 要选中的标识（优先为 stab-item 的 value prop，回退到 DOM 索引）
     * @param width rect 模式下的滑块宽度
     * @param left rect 模式下的滑块左偏移
     */
    public select(v: number | string, width?: number, left?: number): void {
        if (this.selected !== v) {
            const event: clickgo.control.IStabChangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': v
                },
            };
            this.emit('change', event);
            if (!event.go) {
                return;
            }
            this.selected = v;
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
            const v = this.props.modelValue;
            if (this.selected === v) {
                return;
            }
            this.selected = v;
        }, {
            'immediate': true
        });
    }

}
