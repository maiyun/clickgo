import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        /** --- img 图像前缀 --- */
        'pre': string;
        'multi': boolean | string;
        'progress'?: number;

        'modelValue': string[];
    } = {
            'disabled': false,
            'pre': '',
            'multi': false,
            'progress': undefined,

            'modelValue': []
        };

    /** --- 发出 select 事件 --- */
    public select(): void {
        if (this.props.progress !== undefined) {
            return;
        }
        this.emit('select');
    }

}
