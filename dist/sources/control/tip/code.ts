import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'label': string;
        'class': string;    // --- 用来解决 vue 的一个警告 ---
    } = {
            'label': '',
            'class': ''
        };

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
            clickgo.form.showPop(el, this.refs.pop, 't', {
                'flow': false
            });
        };
        const leave = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.hidePop(this.refs.pop);
        };
        el.addEventListener('mouseenter', enter);
        el.addEventListener('touchstart', enter);
        el.addEventListener('mouseleave', leave);
        el.addEventListener('touchend', leave);
    }

}
