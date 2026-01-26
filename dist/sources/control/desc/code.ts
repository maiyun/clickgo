import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'border': boolean | string;
        'plain': boolean | string;
        'stripe': boolean | string;
        'collapse': boolean | string;
        'size': 's' | 'm' | 'l' | 'xl';
    } = {
            'border': true,
            'plain': false,
            'stripe': false,
            'collapse': true,
            'size': 'm'
        };

}
