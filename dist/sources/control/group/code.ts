import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'title': string;
        'plain': boolean | string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'title': '',
            'plain': false,

            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

}
