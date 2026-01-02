import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'position': 'bottom'
    };

    public date: string = '00:00';

    public down(e: PointerEvent): void {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        clickgo.modules.pointer.menu(e, () => {
            clickgo.form.showPop(this.element, this.refs.pop, e);
        });
    }

    public onMounted(): void | Promise<void> {
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
