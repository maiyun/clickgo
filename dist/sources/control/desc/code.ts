import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'border': boolean | string;
        'collapse': boolean | string;
    } = {
            'border': true,
            'collapse': true
        };

}
