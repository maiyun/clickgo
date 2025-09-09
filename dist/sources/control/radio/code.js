import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'change': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'value': '',
            'modelValue': ''
        };
        this.isSpaceDown = false;
    }
    click() {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': this.props.value,
                'selected': this.props.modelValue
            }
        };
        this.emit('change', event);
        if (event.go) {
            this.emit('update:modelValue', this.props.value);
        }
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup() {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click();
    }
}
