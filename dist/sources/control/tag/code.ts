import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
        'plain': boolean | string;
    } = {
            'type': 'default',
            'plain': false
        };

}
