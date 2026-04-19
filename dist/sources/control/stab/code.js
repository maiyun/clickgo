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
    /** --- 当前选中索引 --- */
    selected = 0;
    /** --- rect 模式下滑块宽度 --- */
    tabItemWidth = 0;
    /** --- rect 模式下滑块左偏移 --- */
    tabItemLeft = 0;
    /**
     * --- 由 stab-item 调用，设置选中索引并更新 rect 滑块位置 ---
     * @param index 要选中的索引
     * @param width rect 模式下的滑块宽度
     * @param left rect 模式下的滑块左偏移
     */
    select(index, width, left) {
        if (this.selected !== index) {
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'value': index
                },
            };
            this.emit('change', event);
            if (!event.go) {
                return;
            }
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
    onMounted() {
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
