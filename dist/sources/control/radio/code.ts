import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'value': string;
        'modelValue': string;
    } = {
            'disabled': false,

            'value': '',
            'modelValue': ''
        };

    public isSpaceDown = false;

    public click(): void {
        const event = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            }
        };
        this.emit('change', event, this.props.modelValue, this.props.value);
        if (event.go) {
            this.emit('update:modelValue', this.props.value);
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

}
