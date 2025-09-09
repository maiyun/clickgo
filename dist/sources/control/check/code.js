import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.value = false;
        this.indeterminateData = false;
        this.isSpaceDown = false;
        this.emits = {
            'change': null,
            'changed': null,
            'update:modelValue': null,
            'update:indeterminate': null
        };
        this.props = {
            'disabled': false,
            'modelValue': false,
            'indeterminate': false
        };
    }
    async click() {
        const event = {
            'go': true,
            preventDefault: function () {
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
        const event2 = {
            'detail': {
                'value': this.value,
                'indeterminate': this.indeterminateData
            }
        };
        this.emit('changed', event2);
    }
    async keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    async keyup() {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        await this.click();
    }
    onMounted() {
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
