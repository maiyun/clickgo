import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'hue': string;
        'hover': boolean | string;
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        'label': string;
    } = {
            'hue': '255',
            'hover': false,
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'label': '',
        };

}
