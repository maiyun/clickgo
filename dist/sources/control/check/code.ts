import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public value = false;

    public indeterminateData = false;

    public isSpaceDown = false;

    public emits = {
        'change': null,
        'changed': null
    };

    public props: {
        'disabled': boolean | string;

        'modelValue': boolean | string;
        'indeterminate': boolean | string;
    } = {
            'disabled': false,

            'modelValue': false,
            'indeterminate': false
        };

    public async click() {
        const event: types.ICheckChangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': this.value,
                'indeterminate': this.indeterminateData
            }
        };
        this.emit('change', event);
        if (!event.go) {
            return;
        }
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.emit('update:modelValue', this.value);
        }
        await this.nextTick();
        const event2: types.ICheckChangedEvent = {
            'detail': {
                'value': this.value,
                'indeterminate': this.indeterminateData
            }
        };
        this.emit('changed', event);
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
            if (this.indeterminateData && !this.value) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
        }, {
            'immediate': true
        });
        this.watch('indeterminate', () => {
            if (this.props.indeterminate !== undefined) {
                this.indeterminateData = this.propBoolean('indeterminate');
            }
            if (!this.value && this.indeterminateData) {
                this.value = true;
                this.emit('update:modelValue', this.value);
            }
        }, {
            'immediate': true
        });
    }

}
