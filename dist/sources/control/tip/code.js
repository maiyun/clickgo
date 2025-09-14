import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'label': '',
            'maxwidth': 400,
            'class': ''
        };
        /** --- 鼠标在本体或 pop 里 --- */
        this.inTip = false;
    }
    popEnter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inTip = true;
    }
    popLeave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inTip = false;
        clickgo.tool.sleep(150).then(() => {
            if (this.inTip) {
                return;
            }
            clickgo.form.hidePop(this.refs.pop);
        }).catch(() => { });
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
            this.inTip = true;
            clickgo.form.showPop(el, this.refs.pop, 't', {
                'flow': false
            });
        };
        const leave = (e) => {
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
            }).catch(() => { });
        };
        el.addEventListener('mouseenter', enter);
        el.addEventListener('touchstart', enter);
        el.addEventListener('mouseleave', leave);
        el.addEventListener('touchend', leave);
    }
}
