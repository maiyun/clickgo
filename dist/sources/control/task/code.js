import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'position': 'bottom'
        };
        this.date = '00:00';
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, (e) => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }
    contextmenu(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, e);
    }
    onMounted() {
        const date = new Date();
        clickgo.task.createTimer(this, () => {
            date.setTime(Date.now());
            const h = date.getHours().toString();
            const m = date.getMinutes().toString();
            this.date = (h.length === 1 ? '0' : '') + h + ':' + (m.length === 1 ? '0' : '') + m;
        }, 200, {
            'immediate': true
        });
    }
}
