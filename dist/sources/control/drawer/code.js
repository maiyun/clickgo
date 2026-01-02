import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'changed': null,
        'update:modelValue': null
    };
    props = {
        'modelValue': false,
        'title': '',
        'width': '35%',
        'direction': 'h',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined,
        'close': false
    };
    get widthComp() {
        if (typeof this.props.width === 'number') {
            return this.props.width.toString() + 'px';
        }
        return this.props.width;
    }
    /** --- 关闭按钮 --- */
    closeClick() {
        this.emit('update:modelValue', false);
        this.emit('changed');
    }
    /** --- wrap 点击事件 --- */
    click(e) {
        if (e.target !== this.element) {
            return;
        }
        if (!this.propBoolean('close')) {
            return;
        }
        this.emit('update:modelValue', false);
        this.emit('changed');
    }
}
