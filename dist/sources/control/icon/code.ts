import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'name': string;
        'size': string;
    } = {
            'name': '',
            'size': 's'
        };

}
