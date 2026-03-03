import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- 是否显示条纹 --- */
        'stripe': boolean | string;
        /** --- 是否启用 hover 效果 --- */
        'hover': boolean | string;
    } = {
            'stripe': false,
            'hover': false,
        };

    /** --- 当前是否处于 hover 状态 --- */
    public hovered = false;

    public enter(e: PointerEvent): void {
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
