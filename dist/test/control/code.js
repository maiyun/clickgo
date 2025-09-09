import * as clickgo from 'clickgo';
// --- clickgo -c dist/test/control -s dist/app/demo/res ---
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'touch': null,
        };
    }
    ok() {
        if (this.refs.btn.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.refs.btn, this.refs.pop, 't');
        }
        else {
            clickgo.form.hidePop(this.refs.btn);
        }
    }
}
