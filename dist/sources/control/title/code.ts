import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
    } = {
            'type': 'default'
        };

}
