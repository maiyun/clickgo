import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public value = false;

    public indeterminateData = false;

    public isKeyDown = false;

    public props = {
        'disabled': false,

        'modelValue': undefined,
        'indeterminate': undefined
    };

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public click(): void {
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.emit('update:indeterminate', this.indeterminateData);
        }
        else {
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
            this.isKeyDown = true;
        }
    }

    public keyup(): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click();
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.props.modelValue;
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
                this.indeterminateData = this.props.indeterminate;
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
