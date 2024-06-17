import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'title': string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'title': '',

            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

}
