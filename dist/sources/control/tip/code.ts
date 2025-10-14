import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'label': string;
        'maxwidth': number;
        'class': string;    // --- 用来解决 vue 的一个警告 ---

        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        'plain': boolean | string;
    } = {
            'label': '',
            'maxwidth': 400,
            'class': '',

            'type': 'default',
            'plain': false,
        };

    /** --- 鼠标在本体或 pop 里 --- */
    public inTip = false;

    public popEnter(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inTip = true;
    }

    public popLeave(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inTip = false;
        clickgo.tool.sleep(150).then(() => {
            if (this.inTip) {
                return;
            }
            clickgo.form.hidePop(this.refs.pop);
        }).catch(() => {});
    }

    public onMounted(): void | Promise<void> {
        let el = this.refs.span.previousElementSibling as HTMLElement | null;
        if (!el) {
            return;
        }
        while (el.dataset.cgControl === undefined) {
            el = el.previousElementSibling as HTMLElement | null;
            if (!el) {
                return;
            }
        }
        this.refs.span.remove();
        const enter = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            this.inTip = true;
            clickgo.form.showPop(el, this.refs.pop, 't', {
                'flow': false
            });
        };
        const leave = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            // --- 允许 tip 移动上去 ---
            this.inTip = false;
            clickgo.tool.sleep(150).then(() => {
                if (this.inTip) {
                    return;
                }
                clickgo.form.hidePop(this.refs.pop);
            }).catch(() => {});
        };
        el.addEventListener('mouseenter', enter);
        el.addEventListener('touchstart', enter);
        el.addEventListener('mouseleave', leave);
        el.addEventListener('touchend', leave);
    }

}
