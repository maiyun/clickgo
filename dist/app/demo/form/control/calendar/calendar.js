import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    mv = [];
    ym = '';
    bottom = false;
    left = false;
    disabled = false;
    plain = false;
    start = false;
    end = false;
    dlist = false;
    selected = '';
    select = '';
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
