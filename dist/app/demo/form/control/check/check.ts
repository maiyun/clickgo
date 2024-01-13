import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public checked1 = false;

    public checked2 = false;

    public checked3 = false;

    public indeterminate1 = false;

    public indeterminate2 = false;

    public indeterminate3 = false;

    public indeterminate4 = false;

    public disabled = false;

    public async onChange(e: Event, v: boolean, i: boolean): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog('v: ' + (v ? 'true' : 'false') + ', i: ' + (i ? 'true' : 'false'));
    }

}
