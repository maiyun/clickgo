import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;

        'title': string;
        'note': string;
    } = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': 'center',

            'title': '',
            'note': ''
        };

}
