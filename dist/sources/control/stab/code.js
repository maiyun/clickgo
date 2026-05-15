import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
        'change': null
    };
    props = {
        'modelValue': 0,
        'type': 'default'
    };
    /** --- 当前选中值（支持字符串 key 或数字索引） --- */
    selected = 0;
    /** --- rect 模式下滑块宽度 --- */
    tabItemWidth = 0;
    /** --- rect 模式下滑块左偏移 --- */
    tabItemLeft = 0;
    /**
     * --- 由 stab-item 调用，设置选中值并更新 rect 滑块位置 ---
     * @param v 要选中的标识（优先为 stab-item 的 value prop，回退到 DOM 索引）
     * @param width rect 模式下的滑块宽度
     * @param left rect 模式下的滑块左偏移
     */
    select(v, width, left) {
        if (this.selected !== v) {
            const event = {
                'go': true,
                preventDefault: function () {
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
    onMounted() {
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
