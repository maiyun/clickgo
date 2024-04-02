import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'direction': 'h',
            'type': 'default',
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };

}
