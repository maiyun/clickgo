import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'select': null,
        'remove': null,
        'changed': null,
        'update:modelValue': null
    };
    props = {
        'disabled': false,
        'length': 6,
        'drag': false,
        'pre': '',
        'multi': false,
        'progress': undefined,
        'modelValue': []
    };
    /** --- 发出 select 事件 --- */
    select() {
        if (this.props.progress !== undefined) {
            return;
        }
        this.emit('select');
    }
    // --- drag / drop ---
    rand = '';
    down(e, index) {
        clickgo.modules.pointer.drag(e, e.currentTarget.parentNode?.parentNode, {
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }
    drop(e, index) {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.props.modelValue.splice(index, 0, this.props.modelValue.splice(e.detail.value.index, 1)[0]);
        this.emit('update:modelValue', this.props.modelValue);
        this.emit('changed');
    }
    remove(index) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': index,
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            return;
        }
        this.props.modelValue.splice(index, 1);
        this.emit('update:modelValue', this.props.modelValue);
        this.emit('changed');
    }
    onMounted() {
        this.rand = clickgo.tool.random(16);
    }
}
