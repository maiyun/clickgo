import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null
    };

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'plain': boolean | string;
        'size': 's' | 'm' | 'mh' | 'l' | 'lh' | 'xl' | 'xlh';
        'rsize': 'm' | 'l' | 'xl';
        'close': boolean;
    } = {
            'type': 'default',
            'plain': false,
            'size': 's',
            'rsize': 'l',
            'close': false
        };

}
