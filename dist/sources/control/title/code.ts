import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {
    
    public emits = {
        'update:arrow': null,
    };

    public props: {
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
        'arrow': boolean | string | undefined;
    } = {
            'type': 'default',
            'arrow': undefined
        };

}
