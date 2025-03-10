import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null
    };

    public props: {
        'direction': 'h' | 'v';
        'gutter': string;
        'width'?: number | string;
        'height'?: number | string;
        'padding': boolean | string;

        'buttons': string[];
    } = {
            'direction': 'h',
            'gutter': '',
            'width': undefined,
            'height': undefined,
            'padding': true,

            'buttons': ['OK']
        };

    public click(item: string): void {
        this.emit('select', item);
    }

}
