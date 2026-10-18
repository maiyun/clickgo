import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'size': 's' | 'm' | 'l' | 'xl';
    } = {
            'type': 'cg',
            'size': 'm'
        };

}
