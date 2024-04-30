import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null
    };

    public props: {
        'modelValue': boolean | string;
        'title': string;
        'width': number | string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'modelValue': false,
            'title': '',
            'width': '35%',

            'direction': 'h',
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };

    public get widthComp() {
        if (typeof this.props.width === 'number') {
            return this.props.width.toString() + 'px';
        }
        return this.props.width;
    }

    /** --- 关闭按钮 --- */
    public closeClick() {
        this.emit('update:modelValue', false);
    }

}
