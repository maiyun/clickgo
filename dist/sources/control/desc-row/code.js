import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'stripe': false,
        'hover': false,
    };
    /** --- 当前是否处于 hover 状态 --- */
    hovered = false;
    enter(e) {
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                this.hovered = true;
            },
            leave: () => {
                this.hovered = false;
            },
        });
    }
}
