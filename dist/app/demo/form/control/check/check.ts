import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public checked1 = false;

    public checked2 = false;

    public checked3 = false;

    public indeterminate1 = false;

    public indeterminate2 = false;

    public indeterminate3 = false;

    public indeterminate4 = false;

    public disabled = false;

    public async onChange(e: types.ICheckChangeEvent): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog('v: ' + (e.detail.value ? 'true' : 'false') + ', i: ' + (e.detail.indeterminate ? 'true' : 'false'));
    }

}
