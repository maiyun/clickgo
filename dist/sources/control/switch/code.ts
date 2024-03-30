import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'change': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;

        'modelValue': boolean | string;
    } = {
            'disabled': false,

            'modelValue': false
        };

    public value = false;

    public isSpaceDown = false;

    public click(): void {
        const event: types.ISwitchChangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': this.value
            }
        };
        this.emit('change', event);
        if (event.go) {
            this.value = !this.value;
            this.emit('update:modelValue', this.value);
        }
    }

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }

    public keyup(): void {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click();
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.propBoolean('modelValue');
            }
        }, {
            'immediate': true
        });
    }

}
