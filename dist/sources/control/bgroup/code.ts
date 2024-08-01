import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled'?: boolean | string;
        'plain'?: boolean | string;
        'type'?: 'default' | 'tool' | 'primary' | 'info' | 'warning' | 'danger';
        'size'?: 'm' | 'l' | 'xl';
    } = {
            'disabled': false,
            'plain': false,
            'type': 'default',
            'size': 'm'
        };

    /** --- 子组件 --- */
    public itemsLength: number = 0;

}
