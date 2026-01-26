import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'stripe': boolean | string;
    } = {
            'stripe': false,
        };

}
