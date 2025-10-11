import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'plain': boolean | string;
        'sub': boolean | string;
        'size': 's' | 'm' | 'l' | 'xl';
    } = {
            'type': 'default',
            'plain': false,
            'sub': false,
            'size': 's',
        };

}
