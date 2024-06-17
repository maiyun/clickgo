import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'direction': 'h',
            'type': 'default',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

}
