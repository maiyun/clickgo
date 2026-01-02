import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'remove': null,
        'add': null,
        'change': null,
        'changed': null,
        /** --- 无论是谁，只要 pop 显示就响应 --- */
        'pop': null,
        'update:modelValue': null,
    };
    props = {
        'disabled': false,
        'multi': false,
        'direction': 'h',
        'area': 'all',
        'pop': 'greatlist',
        'plain': false,
        'virtual': false,
        'padding': 'm',
        'minWidth': 0,
        'map': {},
        'data': [],
        'sizes': {},
        'modelValue': []
    };
    isSpaceDown = false;
    /**
     * --- 显示 pop，可供别人调用 ---
     */
    showPop() {
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.propNumber('minWidth') ?
                    Math.max(this.element.offsetWidth, this.propNumber('minWidth')) :
                    this.element.offsetWidth,
            },
            'autoPosition': true,
            'autoScroll': true,
            'way': 'click'
        });
        this.emit('pop');
    }
    /**
     * --- 隐藏 pop，可供别人调用 ---
     */
    hidePop() {
        clickgo.form.hidePop(this.element);
    }
    // --- 内部方法 ---
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.down(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup(e) {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.down(e, 'arrow');
    }
    down(e, area) {
        if (this.element.dataset.cgPopOpen !== undefined) {
            // this.hidePop();
            return;
        }
        if (this.props.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            return;
        }
        this.showPop();
    }
    updateModelValue(val) {
        this.emit('update:modelValue', val);
    }
    itemclicked(e) {
        if (e.detail.arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            // --- 多选不隐藏 ---
            return;
        }
        this.hidePop();
    }
    onAdd(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onRemove(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onChange(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onChanged(e) {
        const event = {
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('changed', event);
    }
}
