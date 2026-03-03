import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- 是否显示外围内部的所有的边框 --- */
        'border': boolean | string;
        /** --- 是否显示轻量边框 --- */
        'plain': boolean | string;
        /** --- 是否显示斑马纹 --- */
        'stripe': boolean | string;
        /** --- 是否折叠边框 --- */
        'collapse': boolean | string;
        /** --- 尺寸 --- */
        'size': 's' | 'm' | 'l' | 'xl';
        /** --- 是否显示外围边框 --- */
        'outside': boolean | string;
        /** --- 每行中每个 cell 是否显示左右边框 --- */
        'rowlr': boolean | string;
    } = {
            'border': true,
            'plain': false,
            'stripe': false,
            'collapse': true,
            'size': 'm',
            'outside': true,
            'rowlr': false,
        };

}
