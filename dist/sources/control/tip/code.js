import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'label': '',
            'maxwidth': 400,
            'class': ''
        };
    }
    onMounted() {
        let el = this.refs.span.previousElementSibling;
        if (!el) {
            return;
        }
        while (el.dataset.cgControl === undefined) {
            el = el.previousElementSibling;
            if (!el) {
                return;
            }
        }
        this.refs.span.remove();
        const enter = (e) => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.showPop(el, this.refs.pop, 't', {
                'flow': false
            });
        };
        const leave = (e) => {
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
