import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null,
        'drop': null,
    };

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'plain': boolean | string;
        'size': 'xs' | 's' | 'm' | 'mh' | 'l' | 'lh' | 'xl' | 'xlh';
        'rsize': 'm' | 'l' | 'xl';
        'close': boolean;
        'drag': boolean;
        'inline': boolean | string;
    } = {
            'type': 'default',
            'plain': false,
            'size': 's',
            'rsize': 'l',
            'close': false,
            'drag': false,
            'inline': false,
        };

    /** --- 拖动提出 --- */
    public down(oe: PointerEvent): void {
        clickgo.modules.pointer.drag(oe, this.element, {
            'data': {
                'index': clickgo.dom.index(this.element),
                'tag': 'cg-tag',
            }
        });
    }

    /** --- 落入 --- */
    public drop(e: CustomEvent): void {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tag !== 'cg-tag') {
            return;
        }
        const event: clickgo.control.ITagDropEvent = {
            'detail': {
                'before': e.detail.value.index,
                'after': clickgo.dom.index(this.element),
            }
        };
        this.emit('drop', event);
    }

}
