import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- grow，是否占用状态栏中的剩余空间 --- */
        'grow': boolean | string;
        /** --- type，当前状态项使用的语义颜色类型 --- */
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
    } = {
            'grow': false,
            'type': 'default'
        };

}
