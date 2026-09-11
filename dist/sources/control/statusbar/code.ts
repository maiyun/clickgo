import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- border，是否显示状态栏顶部的分隔线 --- */
        'border': boolean | string;
        /** --- separator，是否显示状态项之间的左右分隔线 --- */
        'separator': boolean | string;
        /** --- plain，是否使用透明背景显示状态栏 --- */
        'plain': boolean | string;
    } = {
            'border': true,
            'separator': true,
            'plain': false
        };

}
