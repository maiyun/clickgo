import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'border': boolean | string;
        'plain': boolean | string;
        'collapse': boolean | string;
        'size': 's' | 'm';
    } = {
            'border': true,
            'plain': false,
            'collapse': true,
            'size': 'm'
        };

}
