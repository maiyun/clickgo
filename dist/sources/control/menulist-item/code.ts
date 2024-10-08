import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'check': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;

        'alt': string;
        'type': string;
        'label': string;
        'modelValue': string | boolean;
    } = {
            'disabled': false,

            'alt': '',
            'type': '',
            'label': '',
            'modelValue': ''
        };

    /** --- 当前本地的值 --- */
    public value: string | boolean = '';

    public enter(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }

    public touch(): void {
        // --- 只有 touchstart 才显示，因为 PC 的 mouseenter 已经显示过了 ---
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }

    public click(): void {
        if (!this.props.type) {
            if (!this.slots['pop']) {
                // --- 没有下层，则隐藏所有 pop ---
                clickgo.form.hidePop();
            }
            return;
        }
        // --- 有 type ---
        if (this.props.type) {
            const event: types.IMenulistItemCheckEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': this.value,
                    'label': undefined
                }
            };
            if (this.props.type === 'radio') {
                event.detail.label = this.props.label;
                this.emit('check', event, this.value, this.props.label);
                if (event.go) {
                    this.value = this.props.label;
                    this.emit('update:modelValue', this.value);
                }
            }
            else if (this.props.type === 'check') {
                this.emit('check', event, this.value);
                if (event.go) {
                    this.value = !this.value;
                    this.emit('update:modelValue', this.value);
                }
            }
        }
        clickgo.form.hidePop();
    }

    public onBeforeUnmount(): void | Promise<void> {
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        // --- type ---
        if (this.props.type) {
            --menulist.hasTypeItemsCount;
        }
    }

    public onMounted(): void {
        this.watch('type', (): void => {
            const menulist = this.parentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.props.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        }, {
            'immediate': true
        });
        this.watch('modelValue', (): void => {
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });

        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            ++menulist.hasTypeItemsCount;
        }
    }

}
