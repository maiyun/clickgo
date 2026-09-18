import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'src': string;
    } = {
            'src': ''
        };

    /** --- 拖拽时遮住 iframe，防止鼠标事件进入子页面后丢失 --- */
    public get showMask(): boolean {
        return clickgo.dom.is.move;
    }

}
