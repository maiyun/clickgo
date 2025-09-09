import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'close': null,
            'drop': null,
        };
        this.props = {
            'type': 'default',
            'plain': false,
            'size': 's',
            'rsize': 'l',
            'close': false,
            'drag': false,
            'inline': false,
        };
    }
    /** --- 拖动提出 --- */
    down(e) {
        clickgo.dom.bindDrag(e, {
            'el': this.element,
            'data': {
                'index': clickgo.dom.index(this.element),
                'tag': 'cg-tag',
            }
        });
    }
    /** --- 落入 --- */
    drop(e) {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tag !== 'cg-tag') {
            return;
        }
        const event = {
            'detail': {
                'before': e.detail.value.index,
                'after': clickgo.dom.index(this.element),
            }
        };
        this.emit('drop', event);
    }
}
