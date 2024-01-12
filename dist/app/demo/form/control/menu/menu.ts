import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public radio = 'radio1';

    public check1 = true;

    public check2 = false;

    public check3 = true;

    public onCheck(event: Event): void {
        event.preventDefault();
    }

}
