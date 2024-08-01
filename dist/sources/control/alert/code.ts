import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null
    };

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        'close': boolean;
        'title': string;
    } = {
            'type': 'default',
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'close': false,
            'title': ''
        };

}
