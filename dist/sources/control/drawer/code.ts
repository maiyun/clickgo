import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'update:modelValue': null
    };

    public props: {
        'modelValue': boolean | string;
        'title': string;
        'width': number | string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        /** --- 点击左侧空白处是否自动关闭，默认 false，true 为关闭 --- */
        'close': boolean | string;
    } = {
            'modelValue': false,
            'title': '',
            'width': '35%',

            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'close': false
        };

    public get widthComp(): string {
        if (typeof this.props.width === 'number') {
            return this.props.width.toString() + 'px';
        }
        return this.props.width;
    }

    /** --- 关闭按钮 --- */
    public closeClick(): void {
        this.emit('update:modelValue', false);
        this.emit('changed');
    }

    /** --- wrap 点击事件 --- */
    public click(e: MouseEvent): void {
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
