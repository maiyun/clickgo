import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'changed': null,
            'update:modelValue': null,
        };
        this.props = {
            'disabled': false,
            'mode': 'hsl',
            'modelValue': '',
        };
        /** ---调色板的 changed --- */
        this.paletteChanged = {
            'detail': {
                'value': '',
                'hsl': undefined,
                'rgb': undefined
            }
        };
        /** --- 调色板 颜色 --- */
        this.color = '';
        this.value = '';
    }
    /** --- 调色板确定 --- */
    ok() {
        if (this.value !== this.color) {
            this.value = this.color;
            this.emit('update:modelValue', this.value);
            this.emit('changed', this.paletteChanged);
        }
        clickgo.form.hidePop(this.element);
    }
    // --- 单击事件 ---
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    /** --- 调色板 changed 事件 --- */
    changed(e) {
        this.paletteChanged = e;
    }
    onMounted() {
        this.watch('modelValue', async () => {
            if (this.props.modelValue === this.value) {
                return;
            }
            this.value = this.props.modelValue;
            this.color = this.props.modelValue;
            await this.nextTick();
            this.ok();
        }, {
            'immediate': true
        });
        this.watch('mode', async () => {
            await this.nextTick();
            this.ok();
        });
    }
}
