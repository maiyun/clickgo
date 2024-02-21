import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'label': string;
    } = {
            'label': ''
        };
    
    public onMounted(): void | Promise<void> {
        const el = this.refs.span.previousElementSibling as HTMLElement | null;
        if (!el) {
            return;
        }
        const enter = (e: MouseEvent | TouchEvent) => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.showPop(el, this.refs.pop, 't', {
                'flow': false
            });
        }
        const leave = (e: MouseEvent | TouchEvent) => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.hidePop(this.refs.pop);
        }
        el.addEventListener('mouseenter', enter);
        el.addEventListener('touchstart', enter);
        el.addEventListener('mouseleave', leave);
        el.addEventListener('touchend', leave);
    }

}
