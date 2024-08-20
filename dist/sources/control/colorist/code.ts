import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,

        'update:modelValue': null,
    };

    public props: {
        'disabled': boolean | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': string;
    } = {
            'disabled': false,

            'modelValue': '',
        };

    /** ---调色板的 changed --- */
    public paletteChanged: types.IColoristChangedEvent = {
        'detail': {
            'value': '',
            'hsl': undefined,
            'rgb': undefined
        }
    };

    /** --- 调色板 颜色 --- */
    public color = '';

    public value = '';

    /** --- 调色板确定 --- */
    public ok(): void {
        if (this.value === this.color) {
            return;
        }
        this.value = this.color;
        this.emit('update:modelValue', this.value);
        this.emit('changed', this.paletteChanged);
        clickgo.form.hidePop(this.element);
    }

    // --- 单击事件 ---
    public down(e: MouseEvent | TouchEvent): void {
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
    public changed(e: types.IPaletteChangedEvent): void {
        this.paletteChanged = e;
    }

    public onMounted(): void {
        this.watch('modelValue', () => {
            if (this.props.modelValue === this.value) {
                return;
            }
            this.value = this.props.modelValue;
            this.color = this.props.modelValue;
        }, {
            'immediate': true
        });
    }

}
