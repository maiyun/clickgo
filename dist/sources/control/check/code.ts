import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public value = false;

    public indeterminateData = false;

    public isSpaceDown = false;

    public props: {
        'disabled': boolean | string;

        'modelValue': boolean | string;
        'indeterminate': boolean | string;
    } = {
            'disabled': false,

            'modelValue': false,
            'indeterminate': false
        };

    public click(): void {
        const event = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            }
        };
        this.emit('change', event, this.value, this.indeterminateData);
        if (event.go) {
            if (this.indeterminateData) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
            else {
                this.value = !this.value;
                this.emit('update:modelValue', this.value);
            }
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
