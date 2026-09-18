import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'src': ''
    };
    /** --- 拖拽时遮住 iframe，防止鼠标事件进入子页面后丢失 --- */
    get showMask() {
        return clickgo.dom.is.move;
    }
}
