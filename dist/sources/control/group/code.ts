import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'title': string;
        'plain': boolean | string;
        'hover': boolean | string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
        'padding': boolean | string;
        'position': 'top' | 'right' | 'bottom' | 'left';
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'hue': string | undefined;
    } = {
            'title': '',
            'plain': false,
            'hover': false,

            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'padding': true,
            'position': 'top',
            'type': 'default',
            'hue': undefined,
        };

}
