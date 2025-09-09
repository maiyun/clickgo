import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.mv = [];
        this.ym = '';
        this.bottom = false;
        this.left = false;
        this.disabled = false;
        this.plain = false;
        this.start = false;
        this.end = false;
        this.dlist = false;
        this.selected = '';
        this.select = '';
    }
    onChanged() {
        console.log('onChanged', JSON.stringify(this.mv));
    }
    onSelected(e) {
        this.selected = e.detail.value;
    }
    setmv() {
        this.mv = ['20230101', '20230108'];
    }
}
