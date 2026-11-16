import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null
    };

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'size': 'xs' | 's' | 'm' | 'l' | 'xl';
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        'close': boolean;
        'title': string;
    } = {
            'type': 'default',
            'size': 'm',
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'close': false,
            'title': ''
        };

}
