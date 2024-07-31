import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'plain': boolean | string;
        'size': 's' | 'm' | 'mh' | 'l' | 'lh' | 'xl' | 'xlh';
    } = {
            'type': 'default',
            'plain': false,
            'size': 's',
        };

}
