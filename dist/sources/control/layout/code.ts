import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        'wrap': boolean | string;
    } = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'wrap': false
        };

}
