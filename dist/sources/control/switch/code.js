import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'change': null,
        'update:modelValue': null
    };
    props = {
        'disabled': false,
        'size': 'm',
        'map': {},
        'modelValue': false
    };
    /** --- 初始化后的 map 对象 --- */
    get mapComp() {
        return {
            'true': this.props.map.true ?? true,
            'false': this.props.map.false ?? false
        };
    }
    value = false;
    isSpaceDown = false;
    click() {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': this.value
            }
        };
        this.emit('change', event);
        if (event.go) {
            this.value = this.value === this.mapComp.true ? this.mapComp.false : this.mapComp.true;
            this.emit('update:modelValue', this.value);
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
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.props.modelValue;
            }
        }, {
            'immediate': true
        });
    }
}
